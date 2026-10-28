import base64,copy,hashlib,json,platform,struct,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'engine'))
from judge import native_model,adjudicate,defaults

class MapVersions(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  if not list((ROOT/'engine/model').glob('judge-'+platform.system().lower()+'-*')):raise unittest.SkipTest('Build the native model first')
 def sample(self,v):
  f=[0.]*72;f[6]=v['spawn'][0];f[7]=1.55;f[8]=v['spawn'][1];f[19]=100
  frames=struct.pack('<72f',*f)*2
  meta={**v,'formSeeds':['1','2','3','4'],'frames':2,'testFixture':False,'eye':1.55,'tile':2,'sha256':'test','signature':'verified','keyId':'test','fileBytes':len(frames),'runId':'1'}
  return meta,frames
 def test_all_approved_maps_and_legacy_maps_match_the_pinned_native_model(self):
  for v in json.loads((ROOT/'tests/map_vectors.json').read_text()):
   with self.subTest(seed=v['seed'],version=v['version']):
    meta,frames=self.sample(v);model=native_model(meta,frames)
    self.assertEqual(hashlib.sha256(model['bitmap']).hexdigest(),v['bitmapSha256']);self.assertEqual(model['exit'],v['exit'])
 def test_wrong_seed_one_cell_tamper_and_wrong_generator_are_rejected(self):
  vectors=json.loads((ROOT/'tests/map_vectors.json').read_text())
  for v in (vectors[0],vectors[4]):
   meta,frames=self.sample(v);bits=native_model(meta,frames)['bitmap'];meta['bitmap']=base64.b64encode(bits).decode()
   settings={k:{'enabled':k=='map'} for k in defaults()}
   for case in ('original','one_cell','wrong_seed','wrong_generator'):
    m=copy.deepcopy(meta)
    if case=='one_cell':b=bytearray(bits);b[4032]^=1;m['bitmap']=base64.b64encode(b).decode()
    if case=='wrong_seed':m['seed']='43'
    if case=='wrong_generator':m['recordingBuild']=0xa0001 if v['recordingBuild']==0xa0002 else 0xa0002
    rule=next(r for r in adjudicate(m,frames,settings)['rules'] if r['id']=='map')
    self.assertEqual(rule['status'],'pass' if case=='original' else 'fail',(v['version'],case,rule))
    if case=='one_cell':self.assertEqual(rule['details']['differentCells'],1)
 def test_archived_metadata_without_build_still_selects_legacy(self):
  v=json.loads((ROOT/'tests/map_vectors.json').read_text())[0];meta,frames=self.sample(v);del meta['recordingBuild']
  self.assertEqual(hashlib.sha256(native_model(meta,frames)['bitmap']).hexdigest(),v['bitmapSha256'])
if __name__=='__main__':unittest.main()
