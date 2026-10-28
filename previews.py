"""Private preview jobs: authenticate on the worker; retain only render data + SHA-256."""
import hashlib,json,os,re,secrets,shutil,time,traceback
from flask import Blueprint,abort,jsonify,request,send_from_directory
from store import DATA,db,digest,dumps,rate,settings
import storage
RESERVE=300*1024**2
MAX_BYTES=int(os.environ.get('HALLS_PREVIEW_STORAGE_MB','2048'))*1024**2
MAX_ITEMS=10000
TTL=24*3600
ID=re.compile('[a-f0-9]{24}')
class PreviewCapacityError(ValueError):pass
def reserve(c,new):
 count,used=c.execute('SELECT COUNT(*),COALESCE(SUM(bytes),0) FROM preview_cache').fetchone()
 if (new and count>=MAX_ITEMS) or used+RESERVE>MAX_BYTES:raise PreviewCapacityError('预览存储已满，请联系管理员。')

def busy(c):
 return sum(c.execute(q).fetchone()[0] for q in (
  "SELECT COUNT(*) FROM runs WHERE status IN ('receiving','queued','processing')",
  "SELECT COUNT(*) FROM preview_cache WHERE status IN ('queued','processing')",
  "SELECT COUNT(*) FROM previews WHERE status='receiving'"))

def discard_raw(key):
 (DATA/'preview-proofs'/key).unlink(missing_ok=True)
 shutil.rmtree(DATA/'preview-tmp'/key,ignore_errors=True)

def failed(key,message='预览处理未完成，请重新上传。',status='error'):
 discard_raw(key);shutil.rmtree(DATA/'preview-replays'/key,ignore_errors=True)
 with db(True) as c:c.execute('UPDATE preview_cache SET status=?,error=?,bytes=0,updated=? WHERE id=?',(status,message,time.time(),key))

def process(key):
 from codec import decode,ProofError
 from replay import convert
 from visual_codec import load_manifest
 with db() as c:row=c.execute('SELECT * FROM preview_cache WHERE id=?',(key,)).fetchone()
 if not row or row['status']!='processing':return
 path=DATA/'preview-proofs'/key;staging=DATA/'preview-tmp'/key
 try:
  # A previous authenticated score upload can already have this exact replay.
  with db() as c:known=c.execute("SELECT id,report FROM runs WHERE sha=? AND status='done' AND playable=1",(row['sha'],)).fetchone()
  source=DATA/'replays'/known['id'] if known else None
  if source and (source/'init.hvi.gz').is_file():
   manifest=load_manifest(source)
   if manifest.get('format')!='HVR5':source=None
  else:source=None
  if source:
   report=json.loads(known['report']);meta={'duration':report['metrics']['duration'],**{k:report['proof'][k] for k in ('platform','architecture','completedAt')}}
   shutil.copytree(source,staging)
  else:
   meta,frames=decode(path.read_bytes(),os.environ.get('HALLS_KEY','/run/secrets/recipient.pem'))
   if not meta['playbackSafe']:
    failed(key,'凭证中的运动数据超出安全预览范围。','invalid');return
   convert(meta,frames,staging)
  used=sum(p.stat().st_size for p in staging.iterdir());
  if used>RESERVE:raise RuntimeError('Preview output quota exceeded')
  # Delete the encrypted original before making a ready replay visible.
  path.unlink();staging.rename(DATA/'preview-replays'/key)
  summary={k:meta[k] for k in ('duration','platform','architecture','completedAt')}
  with db(True) as c:c.execute("UPDATE preview_cache SET status='ready',bytes=?,summary=?,error=NULL,updated=? WHERE id=?",(used,dumps(summary),time.time(),key))
 except ProofError:
  failed(key,'凭证校验失败，文件可能损坏或版本不受支持。','invalid')
 except Exception:
  traceback.print_exc();failed(key)
 finally:discard_raw(key)

def cleanup(recover=False):
 now=time.time()
 with db() as c:
  abandoned=c.execute("SELECT id FROM previews WHERE status='receiving' AND created<?",(now-180,)).fetchall()
  interrupted=c.execute("SELECT id FROM preview_cache WHERE status='processing'").fetchall() if recover else []
 for row in interrupted:failed(row['id'])
 for row in abandoned:discard_raw(row['id'])
 with db(True) as c:
  c.execute("DELETE FROM previews WHERE (status='receiving' AND created<?) OR expires<?",(now-180,now))
  c.execute("DELETE FROM preview_cache WHERE status IN ('invalid','error') AND updated<? AND NOT EXISTS(SELECT 1 FROM previews WHERE cache_id=preview_cache.id)",(now-TTL,))
  c.execute('DELETE FROM preview_tickets WHERE expires<?',(now,));c.execute('DELETE FROM preview_nonces WHERE expires<?',(now,))
 # A web process can die after attaching a duplicate but before unlinking it.
 # A grace period avoids racing a newly admitted upload between DB and file I/O.
 with db() as c:
  needed={r[0] for r in c.execute("SELECT id FROM previews WHERE status='receiving' UNION SELECT id FROM preview_cache WHERE status IN ('queued','processing')")}
  processing={r[0] for r in c.execute("SELECT id FROM preview_cache WHERE status='processing'")}
 for folder,keep in [('preview-proofs',needed),('preview-tmp',processing)]:
  for path in (DATA/folder).iterdir():
   try:
    if path.name not in keep and path.stat().st_mtime<now-180:
     if folder=='preview-tmp':shutil.rmtree(path,ignore_errors=True)
     else:path.unlink(missing_ok=True)
   except FileNotFoundError:pass


def register(app,ip,fail,secure):
 bp=Blueprint('previews',__name__)
 def origin():
  if request.headers.get('Origin')!=os.environ.get('HALLS_ORIGIN',request.host_url.rstrip('/')):abort(403)
 def cookie(key):return 'halls_preview_'+key
 def owned(key):
  if not ID.fullmatch(key):abort(404)
  with db() as c:row=c.execute('SELECT * FROM previews WHERE id=? AND expires>?',(key,time.time())).fetchone()
  if not row or not secrets.compare_digest(digest(request.cookies.get(cookie(key),'')),row['cap_hash']):abort(404)
  return row
 @bp.post('/api/previews/session')
 def session():
  origin()
  if request.mimetype!='application/json' or (request.content_length or 0)>2048 or request.get_json()!=dict():abort(400)
  if not settings()[0]['previewsEnabled']:return fail('暂未开放回放预览。',403,'previews_disabled')
  if not rate('preview-session:'+ip(),30,3600):return fail('请求过于频繁，请稍后再试。',429)
  token=secrets.token_urlsafe(32)
  with db(True) as c:c.execute('INSERT INTO preview_nonces VALUES(?,?,?)',(digest(token),digest(ip()),time.time()+300))
  response=jsonify(token=token);response.set_cookie('halls_preview_upload',token,httponly=True,secure=secure,samesite='Strict',max_age=300,path='/api/previews');return response
 @bp.post('/api/previews')
 def upload():
  origin()
  if not settings()[0]['previewsEnabled']:return fail('暂未开放回放预览。',403,'previews_disabled')
  token=request.headers.get('X-Preview-Token','')
  if not token or not secrets.compare_digest(token,request.cookies.get('halls_preview_upload','')):abort(403)
  with db(True) as c:nonce=c.execute('DELETE FROM preview_nonces WHERE hash=? AND ip=? AND expires>? RETURNING hash',(digest(token),digest(ip()),time.time())).fetchone()
  if not nonce:abort(403)
  if not rate('preview-upload:'+ip(),6,3600) or not rate('preview-global',30,60):return fail('预览次数过多，请稍后再试。',429)
  if request.mimetype!='application/octet-stream':return fail('请选择通关凭证文件。',415)
  length=request.content_length
  if length is None or not 308<=length<=app.config['MAX_CONTENT_LENGTH']:return fail('文件长度无效或超过上传上限。',413)
  # No submitted filename, path or name is accepted or used for storage.
  if request.args or request.headers.get('Content-Disposition'):return fail('预览上传不接受文件路径或其他参数。')
  key=secrets.token_hex(12);cap=secrets.token_urlsafe(32);now=time.time()
  with db(True) as c:
   if busy(c)>=8:return fail('处理队列已满，请稍后再试。',429)
   if error:=storage.admission(c):return fail(error,503,'preview_storage_full')
   c.execute("INSERT INTO previews(id,cap_hash,created,expires,status) VALUES(?,?,?,?,'receiving')",(key,digest(cap),now,now+TTL))
  path=DATA/'preview-proofs'/key;h=hashlib.sha256();count=0;retry_path=None
  try:
   with path.open('xb') as f:
    while chunk:=request.stream.read(65536):
     if count==0 and chunk[:8]!=b'HLPF\1\r\n\x1a':raise ValueError('凭证文件格式无效。')
     count+=len(chunk)
     if count>app.config['MAX_CONTENT_LENGTH']:abort(413)
     h.update(chunk);f.write(chunk)
   if count!=length:raise ValueError('文件上传不完整。')
   sha=h.hexdigest()
   with db(True) as c:
    cached=c.execute('SELECT * FROM preview_cache WHERE sha=?',(sha,)).fetchone()
    if cached:
     cache_id=cached['id'];reused=True
     if cached['status']=='error' and time.time()-cached['updated']>60:
      reserve(c,False)
      if cache_id!=key:
       retry_path=DATA/'preview-proofs'/cache_id;path.rename(retry_path)
      c.execute("UPDATE preview_cache SET status='queued',error=NULL,bytes=?,updated=? WHERE id=?",(RESERVE,time.time(),cache_id));reused=False
    else:
     reserve(c,True)
     cache_id=key;reused=False
     c.execute("INSERT INTO preview_cache(id,sha,status,bytes,created,updated) VALUES(?,?,'queued',?,?,?)",(key,sha,RESERVE,now,now))
    c.execute("UPDATE previews SET cache_id=?,status='attached' WHERE id=?",(cache_id,key))
   if reused:path.unlink(missing_ok=True)
  except BaseException as e:
   path.unlink(missing_ok=True)
   if retry_path:retry_path.unlink(missing_ok=True)
   with db(True) as c:c.execute('DELETE FROM previews WHERE id=?',(key,))
   if isinstance(e,PreviewCapacityError):return fail(str(e),503,'preview_storage_full')
   if isinstance(e,ValueError):return fail(str(e))
   raise
  response=jsonify(id=key,statusUrl='/api/previews/'+key,previewUrl='/preview?id='+key,reused=reused)
  response.status_code=202;response.set_cookie(cookie(key),cap,httponly=True,secure=secure,samesite='Strict',max_age=TTL,path='/api/previews/'+key);return response
 @bp.get('/api/previews/<key>')
 def status(key):
  owner=owned(key)
  with db() as c:cache=c.execute('SELECT * FROM preview_cache WHERE id=?',(owner['cache_id'],)).fetchone()
  if not cache:return jsonify(status='receiving')
  return jsonify(id=key,status=cache['status'],error=cache['error'],summary=json.loads(cache['summary']) if cache['summary'] else None,expiresAt=owner['expires'])
 @bp.post('/api/previews/<key>/replay-session')
 def replay_session(key):
  origin();owner=owned(key)
  with db() as c:cache=c.execute('SELECT status FROM preview_cache WHERE id=?',(owner['cache_id'],)).fetchone()
  if not cache or cache['status']!='ready':abort(404)
  if not rate('preview-ticket:'+ip(),30,600):abort(429)
  token=secrets.token_urlsafe(32)
  with db(True) as c:c.execute('INSERT INTO preview_tickets(hash,preview,ip,expires) VALUES(?,?,?,?)',(digest(token),key,digest(ip()),min(time.time()+900,owner['expires'])))
  return jsonify(ticket=token)
 @bp.get('/api/previews/<key>/replay/<part>')
 def replay_part(key,part):
  owner=owned(key);token=request.headers.get('X-Replay-Ticket','')
  if not token:abort(404)
  with db(True) as c:
   t=c.execute('SELECT * FROM preview_tickets WHERE hash=? AND preview=? AND ip=? AND expires>?',(digest(token),key,digest(ip()),time.time())).fetchone()
   cached=c.execute('SELECT status FROM preview_cache WHERE id=?',(owner['cache_id'],)).fetchone()
   if not t or not cached or cached['status']!='ready':abort(404)
   if t['uses']>=1500:abort(429)
   c.execute('UPDATE preview_tickets SET uses=uses+1 WHERE hash=?',(digest(token),))
  if not rate('preview-segments:'+ip(),240,60):abort(429)
  if part!='manifest' and not re.fullmatch(r'\d{1,4}',part):abort(404)
  from replay import send_visual
  return send_visual(DATA/'preview-replays'/owner['cache_id'],part)
 app.register_blueprint(bp)
