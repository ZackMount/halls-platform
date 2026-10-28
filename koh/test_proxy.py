import hashlib,io,json,struct,sys,time,unittest
from unittest.mock import patch
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from app import create_app
from remote import Remote,Unavailable

def envelope(payload=b'proof'):
 payload=payload+bytes(max(0,32-len(payload)))
 return b'HLPF\x01\r\n\x1a'+bytes(8)+bytes(12)+struct.pack('<II',256,len(payload))+bytes(256)+bytes(16)+payload

class FakeRemote:
 def __init__(self):self.calls=0
 def evaluate(self,*args,**kwargs):self.calls+=1;return {'code':200,'score':65,'max_score':100,'feedback':'result'}
def machine_app(remote,**kwargs):
 with patch.dict('os.environ',{'HALLS_WEB_UPLOADS':'0'}):return create_app(remote,**kwargs)
class ProxyTests(unittest.TestCase):
 def setUp(self):self.remote=FakeRemote();self.now=100.;self.app=machine_app(self.remote,clock=lambda:self.now);self.client=self.app.test_client()
 def upload(self,data=None,context=None):
  data=envelope() if data is None else data
  return self.client.post('/upload',data={'file':(io.BytesIO(data),'demo.hproof'),'context':json.dumps(context or {'submission_id':1,'problem_id':2})})
 def test_protocol_and_cached_repeated_checks(self):
  self.assertEqual(self.upload().json,{'code':200});self.assertEqual(self.client.post('/check').json['score'],65);self.client.post('/check');self.assertEqual(self.remote.calls,1)
 def test_explicit_name_is_forwarded_and_protocol_without_name_keeps_filename(self):
  r=self.client.post('/upload',data={'file':(io.BytesIO(envelope()),'ignored.hproof'),'context':'{"submission_id":1,"problem_id":2}','name':'  ZackMount  '});self.assertEqual(r.status_code,200)
  with patch.object(self.remote,'evaluate',wraps=self.remote.evaluate) as send:
   self.client.post('/check');self.assertEqual(send.call_args.args[4],'ZackMount')
  other=machine_app(self.remote).test_client();other.post('/upload',data={'file':(io.BytesIO(envelope(b'other')),'Player.hproof'),'context':'{"submission_id":2,"problem_id":2}'})
  with patch.object(self.remote,'evaluate',wraps=self.remote.evaluate) as send:
   other.post('/check');self.assertEqual(send.call_args.args[4],'Player')
 def test_invalid_names_and_repeated_name_fields_are_rejected(self):
  from werkzeug.datastructures import MultiDict
  for name in ('','x'*33,'bad\x00name'):
   self.assertEqual(self.client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':'{"submission_id":1,"problem_id":2}','name':name}).status_code,400)
  self.now+=61
  self.assertEqual(self.client.post('/upload',data=MultiDict([('file',(io.BytesIO(envelope()),'x.hproof')),('context','{"submission_id":1,"problem_id":2}'),('name','A'),('name','B')])).status_code,400)
 def test_ui_has_display_name_but_no_local_preview_badge(self):
  page=self.client.get('/').data.decode();self.assertIn('id="player-name"',page);self.assertNotIn('本机预览',page)
 def test_home_enables_real_browser_uploads_by_default(self):
  client=create_app(self.remote).test_client();page=client.get('/').data.decode()
  for text in ('<h1>HALLS</h1>','游戏介绍','游戏下载','https://halls.z4ck.dev/about','https://halls.z4ck.dev/download'):self.assertIn(text,page)
  self.assertLess(page.index('>HALLS 官网 · 游戏介绍</span>'),page.index('>HALLS 官网 · 游戏下载</span>'));self.assertNotIn('先看看后室',page);self.assertNotIn('程序旁会生成',page)
  self.assertIn('id="submission" hidden',page)
  config=client.get('/web-config').json
  self.assertTrue(config['uploadsEnabled']);self.assertEqual(config['context']['problem_id'],1);self.assertGreater(config['context']['submission_id'],0);self.assertLess(config['context']['submission_id'],2**53);self.assertEqual(config['nssMaxScore'],1000);self.assertEqual(config['problemUrl'],'https://www.nssctf.cn/team/problem')
  self.assertNotIn('HALLS_KOH_KEY',page);self.assertNotIn('API',page);self.assertNotIn('context',page)
 def test_demo_upload_is_retained_and_public_problem_link_can_be_configured(self):
  url='https://www.nssctf.cn/team/problem/12345'
  with patch.dict('os.environ',{'HALLS_LOCAL_DEMO':'1','HALLS_PROBLEM_URL':url}):client=create_app(self.remote).test_client()
  config=client.get('/web-config').json
  self.assertTrue(config['uploadsEnabled']);self.assertEqual(config['problemUrl'],url);self.assertGreater(config['context']['submission_id'],0);self.assertLess(config['context']['submission_id'],2**53)
 def test_configured_contest_link_preserves_custom_path_query_and_fragment(self):
  # Arbitrary fixture paths: the proxy must not infer NSS contest route syntax.
  for host in ('www.nssctf.cn','nssctf.cn'):
   url='https://'+host+'/custom-event/entry?pid=42&from=koh#assessment'
   with self.subTest(url=url),patch.dict('os.environ',{'HALLS_PROBLEM_URL':url,'HALLS_PROBLEM_ID':'98765'}):
    config=create_app(self.remote).test_client().get('/web-config').json
    self.assertEqual(config['problemUrl'],url);self.assertEqual(config['context']['problem_id'],1)
 def test_problem_link_rejects_credentials_insecure_urls_and_lookalike_hosts(self):
  for url in ('http://www.nssctf.cn/team/problem','javascript:alert(1)','https://www.nssctf.cn.evil.test/','https://user:secret@www.nssctf.cn/','https://www.nssctf.cn:8443/team/problem','https://evil.test/?www.nssctf.cn','https://www.nssctf.cn/\nno'):
   with self.subTest(url=url),patch.dict('os.environ',{'HALLS_PROBLEM_URL':url}):
    with self.assertRaises(ValueError):create_app(self.remote)
 def test_browser_context_is_internal_and_legacy_problem_setting_is_ignored(self):
  with patch.dict('os.environ',{'HALLS_PROBLEM_ID':'unused-legacy-value','HALLS_NSS_MAX_SCORE':'1000'}):client=create_app(self.remote).test_client()
  config=client.get('/web-config').json;self.assertEqual(config['context']['problem_id'],1);self.assertEqual(config['context'],client.get('/web-config').json['context'])
  self.assertFalse(config['hasSubmission'])
  client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':json.dumps(config['context'])})
  self.assertTrue(client.get('/web-config').json['hasSubmission'])
  self.assertEqual(client.post('/check').json,{'code':200,'score':65,'max_score':100,'feedback':'result'})
  self.assertEqual(client.post('/check').json['score'],65);self.assertEqual(self.remote.calls,1)
 def test_hiding_browser_upload_does_not_disable_the_nss_machine_protocol(self):
  with patch.dict('os.environ',{'HALLS_WEB_UPLOADS':'0'}):client=create_app(self.remote).test_client()
  config=client.get('/web-config').json;self.assertFalse(config['uploadsEnabled']);self.assertIsNone(config['context'])
  r=client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':'{"submission_id":7,"problem_id":42}'})
  self.assertEqual(r.status_code,200);self.assertEqual(client.post('/check').json['score'],65)
 def test_browser_context_cannot_be_changed_even_without_an_origin_header(self):
  client=create_app(self.remote).test_client();context=client.get('/web-config').json['context']
  def send(value,headers=None):return client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':json.dumps(value)},headers=headers)
  self.assertEqual(send({**context,'submission_id':context['submission_id']+1}).status_code,403)
  self.assertEqual(send({**context,'problem_id':context['problem_id']+1}).status_code,403)
  self.assertFalse(client.get('/web-config').json['hasSubmission']);self.assertEqual(self.remote.calls,0)
  self.assertEqual(send(context).status_code,200);self.assertEqual(client.get('/web-config').json['context'],context)
  self.assertEqual(client.post('/check').json['score'],65)
 def test_browser_context_cannot_inject_a_source_identifier(self):
  client=create_app(self.remote).test_client();context=client.get('/web-config').json['context']
  r=client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':json.dumps({**context,'source_id':'forged-target'})})
  self.assertEqual(r.status_code,403);self.assertFalse(client.get('/web-config').json['hasSubmission'])
 def test_origin_is_checked_for_upload_and_check_without_trusting_forwarded_host(self):
  for origin in ('null','https://localhost','http://localhost:8000','http://localhost.evil.test','http://user@localhost','http://localhost/path','http://localhost:bad','http://localhost:0'):
   with self.subTest(origin=origin):
    client=machine_app(self.remote).test_client();r=client.post('/upload',data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':'{"problem_id":2,"submission_id":1}'},headers={'Origin':origin,'X-Forwarded-Host':'localhost'})
    self.assertEqual(r.status_code,403);self.assertFalse(client.get('/web-config').json['hasSubmission']);self.assertEqual(self.remote.calls,0)
  self.assertEqual(self.upload().status_code,200)
  self.assertEqual(self.client.post('/check',headers={'Origin':'http://evil.test','X-Forwarded-Host':'evil.test'}).status_code,403);self.assertEqual(self.remote.calls,0)
  self.assertEqual(self.client.post('/check',headers={'Origin':'HTTP://LOCALHOST:80'}).json['score'],65)
 def test_same_origin_default_ports_and_https_hosts_are_normalized(self):
  for base,origin in (('http://localhost/','http://LOCALHOST:80'),('https://example.test/','https://EXAMPLE.test:443'),('http://localhost:8785/','http://localhost:8785')):
   with self.subTest(base=base):
    client=create_app(self.remote).test_client();context=client.get('/web-config',base_url=base).json['context']
    r=client.post('/upload',base_url=base,data={'file':(io.BytesIO(envelope()),'x.hproof'),'context':json.dumps(context)},headers={'Origin':origin})
    self.assertEqual(r.status_code,200);self.assertEqual(client.post('/check',base_url=base,headers={'Origin':origin}).json['score'],65)
 def test_upload_and_maximum_score_configuration_are_bounded(self):
  for name,value in [('HALLS_WEB_UPLOADS','yes'),('HALLS_NSS_MAX_SCORE','0'),('HALLS_NSS_MAX_SCORE','nan'),('HALLS_NSS_MAX_SCORE','inf')]:
   with self.subTest(name=name,value=value),patch.dict('os.environ',{name:value}):
    with self.assertRaises(ValueError):create_app(self.remote)
 def test_bad_file_does_not_bind_payload_and_can_be_corrected(self):
  r=self.client.post('/upload',data={'file':(io.BytesIO(envelope()),'wrong.txt'),'context':'{"problem_id":2,"submission_id":1}'})
  self.assertEqual(r.status_code,400);self.assertFalse(self.client.get('/web-config').json['hasSubmission']);self.assertEqual(self.remote.calls,0)
  self.assertEqual(self.upload().status_code,200);self.assertEqual(self.client.post('/check').json['score'],65)
 def test_header_gate_rejects_garbage_truncation_and_forged_lengths_without_remote_calls(self):
  good=envelope();bad=[]
  for at,value in ((28,64),(28,256*1024*1024+1),(32,0),(32,99999)):
   value_bytes=bytearray(good);struct.pack_into('<I',value_bytes,at,value);bad.append(bytes(value_bytes))
  bad.extend([b'not a proof',good[:308],b'BADMAGIC'+good[8:],good[:-1],good+b'x'])
  for payload in bad:
   with self.subTest(size=len(payload)):
    remote=FakeRemote();client=machine_app(remote).test_client();r=client.post('/upload',data={'file':(io.BytesIO(payload),'x.hproof'),'context':'{"problem_id":2,"submission_id":1}'})
    self.assertEqual(r.status_code,400);self.assertEqual(remote.calls,0);self.assertFalse(client.get('/web-config').json['hasSubmission']);self.assertEqual(client.post('/check').status_code,409)
 def test_invalid_upload_attempts_are_rate_limited_but_cooldown_recovers(self):
  for _ in range(3):self.assertEqual(self.client.post('/upload',data=b'bad',content_type='application/octet-stream').status_code,400)
  r=self.upload();self.assertEqual(r.status_code,429);self.assertEqual(r.headers['Retry-After'],'60');self.assertFalse(self.client.get('/web-config').json['hasSubmission'])
  self.now+=60;self.assertEqual(self.upload().status_code,200);self.assertEqual(self.client.post('/check').json['score'],65)
 def test_burst_limit_preserves_cached_check_and_idempotent_upload(self):
  for _ in range(3):self.assertEqual(self.upload().status_code,200)
  self.assertEqual(self.upload().status_code,429)
  for _ in range(5):self.assertEqual(self.client.post('/check').json['score'],65)
  self.assertEqual(self.remote.calls,1);self.assertEqual(self.client.get('/health').status_code,200)
 def test_filename_is_case_insensitive_but_rejects_control_characters(self):
  r=self.client.post('/upload',data={'file':(io.BytesIO(envelope()),'Player.HPROOF'),'context':'{"problem_id":2,"submission_id":1}'})
  self.assertEqual(r.status_code,200)
  other=machine_app(self.remote).test_client();r=other.post('/upload',data={'file':(io.BytesIO(envelope()),'bad\x00name.hproof'),'context':'{"problem_id":2,"submission_id":2}'})
  self.assertEqual(r.status_code,400)
 def test_same_upload_is_idempotent_different_one_is_rate_limited(self):
  self.upload();self.assertEqual(self.upload().status_code,200);r=self.upload(envelope(b'other'));self.assertEqual(r.status_code,429);self.assertEqual(r.headers['Retry-After'],'61');self.now+=61;self.assertEqual(self.upload(envelope(b'other')).status_code,409)
 def test_instances_are_generated_per_container(self):
  other=FakeRemote();second=machine_app(other);client=second.test_client()
  with patch.object(self.remote,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'x'}) as a,patch.object(other,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'x'}) as b:
   self.upload();self.client.post('/check');client.post('/upload',data={'file':(io.BytesIO(envelope()),'a.hproof'),'context':'{"submission_id":1,"problem_id":2}'});client.post('/check');self.assertNotEqual(a.call_args.args[3],b.call_args.args[3])
 def test_invalid_context_and_check_body_are_rejected(self):
  self.assertEqual(self.upload(context={'submission_id':True,'problem_id':2}).status_code,400);self.assertEqual(self.client.post('/check').status_code,409);self.upload();self.assertEqual(self.client.post('/check',data=b'{}').status_code,400)
 def test_upstream_failure_is_not_zero_and_can_retry(self):
  self.upload()
  with patch.object(self.remote,'evaluate',side_effect=Unavailable('unavailable')):self.assertEqual(self.client.post('/check').status_code,503)
  self.assertEqual(self.client.post('/check').json['score'],65)
 def test_hash_hit_never_transfers_proof_bytes(self):
  remote=Remote('https://example.test','private_key');result={'status':'done','result':{'code':200,'score':66,'max_score':100,'feedback':'ok'}}
  with patch.object(remote,'request',return_value=result) as send:
   self.assertEqual(remote.evaluate(b'large proof','a'*64,{'problem_id':2,'submission_id':1},'b'*32,'name',time.monotonic()+5)['score'],66);self.assertEqual(send.call_count,1);self.assertEqual(send.call_args.args[1],'/lookup');self.assertNotIn(b'large proof',send.call_args.args[3])
 def test_hash_miss_transfers_once_and_returns_validated_result(self):
  remote=Remote('https://example.test','private_key');done={'status':'done','result':{'code':200,'score':0,'max_score':100,'feedback':'invalid'}}
  with patch.object(remote,'request',side_effect=[{'uploadRequired':True},done]) as send:
   remote.evaluate(b'payload','a'*64,{'problem_id':2,'submission_id':1},'b'*32,'name',time.monotonic()+5);self.assertEqual(send.call_count,2);self.assertEqual(send.call_args.args[3],b'payload')
 def test_response_cannot_inject_fake_out_of_range_scores(self):
  remote=Remote('https://example.test','private_key')
  for score in (float('nan'),101,-1,True):
   with patch.object(remote,'request',return_value={'status':'done','result':{'code':200,'score':score,'max_score':100,'feedback':'x'}}):
    with self.assertRaises(Unavailable):remote.evaluate(b'p','a'*64,{'problem_id':2,'submission_id':1},'b'*32,'n',time.monotonic()+5)
 def test_source_host_and_optional_platform_identifier_are_private(self):
  context={'problem_id':2,'submission_id':1,'source_id':'node5.anna.nssctf.cn:24933'}
  self.upload(context=context)
  with patch.object(self.remote,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'ok'}) as send:
   r=self.client.post('/check');self.assertNotIn('node5.anna',r.data.decode());self.assertEqual(send.call_args.kwargs['source_id'],context['source_id']);self.assertEqual(send.call_args.kwargs['source_kind'],'context')
 def test_configured_identifier_overrides_untrusted_headers(self):
  with patch.dict('os.environ',{'HALLS_SOURCE_ID':'official-target'}):client=machine_app(self.remote).test_client()
  client.post('/upload',data={'file':(io.BytesIO(envelope()),'test.hproof'),'context':'{"problem_id":2,"submission_id":1}'},headers={'Host':'fake.example:1234'})
  with patch.object(self.remote,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'ok'}) as send:
   client.post('/check');self.assertEqual(send.call_args.kwargs['source_id'],'official-target');self.assertEqual(send.call_args.kwargs['source_kind'],'configured')
 def test_page_host_is_preserved_when_worker_uses_internal_host(self):
  r=self.client.get('/',headers={'Host':'node5.anna.nssctf.cn:24933'});self.assertEqual(r.status_code,200);self.assertNotIn('node5.anna',r.data.decode())
  self.upload()
  with patch.object(self.remote,'evaluate',return_value={'code':200,'score':0,'max_score':100,'feedback':'ok'}) as send:
   self.client.post('/check');self.assertEqual(send.call_args.kwargs['source_id'],'node5.anna.nssctf.cn:24933');self.assertEqual(send.call_args.kwargs['source_kind'],'page_host')
 def test_fifteen_mib_boundary_and_larger_file_are_checked_by_backend(self):
  from app import MAX_BYTES
  self.assertEqual(MAX_BYTES,15*1024*1024);self.assertEqual(self.upload(envelope(b'x'*(MAX_BYTES-308))).status_code,200)
  other=machine_app(self.remote).test_client();r=other.post('/upload',data={'file':(io.BytesIO(b'x'*(MAX_BYTES+1)),'x.hproof'),'context':'{"problem_id":2,"submission_id":1}'});self.assertEqual(r.status_code,413)
 def test_unicode_source_is_sent_without_exceeding_preflight_json_limit(self):
  remote=Remote('https://example.test','private_key')
  with patch.object(remote,'request',return_value={'status':'done','result':{'code':200,'score':0,'max_score':100,'feedback':'ok'}}) as send:
   remote.evaluate(b'p','a'*64,{'problem_id':2,'submission_id':1},'b'*32,'n',time.monotonic()+5,source_id='测'*256);self.assertLess(len(send.call_args.args[3]),2048)

if __name__=='__main__':unittest.main()
