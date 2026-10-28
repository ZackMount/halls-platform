import csv,io,json,sys,time,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import test_platform as fixtures
from app import app
from store import db,dumps,DEFAULTS
from submission_sources import record

class SourceTests(unittest.TestCase):
 def setUp(self):
  fixture=fixtures.PlatformTests();fixture.setUp();self.fixture=fixture;self.client=fixture.client;self.other=fixture.other
  with db(True) as c:c.execute('UPDATE settings SET json=? WHERE id=1',(dumps({**DEFAULTS,'apiUploads':True}),))
  headers=fixture.login();r=self.client.post('/api/admin/keys',json={'label':'origin-test'},headers=headers);self.key=r.json['key'];self.key_id=r.json['id']
 def upload(self,source='node5.anna.nssctf.cn:24933',sha=None):
  headers={'X-Source-ID':source}
  if sha:headers['X-Proof-SHA256']=sha
  return self.client.post('/api/submit/'+self.key+'?name=test',data=b'proof-data'*40,content_type='application/octet-stream',headers=headers)
 def export(self):return list(csv.DictReader(io.StringIO(self.client.get('/api/admin/submission-sources.csv').data.decode('utf-8-sig'))))
 def test_generic_api_origin_is_recorded_privately(self):
  r=self.upload();self.assertEqual(r.status_code,202);run=r.json['id'];receipt=r.json['receipt']
  with db() as c:row=c.execute('SELECT * FROM submission_sources').fetchone();self.assertEqual(row['source_id'],'node5.anna.nssctf.cn:24933');self.assertTrue(row['hash_verified'])
  public=self.client.get('/api/submissions/'+run,headers={'Authorization':'Bearer '+receipt}).json
  self.assertNotIn('node5.anna.nssctf.cn',json.dumps(public));self.assertNotIn('source_id',public)
  rows=self.export();self.assertEqual(rows[0]['source_id'],'node5.anna.nssctf.cn:24933');self.assertEqual(rows[0]['run_id'],run);self.assertTrue(rows[0]['received_at_utc'].endswith('Z'))
 def test_duplicate_hash_without_upload_is_also_in_export(self):
  self.upload()
  with db() as c:sha=c.execute('SELECT sha FROM runs').fetchone()[0]
  r=self.upload('second.example:24934',sha);self.assertEqual(r.status_code,409);rows=self.export();self.assertEqual(len(rows),2);self.assertEqual(rows[1]['duplicate'],'1');self.assertEqual(rows[1]['score'],'0');self.assertEqual(rows[1]['hash_verified'],'0')
 def test_csv_and_json_require_administrator_not_api_key_or_receipt(self):
  for path in ('/api/admin/submission-sources','/api/admin/submission-sources.csv'):
   self.assertEqual(self.other.get(path).status_code,404);self.assertEqual(self.other.get(path,headers={'Authorization':'Bearer '+self.key}).status_code,404)
 def test_formula_injection_is_escaped_and_private_identifiers_are_not_linked(self):
  self.upload('=1+1');rows=self.export();self.assertEqual(rows[0]['source_id'],"'=1+1")
  self.assertEqual(self.client.get('/api/admin/submission-sources').json['items'][0]['source_id'],'=1+1')
 def test_invalid_origin_is_rejected(self):
  self.assertEqual(self.upload('x'*257).status_code,400)
 def test_source_ledger_survives_record_and_key_cleanup(self):
  self.upload()
  with db(True) as c:c.execute('DELETE FROM runs');c.execute('DELETE FROM api_keys')
  self.assertEqual(len(self.export()),1)
 def test_source_list_is_paginated_and_csv_filter_does_not_drop_records(self):
  with db(True) as c:
   key={'id':self.key_id,'label':'test'}
   for i in range(35):record(c,key,'a'*64,400,'host-'+str(i))
  rows=self.client.get('/api/admin/submission-sources?limit=999').json;self.assertEqual(len(rows['items']),30);self.assertEqual(rows['total'],35)
  result=self.client.get('/api/admin/submission-sources.csv?q=host-34');self.assertIn(b'host-34',result.data);self.assertNotIn(b'host-33,',result.data)

if __name__=='__main__':unittest.main()
