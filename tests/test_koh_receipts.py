"""The contest receives only a server-authoritative, single-use capability."""
import concurrent.futures,json,secrets,threading,time,unittest
from unittest.mock import patch
import test_platform # Owns an isolated temporary platform database.
import test_koh_api as fixtures
from app import app
from store import DATA,db,digest,dumps

class KohReceiptTests(unittest.TestCase):
 setUp=fixtures.KohApiTests.setUp
 lookup=fixtures.KohApiTests.lookup
 upload=fixtures.KohApiTests.upload
 finish=fixtures.KohApiTests.finish

 def completed(self,score=76.89,status='done'):
  self.lookup();response=self.upload();self.assertEqual(response.status_code,202)
  self.run=response.json['id'];self.finish(self.run,status=status,score=score)
  return self.run

 def issue(self,source_submission=7,boot='a'*32):
  return self.client.post(self.base+f'/receipts/42/{source_submission}',headers={'X-KOH-Instance':boot})

 def claim(self,receipt,submission=800,problem=42,client=None,**changes):
  value={'receipt':receipt,'context':{'problem_id':problem,'submission_id':submission},'instance':'b'*32,**changes}
  return (client or self.client).post(self.base+'/receipts/claim',json=value)

 def test_issue_requires_completed_source_and_exact_source_instance(self):
  self.lookup()
  self.assertEqual(self.issue().status_code,503)
  self.assertEqual(self.issue(boot='c'*32).status_code,403)
  self.upload();self.assertEqual(self.issue().status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM koh_receipts').fetchone()[0],0)

 def test_small_receipt_is_stable_opaque_and_not_stored_or_audited_in_plaintext(self):
  self.completed();first=self.issue();second=self.issue()
  self.assertEqual(first.status_code,200);self.assertEqual(first.json,second.json)
  receipt=first.json['receipt'];token=receipt['token']
  self.assertEqual(set(receipt),{'version','token'});self.assertEqual(receipt['version'],1)
  self.assertRegex(token,r'^hkr1_[A-Za-z0-9_-]{43}$');self.assertLess(len(dumps(receipt).encode()),1024)
  self.assertTrue(first.json['filename'].endswith('.hreceipt'));self.assertNotIn(self.run,first.json['filename'])
  self.assertNotIn('score',first.get_data(as_text=True));self.assertNotIn('source_id',first.get_data(as_text=True))
  with db() as c:
   rows=c.execute('SELECT * FROM koh_receipts').fetchall();self.assertEqual(len(rows),1)
   self.assertEqual(rows[0]['token_hash'],digest(token));self.assertNotIn(token,dumps(dict(rows[0])))
   self.assertNotIn(token,dumps([dict(r) for r in c.execute('SELECT * FROM audit')]))

 def test_first_claim_uses_only_server_score_snapshot_and_real_contest_context(self):
  self.completed();receipt=self.issue().json['receipt']
  self.finish(self.run,score=1)
  response=self.claim(receipt,submission=801,source_id='private.example:123',source_kind='configured')
  self.assertEqual(response.status_code,200);self.assertEqual(response.json['score'],76.89)
  self.assertEqual(response.json['max_score'],100);self.assertIn('/run/'+self.run,response.json['feedback'])
  self.assertNotIn('private.example',response.get_data(as_text=True))
  with db() as c:
   row=c.execute('SELECT * FROM koh_receipts').fetchone();self.assertEqual((row['claim_problem'],row['claim_submission']),(42,801))
   source=c.execute("SELECT * FROM submission_sources WHERE channel='koh_receipt'").fetchone()
   self.assertEqual(source['submission_id'],801);self.assertEqual(source['source_id'],'private.example:123')
   self.assertTrue(source['hash_verified']);self.assertEqual(source['run_id'],self.run)

 def test_same_contest_submission_retries_idempotently_even_from_a_new_worker(self):
  self.completed();receipt=self.issue().json['receipt'];first=self.claim(receipt)
  again=self.claim(receipt,instance='d'*32)
  self.assertEqual(again.json,first.json)
  with db() as c:
   self.assertEqual(c.execute("SELECT count(*) FROM submission_sources WHERE channel='koh_receipt'").fetchone()[0],1)
   self.assertEqual(c.execute("SELECT count(*) FROM audit WHERE action='receipt_claimed' AND run=?",(self.run,)).fetchone()[0],1)

 def test_second_submission_cannot_reuse_receipt(self):
  self.completed();receipt=self.issue().json['receipt'];self.assertEqual(self.claim(receipt).json['score'],76.89)
  second=self.claim(receipt,submission=802);self.assertEqual(second.status_code,200);self.assertEqual(second.json['score'],0)
  self.assertIn('已被提交',second.json['feedback'])
  self.assertEqual(self.claim(receipt).json['score'],76.89)

 def test_receipt_has_no_source_problem_restriction_and_is_still_single_use(self):
  self.completed();receipt=self.issue().json['receipt']
  response=self.claim(receipt,problem=9001);self.assertEqual(response.status_code,200);self.assertEqual(response.json['score'],76.89)
  self.assertEqual(self.claim(receipt,problem=9001,instance='d'*32).json,response.json)
  duplicate=self.claim(receipt,problem=42,submission=801)
  self.assertEqual(duplicate.json['score'],0);self.assertIn('已被提交',duplicate.json['feedback'])
  with db() as c:
   row=c.execute('SELECT problem_id,claim_problem,claim_submission FROM koh_receipts').fetchone()
   self.assertEqual(tuple(row),(42,9001,800))

 def test_source_key_is_required_and_noncompetition_or_revoked_keys_are_rejected(self):
  self.completed();receipt=self.issue().json['receipt']
  with db(True) as c:c.execute("INSERT INTO api_keys(id,label,hash,created,scope) VALUES(?,?,?,?,?)",('other','other',digest('hls_other_key'),time.time(),'koh'))
  other=self.client.post('/api/koh/hls_other_key/receipts/claim',json={'receipt':receipt,'context':{'problem_id':42,'submission_id':800},'instance':'b'*32})
  self.assertEqual(other.status_code,200);self.assertEqual(other.json['score'],0)
  with db(True) as c:c.execute("UPDATE api_keys SET scope='upload' WHERE id='test-koh'")
  self.assertEqual(self.issue().status_code,401);self.assertEqual(self.claim(receipt).status_code,401)
  with db(True) as c:c.execute("UPDATE api_keys SET scope='koh',active=0 WHERE id='test-koh'")
  self.assertEqual(self.claim(receipt).status_code,401)

 def test_unknown_capability_is_zero_and_not_an_internal_error(self):
  response=self.claim({'version':1,'token':'hkr1_'+'A'*43})
  self.assertEqual(response.status_code,200);self.assertEqual(response.json['score'],0)
  self.assertIn('校验未通过',response.json['feedback'])

 def test_claim_rejects_scores_urls_extra_keys_bad_context_and_oversize(self):
  self.completed();receipt=self.issue().json['receipt']
  for bad in ({**receipt,'score':100},{'version':True,'token':receipt['token']},{'version':2,'token':receipt['token']},{**receipt,'url':'http://127.0.0.1/'}):
   self.assertEqual(self.claim(bad).status_code,400)
  self.assertEqual(self.claim(receipt,score=100).status_code,400)
  self.assertEqual(self.claim(receipt,context={'problem_id':42,'submission_id':True}).status_code,400)
  body='{"receipt":'+dumps(receipt)+',"context":{"problem_id":42,"submission_id":800},"instance":"'+'b'*32+'","instance":"'+'c'*32+'"}'
  self.assertEqual(self.client.post(self.base+'/receipts/claim',data=body,content_type='application/json').status_code,400)
  self.assertEqual(self.client.post(self.base+'/receipts/claim',data=b' '*2049,content_type='application/json').status_code,400)
  self.assertEqual(self.claim(receipt).json['score'],76.89)

 def test_assessment_error_and_inconclusive_evaluation_cannot_mint_a_score_receipt(self):
  self.completed(status='error');self.assertEqual(self.issue().status_code,503)
  self.finish(self.run,extra={'rules':[{'id':'player_model','status':'inconclusive'}]})
  self.assertEqual(self.issue().status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM koh_receipts').fetchone()[0],0)

 def test_invalid_proof_or_duplicate_source_can_only_mint_a_zero_receipt(self):
  self.completed(status='invalid',score=None);receipt=self.issue().json['receipt'];self.assertEqual(self.claim(receipt).json['score'],0)
  self.lookup(context={'problem_id':42,'submission_id':8},instance='c'*32)
  receipt=self.issue(source_submission=8,boot='c'*32).json['receipt'];response=self.claim(receipt,submission=803)
  self.assertEqual(response.json['score'],0);self.assertIn('已被提交',response.json['feedback'])

 def test_one_contest_submission_cannot_switch_receipt(self):
  self.completed();first=self.issue().json['receipt'];self.assertEqual(self.claim(first).json['score'],76.89)
  self.lookup(context={'problem_id':42,'submission_id':8},instance='c'*32)
  second=self.issue(source_submission=8,boot='c'*32).json['receipt']
  response=self.claim(second);self.assertEqual(response.json['score'],0);self.assertIn('另一份回执',response.json['feedback'])
  with db() as c:row=c.execute('SELECT claim_submission FROM koh_receipts WHERE token_hash=?',(digest(second['token']),)).fetchone();self.assertIsNone(row[0])
  self.assertEqual(self.claim(first).json['score'],76.89)

 def test_two_concurrent_contest_submissions_only_one_can_claim(self):
  self.completed();receipt=self.issue().json['receipt'];barrier=threading.Barrier(2)
  def claim(number):
   client=app.test_client();barrier.wait();return self.claim(receipt,problem=number+1000,submission=number,client=client).json
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:responses=list(pool.map(claim,(901,902)))
  self.assertEqual(sorted(v['score'] for v in responses),[0,76.89])
  with db() as c:self.assertIn(c.execute('SELECT claim_submission FROM koh_receipts').fetchone()[0],(901,902))

 def test_api_gate_rate_limit_and_source_deletion_remain_effective(self):
  self.completed();receipt=self.issue().json['receipt']
  with patch('competition.rate',return_value=False):self.assertEqual(self.claim(receipt).status_code,429)
  with db(True) as c:
   p=json.loads(c.execute('SELECT json FROM settings').fetchone()[0]);p['apiUploads']=False;c.execute('UPDATE settings SET json=?',(dumps(p),))
  self.assertEqual(self.claim(receipt).status_code,403)
  with db(True) as c:c.execute('DELETE FROM runs WHERE id=?',(self.run,))
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM koh_receipts').fetchone()[0],0)

 def test_secret_rotation_does_not_issue_an_unclaimable_replacement_token(self):
  self.completed();self.issue()
  with patch('competition_receipts.token_for',return_value='hkr1_'+'A'*43):self.assertEqual(self.issue().status_code,503)

 def test_preflight_race_zero_receipt_is_linked_to_the_real_run_for_deletion(self):
  self.lookup();self.lookup(context={'problem_id':42,'submission_id':8},instance='c'*32)
  response=self.upload();self.finish(response.json['id']);issued=self.issue(source_submission=8,boot='c'*32)
  self.assertEqual(issued.status_code,200);self.assertEqual(self.claim(issued.json['receipt']).json['score'],0)
  with db(True) as c:
   self.assertEqual(c.execute('SELECT run FROM koh_receipts').fetchone()[0],response.json['id'])
   c.execute('DELETE FROM runs WHERE id=?',(response.json['id'],))
  with db() as c:self.assertEqual(c.execute('SELECT count(*) FROM koh_receipts').fetchone()[0],0)

if __name__=='__main__':unittest.main()
