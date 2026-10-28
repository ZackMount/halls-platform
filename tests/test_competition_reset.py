import json,sqlite3,tempfile,unittest
from pathlib import Path
from tools.competition_reset import reset,DATA_FOLDERS,KEEP_TABLES

class CompetitionResetTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup);self.root=Path(self.temp.name);self.data=self.root/'data';self.data.mkdir();self.backups=self.root/'backups';self.backups.mkdir()
  with sqlite3.connect(self.data/'halls.sqlite3') as c:
   for name in KEEP_TABLES:
    c.execute('CREATE TABLE '+name+'(id TEXT PRIMARY KEY,value TEXT)');c.execute('INSERT INTO '+name+' VALUES(?,?)',('keep','preserve-secret-or-config'))
   c.executescript("CREATE TABLE runs(id TEXT PRIMARY KEY,report TEXT);INSERT INTO runs VALUES('temporary','private report');CREATE TABLE koh_receipts(id TEXT,run TEXT REFERENCES runs(id));INSERT INTO koh_receipts VALUES('code','temporary');CREATE TABLE audit(id TEXT,detail TEXT);INSERT INTO audit VALUES('old','private history');")
  for name in DATA_FOLDERS:
   folder=self.data/name;folder.mkdir();(folder/'temporary').mkdir();(folder/'temporary'/'private.bin').write_bytes(b'test evidence')
  (self.data/'admin-totp.key').write_bytes(b'keep MFA');(self.data/'session.key').write_bytes(b'keep session')
  (self.backups/'old.sqlite3').write_bytes(b'old private backup')
 def test_default_dry_run_changes_nothing(self):
  before=(self.data/'halls.sqlite3').read_bytes();result=reset(self.data,self.backups)
  self.assertFalse(result['execute']);self.assertEqual(before,(self.data/'halls.sqlite3').read_bytes());self.assertTrue((self.backups/'old.sqlite3').exists())
 def test_reset_clears_all_temporary_data_but_preserves_access_and_settings(self):
  result=reset(self.data,self.backups,True);self.assertEqual(result['removedRows'],{'audit':1,'koh_receipts':1,'runs':1})
  with sqlite3.connect(self.data/'halls.sqlite3') as c:
   for name in KEEP_TABLES:self.assertEqual(c.execute('SELECT * FROM '+name).fetchall(),[('keep','preserve-secret-or-config')])
   for name in ('runs','koh_receipts','audit'):self.assertEqual(c.execute('SELECT count(*) FROM '+name).fetchone()[0],0)
  for name in DATA_FOLDERS:self.assertEqual(list((self.data/name).iterdir()),[])
  self.assertEqual(list(self.backups.iterdir()),[]);self.assertEqual((self.data/'admin-totp.key').read_bytes(),b'keep MFA');self.assertEqual((self.data/'session.key').read_bytes(),b'keep session')
  self.assertTrue(reset(self.data,self.backups,True)['execute'])
 def test_cleanup_never_follows_a_stored_symlink(self):
  outside=self.root/'outside';outside.write_bytes(b'untouched');(self.data/'proofs'/'link').symlink_to(outside)
  reset(self.data,self.backups,True);self.assertEqual(outside.read_bytes(),b'untouched')
 def test_linked_storage_root_is_rejected_before_deletion(self):
  import shutil
  folder=self.data/'replays';shutil.rmtree(folder);folder.symlink_to(self.backups,target_is_directory=True)
  with self.assertRaises(ValueError):reset(self.data,self.backups,True)
  self.assertTrue((self.backups/'old.sqlite3').exists())

if __name__=='__main__':unittest.main()
