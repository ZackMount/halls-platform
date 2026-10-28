import gzip,json,unittest
from unittest.mock import patch
import test_platform as platform
from app import app
from store import DATA,DEFAULTS,db,dumps
from visual_codec import split_initial
from visual_fixture import write_visual
import public_replay

class PublicReplayTests(unittest.TestCase):
 setUp=platform.PlatformTests.setUp
 seed=platform.PlatformTests.seed
 upload=platform.PlatformTests.upload
 web_headers=platform.PlatformTests.web_headers
 login=platform.PlatformTests.login

 def test_public_packets_are_anonymous_cacheable_and_byte_identical(self):
  key,_=self.seed(board='ranked',decision='approved');write_visual(DATA/'replays'/key,health=(100,)*400)
  detail=self.other.get('/api/runs/'+key);base=detail.json['replayBase']
  self.assertEqual(detail.headers['Cache-Control'],'no-store')
  with patch('app.db',side_effect=AssertionError('anonymous packet must not query authorization')):
   response=self.other.get(base+'manifest.bin')
  self.assertEqual(response.status_code,200);self.assertEqual(response.headers['Cache-Control'],public_replay.CACHE_CONTROL)
  self.assertEqual(response.headers['Cloudflare-CDN-Cache-Control'],public_replay.CDN_CACHE_CONTROL)
  self.assertEqual(response.headers['Content-Encoding'],'gzip');self.assertNotIn('Set-Cookie',response.headers)
  self.assertEqual(response.data,(DATA/'replays'/key/'init.hvi.gz').read_bytes())
  split_initial(gzip.decompress(response.data));response.close()
  chunk=self.other.get(base+'1.bin');self.assertEqual(chunk.status_code,200);self.assertEqual(chunk.data,(DATA/'replays'/key/'1.hvc.gz').read_bytes());chunk.close()
  again=self.other.get(base+'manifest.bin',headers={'If-None-Match':response.headers['ETag']})
  self.assertEqual(again.status_code,304);again.close()
  with db() as c:
   self.assertEqual(c.execute('SELECT COUNT(*) FROM tickets').fetchone()[0],0)
   used=c.execute('SELECT bytes FROM runs WHERE id=?',(key,)).fetchone()[0]
  self.assertEqual(used,(DATA/'proofs'/key).stat().st_size+public_replay.size(DATA/'replays'/key))
  repeat=self.other.get('/api/runs/'+key);self.assertEqual(repeat.json['replayBase'],base)
  with db() as c:self.assertEqual(c.execute('SELECT bytes FROM runs WHERE id=?',(key,)).fetchone()[0],used)

 def test_five_entity_packets_publish_with_their_own_column_count(self):
  from visual_codec import decode_manifest,decode_chunk
  key,_=self.seed(board='ranked',decision='approved');write_visual(DATA/'replays'/key,health=(100,)*400,entities=5)
  base=self.other.get('/api/runs/'+key).json['replayBase']
  with self.other.get(base+'manifest.bin') as response:
   self.assertEqual(response.status_code,200);metadata,chunk=split_initial(gzip.decompress(response.data))
  meta=decode_manifest(metadata);self.assertEqual((meta['entities'],meta['words']),(5,84));self.assertEqual(len(decode_chunk(chunk,meta,0)),360)
  with self.other.get(base+'1.bin') as response:
   self.assertEqual(response.status_code,200);self.assertEqual(len(decode_chunk(gzip.decompress(response.data),meta,1)),40)

 def test_hidden_and_admin_only_records_never_get_public_exports(self):
  key,_=self.seed();self.assertEqual(self.other.get('/api/runs/'+key).status_code,404)
  self.login();self.assertIsNone(self.client.get('/api/runs/'+key).json['replayBase'])
  self.assertFalse((DATA/'replays'/key/'cdn').exists())
  guess=f'/replay-public/{key}/'+('0'*64)+'/manifest.bin'
  response=self.other.get(guess);self.assertEqual(response.status_code,404);self.assertEqual(response.headers['Cache-Control'],'no-store')
  ticket=self.client.post('/api/runs/'+key+'/replay-session').json['ticket']
  response=self.client.get('/api/replay/'+key+'/manifest',headers={'X-Replay-Ticket':ticket,'Accept':'application/vnd.halls.replay.v5'})
  self.assertEqual(response.status_code,200);self.assertEqual(response.headers['Cache-Control'],'no-store');response.close()

 def test_takedown_removes_origin_exports_and_releases_quota(self):
  key,_=self.seed(board='ranked',decision='approved');base=self.other.get('/api/runs/'+key).json['replayBase']
  with db() as c:before=c.execute('SELECT bytes FROM runs WHERE id=?',(key,)).fetchone()[0]
  headers=self.login();self.client.post('/api/admin/runs/'+key,json={'board':'hidden'},headers=headers)
  self.assertEqual(self.other.get(base+'manifest.bin').status_code,404)
  self.assertEqual(self.other.get('/api/runs/'+key).status_code,404)
  with db() as c:after=c.execute('SELECT bytes FROM runs WHERE id=?',(key,)).fetchone()[0]
  self.assertLess(after,before)
  self.assertTrue((DATA/'replays'/key/'init.hvi.gz').exists(),'private source remains available to its admin')

 def test_disabling_unranked_removes_its_exports(self):
  key,_=self.seed(board='unranked',decision='rejected');policy=dict(DEFAULTS,unrankedEnabled=True)
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(policy),))
  base=self.other.get('/api/runs/'+key).json['replayBase'];headers=self.login();policy['unrankedEnabled']=False
  result=self.client.post('/api/admin/settings',json={'policy':policy,'revision':1},headers=headers)
  self.assertEqual(result.status_code,200);self.assertEqual(self.other.get(base+'manifest.bin').status_code,404)

 def test_revision_covers_packet_contents_and_old_files_are_removed(self):
  key,_=self.seed(board='ranked',decision='approved');folder=DATA/'replays'/key
  first=self.other.get('/api/runs/'+key).json['replayBase']
  write_visual(folder,health=(100000,100000))
  second=self.other.get('/api/runs/'+key).json['replayBase'];self.assertNotEqual(first,second)
  self.assertEqual(self.other.get(first+'manifest.bin').status_code,404)
  with self.other.get(second+'manifest.bin') as response:self.assertEqual(response.status_code,200)
  for part in ['catalog.json','cdn.lock','0.bin','../../init.hvi.gz','recipient.pem','-1.bin','10000.bin']:
   self.assertEqual(self.other.get(second+part).status_code,404,part)

 def test_export_respects_disk_quota_and_only_copies_current_visual_parts(self):
  key,_=self.seed(board='ranked',decision='approved');folder=DATA/'replays'/key
  with self.assertRaises(public_replay.CapacityError):public_replay.export(folder,budget=1)
  self.assertFalse((folder/'cdn').exists())
  (folder/'400.hvc.gz').write_bytes(b'obsolete part');(folder/'secret.pem').write_bytes(b'private')
  revision=public_replay.export(folder)
  self.assertEqual({p.name for p in (folder/'cdn'/revision).iterdir()},{'manifest.bin'})

if __name__=='__main__':unittest.main()
