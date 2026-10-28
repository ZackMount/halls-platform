"""Browser proof rounds and single-task machine judging with synchronous /check."""
import hashlib,json,math,os,secrets,struct,threading,time,unicodedata,urllib.parse
from pathlib import Path
from flask import Flask,request,jsonify,abort,send_from_directory
from werkzeug.exceptions import HTTPException
from remote import Remote,Unavailable,receipt_value,receipt_file,unique_object

MAX_BYTES=15*1024*1024
MAX_RECEIPT_BYTES=2048
MAX_PLAIN_BYTES=256*1024*1024
MAX_HISTORY=10
def valid_envelope(payload):
 if len(payload)<309 or payload[:8]!=b'HLPF\x01\r\n\x1a':return False
 plain,packed=struct.unpack_from('<II',payload,28)
 return 64<plain<=MAX_PLAIN_BYTES and packed>0 and packed==len(payload)-308
def normalized_origin(value):
 try:
  parsed=urllib.parse.urlsplit(value)
  if parsed.scheme not in ('http','https') or not parsed.hostname or parsed.username or parsed.password or parsed.path not in ('','/') or parsed.query or parsed.fragment:return None
  if any(unicodedata.category(c)[0]=='C' for c in value):return None
  return parsed.scheme,parsed.hostname,parsed.port if parsed.port is not None else (443 if parsed.scheme=='https' else 80)
 except ValueError:return None
DEFAULT_PROBLEM_URL='https://www.nssctf.cn/team/problem'
def problem_url(value):
 if not isinstance(value,str) or not value or len(value)>512 or any(unicodedata.category(c)[0]=='C' for c in value):raise ValueError('HALLS_PROBLEM_URL 应为 NSSCTF 的 HTTPS 题目链接。')
 try:
  parsed=urllib.parse.urlsplit(value)
  allowed=parsed.scheme=='https' and parsed.hostname in ('nssctf.cn','www.nssctf.cn') and parsed.port in (None,443) and not parsed.username and not parsed.password
 except ValueError:allowed=False
 if not allowed:raise ValueError('HALLS_PROBLEM_URL 应为 NSSCTF 的 HTTPS 题目链接。')
 return value
def source_id(value):
 if not isinstance(value,str):raise ValueError('来源标识无效。')
 value=value.strip()
 if len(value)>256 or len(value.encode())>1024 or any(unicodedata.category(c)[0]=='C' for c in value):raise ValueError('来源标识无效。')
 return value
def create_app(remote=None,clock=time.monotonic):
 app=Flask(__name__);app.json.ensure_ascii=False
 mode=os.environ.get('HALLS_SUBMISSION_MODE','proof')
 if mode not in ('proof','receipt'):raise ValueError('HALLS_SUBMISSION_MODE 必须是 proof 或 receipt。')
 max_bytes=MAX_RECEIPT_BYTES if mode=='receipt' else MAX_BYTES
 app.config.update(MAX_CONTENT_LENGTH=max_bytes+16384,MAX_FORM_MEMORY_SIZE=128*1024,MAX_FORM_PARTS=4)
 state={'payload':None,'result':None,'receipt':None,'busy':False,'instance':secrets.token_hex(16),'lastSubmission':None,'page_source':None,'generation':0,'history':[],'previous_context':None}
 configured_source=source_id(os.environ.get('HALLS_SOURCE_ID',''))
 public_problem=problem_url(os.environ.get('HALLS_PROBLEM_URL',DEFAULT_PROBLEM_URL))
 web_uploads=os.environ.get('HALLS_WEB_UPLOADS','1')
 if web_uploads not in ('0','1'):raise ValueError('HALLS_WEB_UPLOADS 必须是 0 或 1。')
 if mode=='receipt' and web_uploads!='0':raise ValueError('回执评测模式必须关闭网页上传。')
 public_origin=os.environ.get('HALLS_PUBLIC_ORIGIN','')
 if public_origin and (any(c.isspace() for c in public_origin) or '\\' in public_origin or len(public_origin)>512 or normalized_origin(public_origin) is None or normalized_origin(public_origin)[2]<1 or urllib.parse.urlsplit(public_origin).path):raise ValueError('HALLS_PUBLIC_ORIGIN 必须是完整公开源地址，不含路径、参数或凭据。')
 try:nss_max=float(os.environ.get('HALLS_NSS_MAX_SCORE','1000'))
 except ValueError:raise ValueError('赛事满分配置无效。') from None
 if not math.isfinite(nss_max) or not 0<nss_max<=1000000:raise ValueError('赛事满分配置无效。')
 # The upload API retains a source namespace, unrelated to the eventual NSS task.
 browser_context={'problem_id':1,'submission_id':secrets.randbelow(2**53-1)+1}
 condition=threading.Condition();timeout=float(os.environ.get('HALLS_CHECK_TIMEOUT','110'))
 if not 1<=timeout<=115:raise ValueError('HALLS_CHECK_TIMEOUT 必须在 1–115 秒之间。')
 remote=remote or Remote(os.environ.get('HALLS_API_BASE','https://halls.z4ck.dev'),os.environ.get('HALLS_KOH_KEY',''),os.environ.get('HALLS_ALLOW_HTTP')=='1')
 browser_mode=mode=='proof' and web_uploads=='1'

 def cooldown_seconds():
  return max(0,math.ceil(60-(clock()-state['lastSubmission']))) if state['lastSubmission'] is not None else 0

 def configuration():
  # Called while holding condition so a refresh sees one complete round.
  return dict(uploadsEnabled=web_uploads=='1',maxUploadBytes=max_bytes,context=(state.get('context') or browser_context) if web_uploads=='1' else None,hasSubmission=state['payload'] is not None,problemUrl=public_problem,nssMaxScore=nss_max,receiptDownloadEnabled=browser_mode,
   busy=state['busy'],result=state['result'] if browser_mode else None,submissionName=state.get('name') if browser_mode else None,cooldownSeconds=cooldown_seconds() if browser_mode else 0,history=list(state['history']) if browser_mode else [])

 def current_request_round():
  # Old browser clients and the NSS machine protocol do not send this header.
  expected=request.headers.get('X-HALLS-Submission-ID')
  if browser_mode and expected is not None and expected!=str(browser_context['submission_id']):abort(409,description='提交已切换，请刷新页面后重试。')
  return state['generation']

 def require_round(generation):
  if generation!=state['generation']:abort(409,description='提交已切换，请刷新页面后重试。')

 def request_source():
  forwarded=request.headers.get('X-Forwarded-Host')
  try:
   if os.environ.get('HALLS_TRUST_SOURCE_PROXY')=='1' and forwarded:return source_id(forwarded),'forwarded_host'
   return source_id(request.host),'request_host'
  except ValueError:abort(400,description='来源标识无效。')

 @app.get('/')
 def index():
  with condition:
   if state['page_source'] is None and state['payload'] is None:
    identifier,mode=request_source();state['page_source']=(identifier,'page_host' if mode=='request_host' else mode)
  return send_from_directory(Path(__file__).parent/'web','index.html')

 @app.get('/web/<path:name>')
 def web_asset(name):return send_from_directory(Path(__file__).parent/'web',name)

 @app.get('/web-config')
 def web_config():
  with condition:return jsonify(configuration())

 @app.after_request
 def secure_headers(response):
  response.headers.update({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"})
  return response

 # Count attempts before multipart parsing. Rejected files never bind payload,
 # while the bounded burst lets a player correct a mistaken file immediately.
 upload_attempts=[]
 @app.before_request
 def limit_upload_attempts():
  if request.method!='POST' or request.path not in ('/upload','/check','/receipt','/new-submission'):return
  if request.path=='/upload':
   now=clock()
   with condition:
    upload_attempts[:]=[at for at in upload_attempts if now-at<60]
    if len(upload_attempts)>=3:
     response=jsonify(code=429,message='上传过于频繁，请稍后重试。');response.status_code=429;response.headers['Retry-After']=str(max(1,math.ceil(60-(now-upload_attempts[0]))));return response
    upload_attempts.append(now)
  origin=request.headers.get('Origin')
  if origin is not None and (normalized_origin(origin) is None or normalized_origin(origin)!=normalized_origin(public_origin or request.host_url)):abort(403,description='请从当前网页提交凭证。')

 @app.post('/new-submission')
 def new_submission():
  nonlocal browser_context
  if not browser_mode:abort(404)
  if not request.is_json or request.content_length is None or request.content_length>512:abort(400,description='请提供当前提交编号。')
  try:value=json.loads(request.get_data(),object_pairs_hook=unique_object,parse_constant=lambda value:(_ for _ in ()).throw(ValueError(value)))
  except (ValueError,RecursionError):abort(400,description='当前提交编号无效。')
  if not isinstance(value,dict) or set(value)!={'context'} or not isinstance(value['context'],dict) or set(value['context'])!={'problem_id','submission_id'} or any(type(value['context'][key]) is not int or not 0<value['context'][key]<2**63 for key in value['context']):abort(400,description='当前提交编号无效。')
  with condition:
   expected=value['context']
   # Retrying a successful reset must not create another round or lose data.
   if state['payload'] is None and expected==state['previous_context']:return jsonify(configuration())
   if expected!=browser_context:abort(409,description='提交已切换，请刷新页面后重试。')
   if state['busy']:abort(409,description='正在评判或获取提交码，请稍后再提交新的凭证。')
   if state['payload'] is None:return jsonify(configuration())
   if state['result'] is not None:
    code=receipt_value(state['receipt']['receipt'])['token'] if state['receipt'] is not None else None
    item={'context':dict(state['context']),'name':state['name'],'result':dict(state['result']),'submissionCode':code}
    state['history'].insert(0,item);del state['history'][MAX_HISTORY:]
   previous=dict(browser_context)
   # A monotonic counter within the random instance namespace never reuses a
   # prior round ID during this process, without retaining an unbounded ID set.
   browser_context={'problem_id':1,'submission_id':browser_context['submission_id']%(2**53-1)+1}
   state.update(payload=None,result=None,receipt=None,previous_context=previous,generation=state['generation']+1)
   for name in ('sha','context','name','source_id','source_kind'):state.pop(name,None)
   # lastSubmission and upload_attempts deliberately survive the new round.
   condition.notify_all();return jsonify(configuration())

 @app.post('/upload')
 def upload():
  if request.mimetype!='multipart/form-data' or set(request.files)!={'file'} or 'context' not in request.form or set(request.form)-{'context','name'} or len(request.files.getlist('file'))!=1 or any(len(request.form.getlist(k))!=1 for k in request.form):abort(400,description='请上传一个 file 文件和一个 context 字段，可附带 name。')
  name=None
  if 'name' in request.form:
   name=unicodedata.normalize('NFKC',request.form['name']).strip()
   if not 1<=len(name)<=32 or any(unicodedata.category(c)[0]=='C' for c in name):abort(400,description='名字应为 1–32 个字符，不含控制符。')
  raw=request.form['context']
  if len(raw.encode())>1536:abort(400)
  try:context=json.loads(raw,object_pairs_hook=unique_object,parse_constant=lambda value:(_ for _ in ()).throw(ValueError(value)))
  except (ValueError,RecursionError):abort(400,description='context 无效。')
  if not isinstance(context,dict) or not {'submission_id','problem_id'}<=set(context) or set(context)-{'submission_id','problem_id','source_id'} or any(type(context[k]) is not int or not 0<context[k]<2**63 for k in ('submission_id','problem_id')):abort(400,description='context 应包含两个正整数编号。')
  try:provided_source=source_id(context.get('source_id',''))
  except ValueError:abort(400,description='来源标识无效。')
  with condition:
   if web_uploads=='1' and context!=browser_context:abort(403,description='提交编号与当前实例不符，请刷新页面后重试。')
  context={k:context[k] for k in ('submission_id','problem_id')}
  proof=request.files['file'];filename=proof.filename or ''
  if any(unicodedata.category(c)[0]=='C' for c in filename) or mode=='receipt' and len(filename.encode())>255:abort(400,description='提交文件名无效。')
  if mode=='proof' and not filename.replace('\\','/').rsplit('/',1)[-1].lower().endswith('.hproof'):abort(400,description='请选择 .hproof 文件。')
  payload=proof.read(max_bytes+1)
  if not payload:abort(400,description='凭证文件不能为空。')
  if len(payload)>max_bytes:abort(413,description='提交码超过 2 KiB。' if mode=='receipt' else '凭证超过 15 MiB。')
  if mode=='receipt':
   try:receipt_file(payload)
   except (ValueError,UnicodeError,RecursionError):abort(400,description='提交码格式无效，请重新复制。')
  elif not valid_envelope(payload):abort(400,description='凭证封装格式无效，请重新选择 .hproof 文件。')
  sha=hashlib.sha256(payload).hexdigest()
  with condition:
   # Multipart parsing can race another browser tab starting its next round.
   if web_uploads=='1' and context!=browser_context:abort(403,description='提交编号与当前实例不符，请刷新页面后重试。')
   if state['payload'] is not None:
    if sha==state['sha'] and payload==state['payload'] and context==state['context']:return jsonify(code=200)
    if clock()-state['lastSubmission']<60:
     response=jsonify(code=429,message='每分钟只能提交一次成绩。');response.status_code=429;response.headers['Retry-After']=str(max(1,int(60-(clock()-state['lastSubmission']))+1));return response
    abort(409,description='请先选择“提交新的凭证”。' if browser_mode else '一个容器只处理一份凭证，请使用新容器。')
   if cooldown_seconds():
    response=jsonify(code=429,message='每分钟只能提交一次成绩。');response.status_code=429;response.headers['Retry-After']=str(cooldown_seconds());return response
   if name is None:
    name=(proof.filename or '').replace('\\','/').rsplit('/',1)[-1].rsplit('.',1)[0]
    name=''.join(c for c in unicodedata.normalize('NFKC',name) if unicodedata.category(c)[0]!='C').strip()[:32] or f'KOH #{context["submission_id"]}'
   if configured_source:origin,origin_kind=configured_source,'configured'
   elif provided_source:origin,origin_kind=provided_source,'context'
   elif state['page_source']:origin,origin_kind=state['page_source']
   else:origin,origin_kind=request_source()
   state.update(payload=payload,sha=sha,context=context,name=name,lastSubmission=clock(),source_id=origin,source_kind=origin_kind)
  return jsonify(code=200)

 @app.post('/check')
 def check():
  if request.content_length not in (None,0) or request.stream.read(1):abort(400,description='/check 不接受请求体。')
  deadline=clock()+timeout
  with condition:
   generation=current_request_round()
   if state['payload'] is None:abort(409,description='请先上传凭证。')
   while state['busy']:
    remaining=deadline-clock()
    if remaining<=0:raise Unavailable('评分等待超时，请重试本次评测。')
    condition.wait(remaining)
   require_round(generation)
   if state['result'] is not None:return jsonify(state['result'])
   state['busy']=True
   job={key:state[key] for key in ('payload','context','instance','source_id','source_kind')}
   if mode=='proof':job.update(sha=state['sha'],name=state['name'])
  try:
   if mode=='receipt':value=remote.claim(receipt_file(job['payload']),job['context'],job['instance'],deadline,source_id=job['source_id'],source_kind=job['source_kind'])
   else:value=remote.evaluate(job['payload'],job['sha'],job['context'],job['instance'],job['name'],deadline,source_id=job['source_id'],source_kind=job['source_kind'])
   with condition:require_round(generation);state['result']=value
   return jsonify(value)
  finally:
   with condition:state['busy']=False;condition.notify_all()

 def receipt_response(value):
  return app.response_class(receipt_value(value['receipt'])['token'],mimetype='text/plain')

 @app.post('/receipt')
 def receipt():
  if mode!='proof' or web_uploads!='1':abort(404)
  if request.content_length not in (None,0) or request.stream.read(1):abort(400,description='获取提交码不接受请求体。')
  deadline=clock()+timeout
  with condition:
   generation=current_request_round()
   if state['result'] is None:abort(409,description='请先完成本次评判。')
   while state['busy']:
    remaining=deadline-clock()
    if remaining<=0:raise Unavailable('回执等待超时，请重试。')
    condition.wait(remaining)
   require_round(generation)
   if state['receipt'] is not None:return receipt_response(state['receipt'])
   state['busy']=True
   context=dict(state['context']);instance=state['instance']
  try:
   value=remote.receipt(context,instance,deadline)
   with condition:require_round(generation);state['receipt']=value
   return receipt_response(value)
  finally:
   with condition:state['busy']=False;condition.notify_all()

 @app.get('/health')
 def health():return jsonify(code=200,status='ready')

 @app.errorhandler(HTTPException)
 def input_error(error):return jsonify(code=error.code,message=error.description),error.code
 @app.errorhandler(Unavailable)
 def upstream_error(error):return jsonify(code=503,message=str(error)),503
 @app.errorhandler(Exception)
 def internal_error(error):return jsonify(code=500,message='转发服务异常，请重试本次评测。'),500
 return app

if __name__=='__main__':create_app().run(host='127.0.0.1',port=8000)
