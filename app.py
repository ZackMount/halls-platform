"""Public archive and moderation API. Raw proof bytes never have a download route."""
import functools,hashlib,json,math,os,re,secrets,sqlite3,sys,time,unicodedata,logging
from pathlib import Path
from flask import Response,Flask,request,jsonify,send_from_directory,g,abort,render_template,redirect
from werkzeug.exceptions import HTTPException
from public_report import public_report,race_reference
from public_navigation import public_upload_links
import submission_sources as source_records
import storage
from downloads import state as download_state
from record_deletion import delete_run,DeleteError
from engine.eligibility import MINIMUM_CLIENT
import public_replay
from store import ROOT,DATA,DEFAULTS,db,dumps,digest,initialize,settings,rate,audit,visible,public_row
sys.path.insert(0,str(ROOT/'engine'))
from judge import policy,RULES,defaults,VERSION as JUDGE_VERSION
from scoring import weights as scoring_weights,deductions as scoring_deductions,grade as score_grade
from asset_pipeline import Assets
assets_bundle=Assets(ROOT/'web')
initialize()
app=Flask(__name__,static_folder=None)
app.config.update(MAX_CONTENT_LENGTH=int(os.environ.get('HALLS_MAX_UPLOAD_MB','15'))*1024*1024,TRUSTED_HOSTS=os.environ.get('HALLS_HOSTS','localhost,127.0.0.1').split(','))
app.config.update(ADMIN_SERVICE=False,ADMIN_CSRF=secrets.token_urlsafe(32))
class KeyRedactor(logging.Filter):
 def filter(self,record):
  message=re.sub(r'(/api/(?:submit|koh)/)[^?\s/"\']+',r'\1[REDACTED]',record.getMessage())
  record.msg=re.sub(r'([?&]pwd=)[^&\s"\']*',r'\1[REDACTED]',message,flags=re.I);record.args=();return True
for logger in ('gunicorn.error','gunicorn.access',app.logger.name):logging.getLogger(logger).addFilter(KeyRedactor())
SECURE=os.environ.get('HALLS_HTTPS','0')=='1'
MAX_QUEUE=8;MAX_RECORDS=20000;MAX_STORAGE=int(os.environ.get('HALLS_STORAGE_GB','20'))*1024**3

def fail(message,status=400,code='invalid_request'):return jsonify(error=message,code=code),status

def ip():
 # Only a directly connected, explicitly trusted reverse proxy may supply IPs.
 if os.environ.get('HALLS_TRUST_PROXY')=='1' and request.remote_addr in os.environ.get('HALLS_PROXY_IPS','127.0.0.1,::1').split(','):
  import ipaddress
  if not request.headers.get('X-Real-IP'):return request.remote_addr
  try:return str(ipaddress.ip_address(request.headers['X-Real-IP']))
  except ValueError:abort(400)
 return request.remote_addr or 'unknown'

def admin_required(f):
 @functools.wraps(f)
 def wrapped(*a,**kw):
  if not g.admin:abort(404)
  return f(*a,**kw)
 return wrapped

def payload(limit=65536):
 if not request.is_json or (request.content_length or 0)>limit:abort(400)
 value=request.get_json()
 if not isinstance(value,dict):abort(400)
 return value

def read_run(run_id):
 with db() as c:r=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
 if not r:abort(404)
 return r

def owns(r):
 token=request.headers.get('Authorization','')
 return token.startswith('Bearer ') and secrets.compare_digest(digest(token[7:]),r['cap_hash'])

def withdraw_public_replay(r,c):
 folder=DATA/'replays'/r['id'];before=public_replay.size(folder);public_replay.withdraw(folder);removed=before-public_replay.size(folder)
 if removed:c.execute('UPDATE runs SET bytes=MAX(0,bytes-?) WHERE id=?',(removed,r['id']))

@app.before_request
def protect():
 admin_service=request.environ.get('halls.admin_service',app.config['ADMIN_SERVICE']) if app.testing else app.config['ADMIN_SERVICE']
 g.admin=admin_service;g.csrf=app.config['ADMIN_CSRF'] if admin_service else None;g.admin_name='admin' if admin_service else None
 private=request.path in ('/admin','/api/admin') or request.path.startswith(('/admin/','/api/admin/'))
 if private and not admin_service:abort(404)
 if admin_service:
  import ipaddress
  networks=[ipaddress.ip_network(value.strip()) for value in os.environ.get('HALLS_ADMIN_NETWORKS','127.0.0.0/8,::1/128').split(',')]
  try:allowed=any(ipaddress.ip_address(request.remote_addr) in network for network in networks)
  except ValueError:allowed=False
  if not allowed:abort(404)
 if request.path.startswith('/replay-public/'):return
 if request.path.startswith('/api/'):
  if not rate('all:'+ip(),600,60):return fail('请求过于频繁，请稍后再试。',429,'rate_limit')
 if request.method not in ('GET','HEAD','OPTIONS'):
  origin=request.headers.get('Origin')
  expected=request.host_url.rstrip('/') if admin_service else os.environ.get('HALLS_ORIGIN',request.host_url.rstrip('/'))
  if origin and origin!=expected:return fail('不接受跨站请求。',403,'origin')
  if request.path.startswith('/api/admin/') and g.admin:
   if not secrets.compare_digest(request.headers.get('X-CSRF-Token',''),g.csrf):return fail('页面会话已改变，请刷新后重试。',403,'csrf')

@app.after_request
def headers(response):
 if response.status_code==404:
  response.set_data(b'');response.headers.clear();response.headers['Content-Length']='0'
  response.headers['Cache-Control']='no-store';response.headers['Referrer-Policy']='no-referrer'
  if SECURE:response.headers['Strict-Transport-Security']='max-age=31536000'
  return response
 response.headers.update({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'"})
 if request.path.startswith('/static/') and response.status_code in (200,206,304):response.headers['Cache-Control']='public, max-age=31536000, immutable'
 if request.path.startswith('/replay-public/') and response.status_code in (200,206,304):
  response.headers['Cache-Control']=public_replay.CACHE_CONTROL;response.headers['Cloudflare-CDN-Cache-Control']=public_replay.CDN_CACHE_CONTROL
 if request.path=='/' and response.status_code==200:response.headers['Cloudflare-CDN-Cache-Control']='public, max-age=60'
 if request.path=='/sw.js':response.headers['Cache-Control']='no-cache';response.headers['Service-Worker-Allowed']='/'
 if request.path.startswith('/assets/fonts/') and request.path.endswith('.woff2') and response.status_code==200:response.headers['Cache-Control']='public, max-age=31536000, immutable'
 if SECURE:response.headers['Strict-Transport-Security']='max-age=31536000'
 if request.path in ('/admin','/api/admin') or request.path.startswith(('/admin/','/api/admin/')):
  response.headers['Referrer-Policy']='no-referrer';response.headers['X-Robots-Tag']='noindex, nofollow, noarchive'
 # Origin-owned empty rules prevent Cloudflare's speculative document fetches;
 # navigation is handled locally.
 if response.mimetype=='text/html':response.headers['Speculation-Rules']='"'+assets_bundle.url('assets/no-prefetch.json')+'"'
 if response.status_code==429:response.headers['Retry-After']='60'
 return response

@app.errorhandler(HTTPException)
def http_error(e):
 if e.code==404:return Response(status=404)
 return fail({413:'凭证超过服务器上传大小限制。',400:'请求格式无效。'}.get(e.code,e.name),e.code,'http_'+str(e.code))

@app.errorhandler(Exception)
def internal_error(e):
 app.logger.exception('Request failed')
 return fail('服务暂时未完成请求，请稍后重试。',500,'internal_error')

@app.get('/api/health')
def health():return jsonify(status='ok',format='HLR5',supportedFormats=['HLR4','HLR5'],formalFormats=['HLR5'],minimumClient=MINIMUM_CLIENT,judgeVersion=JUDGE_VERSION)

def page_fragment(page):
 p,_=settings()
 if page=='upload':return render_template('upload-page.html',allowed=p['uploadsEnabled'] and p['webUploads'],consent=p['publicationConfirmation'],admin=False)
 if page=='preview':return render_template('preview-page.html',allowed=p['previewsEnabled'])
 if page=='download':
  state=download_state(p)
  return render_template('download-page.html',**state,items=download_items() if state['enabled'] else [])
 abort(404)

@app.get('/api/pages/<page>')
def public_page(page):return Response(page_fragment(page),mimetype='text/html')

@app.get('/api/admin/upload-page')
@admin_required
def admin_upload_page():return Response(render_template('upload-form.html',consent=False,admin=True),mimetype='text/html')

@app.post('/api/uploads/check')
def hash_check():
 v=payload();sha=v.get('sha256','')
 if not isinstance(sha,str) or not re.fullmatch('[a-f0-9]{64}',sha):return fail('SHA-256 格式无效。')
 with db() as c:exists=c.execute('SELECT 1 FROM runs WHERE sha=?',(sha,)).fetchone() is not None
 return jsonify(duplicate=exists)

@app.post('/api/upload-session')
def upload_session():
 p,_=settings()
 if not p['uploadsEnabled'] or not p['webUploads']:return fail('当前未开放网页提交。',403,'uploads_disabled')
 if request.headers.get('Origin')!=os.environ.get('HALLS_ORIGIN',request.host_url.rstrip('/')):return fail('请从本站提交页面上传。',403,'web_origin_required')
 if not rate('upload_session:'+ip(),40,3600):return fail('请求过多，请稍后重试。',429)
 token=secrets.token_urlsafe(32)
 with db(True) as c:
  c.execute('DELETE FROM web_uploads WHERE expires<?',(time.time(),));c.execute('INSERT INTO web_uploads VALUES(?,?,?)',(digest(token),digest(ip()),time.time()+300))
 response=jsonify(token=token,expiresIn=300);response.set_cookie('halls_upload',token,max_age=300,httponly=True,secure=SECURE,samesite='Strict',path='/api/uploads');return response

@app.post('/api/uploads')
@app.post('/api/admin/uploads')
@app.post('/api/submit/<api_key>')
def upload(api_key=None):
 if request.path.startswith('/api/admin/') and not g.admin:return fail('请先登录。',401)
 admin_upload=request.path=='/api/admin/uploads'
 if not admin_upload:
  p,_=settings()
  if not p['uploadsEnabled']:return fail('当前暂停提交。',403,'uploads_disabled')
  if api_key is not None:
   if not p['apiUploads']:return fail('API 提交未开放。',403,'api_uploads_disabled')
   with db(True) as c:
    key=c.execute('SELECT id,label,scope FROM api_keys WHERE hash=? AND active=1',(digest(api_key),)).fetchone()
    if not key:return fail('API Key 无效或已撤销。',401,'invalid_api_key')
    if key['scope']!='upload':return fail('此 Key 仅用于比赛接口。',403,'key_scope')
    c.execute('UPDATE api_keys SET uses=uses+1,last_used=? WHERE id=?',(time.time(),key['id']))
   if not rate('api_key:'+key['id'],60,3600):return fail('API Key 提交额度已用完。',429,'upload_rate')
  else:
   if not p['webUploads']:return fail('网页提交未开放。',403,'web_uploads_disabled')
   if p['publicationConfirmation'] and request.headers.get('X-Publication-Consent')!='1':return fail('请确认公开名字、成绩和回放后提交。',403,'publication_confirmation_required')
   token=request.headers.get('X-Upload-Token','')
   if not token or not secrets.compare_digest(token,request.cookies.get('halls_upload','')):return fail('请从本站提交页面上传，程序调用请使用 API Key。',403,'web_session_required')
   if request.headers.get('Origin')!=os.environ.get('HALLS_ORIGIN',request.host_url.rstrip('/')):return fail('请从本站提交页面上传。',403,'web_origin_required')
   with db(True) as c:
    nonce=c.execute('DELETE FROM web_uploads WHERE hash=? AND ip=? AND expires>? RETURNING hash',(digest(token),digest(ip()),time.time())).fetchone()
    if not nonce:return fail('提交会话已失效，请重新提交。',403,'web_session_expired')
 if not rate('upload:'+ip(),60 if admin_upload or api_key else 6,3600):return fail('上传次数过多，请稍后重试。',429,'upload_rate')
 if request.mimetype!='application/octet-stream':return fail('使用 application/octet-stream 原始文件上传。',415)
 name=unicodedata.normalize('NFKC',request.args.get('name','')).strip()
 if not 1<=len(name)<=32 or any(unicodedata.category(c)[0]=='C' for c in name):return fail('名字应为 1–32 个字符，不含控制符。')
 try:origin_id=source_records.source_id(request.headers.get('X-Source-ID','')) if api_key else ''
 except ValueError as e:return fail(str(e))
 length=request.content_length
 if length is None or not 308<=length<=app.config['MAX_CONTENT_LENGTH']:return fail('文件长度无效或超过上传上限。',413)
 claimed=request.headers.get('X-Proof-SHA256')
 if claimed and not re.fullmatch('[a-f0-9]{64}',claimed):return fail('SHA-256 格式无效。')
 if claimed:
  with db() as c:
   existing=c.execute('SELECT id FROM runs WHERE sha=?',(claimed,)).fetchone()
   if existing:
    if api_key:
     with db(True) as log:source_records.record(log,key,claimed,length,origin_id,run=existing['id'],duplicate=True)
    return fail('此凭证已提交，不允许重复上传。',409,'duplicate_hash')
 run_id=secrets.token_hex(12);cap=secrets.token_urlsafe(32);now=time.time()
 with db(True) as c:
  stats=c.execute("SELECT COUNT(*) n,COALESCE(SUM(bytes),0) bytes,SUM(CASE WHEN status IN ('receiving','queued','processing') THEN 1 ELSE 0 END) busy FROM runs").fetchone()
  if stats['n']>=MAX_RECORDS or stats['bytes']+(stats['busy'] or 0)*300*1024**2+300*1024**2>MAX_STORAGE:return fail('服务器存储配额已满，请联系管理员。',503,'storage_full')
  if preview_jobs.busy(c)>=MAX_QUEUE:return fail('评判队列已满，请稍后提交。',429,'queue_full')
  if error:=storage.admission(c):return fail(error,503,'storage_full')
  config,revision=settings(c)
  c.execute('INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,bytes,policy,policy_revision) VALUES(?,?,?,?,?,?,?,?,?,?)',(run_id,name,'receiving:'+run_id,digest(cap),now,now,'receiving',length,dumps(config),revision))
 path=DATA/'proofs'/run_id;h=hashlib.sha256();count=0
 try:
  with path.open('xb') as f:
   while chunk:=request.stream.read(65536):
    count+=len(chunk)
    if count>app.config['MAX_CONTENT_LENGTH']:abort(413)
    h.update(chunk);f.write(chunk)
  sha=h.hexdigest()
  if count!=length or claimed and sha!=claimed:raise ValueError('上传内容与声明的长度或 hash 不一致。')
  with db(True) as c:
   c.execute("UPDATE runs SET sha=?,status='queued',updated=? WHERE id=?",(sha,time.time(),run_id))
   if api_key:source_records.record(c,key,sha,count,origin_id,run=run_id,verified=True,status='queued')
   audit(c,'admin' if g.admin else 'uploader','upload',run_id,{'source':'admin' if admin_upload else 'api' if api_key else 'web','apiKeyId':key['id'] if api_key else None})
 except (sqlite3.IntegrityError,ValueError) as e:
  if api_key:
   with db(True) as c:
    existing=c.execute('SELECT id FROM runs WHERE sha=?',(h.hexdigest(),)).fetchone()
    source_records.record(c,key,h.hexdigest(),count,origin_id,run=existing['id'] if existing else None,duplicate=isinstance(e,sqlite3.IntegrityError),verified=True,status='duplicate' if isinstance(e,sqlite3.IntegrityError) else 'hash_mismatch')
  path.unlink(missing_ok=True)
  with db(True) as c:c.execute('DELETE FROM runs WHERE id=?',(run_id,))
  return fail('此凭证已提交，不允许重复上传。' if isinstance(e,sqlite3.IntegrityError) else str(e),409 if isinstance(e,sqlite3.IntegrityError) else 400,'duplicate_hash' if isinstance(e,sqlite3.IntegrityError) else 'hash_mismatch')
 except BaseException:
  path.unlink(missing_ok=True)
  with db(True) as c:c.execute('DELETE FROM runs WHERE id=?',(run_id,))
  raise
 try:wait=max(0,min(10,float(request.args.get('wait','0'))))
 except ValueError:wait=0
 deadline=time.monotonic()+wait;current=None
 while time.monotonic()<deadline:
  with db() as c:current=c.execute('SELECT status,report FROM runs WHERE id=?',(run_id,)).fetchone()
  if current['status'] not in ('queued','processing'):break
  time.sleep(.2)
 done=current is not None and current['status'] not in ('queued','processing')
 report=json.loads(current['report']) if done and current['report'] else None
 if not admin_upload and not api_key:report=public_report(report)
 return jsonify(id=run_id,status=current['status'] if done else 'queued',receipt=cap,statusUrl='/api/submissions/'+run_id,report=report,message='携带 receipt 轮询 statusUrl 可获取完整报告；请保存回执。'),200 if done else 202

@app.get('/api/submissions/<run_id>')
def submission(run_id):
 r=read_run(run_id)
 if not g.admin and not owns(r):abort(404)
 report=json.loads(r['report']) if r['report'] else None
 # API-key submissions retain the private report contract, bound to their receipt.
 with db() as c:source=c.execute("SELECT detail FROM audit WHERE run=? AND action='upload' ORDER BY id LIMIT 1",(run_id,)).fetchone()
 private=g.admin or source and json.loads(source['detail']).get('source') in ('api','admin')
 return jsonify(**public_row(r),status=r['status'],report=report if private else public_report(report),note=r['note'] if g.admin else '')

def ranking_data(board='all',sort_key='score',page=1,query=''):
 p,_=settings()
 # Keep the exact public visibility union: publishing to unranked is distinct
 # from approving a ranked result. Never include hidden or unfinished records.
 boards=['all','ranked']+(['unranked'] if p['unrankedEnabled'] else [])
 public="status='done' AND ((board='ranked' AND decision='approved' AND score IS NOT NULL)"+(" OR board='unranked'" if p['unrankedEnabled'] else '')+")"
 score="CASE WHEN board='ranked' THEN score ELSE json_extract(report,'$.performance.referenceScore') END"
 sort={'score':'board_score DESC,duration ASC','speed':'duration ASC,board_score DESC','recent':'created DESC'}.get(sort_key)
 if sort is None:abort(400)
 # Rank only eligible ranked records, before search and mixed-board pagination.
 # Keep the rank CTE narrow; complete reports are fetched for this page only.
 ranks="SELECT id,ROW_NUMBER() OVER (ORDER BY "+sort.replace('board_score','score')+",id) AS position FROM runs WHERE board='ranked' AND status='done' AND decision='approved' AND score IS NOT NULL"
 q=query[:32];where=public+(" AND board=?" if board!='all' else '')+" AND instr(lower(name),lower(?))>0";params=([board] if board!='all' else [])+[q]
 with db() as c:
  stats=c.execute('SELECT COUNT(*) n,MIN(duration) fastest,MAX('+score+') best FROM runs WHERE '+where,params).fetchone();total=stats['n']
  rows=c.execute('WITH ranked_positions AS ('+ranks+') SELECT runs.*,'+score+' AS board_score,ranked_positions.position AS ranked_position FROM runs LEFT JOIN ranked_positions USING(id) WHERE '+where+' ORDER BY '+sort+',runs.id LIMIT 25 OFFSET ?',params+[(page-1)*25]).fetchall()
  counts={r['board']:r['n'] for r in c.execute('SELECT board,COUNT(*) n FROM runs WHERE '+public+' GROUP BY board')}
 counts={'all':sum(counts.values()),'ranked':counts.get('ranked',0),'unranked':counts.get('unranked',0)}
 return dict(items=[public_row(r)|{'displayScore':r['board_score'],'rank':r['ranked_position']} for r in rows],total=total,page=page,pages=math.ceil(total/25),stats=dict(stats),boards=boards,board=board,boardCounts=counts)


@app.get('/api/runs')
def runs():
 board=request.args.get('board','all')
 if board not in ('all','ranked','unranked'):abort(400)
 try:page=max(1,min(1000,int(request.args.get('page','1'))))
 except ValueError:abort(400)
 return jsonify(ranking_data(board,request.args.get('sort','score'),page,request.args.get('q','')))

def run_data(run_id):
 r=read_run(run_id)
 if not g.admin and not visible(r):abort(404)
 report=json.loads(r['report']) if r['report'] else None
 report=public_report(report)
 replay_base=None
 if r['playable']:
  with db(True) as c:
   current=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
   if current and visible(current,c):
    folder=DATA/'replays'/run_id
    try:revision=public_replay.export(folder,storage.snapshot(c)['platform']['remaining'])
    except public_replay.CapacityError:raise
    replay_base=f'/replay-public/{run_id}/{revision}/'
    used=(DATA/'proofs'/run_id).stat().st_size+public_replay.size(folder)
    if used!=current['bytes']:c.execute('UPDATE runs SET bytes=? WHERE id=?',(used,run_id))
 return dict(**public_row(r),report=report,replayBase=replay_base)

@app.get('/api/runs/<run_id>')
def detail(run_id):
 try:return jsonify(run_data(run_id))
 except public_replay.CapacityError:return fail('服务器暂时无法准备公开回放资源。',503,'replay_storage_full')

@app.get('/api/runs/<run_id>/race-reference')
def run_race_reference(run_id):
 r=read_run(run_id)
 if not g.admin and not visible(r):abort(404)
 try:report=json.loads(r['report']) if r['report'] else None
 except (ValueError,TypeError):report=None
 return jsonify(race_reference(report,include_path=True))

@app.get('/replay-public/<run_id>/<revision>/<part>.bin')
def public_replay_part(run_id,revision,part):
 if not re.fullmatch(r'[a-f0-9]{24}',run_id) or not re.fullmatch(r'[a-f0-9]{64}',revision) or not re.fullmatch(r'manifest|[1-9]\d{0,3}',part):abort(404)
 from visual_codec import MIME
 response=send_from_directory(DATA/'replays'/run_id/'cdn'/revision,part+'.bin',mimetype=MIME)
 response.headers['Content-Encoding']='gzip';return response

@app.post('/api/runs/<run_id>/replay-session')
def replay_session(run_id):
 r=read_run(run_id)
 if not g.admin and not visible(r):abort(404)
 if not r['playable']:return fail('此记录不可安全回放。',422)
 if not rate('replay:'+ip(),30,600):return fail('回放会话请求过多，请稍后重试。',429)
 token=secrets.token_urlsafe(32)
 with db(True) as c:
  c.execute('DELETE FROM tickets WHERE expires<?',(time.time(),))
  c.execute('INSERT INTO tickets(hash,run,ip,expires,private) VALUES(?,?,?,?,?)',(digest(token),run_id,digest(ip()),time.time()+900,int(g.admin)))
 return jsonify(ticket=token,expiresIn=900,manifestUrl='/api/replay/'+run_id+'/manifest')

@app.get('/api/replay/<run_id>/<part>')
def replay_part(run_id,part):
 token=request.headers.get('X-Replay-Ticket','')
 if not token:abort(404)
 with db(True) as c:
  t=c.execute('SELECT * FROM tickets WHERE hash=? AND run=? AND ip=? AND expires>?',(digest(token),run_id,digest(ip()),time.time())).fetchone();r=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
  if not t or not r or not (visible(r,c) or t['private'] and g.admin):abort(404)
  if t['uses']>=1500:return fail('回放访问额度已用完。',429)
  c.execute('UPDATE tickets SET uses=uses+1 WHERE hash=?',(digest(token),))
 if not rate('segments:'+ip(),240,60):return fail('回放读取过快。',429)
 if part!='manifest' and not re.fullmatch(r'\d{1,4}',part):abort(404)
 from replay import send_visual
 return send_visual(DATA/'replays'/run_id,part)

@app.get('/api/admin/session')
@admin_required
def session():return jsonify(csrf=g.csrf)

@app.get('/api/admin/runs')
@admin_required
def admin_runs():
 try:page=max(1,int(request.args.get('page',1)))
 except ValueError:abort(400)
 return jsonify(admin_runs_data(request.args.get('filter','all'),page))

def admin_runs_data(filt='all',page=1):
 where={'all':'1','pending':"decision='pending'",'published':"board<>'hidden'",'rejected':"decision='rejected'",'error':"status IN ('error','invalid','duplicate')"}.get(filt)
 if not where:abort(400)
 with db() as c:
  total=c.execute('SELECT count(*) FROM runs WHERE '+where).fetchone()[0];rows=c.execute('SELECT * FROM runs WHERE '+where+' ORDER BY created DESC LIMIT 30 OFFSET ?',((page-1)*30,)).fetchall()
 return dict(items=[public_row(r)|{'status':r['status'],'note':r['note']} for r in rows],total=total,page=page,pages=math.ceil(total/30))

@app.post('/api/admin/runs/<run_id>')
@admin_required
def moderate(run_id):
 v=payload(4096);r=read_run(run_id);decision=v.get('decision',r['decision']);board=v.get('board',r['board']);tags=v.get('tags',json.loads(r['tags']));note=v.get('note',r['note'])
 if decision not in ('approved','pending','rejected') or board not in ('hidden','ranked','unranked'):abort(400)
 if not isinstance(tags,list) or len(tags)>8 or any(not isinstance(t,str) or not 1<=len(t)<=24 for t in tags) or not isinstance(note,str) or len(note)>1000:abort(400)
 if board!='hidden' and r['status']!='done':return fail('尚未完成有效评判，不能公开。')
 score=r['score'];grade=r['grade']
 if board=='ranked' and decision!='approved':return fail('正式榜要求审核通过。')
 if board=='ranked' and score is None:
  report=json.loads(r['report'] or '{}');perf=report.get('performance',{})
  if r['verdict']!='review' or not perf.get('completed') or len(note.strip())<8:return fail('无有效得分。待复核成绩需填写至少 8 字的人工认定依据；硬性拒绝项应先更正规则并重评。')
  score=perf['referenceScore'];grade=score_grade(score)
  if '人工复核通过' not in tags:tags.append('人工复核通过')
 if board=='unranked' and not settings()[0]['unrankedEnabled']:return fail('先在发布策略中启用 unranked。')
 with db(True) as c:
  c.execute('UPDATE runs SET decision=?,board=?,tags=?,note=?,score=?,grade=?,updated=? WHERE id=?',(decision,board,dumps(tags),note,score,grade,time.time(),run_id));c.execute('DELETE FROM tickets WHERE run=?',(run_id,));audit(c,'admin','moderate',run_id,{'decision':decision,'board':board,'tags':tags,'note':note})
  current=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
  if not visible(current,c):withdraw_public_replay(current,c)
 return jsonify(ok=True)

@app.delete('/api/admin/runs/<run_id>')
@admin_required
def permanently_delete_run(run_id):
 v=payload(1024)
 if set(v)!={'confirm'} or v['confirm']!=run_id:return fail('请确认要彻底删除的记录。',400,'confirmation_required')
 try:return jsonify(delete_run(run_id,g.admin_name))
 except DeleteError as error:return fail(str(error),error.status,error.code)

@app.get('/api/admin/runs/<run_id>/report')
@admin_required
def download_admin_report(run_id):
 r=read_run(run_id)
 if not r['report']:abort(404)
 response=app.response_class(r['report'],mimetype='application/json')
 safe_id=re.sub('[^a-zA-Z0-9_-]','',run_id)
 response.headers['Content-Disposition']='attachment; filename="halls-report-'+safe_id+'.json"'
 return response

@app.post('/api/admin/runs/<run_id>/rejudge')
@admin_required
def rejudge(run_id):
 with db(True) as c:
  r=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
  if not r:abort(404)
  if r['status'] in ('queued','processing','receiving','deleting') or r['attempts']>=10:return fail('记录正在评判或已达到 10 次重试上限。',409)
  if not (DATA/'proofs'/run_id).exists():return fail('原始文件不可用。',409)
  if preview_jobs.busy(c)>=MAX_QUEUE:return fail('队列已满。',429)
  withdraw_public_replay(r,c)
  p,rev=settings(c);c.execute("UPDATE runs SET status='queued',board='hidden',decision='pending',report=NULL,verdict=NULL,score=NULL,grade=NULL,policy=?,policy_revision=?,updated=? WHERE id=?",(dumps(p),rev,time.time(),run_id));c.execute('DELETE FROM tickets WHERE run=?',(run_id,));audit(c,'admin','rejudge',run_id,{'previousReport':json.loads(r['report']) if r['report'] else None})
 return jsonify(ok=True)

@app.get('/api/admin/settings')
@admin_required
def get_settings():
 p,rev=settings();return jsonify(policy=p,revision=rev,rules=RULES,defaults=defaults())

@app.get('/api/admin/storage')
@admin_required
def admin_storage():
 with db() as c:return jsonify(storage.snapshot(c))

@app.post('/api/admin/settings')
@admin_required
def set_settings():
 v=payload();p=v.get('policy')
 if not isinstance(p,dict) or set(p)!=set(DEFAULTS):return fail('策略字段不完整。')
 try:
  for k in ('downloadsEnabled','uploadsEnabled','webUploads','previewsEnabled','apiUploads','publicationConfirmation','fullyAutomatic','autoApprove','autoPublish','allowLimited','unrankedEnabled','requireBehaviorAssessment','strictRaceReference'):
   if type(p[k]) is not bool:raise ValueError('开关必须为布尔值')
  def number(obj,key,low,high):
   n=obj[key]
   if type(n) not in (int,float) or not math.isfinite(n) or not low<=n<=high:raise ValueError('参数范围无效：'+key)
  for k,lo,hi in [('maxBotScore',0,100),('seedScoreCap',0,99),('minScore',0,100),('maxDuration',1,86400)]:number(p,k,lo,hi)
  number(p,'downloadsOpenAt',0,4102444800)
  if p['fullyAutomatic']:p['unrankedEnabled']=True
  p['judge']=policy(p['judge'])
  p['scoring']=scoring_weights(p['scoring'])
  p['deductions']=scoring_deductions(p['deductions'])
  for group in ('timestamp','similarity'):
   if not isinstance(p[group],dict) or set(p[group])!=set(DEFAULTS[group]):raise ValueError('子项字段无效')
   for key,default in DEFAULTS[group].items():
    if type(default) is bool and type(p[group][key]) is not bool:raise ValueError('开关无效')
   if p[group]['action'] not in ('review','reject'):raise ValueError('子项动作无效')
  for k,lo,hi in [('mapThreshold',90,100),('pathThreshold',0,100),('minimumDistance',0,10000)]:number(p['similarity'],k,lo,hi)
  number(p['timestamp'],'futureSkewSeconds',0,86400);number(p['timestamp'],'maxAgeDays',0,3650)
 except (ValueError,KeyError,TypeError) as e:return fail(str(e))
 with db(True) as c:
  before,rev=settings(c)
  if v.get('revision')!=rev:return fail('策略已被另一会话修改，请刷新。',409)
  c.execute('UPDATE settings SET json=?,revision=revision+1 WHERE id=1',(dumps(p),));audit(c,'admin','policy',detail={'before':before,'after':p})
  if before['unrankedEnabled'] and not p['unrankedEnabled']:
   for row in c.execute("SELECT * FROM runs WHERE board='unranked'").fetchall():withdraw_public_replay(row,c)
 return jsonify(ok=True,revision=rev+1)

@app.get('/api/admin/keys')
@admin_required
def list_keys():
 with db() as c:rows=c.execute('SELECT id,label,created,last_used,uses,active,scope FROM api_keys ORDER BY created DESC').fetchall()
 return jsonify(items=[dict(r) for r in rows])

@app.post('/api/admin/keys')
@admin_required
def create_key():
 v=payload(2048);label=v.get('label','')
 if not isinstance(label,str):return fail('名称无效。')
 label=label.strip()
 if not 1<=len(label)<=40:return fail('名称应为 1–40 个字符。')
 scope=v.get('scope','upload')
 if scope not in ('upload','koh'):return fail('Key 用途无效。')
 value='hls_'+secrets.token_urlsafe(32);key_id=secrets.token_hex(8)
 with db(True) as c:
  if c.execute('SELECT count(*) FROM api_keys WHERE active=1').fetchone()[0]>=20:return fail('最多启用 20 个 Key。')
  c.execute('INSERT INTO api_keys(id,label,hash,created,scope) VALUES(?,?,?,?,?)',(key_id,label,digest(value),time.time(),scope));audit(c,'admin','api_key_created',detail={'id':key_id,'label':label})
 return jsonify(id=key_id,key=value),201

@app.post('/api/admin/keys/<key_id>/revoke')
@admin_required
def revoke_key(key_id):
 return change_key_state(key_id,False)

@app.post('/api/admin/keys/<key_id>/restore')
@admin_required
def restore_key(key_id):
 return change_key_state(key_id,True)

def change_key_state(key_id,active):
 v=payload(1024)
 if set(v)!={'confirmed'} or v['confirmed'] is not True:return fail('请先确认此 Key 操作。',400,'confirmation_required')
 with db(True) as c:
  row=c.execute('SELECT id,label,scope,active FROM api_keys WHERE id=?',(key_id,)).fetchone()
  if not row:abort(404)
  if bool(row['active'])==active:return jsonify(ok=True,active=active,changed=False)
  if active and c.execute('SELECT count(*) FROM api_keys WHERE active=1').fetchone()[0]>=20:return fail('最多启用 20 个 Key。',409,'key_limit')
  c.execute('UPDATE api_keys SET active=? WHERE id=?',(int(active),key_id))
  audit(c,g.admin_name,'api_key_restored' if active else 'api_key_revoked',detail={'id':key_id,'label':row['label'],'scope':row['scope'],'previousActive':bool(row['active'])})
 return jsonify(ok=True,active=active,changed=True)

@app.get('/api/admin/audit')
@admin_required
def audit_log():
 with db() as c:rows=c.execute('SELECT id,at,actor,action,run FROM audit ORDER BY id DESC LIMIT 100').fetchall()
 return jsonify(items=[dict(r) for r in rows])

@app.get('/api/admin/audit/<int:entry_id>')
@admin_required
def audit_detail(entry_id):
 with db() as c:row=c.execute('SELECT * FROM audit WHERE id=?',(entry_id,)).fetchone()
 if not row:abort(404)
 return jsonify(**dict(row))

DOWNLOADS=Path(os.environ.get('HALLS_DOWNLOADS',ROOT/'downloads')).resolve()
def download_items():
 try:items=json.loads((DOWNLOADS/'manifest.json').read_text())['items']
 except FileNotFoundError:return []
 result=[]
 for item in items:
  if item.get('product')!='halls' or not re.fullmatch(r'[A-Za-z0-9_.-]+',item['file']):continue
  path=DOWNLOADS/item['file']
  if not path.is_file():continue
  result.append({**item,'bytes':path.stat().st_size,'url':'/download='+item['product']+'?platform='+item['platform']+'&arch='+item['arch']})
 return result
@app.get('/api/downloads')
def downloads_list():
 p,_=settings();state=download_state(p)
 return jsonify(items=download_items() if state['enabled'] else [],opensAt=state['opensAt'] if state['scheduled'] else None,serverTime=state['serverTime'],emptyMessage='暂无可用下载' if state['enabled'] else '游戏下载暂未开放')
@app.get('/download=<product>')
def download_file(product):
 if product=='halls' and not download_state(settings()[0])['enabled']:return fail('游戏下载暂未开放。',403,'downloads_disabled')
 platform=request.args.get('platform','windows').lower();platform={'win':'windows','mac':'macos'}.get(platform,platform)
 arch=request.args.get('arch','universal' if platform=='macos' and product=='halls' else 'any' if product!='halls' else 'x86_64').lower();arch={'amd64':'x86_64','arm64':'aarch64'}.get(arch,arch)
 item=next((i for i in download_items() if (i['product'],i['platform'],i['arch'])==(product,platform,arch)),None)
 if not item:abort(404)
 return send_from_directory(DOWNLOADS,item['file'],as_attachment=True,download_name=item['file'])
@app.get('/admin/api-guide')
@admin_required
def api_guide():
 text=(ROOT/'private-docs/api-guide.html').read_text()
 for marker,name in [('__UI_FONTS__','fonts/ui.css'),('__SITE_CSS__','site-inline.css'),('__GUIDE_CSS__','api-guide.css')]:text=text.replace(marker,(ROOT/'web'/name).read_text())
 return Response(assets_bundle.rewrite(text),mimetype='text/html')
@app.get('/api/admin/guide')
@admin_required
def guide_download():return send_from_directory(ROOT/'private-docs','HALLS-API-Guide-2.0.zip',as_attachment=True)
@app.get('/api/admin/openapi.json')
@admin_required
def openapi_download():return send_from_directory(ROOT/'private-docs','openapi.json',as_attachment=True,download_name='halls-openapi-3.1.json')

PAGE_LABELS={'queued':'排队中','receiving':'接收文件','processing':'正在评判','done':'评判完成','invalid':'凭证无效','error':'处理未完成','duplicate':'重复记录','ranked':'正式榜','unranked':'非排名榜','hidden':'未公开','approved':'已通过','pending':'待审核','rejected':'未通过','accepted':'通过全部规则','accepted_limited':'部分规则通过','review':'待复核','pass':'通过','fail':'未通过','disabled':'已关闭','insufficient':'样本不足','inconclusive':'未完成'}
def page_duration(value):return '—' if value is None else f'{int(value//60):02d}:{value%60:05.2f}'
def page_platform(data):return {'windows':'Windows','macos':'macOS','linux':'Linux'}.get(data.get('platform'),'—')+(' · ARM64' if data.get('architecture')=='aarch64' else ' · x86_64' if data.get('architecture') else '')

@app.get('/')
@app.get('/upload')
@app.get('/download')
@app.get('/preview')
@app.get('/about')
@app.get('/leaderboard')
@app.get('/admin')
@app.get('/run/<run_id>')
def shell(run_id=None):
 p,_=settings();web_uploads=p['uploadsEnabled'] and p['webUploads']
 text=(ROOT/'web/index.html').read_text().replace('__UI_FONTS__',(ROOT/'web/fonts/ui.css').read_text()).replace('__SITE_CSS__',(ROOT/'web/site-inline.css').read_text())
 if request.path in ('/upload','/preview','/download'):
  content=page_fragment(request.path[1:]);text=text.replace('<main id="app"><p>载入中…</p></main>','<main id="app" data-server-page="'+request.path+'">'+content+'</main>')
 elif request.path in ('/','/about'):
  name='home-content.html' if request.path=='/' else 'about-content.html'
  text=text.replace('<main id="app"><p>载入中…</p></main>','<main id="app" data-server-page="'+request.path+'">'+(ROOT/'web'/name).read_text()+'</main>')
 elif request.path=='/admin':
  content=render_template('admin-page.html',authenticated=g.admin,csrf=g.csrf,data=admin_runs_data() if g.admin else None,labels=PAGE_LABELS,duration=page_duration)
  text=text.replace('<main id="app"><p>载入中…</p></main>','<main id="app" data-server-page="/admin">'+content+'</main>')
 elif request.path=='/leaderboard':
  data=ranking_data();content=render_template('leaderboard-page.html',data=data,duration=page_duration)
  text=text.replace('<main id="app"><p>载入中…</p></main>','<main id="app" data-server-page="/leaderboard">'+content+'</main>')
 elif run_id:
  try:data=run_data(run_id)
  except public_replay.CapacityError:return fail('服务器暂时无法准备公开回放资源。',503,'replay_storage_full')
  content=render_template('run-page.html',data=data,labels=PAGE_LABELS,duration=page_duration,platform=page_platform(data))
  text=text.replace('<main id="app"><p>载入中…</p></main>','<main id="app" data-server-page="'+request.path+'">'+content+'</main>')
 text=public_upload_links(text.replace('data-web-uploads="1"','data-web-uploads="'+str(int(web_uploads))+'"'),web_uploads)
 return Response(assets_bundle.rewrite(text),mimetype='text/html')
@app.get('/assets/<path:name>')
def assets(name):return send_from_directory(ROOT/'web',name)
@app.get('/replay')
def replay_shell():return Response(assets_bundle.rewrite((ROOT/'web/replay/index.html').read_text()),mimetype='text/html')
@app.get('/replay-assets/<path:name>')
def replay_assets(name):return send_from_directory(ROOT/'web/replay',name)
import previews as preview_jobs
preview_jobs.register(app,ip,fail,SECURE)


@app.get('/sw.js')
def service_worker():return Response((ROOT/'web/sw.js').read_text().replace('__ASSET_VERSION__',assets_bundle.version).replace('__REPLAY_SHELL__',assets_bundle.url('replay-assets/index.html')).replace('__MEDIA_MAP__',dumps(assets_bundle.media_map())),mimetype='text/javascript')

@app.get('/static/<version>/<path:name>')
def versioned_assets(version,name):
 if version not in (assets_bundle.version,assets_bundle.resource_version(name)):abort(404)
 source=assets_bundle.source(name)
 if name!='preload.json' and source is None:abort(404)
 if source and source.suffix not in {'.js','.css','.html','.svg','.json'}:return send_from_directory(source.parent,source.name)
 data,mime=assets_bundle.content(name)
 return Response(data,mimetype=mime)

from competition import register as register_competition
register_competition(app,ip)
source_records.register(app,admin_required)

if __name__=='__main__':app.run(host='127.0.0.1',port=int(os.environ.get('PORT','8770')),threaded=True)
