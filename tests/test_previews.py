import gzip
import json,os,secrets,time,unittest
from pathlib import Path
from unittest.mock import patch
import test_platform as platform_tests
from test_platform import app,db,DATA,dumps,DEFAULTS,digest
import previews
from visual_fixture import write_visual
from visual_codec import MIME
class PreviewTests(unittest.TestCase):
 setUp=platform_tests.PlatformTests.setUp
 def send(self,client=None,data=None,extra=None):
  client=client or self.client
  session=client.post('/api/previews/session',json={},headers={'Origin':'http://localhost'});self.assertEqual(session.status_code,200)
  h={'Origin':'http://localhost','X-Preview-Token':session.json['token']};h.update(extra or {})
  return client.post('/api/previews',headers=h,data=data or b'HLPF\1\r\n\x1a'+b'x'*392,content_type='application/octet-stream')
 def convert(self,meta,frames,folder):
  folder.mkdir();write_visual(folder)
 def ready(self,key):
  with db(True) as c:
   cache=c.execute('SELECT cache_id FROM previews WHERE id=?',(key,)).fetchone()[0];c.execute("UPDATE preview_cache SET status='processing' WHERE id=?",(cache,))
  meta={'playbackSafe':True,'duration':12,'platform':'windows','architecture':'x86_64','completedAt':123}
  with patch('codec.decode',return_value=(meta,b'demo')),patch('replay.convert',side_effect=self.convert):previews.process(cache)
  return cache
 def test_preview_independent_of_submission_and_never_scores(self):
  p=dict(DEFAULTS);p.update(uploadsEnabled=False,webUploads=False)
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
  r=self.send();self.assertEqual(r.status_code,202);cache=self.ready(r.json['id']);self.assertFalse((DATA/'preview-proofs'/cache).exists())
  with db() as c:
   self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],0);self.assertEqual(c.execute('SELECT status FROM preview_cache WHERE id=?',(cache,)).fetchone()[0],'ready')
  self.assertEqual(self.client.get('/api/previews/'+r.json['id']).json['status'],'ready')
  self.assertEqual(self.other.get('/api/previews/'+r.json['id']).status_code,404)
  self.assertEqual(self.other.get('/api/runs').json['total'],0)
 def test_hash_reuse_requires_upload_and_private_grant(self):
  r=self.send();key=r.json['id'];cache=self.ready(key)
  again=self.send(self.other);self.assertTrue(again.json['reused']);other=again.json['id'];self.assertNotEqual(key,other)
  with db() as c:
   self.assertEqual(c.execute('SELECT COUNT(*) FROM preview_cache').fetchone()[0],1);self.assertEqual(c.execute('SELECT sha FROM preview_cache').fetchone()[0],digest(b'HLPF\1\r\n\x1a'+b'x'*392))
  self.assertFalse((DATA/'preview-proofs'/other).exists());self.assertEqual(self.other.get('/api/previews/'+other).json['status'],'ready')
  self.assertEqual(self.other.get('/api/previews/'+key).status_code,404)
  self.assertIn(self.client.post('/api/previews/check',json={'sha256':digest(b'HLPF\1\r\n\x1a'+b'x'*392)}).status_code,(404,405))
 def test_pending_duplicate_has_only_one_job(self):
  first=self.send();second=self.send(self.other);self.assertTrue(second.json['reused'])
  with db() as c:self.assertEqual(c.execute("SELECT COUNT(*) FROM preview_cache WHERE status='queued'").fetchone()[0],1)
  self.assertFalse((DATA/'preview-proofs'/second.json['id']).exists())
 def test_read_requires_owner_and_ticket_and_correct_ip(self):
  r=self.send();key=r.json['id'];self.ready(key);url='/api/previews/'+key
  self.assertEqual(self.other.post(url+'/replay-session',headers={'Origin':'http://localhost'}).status_code,404)
  ticket=self.client.post(url+'/replay-session',headers={'Origin':'http://localhost'});self.assertEqual(ticket.status_code,200);h={'X-Replay-Ticket':ticket.json['ticket'],'Accept':MIME}
  self.assertEqual(self.client.get(url+'/replay/manifest',headers=h).status_code,200)
  self.assertEqual(self.other.get(url+'/replay/manifest',headers=h).status_code,404)
  self.assertEqual(self.client.get(url+'/replay/manifest',headers=h,environ_base={'REMOTE_ADDR':'192.0.2.2'}).status_code,404)
  for part in ('proof','../proofs','%2e%2e%2fapp.py','manifest.json'):
   self.assertEqual(self.client.get(url+'/replay/'+part,headers=h).status_code,404)
  self.assertEqual(gzip.decompress(self.client.get(url+'/replay/0',headers=h).data)[:4],b'HVC5')
 def test_bad_signature_and_conversion_errors_delete_original(self):
  from codec import ProofError
  for error in (ProofError('bad signature'),RuntimeError('conversion failed')):
   r=self.send(data=b'HLPF\1\r\n\x1a'+os.urandom(392));key=r.json['id']
   with db(True) as c:c.execute("UPDATE preview_cache SET status='processing' WHERE id=?",(key,))
   with patch('codec.decode',side_effect=error),patch('previews.traceback.print_exc'):previews.process(key)
   self.assertFalse((DATA/'preview-proofs'/key).exists());self.assertFalse((DATA/'preview-tmp'/key).exists());self.assertFalse((DATA/'preview-replays'/key).exists())
 def test_unsafe_motion_cannot_play(self):
  r=self.send();key=r.json['id']
  with db(True) as c:c.execute("UPDATE preview_cache SET status='processing' WHERE id=?",(key,))
  with patch('codec.decode',return_value=({'playbackSafe':False},b'')),patch('replay.convert') as convert:previews.process(key);convert.assert_not_called()
  self.assertEqual(self.client.get('/api/previews/'+key).json['status'],'invalid');self.assertFalse((DATA/'preview-proofs'/key).exists())
 def test_csrf_magic_length_filename_and_switch(self):
  self.assertEqual(self.client.post('/api/previews/session',json={},headers={'Origin':'https://evil.example'}).status_code,403)
  self.assertEqual(self.client.post('/api/previews',data=b'x'*400,content_type='application/octet-stream',headers={'Origin':'http://localhost'}).status_code,403)
  self.assertEqual(self.send(data=b'<script>'+b'x'*392).status_code,400)
  self.assertEqual(self.send(extra={'Content-Disposition':'attachment; filename="../../config"'}).status_code,400)
  self.assertEqual(self.send(data=b'HLPF\1\r\n\x1a').status_code,413)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM previews').fetchone()[0],0)
  p=dict(DEFAULTS);p['previewsEnabled']=False
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
  self.assertEqual(self.client.post('/api/previews/session',json={},headers={'Origin':'http://localhost'}).status_code,403)
 def test_expired_access_and_crash_cleanup_keep_hash(self):
  r=self.send();key=r.json['id'];cache=self.ready(key)
  with db(True) as c:c.execute('UPDATE previews SET expires=0 WHERE id=?',(key,))
  self.assertEqual(self.client.get('/api/previews/'+key).status_code,404);previews.cleanup()
  with db() as c:self.assertIsNotNone(c.execute('SELECT sha FROM preview_cache WHERE id=?',(cache,)).fetchone())
  r=self.send(data=b'HLPF\1\r\n\x1a'+b'y'*392);key=r.json['id']
  with db(True) as c:c.execute("UPDATE preview_cache SET status='processing' WHERE id=?",(key,))
  previews.cleanup(recover=True);self.assertFalse((DATA/'preview-proofs'/key).exists());self.assertEqual(self.client.get('/api/previews/'+key).json['status'],'error')
 def test_nonce_is_single_use(self):
  n=self.client.post('/api/previews/session',json={},headers={'Origin':'http://localhost'}).json['token'];h={'Origin':'http://localhost','X-Preview-Token':n}
  first=self.client.post('/api/previews',data=b'HLPF\1\r\n\x1a'+b'x'*392,content_type='application/octet-stream',headers=h);self.assertEqual(first.status_code,202)
  self.assertEqual(self.client.post('/api/previews',data=b'HLPF\1\r\n\x1a'+b'x'*392,content_type='application/octet-stream',headers=h).status_code,403)
 def test_cache_quota_still_allows_reuse_and_rejects_new_work(self):
  r=self.send();self.ready(r.json['id'])
  with patch('previews.MAX_BYTES',0):
   self.assertTrue(self.send(self.other).json['reused'])
   self.assertEqual(self.send(data=b'HLPF\1\r\n\x1a'+b'z'*392).status_code,503)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM preview_cache').fetchone()[0],1)
 def test_concurrent_identical_uploads_create_one_conversion(self):
  from concurrent.futures import ThreadPoolExecutor
  from threading import Barrier
  barrier=Barrier(2)
  def upload(_):
   client=app.test_client();nonce=client.post('/api/previews/session',json={},headers={'Origin':'http://localhost'}).json['token'];barrier.wait()
   return client.post('/api/previews',data=b'HLPF\1\r\n\x1a'+b'x'*392,content_type='application/octet-stream',headers={'Origin':'http://localhost','X-Preview-Token':nonce})
  with ThreadPoolExecutor(max_workers=2) as pool:responses=list(pool.map(upload,range(2)))
  self.assertEqual([r.status_code for r in responses],[202,202])
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM preview_cache').fetchone()[0],1)
 def test_existing_authenticated_score_replay_is_reused_without_judging(self):
  data=b'HLPF\1\r\n\x1a'+b'x'*392;key=secrets.token_hex(12);now=time.time()
  report={'metrics':{'duration':10},'proof':{'platform':'windows','architecture':'x86_64','completedAt':123}}
  with db(True) as c:c.execute("INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,bytes,policy,policy_revision,playable,report) VALUES(?,?,?,?,?,?,'done',400,'{}',1,1,?)",(key,'owner',digest(data),'private',now,now,dumps(report)))
  source=DATA/'replays'/key;source.mkdir();write_visual(source)
  r=self.send(data=data);preview=r.json['id']
  with db(True) as c:c.execute("UPDATE preview_cache SET status='processing' WHERE id=?",(preview,))
  with patch('codec.decode') as decoder,patch('replay.convert') as convert:previews.process(preview);decoder.assert_not_called();convert.assert_not_called()
  self.assertEqual(self.client.get('/api/previews/'+preview).json['status'],'ready');self.assertFalse((DATA/'preview-proofs'/preview).exists())
  self.assertEqual((DATA/'preview-replays'/preview/'init.hvi.gz').read_bytes(),(source/'init.hvi.gz').read_bytes())
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],1)
 def test_orphan_duplicate_upload_is_removed_after_web_crash(self):
  r=self.send();self.ready(r.json['id']);duplicate=self.send(self.other);key=duplicate.json['id']
  orphan=DATA/'preview-proofs'/key;orphan.write_bytes(b'left after web crash');os.utime(orphan,(time.time()-181,time.time()-181))
  previews.cleanup();self.assertFalse(orphan.exists());self.assertEqual(self.other.get('/api/previews/'+key).json['status'],'ready')
if __name__=='__main__':unittest.main()
