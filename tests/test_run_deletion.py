import hashlib,json,sys,time,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
import test_platform as fixtures
from app import app
from store import DATA,db,dumps,settings
class RunDeletionTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 seed=fixtures.PlatformTests.seed
 upload=fixtures.PlatformTests.upload
 web_headers=fixtures.PlatformTests.web_headers
 login=fixtures.PlatformTests.login
 def request_delete(self,key,headers=None,confirm=None,client=None):return (client or self.client).delete('/api/admin/runs/'+key,json={'confirm':key if confirm is None else confirm},headers=headers or {})
 def test_only_admin_with_csrf_and_explicit_matching_confirmation_can_delete(self):
  key,_=self.seed();self.assertEqual(self.request_delete(key,client=self.other).status_code,404)
  headers=self.login();self.assertEqual(self.request_delete(key).status_code,403)
  self.assertEqual(self.request_delete(key,{**headers,'Origin':'https://attacker.invalid'}).status_code,403)
  self.assertEqual(self.request_delete(key,headers,confirm='other-record').status_code,400)
  self.assertEqual(self.client.delete('/api/admin/runs/'+key,json={},headers=headers).status_code,400)
  with db() as c:self.assertIsNotNone(c.execute('SELECT id FROM runs WHERE id=?',(key,)).fetchone())
 def test_deletes_files_public_replay_preview_copies_and_competition_links(self):
  key,_=self.seed(board='ranked',decision='approved');public=self.other.get('/api/runs/'+key).json['replayBase'];download=self.other.get(public+'manifest.bin');self.assertEqual(download.status_code,200);download.close()
  cache='c'*24;preview='d'*24
  with db(True) as c:
   sha=c.execute('SELECT sha FROM runs WHERE id=?',(key,)).fetchone()[0]
   c.execute("INSERT INTO preview_cache(id,sha,status,bytes,created,updated) VALUES(?,?,'done',20,?,?)",(cache,sha,time.time(),time.time()))
   c.execute("INSERT INTO previews(id,cache_id,cap_hash,created,expires,status) VALUES(?,?,?, ?,?,'attached')",(preview,cache,'cap',time.time(),time.time()+100))
   c.execute('INSERT INTO preview_tickets VALUES(?,?,?,?,?)',('preview-ticket',preview,'ip',time.time()+100,0))
   c.execute('INSERT INTO tickets VALUES(?,?,?,?,?,?)',('run-ticket',key,'ip',time.time()+100,0,0))
   c.execute('INSERT INTO api_keys(id,label,hash,created,scope) VALUES(?,?,?,?,?)',('key','KOH','secret-hash',time.time(),'koh'))
   c.execute('INSERT INTO koh_submissions VALUES(?,?,?,?,?,?,?,?,?)',('key',1,1,sha,400,'i'*32,0,key,time.time()))
   c.execute('INSERT INTO submission_sources(at,channel,key_id,key_label,source_kind,sha,file_bytes,run_id,status) VALUES(?,?,?,?,?,?,?,?,?)',(time.time(),'koh','key','KOH','provided',sha,400,key,'done'))
   c.execute('INSERT INTO audit(at,actor,run,action,detail) VALUES(?,?,?,?,?)',(time.time(),'admin',key,'rejudge',dumps({'previousReport':'sensitive old report'})))
  for folder in ['proofs','results','tmp']:(DATA/folder/key).write_bytes(b'private data')
  for folder in ['preview-proofs']:(DATA/folder/cache).write_bytes(b'preview proof')
  for folder in ['preview-replays','preview-tmp']:(DATA/folder/cache).mkdir(exist_ok=True);(DATA/folder/cache/'private.bin').write_bytes(b'private data')
  before=settings();response=self.request_delete(key,self.login());self.assertEqual(response.status_code,200,response.json)
  self.assertEqual(self.other.get('/api/runs/'+key).status_code,404);self.assertEqual(self.other.get(public+'manifest.bin').status_code,404)
  for folder in ['proofs','results','tmp','replays']:self.assertFalse((DATA/folder/key).exists())
  for folder in ['preview-proofs','preview-replays','preview-tmp']:self.assertFalse((DATA/folder/cache).exists())
  with db() as c:
   for table in ['runs','preview_cache','previews','tickets','preview_tickets','koh_submissions','submission_sources']:self.assertEqual(c.execute('SELECT COUNT(*) FROM '+table).fetchone()[0],0,table)
   self.assertEqual(c.execute('SELECT COUNT(*) FROM admins').fetchone()[0],1);self.assertEqual(c.execute('SELECT COUNT(*) FROM api_keys').fetchone()[0],1)
   audit=c.execute('SELECT actor,action,detail FROM audit WHERE run=?',(key,)).fetchall();self.assertEqual(len(audit),1);self.assertEqual(tuple(audit[0])[:2],('admin','permanent_delete'));self.assertNotIn('sensitive',audit[0]['detail'])
  self.assertEqual(settings(),before)
 def test_receiving_processing_and_active_preview_jobs_are_not_deleted(self):
  key,_=self.seed();headers=self.login()
  for status in ['receiving','processing']:
   with db(True) as c:c.execute('UPDATE runs SET status=? WHERE id=?',(status,key))
   self.assertEqual(self.request_delete(key,headers).status_code,409)
   with db() as c:self.assertEqual(c.execute('SELECT status FROM runs WHERE id=?',(key,)).fetchone()[0],status)
  with db(True) as c:
   c.execute("UPDATE runs SET status='done' WHERE id=?",(key,))
   sha=c.execute('SELECT sha FROM runs WHERE id=?',(key,)).fetchone()[0]
   c.execute("INSERT INTO preview_cache(id,sha,status,bytes,created,updated) VALUES(?,?,'processing',1,?,?)",('e'*24,sha,time.time(),time.time()))
  self.assertEqual(self.request_delete(key,self.login()).status_code,409)
 def test_failed_cleanup_is_hidden_and_retry_finishes_deletion(self):
  key,_=self.seed(board='ranked',decision='approved');headers=self.login()
  with patch('record_deletion.remove',side_effect=OSError('disk problem')):self.assertEqual(self.request_delete(key,headers).status_code,503)
  with db() as c:
   row=c.execute('SELECT status,board,playable FROM runs WHERE id=?',(key,)).fetchone();self.assertEqual(tuple(row),('deleting','hidden',0))
  self.assertEqual(self.other.get('/api/runs/'+key).status_code,404)
  self.assertEqual(self.request_delete(key,headers).status_code,200)
 def test_queued_job_is_removed_and_symlink_targets_are_untouched(self):
  key,_=self.seed();headers=self.login()
  with db(True) as c:c.execute("UPDATE runs SET status='queued' WHERE id=?",(key,))
  with tempfile.TemporaryDirectory() as tmp:
   sentinel=Path(tmp)/'keep';sentinel.write_bytes(b'keep');link=DATA/'results'/key;link.symlink_to(tmp,target_is_directory=True)
   self.assertEqual(self.request_delete(key,headers).status_code,200);self.assertEqual(sentinel.read_bytes(),b'keep');self.assertFalse(link.is_symlink())
if __name__=='__main__':unittest.main()
