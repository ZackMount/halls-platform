"""Training transport probes must preserve group provenance and buffer limits."""
import math,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from behavior_features import FEATURES
from tools.behavior_ml.augmentation import PULSE_PROFILES,pulse_projection,tempo_style
from tools.behavior_ml.synthetic import Trace

class ProjectionTests(unittest.TestCase):
 def course(self):
  trace=Trace(63,60)
  for i in range(100):
   trace.hold(.25+(i%7)*.031,1,0,0,i%3!=0)
   trace.hold(.16+(i%5)*.013,0,1,.9,i%3!=0)
   trace.hold(.13+(i%3)*.021)
  return trace
 def test_protocol_probes_are_finite_and_reproducible(self):
  trace=self.course()
  for delay,period in PULSE_PROFILES:
   for last in (False,True):
    before=pulse_projection(trace.rows,trace.uints,trace.clocks,delay,period,last)
    self.assertTrue(before)
    self.assertEqual(before,pulse_projection(trace.rows,trace.uints,trace.clocks,delay,period,last))
    self.assertTrue(all(len(w['values'])==len(FEATURES) and all(math.isfinite(v) for v in w['values']) for w in before))
 def test_tempo_and_view_probes_retain_one_human_group(self):
  trace=self.course();windows=pulse_projection(trace.rows,trace.uints,trace.clocks,.35,.04,True)
  augmented=tempo_style(windows,'same-human')
  self.assertEqual(len(augmented),len(windows)*10)
  self.assertEqual({w['group'] for w in augmented},{'same-human'})
  self.assertEqual({w['label'] for w in augmented},{0})

if __name__=='__main__':unittest.main()
