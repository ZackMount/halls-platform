"""Small, one-use score capabilities for an external contest's upload limit.

The receipt contains no score. Only this server's completed result can be
claimed, once, for one contest submission. Raw receipt capabilities are never
stored in SQLite or written to the attribution/audit ledgers.
"""
import base64,hashlib,hmac,json,re,secrets,time
from flask import request,jsonify,abort
from store import DATA,db,dumps,digest,audit
import submission_sources as sources

TOKEN=re.compile(r'hkr1_[A-Za-z0-9_-]{43}')

def token_for(row):
 secret=bytes.fromhex((DATA/'session.key').read_text().strip())
 if len(secret)!=32:raise ValueError('Invalid server secret')
 message=b'HALLS/KOH/receipt/v1\0'+dumps([row['key_id'],row['problem_id'],row['submission_id'],row['instance'],row['sha'],row['nonce']]).encode()
 return 'hkr1_'+base64.urlsafe_b64encode(hmac.new(secret,message,hashlib.sha256).digest()).decode().rstrip('=')

def unique_object(items):
 result={}
 for key,value in items:
  if key in result:raise ValueError('Duplicate JSON key')
  result[key]=value
 return result

def receipt_value(value):
 return isinstance(value,dict) and set(value)=={'version','token'} and type(value['version']) is int and value['version']==1 and isinstance(value['token'],str) and TOKEN.fullmatch(value['token']) is not None

def zero(feedback):return {'code':200,'score':0,'max_score':100,'feedback':feedback}

def register(app,authorize,instance,context,task,result,duplicate_result):
 @app.post('/api/koh/<api_key>/receipts/<int:problem>/<int:submission>')
 def koh_receipt_issue(api_key,problem,submission):
  key=authorize(api_key);boot=instance(request.headers.get('X-KOH-Instance'))
  if request.content_length not in (None,0) or request.stream.read(1):abort(400,description='回执签发不接受请求体。')
  with db(True) as c:
   source=task(key['id'],problem,submission,c)
   if not secrets.compare_digest(source['instance'],boot):abort(403,description='回执与当前实例不符。')
   old=c.execute('SELECT * FROM koh_receipts WHERE key_id=? AND problem_id=? AND submission_id=?',(key['id'],problem,submission)).fetchone()
   if old:
    token=token_for(old)
    if not secrets.compare_digest(digest(token),old['token_hash']):return jsonify(error='回执暂时不可用。',code='receipt_unavailable'),503
    return jsonify(receipt={'version':1,'token':token},filename='HALLS-'+old['token_hash'][:16]+'.hreceipt')
   row=c.execute('SELECT * FROM runs WHERE sha=?',(source['sha'],)).fetchone()
   value=duplicate_result() if source['duplicate'] or row and row['id']!=source['run'] else result(row)
   if value['status']!='done':return jsonify(error='评判尚未完成，请稍后重试。',code='assessment_unavailable'),503
   if c.execute('SELECT count(*) FROM koh_receipts').fetchone()[0]>=100000:return jsonify(error='回执配额已满。',code='storage_full'),503
   record={'key_id':key['id'],'problem_id':problem,'submission_id':submission,'instance':boot,'sha':source['sha'],'nonce':secrets.token_hex(16)}
   token=token_for(record);token_hash=digest(token);linked_run=row['id'] if row else source['run']
   c.execute('INSERT INTO koh_receipts(token_hash,key_id,problem_id,submission_id,instance,nonce,sha,bytes,run,result,created) VALUES(?,?,?,?,?,?,?,?,?,?,?)',(token_hash,key['id'],problem,submission,boot,record['nonce'],source['sha'],source['bytes'],linked_run,dumps(value['result']),time.time()))
   c.execute('UPDATE api_keys SET uses=uses+1,last_used=? WHERE id=?',(time.time(),key['id']))
   audit(c,'koh','receipt_issued',linked_run,{'apiKeyId':key['id'],'problemId':problem,'submissionId':submission,'receipt':token_hash[:16]})
  return jsonify(receipt={'version':1,'token':token},filename='HALLS-'+token_hash[:16]+'.hreceipt')

 @app.post('/api/koh/<api_key>/receipts/claim')
 def koh_receipt_claim(api_key):
  key=authorize(api_key)
  if not request.is_json or request.content_length is None or not 0<request.content_length<=2048:abort(400)
  try:value=json.loads(request.get_data(),object_pairs_hook=unique_object,parse_constant=lambda v:(_ for _ in ()).throw(ValueError(v)))
  except (ValueError,RecursionError,UnicodeDecodeError):abort(400)
  if not isinstance(value,dict) or not {'receipt','context','instance'}<=set(value) or set(value)-{'receipt','context','instance','source_id','source_kind'} or not receipt_value(value['receipt']):abort(400,description='回执格式无效。')
  problem,submission=context(value['context']);boot=instance(value['instance'])
  try:origin=sources.source_id(value.get('source_id',''));origin_kind=sources.kind(value.get('source_kind','provided'),origin)
  except ValueError:abort(400)
  token_hash=digest(value['receipt']['token'])
  with db(True) as c:
   row=c.execute('SELECT * FROM koh_receipts WHERE token_hash=? AND key_id=?',(token_hash,key['id'])).fetchone()
   if not row:return jsonify(**zero('回执校验未通过，本次得分为 0。'))
   previous=c.execute('SELECT token_hash FROM koh_receipts WHERE key_id=? AND claim_problem=? AND claim_submission=?',(key['id'],problem,submission)).fetchone()
   if previous and previous['token_hash']!=token_hash:return jsonify(**zero('本次提交已绑定另一份回执，得分为 0。'))
   if row['claim_problem'] is not None:
    if (row['claim_problem'],row['claim_submission'])==(problem,submission):return jsonify(**json.loads(row['result']))
    sources.record(c,key,row['sha'],row['bytes'],origin,origin_kind,channel='koh_receipt',problem=problem,submission=submission,instance=boot,run=row['run'],duplicate=True,verified=True,status='duplicate')
    return jsonify(**zero('回执已被提交，本次得分为 0。'))
   c.execute('UPDATE koh_receipts SET claim_problem=?,claim_submission=?,claim_instance=?,claimed=? WHERE token_hash=?',(problem,submission,boot,time.time(),token_hash))
   sources.record(c,key,row['sha'],row['bytes'],origin,origin_kind,channel='koh_receipt',problem=problem,submission=submission,instance=boot,run=row['run'],verified=True,status='receipt_claimed')
   c.execute('UPDATE api_keys SET uses=uses+1,last_used=? WHERE id=?',(time.time(),key['id']))
   audit(c,'koh','receipt_claimed',row['run'],{'apiKeyId':key['id'],'problemId':problem,'submissionId':submission,'receipt':token_hash[:16]})
   return jsonify(**json.loads(row['result']))
