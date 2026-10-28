"""Signed gameplay builds select isolated native sources and protocol contracts."""
import hashlib,json,platform,struct,subprocess,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'engine'))
from build_model import MODEL_SOURCES,CURRENT_FILES
from judge import model_binary
from layout import LAYOUTS

class NativeIsolationTests(unittest.TestCase):
 def test_every_build_has_one_native_family_and_current_sync_includes_coins(self):
  owners={}
  for source,family,builds in MODEL_SOURCES:
   self.assertTrue((ROOT/source/'Cargo.toml').is_file())
   for build in builds:self.assertNotIn(build,owners);owners[build]=family
  self.assertEqual(set(owners),set(LAYOUTS))
  self.assertEqual([owners[n] for n in (0xb0000,0xb0001,0xb0002,0xb0003,0x01000000,0x01000001)],['judge-v11','judge-v11','judge-v113','judge-v113','judge-current','judge-current'])
  self.assertIn('coins.rs',CURRENT_FILES)
 def test_frozen_v113_gameplay_matches_its_preserved_source_manifest(self):
  folder=ROOT/'native-v113';manifest=json.loads((folder/'source-manifest.json').read_text())
  self.assertEqual(manifest['supportedBuilds'],['0x000b0002','0x000b0003'])
  for rel,digest in manifest['files'].items():self.assertEqual(hashlib.sha256((folder/rel).read_bytes()).hexdigest(),digest,rel)
 @unittest.skipUnless(list((ROOT/'engine/model').glob('judge-v113-'+platform.system().lower()+'-*')),'Build native judges first')
 def test_each_binary_rejects_other_generation_headers(self):
  for own,foreign in ((0x01000000,0xb0003),(0x01000001,0xb0003),(0xb0003,0x01000000),(0xb0003,0x01000001)):
   path,entry,_=model_binary(LAYOUTS[own]);self.assertIn(f'0x{own:08x}',entry['supportedBuilds']);self.assertNotIn(f'0x{foreign:08x}',entry['supportedBuilds'])
   data=b'HJM2'+struct.pack('<I',foreign)+struct.pack('<Q5QHHI',104729,0,0,0,0,0,1,1,2)+bytes(84*4*2)
   result=subprocess.run([str(path)],input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=10)
   self.assertNotEqual(result.returncode,0);self.assertFalse(result.stdout)

if __name__=='__main__':unittest.main()
