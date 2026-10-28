"""Only transports bytes and final scores; no proof decoder or Judge is included."""
import base64,json,math,re,time,urllib.error,urllib.parse,urllib.request

class Unavailable(RuntimeError):pass
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None

def receipt_value(value):
 if not isinstance(value,dict) or set(value)!={'version','token'} or type(value['version']) is not int or value['version']!=1 or not isinstance(value['token'],str) or re.fullmatch(r'hkr1_[A-Za-z0-9_-]{43}',value['token']) is None:raise ValueError('提交回执格式无效。')
 return value

def unique_object(items):
 result={}
 for key,value in items:
  if key in result:raise ValueError('duplicate key')
  result[key]=value
 return result

def receipt_bytes(value):
 token=receipt_value(value)['token'][5:]
 raw=base64.b64decode(token+'=',altchars=b'-_',validate=True)
 if len(raw)!=32 or base64.urlsafe_b64encode(raw).decode().rstrip('=')!=token:raise ValueError('提交回执格式无效。')
 return b'HRC1'+raw

def receipt_file(payload):
 text=payload.strip(b' \t\r\n')
 if text.startswith(b'hkr1_'):
  if len(payload)-len(text)>64:raise ValueError('提交码格式无效。')
  value={'version':1,'token':text.decode('ascii')}
  receipt_bytes(value)
  return value
 if payload.startswith(b'HRC1'):
  if len(payload)!=36:raise ValueError('提交回执格式无效。')
  return {'version':1,'token':'hkr1_'+base64.urlsafe_b64encode(payload[4:]).decode().rstrip('=')}
 # Legacy JSON receipts retain their strict schema and duplicate-key checks.
 return receipt_value(json.loads(payload,object_pairs_hook=unique_object,parse_constant=lambda value:(_ for _ in ()).throw(ValueError(value))))

def score_value(value):
 if not isinstance(value,dict):raise Unavailable('评分结果格式无效。')
 score=value.get('score')
 if value.get('code')!=200 or value.get('max_score')!=100 or type(score) not in (int,float) or not math.isfinite(score) or not 0<=score<=100 or not isinstance(value.get('feedback'),str) or len(value['feedback'])>1000:raise Unavailable('评分结果格式无效。')
 return {k:value[k] for k in ('code','score','max_score','feedback')}

class Remote:
 def __init__(self,base,key,allow_http=False):
  parsed=urllib.parse.urlsplit(base)
  if parsed.scheme not in (('https','http') if allow_http else ('https',)) or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path not in ('','/'):
   raise ValueError('HALLS_API_BASE 必须是固定 HTTPS 源站地址。')
  if not key or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-' for c in key):raise ValueError('请设置 HALLS_KOH_KEY。')
  self.base=base.rstrip('/')+'/api/koh/'+key;self.opener=urllib.request.build_opener(NoRedirect)

 def request(self,method,path,deadline,body=None,headers=None):
  if time.monotonic()>=deadline:raise Unavailable('评分等待超时，请重试本次评测。')
  req=urllib.request.Request(self.base+path,data=body,method=method,headers={'User-Agent':'HALLS-KOH/1.0',**(headers or {})})
  try:
   with self.opener.open(req,timeout=min(60 if body and len(body)>524288 else 12,max(.1,deadline-time.monotonic()))) as response:
    if 'application/json' not in response.headers.get('Content-Type',''):raise Unavailable('评分服务返回了无效响应。')
    raw=response.read(65537)
  except urllib.error.HTTPError as error:
   if error.code==429:raise Unavailable('评分服务繁忙，请重试本次评测。') from None
   raise Unavailable('评分服务暂时不可用，请重试本次评测。') from None
  except (OSError,urllib.error.URLError):raise Unavailable('暂时无法连接评分服务，请重试本次评测。') from None
  if len(raw)>65536:raise Unavailable('评分响应超过限制。')
  try:value=json.loads(raw)
  except (ValueError,RecursionError):raise Unavailable('评分服务返回了无效响应。') from None
  if not isinstance(value,dict):raise Unavailable('评分响应格式无效。')
  return value

 def evaluate(self,payload,sha,context,instance,name,deadline,source_id='',source_kind='unspecified'):
  lookup=self.request('POST','/lookup',deadline,json.dumps({'sha256':sha,'bytes':len(payload),'context':context,'instance':instance,'source_id':source_id,'source_kind':source_kind},ensure_ascii=False).encode(),{'Content-Type':'application/json'})
  suffix=f'/{context["problem_id"]}/{context["submission_id"]}'
  if lookup.get('uploadRequired'):
   lookup=self.request('POST','/proofs'+suffix+'?'+urllib.parse.urlencode({'name':name}),deadline,payload,{'Content-Type':'application/octet-stream','X-KOH-Instance':instance})
  while lookup.get('status')!='done':
   if lookup.get('status')=='error':raise Unavailable('评判未完成，请重试本次评测。')
   if lookup.get('status') not in ('queued','processing','receiving'):raise Unavailable('评分任务状态无效。')
   remaining=deadline-time.monotonic()
   if remaining<=0:raise Unavailable('评分等待超时，请重试本次评测。')
   time.sleep(min(2,remaining))
   lookup=self.request('GET','/results'+suffix,deadline)
  return score_value(lookup.get('result',{}))

 def receipt(self,context,instance,deadline):
  value=self.request('POST',f'/receipts/{context["problem_id"]}/{context["submission_id"]}',deadline,headers={'X-KOH-Instance':instance})
  try:
   if set(value)!={'receipt','filename'} or not isinstance(value['filename'],str) or re.fullmatch(r'HALLS-[a-f0-9]{8,64}\.hreceipt',value['filename']) is None:raise ValueError()
   receipt_bytes(value['receipt'])
  except ValueError:raise Unavailable('提交回执格式无效，请重试。') from None
  return value

 def claim(self,receipt,context,instance,deadline,source_id='',source_kind='unspecified'):
  receipt_value(receipt)
  body=json.dumps({'receipt':receipt,'context':context,'instance':instance,'source_id':source_id,'source_kind':source_kind},ensure_ascii=False,separators=(',',':')).encode()
  if len(body)>2048:raise Unavailable('提交回执请求超过限制。')
  return score_value(self.request('POST','/receipts/claim',deadline,body,{'Content-Type':'application/json'}))
