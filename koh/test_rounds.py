import base64,hashlib,io,json,threading,unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
import app as proxy
from remote import Unavailable
from test_proxy import envelope

class RoundRemote:
 def __init__(self):self.evaluations=[];self.receipts=[];self.claims=[]
 def evaluate(self,payload,sha,context,instance,name,deadline,**source):
  self.evaluations.append((payload,sha,dict(context),instance,name,source))
  return {'code':200,'score':len(self.evaluations)*7,'max_score':100,'feedback':'round '+str(context['submission_id'])}
 def receipt(self,context,instance,deadline):
  self.receipts.append(dict(context));raw=hashlib.sha256(str(context['submission_id']).encode()).digest()
  return {'receipt':{'version':1,'token':'hkr1_'+base64.urlsafe_b64encode(raw).decode().rstrip('=')},'filename':'HALLS-'+'a'*24+'.hreceipt'}
 def claim(self,*args,**kwargs):self.claims.append(args);raise AssertionError('web rounds never claim receipts')

class BrowserRoundsTests(unittest.TestCase):
 def setUp(self):
  self.now=100.;self.remote=RoundRemote()
  self.app=self.make_app();self.client=self.app.test_client();self.context=self.config()['context']
 def make_app(self,**env):
  with patch.dict('os.environ',{'HALLS_SUBMISSION_MODE':'proof','HALLS_WEB_UPLOADS':'1',**env}):return proxy.create_app(self.remote,clock=lambda:self.now)
 def config(self,client=None):return (client or self.client).get('/web-config').json
 def upload(self,payload=None,context=None,filename='run.hproof',client=None):
  return (client or self.client).post('/upload',data={'file':(io.BytesIO(envelope() if payload is None else payload),filename),'context':json.dumps(context or self.context),'name':'player'})
 def advance(self,context=None,client=None,**kw):return (client or self.client).post('/new-submission',json={'context':context or self.context},**kw)
 def headers(self,context=None):return {'X-HALLS-Submission-ID':str((context or self.context)['submission_id'])}
 def complete(self,with_receipt=True):
  self.assertEqual(self.upload().status_code,200)
  result=self.client.post('/check',headers=self.headers());self.assertEqual(result.status_code,200)
  code=self.client.post('/receipt',headers=self.headers()).text if with_receipt else None
  return result.json,code
 def test_two_rounds_get_distinct_ids_results_and_receipts_and_keep_small_history(self):
  first_result,first_code=self.complete();first_context=dict(self.context)
  cfg=self.config();self.assertEqual(cfg['result'],first_result);self.assertEqual(cfg['submissionName'],'player');self.assertEqual(cfg['cooldownSeconds'],60)
  next_round=self.advance();self.assertEqual(next_round.status_code,200);cfg=next_round.json
  self.assertFalse(cfg['hasSubmission']);self.assertIsNone(cfg['result']);self.assertIsNone(cfg['submissionName']);self.assertFalse(cfg['busy'])
  self.assertNotEqual(cfg['context'],first_context);self.assertEqual(cfg['cooldownSeconds'],60)
  self.assertEqual(cfg['history'],[{'context':first_context,'name':'player','result':first_result,'submissionCode':first_code}])
  self.context=cfg['context'];self.now+=60
  second_result,second_code=self.complete();self.assertNotEqual(first_code,second_code);self.assertNotEqual(first_result,second_result)
  self.assertEqual(self.config()['history'][0]['submissionCode'],first_code)
  self.assertEqual(self.config()['result'],second_result);self.assertEqual(len(self.remote.evaluations),2)
  self.assertEqual(self.remote.evaluations[0][0],self.remote.evaluations[1][0],'same proof in a new round still reaches authoritative duplicate lookup')
  self.assertNotEqual(self.remote.evaluations[0][2],self.remote.evaluations[1][2]);self.assertEqual(self.remote.evaluations[0][3],self.remote.evaluations[1][3])
  self.assertTrue(all(value[1]==hashlib.sha256(value[0]).hexdigest() for value in self.remote.evaluations))
  self.assertEqual(self.remote.claims,[])
 def test_new_round_cannot_reset_cooldown_or_upload_attempt_budget(self):
  self.complete();self.context=self.advance().json['context']
  for _ in range(2):
   rejected=self.upload(envelope(b'new'));self.assertEqual(rejected.status_code,429);self.assertEqual(rejected.headers['Retry-After'],'60')
  self.assertEqual(self.upload(envelope(b'new')).status_code,429)
  cfg=self.config();self.assertFalse(cfg['hasSubmission']);self.assertEqual(len(cfg['history']),1)
  # Resetting an empty round cannot manufacture a new context or reset limits.
  for _ in range(4):self.assertEqual(self.advance().json['context'],self.context)
  self.assertEqual(self.upload().status_code,429);self.assertEqual(len(self.remote.evaluations),1)
  self.now+=60;self.assertEqual(self.upload(envelope(b'new')).status_code,200);self.assertEqual(self.client.post('/check').json['score'],14)
 def test_reset_retry_is_idempotent_but_stale_tabs_cannot_replace_a_new_upload(self):
  old=dict(self.context);self.complete();new=self.advance().json
  self.assertEqual(self.advance(old).json,new);self.assertEqual(len(new['history']),1)
  self.context=new['context'];self.now+=60;self.assertEqual(self.upload(envelope(b'next')).status_code,200)
  self.assertEqual(self.advance(old).status_code,409)
  self.assertEqual(self.upload(envelope(b'old'),old).status_code,403)
  self.assertEqual(self.client.post('/check',headers=self.headers(old)).status_code,409)
  self.assertEqual(self.client.post('/receipt',headers=self.headers(old)).status_code,409)
  self.assertIsNone(self.config()['result']);self.assertEqual(self.client.post('/check',headers=self.headers()).json['score'],14)
 def test_failed_new_upload_and_failed_judge_preserve_previous_completed_result(self):
  result,code=self.complete();self.context=self.advance().json['context'];self.now+=60
  self.assertEqual(self.upload(b'not a proof').status_code,400);self.assertFalse(self.config()['hasSubmission'])
  self.assertEqual(self.config()['history'][0]['result'],result);self.assertEqual(self.config()['history'][0]['submissionCode'],code)
  self.assertEqual(self.upload(envelope(b'next')).status_code,200)
  with patch.object(self.remote,'evaluate',side_effect=Unavailable('offline')):self.assertEqual(self.client.post('/check').status_code,503)
  self.assertFalse(self.config()['busy']);self.assertIsNone(self.config()['result']);next_round=self.advance().json
  self.assertFalse(next_round['hasSubmission']);self.assertEqual(len(next_round['history']),1);self.assertEqual(next_round['history'][0]['result'],result)
 def test_completed_zero_scores_and_missing_receipts_are_kept_without_payloads(self):
  for n in range(12):
   self.assertEqual(self.upload(envelope(str(n).encode())).status_code,200)
   with patch.object(self.remote,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'duplicate'}):self.client.post('/check')
   cfg=self.advance().json;self.context=cfg['context'];self.now+=60
  self.assertEqual(len(cfg['history']),proxy.MAX_HISTORY)
  self.assertTrue(all(item['result']['score']==0 and item['submissionCode'] is None for item in cfg['history']))
  for item in cfg['history']:self.assertEqual(set(item),{'context','name','result','submissionCode'})
  self.assertLess(len(json.dumps(cfg)),10000)
 def test_new_submission_is_browser_only_same_origin_and_strictly_bounded(self):
  self.complete()
  self.assertEqual(self.advance(headers={'Origin':'https://evil.test'}).status_code,403)
  self.assertTrue(self.config()['hasSubmission']);self.assertEqual(self.advance(headers={'Origin':'http://localhost'}).status_code,200)
  for settings in ({'HALLS_WEB_UPLOADS':'0'},{'HALLS_WEB_UPLOADS':'0','HALLS_SUBMISSION_MODE':'receipt'}):
   client=self.make_app(**settings).test_client();self.assertEqual(self.advance(client=client).status_code,404)
   cfg=self.config(client);self.assertIsNone(cfg['context']);self.assertIsNone(cfg['result']);self.assertEqual(cfg['history'],[])
  for data in (None,{},[],{'context':True},{'context':{'problem_id':True,'submission_id':1}},{'context':{'problem_id':1,'submission_id':1,'source_id':'x'}},{'context':self.context,'extra':1}):
   self.assertEqual(self.client.post('/new-submission',json=data).status_code,400)
  duplicate=json.dumps({'context':self.context})[:-1]+',"context":'+json.dumps(self.context)+'}'
  self.assertEqual(self.client.post('/new-submission',data=duplicate,content_type='application/json').status_code,400)
  self.assertEqual(self.client.post('/new-submission',data=' '*513,content_type='application/json').status_code,400)
 def test_machine_receipt_and_proof_modes_keep_single_task_semantics(self):
  for mode,payload,changed,method in (('proof',envelope(),envelope(b'changed'),'evaluate'),('receipt',('hkr1_'+'A'*43).encode(),('hkr1_'+'B'*42+'A').encode(),'claim')):
   with self.subTest(mode=mode):
    client=self.make_app(HALLS_WEB_UPLOADS='0',HALLS_SUBMISSION_MODE=mode).test_client();context={'problem_id':2,'submission_id':3}
    result={'code':200,'score':65,'max_score':100,'feedback':'machine result'}
    with patch.object(self.remote,method,return_value=result)as call:
     self.assertEqual(self.upload(payload,context,client=client).status_code,200)
     self.assertEqual(client.post('/check').json,result);self.assertEqual(client.post('/check').json,result)
     self.assertEqual(self.advance(context,client=client).status_code,404)
     self.assertEqual(self.upload(changed,context,client=client).status_code,429)
     self.now+=60
     self.assertEqual(self.upload(changed,context,client=client).status_code,409)
     self.assertEqual(self.upload(payload,context,client=client).status_code,200)
     self.assertEqual(client.post('/check').json,result);self.assertEqual(call.call_count,1)
     self.assertEqual(call.call_args.args[1] if mode=='receipt' else call.call_args.args[2],context)
    self.now+=60
 def test_timeout_stays_retryable_or_can_start_a_distinct_browser_round(self):
  old=dict(self.context);self.assertEqual(self.upload().status_code,200)
  with patch.object(self.remote,'evaluate',side_effect=Unavailable('评分等待超时，请重试本次评测。')):
   response=self.client.post('/check',headers=self.headers());self.assertEqual(response.status_code,503)
  cfg=self.config();self.assertFalse(cfg['busy']);self.assertTrue(cfg['hasSubmission']);self.assertIsNone(cfg['result'])
  new=self.advance().json;self.context=new['context'];self.assertNotEqual(self.context,old)
  self.assertEqual(self.client.post('/check',headers=self.headers(old)).status_code,409)
  self.now+=60;self.assertEqual(self.upload(envelope(b'next')).status_code,200)
  self.assertEqual(self.client.post('/check',headers=self.headers()).json['score'],7)
  self.assertEqual(self.remote.evaluations[0][2],self.context);self.assertEqual(self.config()['history'],[])
 def test_reset_is_rejected_while_remote_check_or_receipt_is_busy(self):
  self.assertEqual(self.upload().status_code,200)
  for endpoint,method in (('/check','evaluate'),('/receipt','receipt')):
   started=threading.Event();release=threading.Event();original=getattr(self.remote,method)
   def blocked(*args,**kwargs):
    started.set();self.assertTrue(release.wait(3));return original(*args,**kwargs)
   with patch.object(self.remote,method,side_effect=blocked),ThreadPoolExecutor(max_workers=1)as pool:
    future=pool.submit(lambda:self.app.test_client().post(endpoint,headers=self.headers()))
    try:
     self.assertTrue(started.wait(3));self.assertTrue(self.config()['busy']);self.assertEqual(self.advance().status_code,409)
     self.assertEqual(self.config()['context'],self.context)
    finally:release.set()
    self.assertEqual(future.result(3).status_code,200)
  self.assertFalse(self.config()['busy'])
 def test_inflight_old_multipart_cannot_bind_after_another_tab_resets(self):
  self.complete();self.now+=60;old=dict(self.context);inside=threading.Event();release=threading.Event();original=proxy.valid_envelope
  def blocked(payload):inside.set();self.assertTrue(release.wait(3));return original(payload)
  with patch.object(proxy,'valid_envelope',side_effect=blocked),ThreadPoolExecutor(max_workers=1)as pool:
   future=pool.submit(lambda:self.upload(envelope(b'stale'),old,client=self.app.test_client()))
   try:
    self.assertTrue(inside.wait(3));new=self.advance().json;self.assertNotEqual(new['context'],old)
   finally:release.set()
   self.assertEqual(future.result(3).status_code,403)
  self.assertFalse(self.config()['hasSubmission']);self.assertEqual(self.config()['context'],new['context'])
 def test_waiting_check_cannot_evaluate_a_new_round_after_reset(self):
  condition=threading.Condition()
  with patch.object(proxy.threading,'Condition',return_value=condition):self.app=self.make_app()
  self.client=self.app.test_client();self.context=self.config()['context'];self.assertEqual(self.upload().status_code,200)
  entered=threading.Event();finish=threading.Event();waiting=threading.Event();woken=threading.Event();resume=threading.Event();original_wait=condition.wait;original_evaluate=self.remote.evaluate
  def blocked_evaluate(*args,**kwargs):entered.set();self.assertTrue(finish.wait(3));return original_evaluate(*args,**kwargs)
  def delayed_wait(timeout=None):
   waiting.set();result=original_wait(timeout);condition.release()
   try:woken.set();self.assertTrue(resume.wait(3))
   finally:condition.acquire()
   return result
  with patch.object(self.remote,'evaluate',side_effect=blocked_evaluate),patch.object(condition,'wait',side_effect=delayed_wait),ThreadPoolExecutor(max_workers=2)as pool:
   first=pool.submit(lambda:self.app.test_client().post('/check'));self.assertTrue(entered.wait(3))
   second=pool.submit(lambda:self.app.test_client().post('/check'))
   try:
    self.assertTrue(waiting.wait(3));finish.set();self.assertTrue(woken.wait(3));self.assertEqual(self.advance().status_code,200)
   finally:finish.set();resume.set()
   self.assertEqual(first.result(3).status_code,200);self.assertEqual(second.result(3).status_code,409)
  self.assertFalse(self.config()['hasSubmission']);self.assertEqual(len(self.remote.evaluations),1)

if __name__=='__main__':unittest.main()
