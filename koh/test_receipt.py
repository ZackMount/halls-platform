import base64,io,json,sys,time,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parent))
from app import create_app
from remote import Remote,Unavailable,receipt_bytes,receipt_file
from test_proxy import envelope

TOKEN='hkr1_'+'A'*43
RECEIPT={'version':1,'token':TOKEN}
BINARY=b'HRC1'+bytes(32)
RESULT={'code':200,'score':76.89,'max_score':100,'feedback':'成绩与回放：https://halls.z4ck.dev/run/'+'a'*24}
class FakeRemote:
 def __init__(self):self.proofs=[];self.claims=[];self.receipts=[]
 def evaluate(self,*args,**kwargs):self.proofs.append((args,kwargs));return dict(RESULT)
 def claim(self,*args,**kwargs):self.claims.append((args,kwargs));return dict(RESULT)
 def receipt(self,*args,**kwargs):self.receipts.append((args,kwargs));return {'receipt':dict(RECEIPT),'filename':'HALLS-'+'a'*24+'.hreceipt'}
class ReceiptTests(unittest.TestCase):
 def setUp(self):self.remote=FakeRemote();self.now=100.
 def client(self,**env):
  with patch.dict('os.environ',env):return create_app(self.remote,clock=lambda:self.now).test_client()
 def checker(self):return self.client(HALLS_SUBMISSION_MODE='receipt',HALLS_WEB_UPLOADS='0')
 def upload(self,client,payload=None,filename='score.hreceipt',context=None,**kwargs):
  data=TOKEN.encode() if payload is None else payload
  return client.post('/upload',data={'file':(io.BytesIO(data),filename),'context':json.dumps(context or {'problem_id':42,'submission_id':9})},**kwargs)
 def test_receipt_checker_uses_real_nss_context_and_never_evaluates_proof(self):
  client=self.checker();cfg=client.get('/web-config').json
  self.assertFalse(cfg['uploadsEnabled']);self.assertFalse(cfg['receiptDownloadEnabled']);self.assertIsNone(cfg['context']);self.assertEqual(cfg['maxUploadBytes'],2048)
  context={'problem_id':42,'submission_id':123,'source_id':'nss-target'}
  self.assertEqual(self.upload(client,context=context).status_code,200)
  self.assertEqual(client.post('/check').json,RESULT);self.assertEqual(client.post('/check').json,RESULT)
  self.assertEqual(len(self.remote.claims),1);args,kwargs=self.remote.claims[0]
  self.assertEqual(args[:2],(RECEIPT,{'problem_id':42,'submission_id':123}));self.assertEqual(kwargs['source_id'],'nss-target');self.assertEqual(self.remote.proofs,[])
 def test_nss_text_is_wrapped_in_file_without_a_required_extension(self):
  for filename in ('submission.txt','code.py','submission',''):
   with self.subTest(filename=filename):
    client=self.checker();self.assertEqual(self.upload(client,filename=filename).status_code,200);self.assertEqual(client.post('/check').json,RESULT)
  self.assertEqual(len(self.remote.claims),4);self.assertTrue(all(call[0][0]==RECEIPT for call in self.remote.claims));self.assertEqual(self.remote.proofs,[])
  self.assertEqual(self.upload(self.checker(),filename='x'*256).status_code,400)
  proof=self.client();context=proof.get('/web-config').json['context'];self.assertEqual(self.upload(proof,envelope(),'submission.txt',context).status_code,400)
 def test_plain_text_accepts_only_bounded_surrounding_ascii_whitespace(self):
  for payload in (TOKEN.encode(),b' \t\r\n'+TOKEN.encode()+b'\r\n',b' '*32+TOKEN.encode()+b'\t'*32):
   with self.subTest(payload=payload):
    client=self.checker();self.assertEqual(self.upload(client,payload).status_code,200);self.assertEqual(client.post('/check').json,RESULT);self.assertEqual(self.remote.claims[-1][0][0],RECEIPT)
  for payload in (b' '*65+TOKEN.encode(),TOKEN[:12].encode()+b' '+TOKEN[12:].encode(),TOKEN.encode()+b'\x00',b'\xef\xbb\xbf'+TOKEN.encode(),'\u3000'.encode()+TOKEN.encode(),TOKEN[:-1].encode(),TOKEN.encode()+b'A',b'hkr2_'+TOKEN[5:].encode(),b'hkr1_'+b'A'*42+b'B',json.dumps(TOKEN).encode(),b'```'+TOKEN.encode()+b'```'):
   with self.subTest(payload=payload):self.assertEqual(self.upload(self.checker(),payload).status_code,400)
 def test_legacy_binary_receipt_remains_readable(self):
  client=self.checker();self.assertEqual(self.upload(client,BINARY).status_code,200);self.assertEqual(client.post('/check').json,RESULT);self.assertEqual(self.remote.claims[-1][0][0],RECEIPT)
 def test_text_submission_code_preserves_every_token_byte_and_claims_server_score(self):
  raw=bytes(range(224,256));receipt={'version':1,'token':'hkr1_'+base64.urlsafe_b64encode(raw).decode().rstrip('=')}
  encoded=receipt_bytes(receipt);self.assertEqual(encoded,b'HRC1'+raw);self.assertEqual(len(encoded),36);self.assertEqual(receipt_file(encoded),receipt)
  client=self.client();context=client.get('/web-config').json['context'];self.upload(client,envelope(),'game.hproof',context);client.post('/check')
  with patch.object(self.remote,'receipt',return_value={'receipt':receipt,'filename':'HALLS-'+'a'*24+'.hreceipt'}):download=client.post('/receipt')
  self.assertEqual(download.data,receipt['token'].encode());self.assertEqual(download.mimetype,'text/plain');self.assertEqual(download.content_length,48)
  self.assertNotIn('Content-Disposition',download.headers);self.assertEqual(download.headers['Cache-Control'],'no-store');self.assertEqual(download.headers['X-Content-Type-Options'],'nosniff')
  checker=self.checker();self.assertEqual(self.upload(checker,download.data).status_code,200)
  # The file carries no score: /check obtains whatever the server actually returns.
  zero={**RESULT,'score':0,'feedback':'回执校验未通过，本次得分为 0。'}
  with patch.object(self.remote,'claim',return_value=zero) as claim:
   self.assertEqual(checker.post('/check').json,zero);self.assertEqual(claim.call_args.args[0],receipt)
 def test_binary_format_rejects_bad_magic_version_truncation_and_extra_bytes(self):
  bad=[b'',BINARY[:3],BINARY[:4],BINARY[:-1],BINARY+b'\0',BINARY+b' ',b'HRC2'+BINARY[4:],b'XRC1'+BINARY[4:],b'hrc1'+BINARY[4:],b'\xef\xbb\xbf'+BINARY]
  for payload in bad:
   with self.subTest(payload=payload):
    client=self.checker();self.assertEqual(self.upload(client,payload).status_code,400);self.assertFalse(client.get('/web-config').json['hasSubmission'])
  self.assertEqual(self.remote.claims,[])
 def test_binary_mutated_token_still_requires_server_verification(self):
  client=self.checker();payload=BINARY[:-1]+b'\xff';self.assertEqual(self.upload(client,payload).status_code,200)
  zero={**RESULT,'score':0,'feedback':'回执校验未通过，本次得分为 0。'}
  with patch.object(self.remote,'claim',return_value=zero) as claim:
   self.assertEqual(client.post('/check').json,zero);self.assertEqual(receipt_bytes(claim.call_args.args[0]),payload)
 def test_legacy_json_keeps_strict_format_and_never_changes_its_token(self):
  legacy=b' \n'+json.dumps(RECEIPT).encode()+b'\t'
  self.assertEqual(receipt_file(legacy),RECEIPT);client=self.checker();self.assertEqual(self.upload(client,legacy).status_code,200);self.assertEqual(client.post('/check').json,RESULT)
  self.assertEqual(self.remote.claims[0][0][0],RECEIPT)
  for payload in (json.dumps(RECEIPT).encode()+b'{}',json.dumps(RECEIPT).encode()+b'\0'):
   with self.subTest(payload=payload):self.assertEqual(self.upload(self.checker(),payload).status_code,400)
 def test_binary_encoding_rejects_noncanonical_base64_without_truncating_token(self):
  with self.assertRaises(ValueError):receipt_bytes({'version':1,'token':'hkr1_'+'A'*42+'B'})
 def test_receipt_checker_rejects_large_proof_and_does_not_decode_or_execute(self):
  client=self.checker();self.assertEqual(self.upload(client,envelope(),'large.hproof').status_code,400)
  self.assertEqual(self.upload(client,b'x'*2049).status_code,413)
  self.assertEqual(self.upload(client,b'not-json').status_code,400)
  self.assertEqual(self.remote.claims,[]);self.assertFalse(client.get('/web-config').json['hasSubmission'])
 def test_receipt_requires_exact_versioned_token_without_scores_urls_or_duplicate_keys(self):
  bad=[b'{"version":1,"version":1,"token":"'+TOKEN.encode()+b'"}',json.dumps({'version':1,'token':TOKEN,'score':100}).encode(),json.dumps({'version':1,'token':TOKEN,'url':'http://internal'}).encode(),json.dumps({'version':True,'token':TOKEN}).encode(),json.dumps({'version':1.0,'token':TOKEN}).encode(),json.dumps({'version':2,'token':TOKEN}).encode(),json.dumps({'version':1,'token':'https://evil.test'}).encode(),b'[]',b'null',b'{"version":NaN,"token":"x"}']
  for payload in bad:
   with self.subTest(payload=payload):self.assertEqual(self.upload(self.checker(),payload).status_code,400)
  self.assertEqual(self.remote.claims,[])
 def test_receipt_two_kib_boundary_and_rejected_attempt_budget(self):
  core=json.dumps(RECEIPT).encode();client=self.checker()
  self.assertEqual(self.upload(client,core+b' '*(2048-len(core))).status_code,200)
  self.assertEqual(client.post('/check').json['score'],76.89)
  other=self.checker()
  for _ in range(3):self.assertEqual(self.upload(other,b'bad').status_code,400)
  self.assertEqual(self.upload(other).status_code,429);self.now+=60;self.assertEqual(self.upload(other).status_code,200)
 def test_claim_upstream_failure_stays_retryable_and_zero_is_real_zero(self):
  client=self.checker();self.upload(client)
  with patch.object(self.remote,'claim',side_effect=Unavailable('offline')):self.assertEqual(client.post('/check').status_code,503)
  with patch.object(self.remote,'claim',return_value={**RESULT,'score':0,'feedback':'回执已被领取，本次得分为 0。'}):self.assertEqual(client.post('/check').json['score'],0)
 def test_download_receipt_only_after_real_check_and_is_cached(self):
  client=self.client();context=client.get('/web-config').json['context'];self.assertTrue(client.get('/web-config').json['receiptDownloadEnabled'])
  self.assertEqual(client.post('/receipt').status_code,409)
  self.upload(client,envelope(),'game.hproof',context);self.assertEqual(client.post('/receipt').status_code,409)
  client.post('/check')
  self.assertEqual(client.post('/receipt').data,TOKEN.encode());self.assertEqual(client.post('/receipt').data,TOKEN.encode());self.assertEqual(len(self.remote.receipts),1)
  self.assertEqual(self.remote.receipts[0][0][0],context);self.assertEqual(client.post('/receipt',data=b'{}').status_code,400)
  self.assertEqual(client.post('/receipt',headers={'Origin':'https://evil.test'}).status_code,403)
  self.assertEqual(self.checker().post('/receipt').status_code,404)
  self.assertEqual(self.client(HALLS_WEB_UPLOADS='0').post('/receipt').status_code,404)
 def test_receipt_download_can_retry_an_upstream_error(self):
  client=self.client();context=client.get('/web-config').json['context'];self.upload(client,envelope(),'game.hproof',context);client.post('/check')
  with patch.object(self.remote,'receipt',side_effect=Unavailable('offline')):self.assertEqual(client.post('/receipt').status_code,503)
  self.assertEqual(client.post('/receipt').data,TOKEN.encode())
 def test_explicit_public_origin_handles_https_proxy_without_trusting_headers(self):
  client=self.client(HALLS_PUBLIC_ORIGIN='https://target.example:8443');context=client.get('/web-config').json['context']
  self.assertEqual(self.upload(client,envelope(),'game.hproof',context,headers={'Origin':'https://target.example:8443','X-Forwarded-Host':'evil.test','X-Forwarded-Proto':'http'}).status_code,200)
  self.assertEqual(client.post('/check',headers={'Origin':'https://target.example:8443'}).json['score'],76.89)
  self.assertEqual(client.post('/receipt',headers={'Origin':'https://target.example:8443'}).status_code,200)
  for origin in ('https://evil.test','https://target.example','http://target.example:8443','https://target.example:8443.evil.test'):
   self.assertEqual(client.post('/check',headers={'Origin':origin,'X-Forwarded-Host':'target.example:8443','X-Forwarded-Proto':'https'}).status_code,403)
 def test_public_origin_and_submission_mode_configuration_are_strict(self):
  for value in ('http://user@target.example','https://target.example/path','https://target.example/','https://target.example?x=1','https://target.example#x','https://target.example:bad','https://target.example:0','https://tar get.example','https://target.example\n',' https://target.example'):
   with self.subTest(value=value),self.assertRaises(ValueError):self.client(HALLS_PUBLIC_ORIGIN=value)
  with self.assertRaises(ValueError):self.client(HALLS_SUBMISSION_MODE='other')
  with self.assertRaises(ValueError):self.client(HALLS_SUBMISSION_MODE='receipt',HALLS_WEB_UPLOADS='1')
 def test_remote_receipt_contract_and_no_untrusted_fetch(self):
  remote=Remote('https://example.test','test_key');value={'receipt':RECEIPT,'filename':'HALLS-'+'a'*24+'.hreceipt'}
  with patch.object(remote,'request',return_value=value) as send:
   self.assertEqual(remote.receipt({'problem_id':42,'submission_id':123},'b'*32,time.monotonic()+5),value)
   self.assertEqual(send.call_args.args[:2],('POST','/receipts/42/123'));self.assertEqual(send.call_args.kwargs['headers'],{'X-KOH-Instance':'b'*32})
  for value in ({'receipt':RECEIPT,'filename':'../../x'},{'receipt':{'version':1,'token':TOKEN,'score':100},'filename':'HALLS-'+'a'*24+'.hreceipt'},{'receipt':RECEIPT,'filename':'http://internal'}):
   with patch.object(remote,'request',return_value=value),self.assertRaises(Unavailable):remote.receipt({'problem_id':42,'submission_id':123},'b'*32,time.monotonic()+5)
 def test_remote_claim_only_posts_receipt_and_context_and_validates_server_score(self):
  remote=Remote('https://example.test','test_key')
  with patch.object(remote,'request',return_value=RESULT) as send:
   self.assertEqual(remote.claim(RECEIPT,{'problem_id':42,'submission_id':123},'b'*32,time.monotonic()+5,source_id='测'*256),RESULT)
   args=send.call_args.args;self.assertEqual(args[:2],('POST','/receipts/claim'));self.assertLessEqual(len(args[3]),2048)
   value=json.loads(args[3]);self.assertEqual(value['receipt'],RECEIPT);self.assertEqual(value['context'],{'problem_id':42,'submission_id':123});self.assertNotIn('score',value)
  for score in (True,float('nan'),float('inf'),-1,101,'100'):
   with patch.object(remote,'request',return_value={**RESULT,'score':score}),self.assertRaises(Unavailable):remote.claim(RECEIPT,{'problem_id':42,'submission_id':123},'b'*32,time.monotonic()+5)
  with self.assertRaises(ValueError):remote.claim({'version':1,'token':'https://internal'}, {},'b'*32,time.monotonic()+5)

if __name__=='__main__':unittest.main()
