import hashlib,json,sys,time,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import app
from store import DATA,DEFAULTS,db,dumps,digest
from similarity import compare
from public_report import public_report

class KohApiTests(unittest.TestCase):
 def setUp(self):
  app.config['TESTING']=True;self.client=app.test_client();self.key='hls_test_koh_private';self.base='/api/koh/'+self.key;self.data=b'a test proof'*40;self.sha=hashlib.sha256(self.data).hexdigest()
  self.context={'problem_id':42,'submission_id':7};self.body={'context':self.context,'sha256':self.sha,'bytes':len(self.data),'instance':'a'*32}
  with db(True) as c:
   c.execute('DELETE FROM submission_sources');c.execute('DELETE FROM koh_submissions');c.execute('DELETE FROM runs');c.execute('DELETE FROM api_keys');c.execute('DELETE FROM rates')
   c.execute('UPDATE settings SET json=? WHERE id=1',(dumps({**DEFAULTS,'apiUploads':True,'unrankedEnabled':True}),))
   c.execute("INSERT INTO api_keys(id,label,hash,created,scope) VALUES(?,?,?,?,?)",('test-koh','test',digest(self.key),time.time(),'koh'))
 def lookup(self,**changes):return self.client.post(self.base+'/lookup',json={**self.body,**changes})
 def upload(self,data=None):return self.client.post(self.base+'/proofs/42/7?name=test',data=self.data if data is None else data,content_type='application/octet-stream',headers={'X-KOH-Instance':'a'*32})
 def finish(self,run,status='done',score=71.25,extra=None):
  from scoring import VERSION
  report={'verdict':'rejected','rules':[],'performance':{'version':VERSION,'score':score},**(extra or {})}
  with db(True) as c:c.execute('UPDATE runs SET status=?,score=?,report=? WHERE id=?',(status,score,dumps(report),run))
 def test_hash_miss_does_not_create_a_run_or_receive_file(self):
  r=self.lookup();self.assertEqual(r.status_code,200);self.assertFalse(r.json['known']);self.assertTrue(r.json['uploadRequired'])
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],0)
 def test_known_hash_from_another_submission_is_zero_without_upload(self):
  self.lookup();r=self.upload();self.assertEqual(r.status_code,202);self.finish(r.json['id'])
  found=self.lookup(context={'problem_id':42,'submission_id':8});self.assertTrue(found.json['known']);self.assertFalse(found.json['uploadRequired']);self.assertEqual(found.json['result']['score'],0);self.assertNotIn('report',found.json)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],1)
 def test_same_submission_retry_returns_its_original_score(self):
  self.lookup();r=self.upload();self.finish(r.json['id']);found=self.lookup();self.assertEqual(found.json['result']['score'],71.25)
 def test_simultaneous_different_submissions_cannot_share_one_hash(self):
  self.lookup();self.lookup(context={'problem_id':42,'submission_id':8});self.upload();found=self.lookup(context={'problem_id':42,'submission_id':8});self.assertEqual(found.json['result']['score'],0)
 def test_lookup_requires_competition_scope_and_active_key(self):
  with db(True) as c:c.execute("UPDATE api_keys SET scope='upload'")
  self.assertEqual(self.lookup().status_code,401)
  with db(True) as c:c.execute("UPDATE api_keys SET scope='koh',active=0")
  self.assertEqual(self.lookup().status_code,401)
 def test_competition_key_cannot_read_general_private_report_api(self):
  r=self.client.post('/api/submit/'+self.key+'?name=x',data=self.data,content_type='application/octet-stream');self.assertEqual(r.status_code,403)
 def test_submission_binding_cannot_be_changed(self):
  self.lookup();self.assertEqual(self.lookup(sha256='b'*64).status_code,409)
 def test_hash_mismatch_removes_partial_run_and_can_retry(self):
  self.lookup();self.assertEqual(self.upload(b'b'*len(self.data)).status_code,400)
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM runs').fetchone()[0],0)
  self.lookup();self.assertEqual(self.upload().status_code,202)
 def test_repeated_upload_and_pending_lookup_reuse_one_task(self):
  self.lookup();first=self.upload();second=self.upload();self.assertEqual(second.json['id'],first.json['id']);self.assertFalse(self.lookup().json['uploadRequired'])
 def test_invalid_file_scores_zero_but_service_failure_is_an_error(self):
  self.lookup();r=self.upload();self.finish(r.json['id'],status='invalid',score=None)
  value=self.client.get(self.base+'/results/42/7');self.assertEqual(value.json['result']['score'],0)
  self.finish(r.json['id'],status='error',score=None);self.assertEqual(self.client.get(self.base+'/results/42/7').status_code,503)
 def test_native_incomplete_evaluation_is_not_a_contestant_penalty(self):
  self.lookup();r=self.upload();self.finish(r.json['id'],extra={'rules':[{'id':'player_model','status':'inconclusive'}]});self.assertEqual(self.client.get(self.base+'/results/42/7').status_code,503)
 def test_backend_checks_missing_bad_context_size_instance_and_hash(self):
  for changes in ({'context':{'problem_id':True,'submission_id':1}},{'bytes':-1},{'sha256':'../bad'},{'instance':'x'}):self.assertEqual(self.lookup(**changes).status_code,400)
  self.assertEqual(self.client.get(self.base+'/results/42/7').status_code,404)
 def test_queue_full_is_not_zero_score(self):
  self.lookup()
  with patch('competition.previews.busy',return_value=8):self.assertEqual(self.upload().status_code,429)
 def test_same_seed_across_generator_versions_is_not_a_duplicate_map_seed(self):
  self.lookup();r=self.upload();run=r.json['id'];self.finish(run)
  with db(True) as c:c.execute("UPDATE runs SET board='unranked',decision='rejected' WHERE id=?",(run,))
  fp={'seed':'42','mapHash':'a','bitmap':'AA==','coarse':[0]*256,'points':[[0,0]]*128,'length':20,'turns':0}
  with db(True) as c:c.execute('UPDATE runs SET seed=?,fingerprint=? WHERE id=?',('42',dumps(fp),run))
  current={**fp,'mapGenerator':1}
  rules=compare(current,'next-run',DEFAULTS['similarity']);self.assertEqual(next(v for v in rules if v['id']=='seed_similarity')['status'],'pass')
  with db(True) as c:c.execute('UPDATE runs SET fingerprint=? WHERE id=?',(dumps(current),run))
  rules=compare(current,'next-run',DEFAULTS['similarity']);self.assertEqual(next(v for v in rules if v['id']=='seed_similarity')['status'],'fail')
 def test_unranked_and_hidden_records_participate_in_seed_similarity(self):
  self.lookup();r=self.upload();self.finish(r.json['id'])
  fp={'seed':'42','mapHash':'map','bitmap':'AA==','coarse':[0]*256,'points':[[x,x%8] for x in range(128)],'length':300,'turns':30}
  for board in ('unranked','hidden','ranked'):
   with db(True) as c:c.execute("UPDATE runs SET seed='42',fingerprint=?,board=?,decision='rejected' WHERE id=?",(dumps(fp),board,r.json['id']))
   rules=compare(fp,'next-run',DEFAULTS['similarity']);self.assertEqual(next(v for v in rules if v['id']=='seed_similarity')['status'],'fail',board)
 def test_public_similarity_links_only_include_visible_records(self):
  self.lookup();r=self.upload();self.finish(r.json['id']);run=r.json['id']
  report={'rules':[{'id':'seed_similarity','title':'地图种子','status':'fail','evidence':[{'id':run}]}]}
  with db(True) as c:c.execute("UPDATE runs SET board='unranked',decision='rejected' WHERE id=?",(run,))
  self.assertEqual(public_report(report)['rules'][0]['relatedRuns'][0]['id'],run)
  with db(True) as c:c.execute("UPDATE runs SET board='hidden' WHERE id=?",(run,))
  self.assertNotIn('relatedRuns',public_report(report)['rules'][0])
 def test_source_metadata_survives_duplicate_preflight_without_leaking(self):
  source='https://node5.anna.nssctf.cn:24933';found=self.lookup(source_id=source,source_kind='configured');self.assertNotIn(source,json.dumps(found.json))
  self.upload();self.lookup(context={'problem_id':42,'submission_id':8},source_id='other.example:1234')
  with db() as c:rows=c.execute('SELECT * FROM submission_sources ORDER BY id').fetchall()
  self.assertEqual(rows[0]['source_id'],source);self.assertTrue(rows[0]['hash_verified']);self.assertEqual(rows[1]['source_id'],'other.example:1234');self.assertTrue(rows[1]['duplicate'])
 def test_preflight_cleanup_does_not_remove_attribution_ledger(self):
  self.lookup(source_id='original')
  with db(True) as c:c.execute('UPDATE koh_submissions SET created=0')
  self.lookup(context={'problem_id':42,'submission_id':8},source_id='second')
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM submission_sources').fetchone()[0],2)

if __name__=='__main__':unittest.main()
