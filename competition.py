"""Private KOH bridge: hash lookup, idempotent admission, and score-only results."""
import hashlib,json,math,os,re,secrets,sqlite3,time,unicodedata
from flask import request,jsonify,abort,g
from store import DATA,db,dumps,digest,settings,rate,audit
from scoring import VERSION,evaluate_report
import previews
import submission_sources as sources
import storage

def register(app,ip):
 def fail(message,status=400,code='invalid_request'):
  return jsonify(error=message,code=code),status

 def authorize(key):
  p,_=settings()
  if not p['uploadsEnabled'] or not p['apiUploads']:abort(403,description='比赛 API 当前关闭。')
  with db() as c:r=c.execute("SELECT * FROM api_keys WHERE hash=? AND active=1 AND scope='koh'",(digest(key),)).fetchone()
  if not r:abort(401,description='比赛 API Key 无效或已撤销。')
  if not rate('koh:'+r['id'],600,60):abort(429,description='比赛 API 请求过于频繁。')
  return r

 def instance(value):
  if not isinstance(value,str) or not re.fullmatch('[a-f0-9]{32}',value):abort(400,description='实例标识无效。')
  return value

 def context(value):
  if not isinstance(value,dict) or set(value)!={'problem_id','submission_id'} or any(type(v) is not int or not 0<v<2**63 for v in value.values()):abort(400,description='提交编号无效。')
  return value['problem_id'],value['submission_id']

 def task(key_id,problem,submission,c):
  row=c.execute('SELECT * FROM koh_submissions WHERE key_id=? AND problem_id=? AND submission_id=?',(key_id,problem,submission)).fetchone()
  if not row:abort(404)
  return row

 def result(row):
  if not row:return {'status':'awaiting_upload','uploadRequired':True}
  report=json.loads(row['report'] or '{}');status=row['status']
  if status=='error':return {'status':'error','code':'assessment_unavailable'}
  if status in ('invalid','duplicate'):score=0.
  elif status=='done':
   # Incomplete native evaluation is an organizer error, not a contestant penalty.
   if any(r.get('status')=='inconclusive' and r.get('id') not in ('map_similarity','path_similarity') for r in report.get('rules',[])):
    return {'status':'error','code':'assessment_incomplete'}
   perf=report.get('performance',{})
   if perf.get('version')!=VERSION:
    config=json.loads(row['policy']);current,_=settings();score=evaluate_report(report,current['scoring'],current['deductions'],current['seedScoreCap'])['score']
   else:score=perf.get('score')
   if type(score) not in (int,float) or not math.isfinite(score) or not 0<=score<=100:return {'status':'error','code':'invalid_score'}
  else:return {'status':status,'uploadRequired':False,'id':row['id']}
  link='/run/'+row['id'] if status=='done' else ''
  feedback=('成绩与回放：'+os.environ.get('HALLS_ORIGIN','https://halls.z4ck.dev').rstrip('/')+link) if link else '凭证校验未通过，得分为 0。'
  return {'status':'done','uploadRequired':False,'id':row['id'],'result':{'code':200,'score':score,'max_score':100,'feedback':feedback},'runUrl':link}

 def duplicate_result():
  return {'known':True,'status':'done','uploadRequired':False,'result':{'code':200,'score':0,'max_score':100,'feedback':'凭证已被提交，本次得分为 0。'}}

 @app.post('/api/koh/<api_key>/lookup')
 def koh_lookup(api_key):
  key=authorize(api_key)
  if not request.is_json or request.content_length is None or not 0<request.content_length<=2048:abort(400)
  v=request.get_json();problem,submission=context(v.get('context') if isinstance(v,dict) else None)
  boot=instance(v.get('instance'));sha=v.get('sha256');size=v.get('bytes')
  try:origin=sources.source_id(v.get('source_id',''));origin_kind=sources.kind(v.get('source_kind','provided'),origin)
  except ValueError:abort(400)
  if not isinstance(sha,str) or not re.fullmatch('[a-f0-9]{64}',sha) or type(size) is not int or not 0<size<=app.config['MAX_CONTENT_LENGTH']:abort(400,description='文件摘要或大小无效。')
  with db(True) as c:
   c.execute('DELETE FROM koh_submissions WHERE run IS NULL AND created<?',(time.time()-600,))
   if c.execute('SELECT count(*) FROM koh_submissions').fetchone()[0]>=100000:return fail('提交记录配额已满。',503,'storage_full')
   old=c.execute('SELECT * FROM koh_submissions WHERE key_id=? AND problem_id=? AND submission_id=?',(key['id'],problem,submission)).fetchone()
   if old and (old['sha']!=sha or old['bytes']!=size):return fail('本次提交已绑定另一份凭证。',409,'submission_conflict')
   existing=c.execute('SELECT * FROM runs WHERE sha=?',(sha,)).fetchone()
   duplicate=bool(old['duplicate']) if old else existing is not None
   if old and existing and old['run']!=existing['id']:duplicate=True
   if not old and existing is None and previews.busy(c)>=8:return fail('评判队列已满。',429,'queue_full')
   if not old:
    c.execute('INSERT INTO koh_submissions(key_id,problem_id,submission_id,sha,bytes,instance,duplicate,run,created) VALUES(?,?,?,?,?,?,?,?,?)',(key['id'],problem,submission,sha,size,boot,int(duplicate),existing['id'] if existing else None,time.time()))
   elif duplicate:
    c.execute('UPDATE koh_submissions SET duplicate=1 WHERE key_id=? AND problem_id=? AND submission_id=?',(key['id'],problem,submission))
    sources.bind(c,key['id'],problem,submission,sha,existing['id'] if existing else old['run'],duplicate=True,status='duplicate')
   c.execute('UPDATE api_keys SET uses=uses+1,last_used=? WHERE id=?',(time.time(),key['id']))
   sources.record(c,key,sha,size,origin,origin_kind,channel='koh',problem=problem,submission=submission,instance=boot,run=existing['id'] if existing else None,duplicate=duplicate)
  return jsonify(**duplicate_result()) if duplicate else jsonify(known=existing is not None,**result(existing))

 @app.post('/api/koh/<api_key>/proofs/<int:problem>/<int:submission>')
 def koh_upload(api_key,problem,submission):
  key=authorize(api_key);boot=instance(request.headers.get('X-KOH-Instance'))
  with db() as c:
   t=task(key['id'],problem,submission,c);existing=c.execute('SELECT * FROM runs WHERE sha=?',(t['sha'],)).fetchone()
  if t['duplicate']:return jsonify(**duplicate_result())
  if existing and existing['id']!=t['run']:
   with db(True) as c:sources.bind(c,key['id'],problem,submission,t['sha'],existing['id'],duplicate=True,status='duplicate')
   return jsonify(**duplicate_result())
  if existing:return jsonify(**result(existing)) # Same-submission retry only.
  if request.mimetype!='application/octet-stream' or request.content_length!=t['bytes']:abort(400,description='文件长度或类型无效。')
  name=unicodedata.normalize('NFKC',request.args.get('name',f'KOH #{submission}')).strip()
  if not 1<=len(name)<=32 or any(unicodedata.category(c)[0]=='C' for c in name):abort(400,description='名字无效。')
  run_id=secrets.token_hex(12);now=time.time()
  with db(True) as c:
   existing=c.execute('SELECT * FROM runs WHERE sha=?',(t['sha'],)).fetchone()
   if existing:
    if existing['id']!=t['run']:sources.bind(c,key['id'],problem,submission,t['sha'],existing['id'],duplicate=True,status='duplicate')
    return jsonify(**result(existing)) if existing['id']==t['run'] else jsonify(**duplicate_result())
   if previews.busy(c)>=8:return fail('评判队列已满。',429,'queue_full')
   if error:=storage.admission(c):return fail(error,503,'storage_full')
   stats=c.execute('SELECT COUNT(*) n,COALESCE(SUM(bytes),0) bytes FROM runs').fetchone()
   if stats['n']>=20000 or stats['bytes']+300*1024**2>int(os.environ.get('HALLS_STORAGE_GB','20'))*1024**3:return fail('存储配额不足。',503,'storage_full')
   config,revision=settings(c);config={**config,'fullyAutomatic':True,'unrankedEnabled':True}
   c.execute('INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,bytes,policy,policy_revision) VALUES(?,?,?,?,?,?,?,?,?,?)',(run_id,name,t['sha'],digest(secrets.token_urlsafe(32)),now,now,'receiving',t['bytes'],dumps(config),revision))
   c.execute('UPDATE koh_submissions SET run=? WHERE key_id=? AND problem_id=? AND submission_id=?',(run_id,key['id'],problem,submission))
   sources.bind(c,key['id'],problem,submission,t['sha'],run_id,status='receiving')
   audit(c,'koh','upload',run_id,{'source':'koh','apiKeyId':key['id'],'problemId':problem,'submissionId':submission,'instance':boot})
  path=DATA/'proofs'/run_id;h=hashlib.sha256();count=0
  try:
   with path.open('xb') as f:
    while chunk:=request.stream.read(65536):
     count+=len(chunk)
     if count>t['bytes']:raise ValueError('文件长度不一致。')
     h.update(chunk);f.write(chunk)
   if count!=t['bytes'] or h.hexdigest()!=t['sha']:raise ValueError('文件摘要不一致。')
   with db(True) as c:
    c.execute("UPDATE runs SET status='queued',updated=? WHERE id=?",(time.time(),run_id));sources.bind(c,key['id'],problem,submission,t['sha'],run_id,verified=True)
  except BaseException as error:
   path.unlink(missing_ok=True)
   with db(True) as c:
    sources.bind(c,key['id'],problem,submission,t['sha'],run_id,status='hash_mismatch' if isinstance(error,ValueError) else 'upload_interrupted')
    c.execute('UPDATE koh_submissions SET run=NULL WHERE run=?',(run_id,));c.execute('DELETE FROM runs WHERE id=?',(run_id,))
   if isinstance(error,ValueError):return fail(str(error),400,'hash_mismatch')
   raise
  return jsonify(status='queued',uploadRequired=False,id=run_id),202

 @app.get('/api/koh/<api_key>/results/<int:problem>/<int:submission>')
 def koh_result(api_key,problem,submission):
  key=authorize(api_key)
  with db() as c:
   t=task(key['id'],problem,submission,c);row=c.execute('SELECT * FROM runs WHERE sha=?',(t['sha'],)).fetchone()
  if row and row['id']!=t['run']:
   with db(True) as c:sources.bind(c,key['id'],problem,submission,t['sha'],row['id'],duplicate=True,status='duplicate')
  value=duplicate_result() if t['duplicate'] or row and row['id']!=t['run'] else result(row)
  if value['status']=='error':return jsonify(**value),503
  return jsonify(**value)

 from competition_receipts import register as register_receipts
 register_receipts(app,authorize,instance,context,task,result,duplicate_result)
