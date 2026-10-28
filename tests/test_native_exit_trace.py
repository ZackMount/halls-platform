"""The native protocol preserves canonical geometry and observes per-frame exits."""
import base64,platform,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from judge import native_model,Rows


def trace(cells):return {'samples':base64.b64encode(b''.join(struct.pack('<II',*cell) for cell in cells)).decode(),'encoding':'u32le-pair'}


@unittest.skipUnless(list((Path(__file__).resolve().parents[1]/'engine/model').glob('judge-current-'+platform.system().lower()+'-*')),'Build current native judge first')
class NativeExitTraceTests(unittest.TestCase):
 def fixture(self):
  meta={'recordingBuild':0x01000001,'version':'1.0.1','seed':'42','formSeeds':['1','2','3','4','5'],'exit':[1,1],'frames':2,'exitSamples':trace([[1,1],[1,1]])}
  initial=native_model(meta,bytes(2*336));meta.update(exit=initial['exit'],formSeeds=list(map(str,initial['forms'])))
  row=list(struct.unpack_from('<84I',initial['frames']));row[1]=512;first=struct.pack('<84I',*row)
  f=struct.unpack('<84f',first);spawn=[int(f[6]/2),int(f[8]/2)];self.assertNotEqual(spawn,meta['exit'])
  row[0]=struct.unpack('<I',struct.pack('<f',.05))[0];row[23]=1
  return meta,first+struct.pack('<84I',*row),spawn
 def test_current_exit_changes_drive_the_step_but_do_not_change_the_canonical_output(self):
  meta,frames,spawn=self.fixture();meta['exitSamples']=trace([meta['exit'],spawn])
  result=native_model(meta,frames);rows=Rows(result['frames'],words=84);state=struct.unpack_from('<I',result['frames'],336+23*4)[0]
  self.assertEqual(result['exit'],meta['exit']);self.assertEqual(state,1);self.assertEqual(rows[-1][22],rows[0][22]);self.assertIsNone(result['terminalConditioning'])
  self.assertEqual(result['frames'][336+24*4:336+84*4],result['frames'][24*4:84*4])
 def test_new_build_cannot_infer_a_win_outside_the_recorded_exit(self):
  meta,frames,_=self.fixture();meta['exitSamples']=trace([meta['exit'],meta['exit']]);result=native_model(meta,frames)
  self.assertEqual(struct.unpack_from('<I',result['frames'],336+23*4)[0],0);self.assertGreater(Rows(result['frames'],words=84)[-1][22],0);self.assertIsNone(result['terminalConditioning'])
 def test_legacy_unknown_live_exit_is_explicitly_conditioned_not_certified(self):
  meta,frames,_=self.fixture();meta.update(recordingBuild=0x01000000,version='1.0.0');meta.pop('exitSamples')
  result=native_model(meta,frames)
  self.assertEqual(result['terminalConditioning'],'legacy_unverified_exit');self.assertEqual(result['exit'],meta['exit'])
  self.assertEqual(Rows(result['frames'],words=84)[-1][22],0);self.assertEqual(struct.unpack_from('<I',result['frames'],336+23*4)[0],1)
 def test_current_build_requires_a_complete_exit_trace(self):
  meta,frames,_=self.fixture();meta.pop('exitSamples')
  with self.assertRaises(RuntimeError):native_model(meta,frames)
  meta['exitSamples']=trace([meta['exit']])
  with self.assertRaises(RuntimeError):native_model(meta,frames)

if __name__=='__main__':unittest.main()
