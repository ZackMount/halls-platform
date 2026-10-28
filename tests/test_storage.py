import hashlib,json,shutil,time,unittest
from unittest.mock import patch
import test_platform as fixtures
from store import DATA,db,dumps,digest,DEFAULTS
import storage
class StorageTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 web_headers=fixtures.PlatformTests.web_headers
 upload=fixtures.PlatformTests.upload
 def disk(self,free):return shutil._ntuple_diskusage(100*1024**3,100*1024**3-free,free)
 def test_admin_only_snapshot_has_capacity_and_no_internal_paths(self):
  self.assertEqual(self.client.get('/api/admin/storage').status_code,404);self.login()
  with patch('storage.shutil.disk_usage',return_value=self.disk(50*1024**3)):
   r=self.client.get('/api/admin/storage');self.assertEqual(r.status_code,200);self.assertEqual(r.json['disk']['free'],50*1024**3);self.assertTrue(r.json['safety']['acceptingUploads']);self.assertNotIn(str(DATA),json.dumps(r.json))
 def test_low_disk_rejects_public_and_admin_uploads_without_reserving_or_writing(self):
  with patch('storage.shutil.disk_usage',return_value=self.disk(storage.FREE_FLOOR+storage.RESERVE-1)):
   self.assertEqual(self.upload().status_code,503);h=self.login();self.assertEqual(self.client.post('/api/admin/uploads?name=test',data=b'x'*400,content_type='application/octet-stream',headers=h).status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],0)
 def test_queue_reservations_and_preview_quota_are_shared(self):
  with db(True) as c:
   c.execute("INSERT INTO preview_cache VALUES('test','sha','queued',?,?,?,NULL,NULL)",(storage.RESERVE,time.time(),time.time()))
   with patch('storage.shutil.disk_usage',return_value=self.disk(storage.FREE_FLOOR+2*storage.RESERVE-1)):
    self.assertIsNotNone(storage.admission(c));self.assertEqual(storage.snapshot(c)['platform']['pending'],1)
   with patch('storage.LIMIT',storage.RESERVE):self.assertIsNotNone(storage.admission(c))
 def test_preview_upload_checks_disk_before_receiving_bytes(self):
  n=self.client.post('/api/previews/session',json={},headers={'Origin':'http://localhost'}).json['token']
  with patch('storage.shutil.disk_usage',return_value=self.disk(100)):
   r=self.client.post('/api/previews',data=b'HLPF\1\r\n\x1a'+b'x'*392,content_type='application/octet-stream',headers={'Origin':'http://localhost','X-Preview-Token':n});self.assertEqual(r.status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM previews').fetchone()[0],0)
 def test_koh_duplicate_lookup_still_works_when_disk_is_low(self):
  key='hls_storage_test';sha=hashlib.sha256(b'x'*400).hexdigest();body={'sha256':sha,'bytes':400,'instance':'a'*32,'context':{'problem_id':1,'submission_id':1}}
  with db(True) as c:
   c.execute('UPDATE settings SET json=?',(dumps({**DEFAULTS,'apiUploads':True}),));c.execute("INSERT INTO api_keys(id,label,hash,created,scope) VALUES('disk-key','test',?,?,'koh')",(digest(key),time.time()))
  base='/api/koh/'+key
  with patch('storage.shutil.disk_usage',return_value=self.disk(100)):
   self.assertEqual(self.client.post(base+'/lookup',json=body).status_code,200)
   self.assertEqual(self.client.post(base+'/proofs/1/1?name=Zack',data=b'x'*400,content_type='application/octet-stream',headers={'X-KOH-Instance':'a'*32}).status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],0)
