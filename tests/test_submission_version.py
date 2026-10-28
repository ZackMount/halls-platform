"""All formal entry channels share the authenticated current-build floor."""
import copy,json,types,unittest
from unittest.mock import patch
import test_platform as fixtures
import test_proof_format as signing
import test_version_0110 as version_fixtures
from codec import decode
from eligibility import require_current_submission
from judge import defaults,VERSION as JUDGE_VERSION
from store import DATA,db,dumps,DEFAULTS
from worker import assess,process

class SubmissionVersionTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 web_headers=fixtures.PlatformTests.web_headers
 upload=fixtures.PlatformTests.upload
 @classmethod
 def setUpClass(cls):
  keys=type('SigningKeys',(),{});signing.FormatTests.setUpClass.__func__(keys);cls.signer=keys();cls.signer.seal=types.MethodType(signing.FormatTests.seal,cls.signer);cls.key_temp=keys.tmp
 @classmethod
 def tearDownClass(cls):cls.key_temp.cleanup()
 def authenticated_decode(self,data,*_):return decode(data,self.signer.key,self.signer.trust)
 def submit(self,channel,data):
  if channel=='web':return self.upload(data=data)
  headers=self.login()
  if channel=='admin':return self.client.post('/api/admin/uploads?name=owner',data=data,content_type='application/octet-stream',headers=headers)
  token=self.client.post('/api/admin/keys',json={'label':'version-floor'},headers=headers).json['key']
  policy=copy.deepcopy(DEFAULTS);policy['apiUploads']=True
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(policy),))
  return self.other.post('/api/submit/'+token+'?name=api',data=data,content_type='application/octet-stream')
 def start(self,response):
  self.assertEqual(response.status_code,202);key=response.json['id']
  with db(True) as c:c.execute("UPDATE runs SET status='processing' WHERE id=?",(key,))
  return key
 def test_signed_old_formal_web_api_and_admin_uploads_never_reach_assessment(self):
  for build in (0xa0002,0xb0000,0xb0001,0xb0002,0xb0003,0x01000000):
   sealed=self.signer.seal(version_fixtures.recording(build,move=.23))
   self.check_old_channels(sealed,build)
 def check_old_channels(self,sealed,build):
  for channel in ('web','api','admin'):
   with self.subTest(build=build,channel=channel):
    self.setUp();response=self.submit(channel,sealed);key=self.start(response)
    with patch('worker.decode',side_effect=self.authenticated_decode),patch('worker.assess') as judge,patch('worker.convert') as convert:
     process(key);judge.assert_not_called();convert.assert_not_called()
    with db() as c:row=c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone()
    self.assertEqual((row['status'],row['board'],row['playable'],row['bytes']),('invalid','hidden',0,0))
    for column in ('identity','raw_sha','seed','score','grade','duration','fingerprint'):self.assertIsNone(row[column],column)
    self.assertFalse((DATA/'proofs'/key).exists());self.assertFalse((DATA/'replays'/key).exists())
    report=json.loads(row['report']);self.assertEqual(report['code'],'client_upgrade_required');self.assertEqual(report['checks']['signature'],'passed');self.assertEqual(report['checks']['format'],'passed');self.assertIn('1.0.1',report['error'])
    result=self.other.get('/api/submissions/'+key,headers={'Authorization':'Bearer '+response.json['receipt']});self.assertEqual(result.status_code,200);self.assertEqual(result.json['report']['code'],'client_upgrade_required');self.assertIn('1.0.1',result.json['report']['error'])
 def test_health_advertises_the_same_formal_floor_as_the_judge(self):
  health=self.client.get('/api/health').json
  self.assertEqual((health['minimumClient'],health['judgeVersion']),('1.0.1',JUDGE_VERSION))
 def test_new_signed_proof_finishes_the_normal_worker_pipeline(self):
  policy=copy.deepcopy(DEFAULTS)
  # This simple synthetic course exercises the formal pipeline and safe rules;
  # exact native source/model consistency is covered by separate fixture tests.
  enabled={'production','completion','clock','time_sources','speed_control','flashlight','route','input','entity_speed'}
  policy['judge']={k:{'enabled':k in enabled} for k in defaults()};policy['judge']['input']['params']={'exact_keys':0}
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(policy),))
  response=self.submit('web',self.signer.seal(version_fixtures.recording()));key=self.start(response)
  with patch('worker.decode',side_effect=self.authenticated_decode):process(key)
  with db() as c:row=c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone()
  self.assertEqual(row['status'],'done');self.assertIsNotNone(row['score']);self.assertIsNotNone(row['identity']);self.assertIsNotNone(row['raw_sha']);self.assertEqual(row['seed'],'42');self.assertTrue(row['playable'])
  report=json.loads(row['report']);self.assertEqual(report['proof']['version'],'1.0.1');self.assertEqual(report['failed'],[]);self.assertTrue((DATA/'replays'/key/'init.hvi.gz').exists())
 def test_version_floor_cannot_be_disabled_with_judge_settings(self):
  meta,_=self.authenticated_decode(self.signer.seal(version_fixtures.recording(0xa0002,move=.23)))
  config=copy.deepcopy(DEFAULTS);config['judge']={k:{'enabled':False} for k in defaults()}
  with self.assertRaisesRegex(ValueError,'1.0.1'):assess(meta,b'',config,'x',0,1)
 def test_codec_keeps_legacy_replay_decoding_outside_formal_submission(self):
  for build in (0xa0000,0xa0001,0xa0002,0xb0000,0xb0001,0xb0002,0xb0003,0x01000000):
   meta,frames=self.authenticated_decode(self.signer.seal(version_fixtures.recording(build,move=.23)))
   expected=(5,84,97) if build>=0xb0000 else (4,72,85)
   self.assertEqual((meta['entities'],meta['words'],meta['recordWords']),expected);self.assertEqual(len(frames),meta['frames']*expected[1]*4)
   with self.assertRaisesRegex(ValueError,'1.0.1'):require_current_submission(meta)
if __name__=='__main__':unittest.main()
