"""Portable inference, model loading safety and control-feature regressions."""
import copy,json,math,sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
import behavior_model as learned
from behavior_features import FEATURES,SCHEMA,extract
from test_held_refresh import course

class LearnedBehaviorTests(unittest.TestCase):
 def test_shipped_artifact_is_small_trained_data_and_has_no_raw_proofs(self):
  model=learned.load_model()
  self.assertEqual(model['training']['humanRecordings'],3)
  self.assertEqual(len(model['training']['syntheticFamilies']),10)
  self.assertEqual(model['training']['syntheticRuns'],240)
  self.assertFalse(model['training']['rawProofsIncluded']);self.assertFalse(model['training']['humanAugmentationsAreIndependent'])
  self.assertLess(learned.PATH.stat().st_size,256*1024)
  self.assertEqual(set(model['heads']),{'held','pulse'})
  self.assertEqual(model['modelVersion'],'forest-2')
  self.assertEqual(model['training']['recordedBotRecordings'],22)
 def test_portable_reference_vectors_exported_from_training_library(self):
  path=Path(__file__).resolve().parent/'data/behavior-model-vectors.json'
  for sample in json.loads(path.read_text()):
   self.assertAlmostEqual(learned.predict(sample['values'],learned.load_model(),sample['inputMode']),sample['support'],places=12)
 def test_three_disjoint_windows_and_activity_are_required(self):
  rows,keys,clocks=course(bursts=20)
  self.assertEqual(learned.observe(rows,keys,clocks)['score'],None)
 def test_both_transport_models_are_used_and_unknown_protocols_abstain(self):
  rows,keys,clocks=course()
  for mode in (None,'unknown'):
   result=learned.observe(rows,keys,clocks,input_mode=mode)
   self.assertFalse(result['coveredProtocol']);self.assertEqual(result['score'],None)
  for mode in ('held','pulse'):
   result=learned.observe(rows,keys,clocks,input_mode=mode)
   self.assertTrue(result['coveredProtocol']);self.assertTrue(result['sufficient'])
   self.assertEqual(result['inputHead'],mode)
   self.assertEqual(result['score'],round(learned.suspicion(result['support'],learned.load_model()['heads'][mode]['operatingPoint']),2))
  rows,keys,clocks=course(bursts=160)
  for row in rows:row[2:6]=[0]*4
  # Position-rich windows are assessed even if all input transitions are absent.
  # Whether those positions agree with inputs is checked by the physics judge.
  self.assertTrue(learned.observe(rows,keys,clocks)['sufficient'])
 def test_wall_clock_provenance_and_absolute_time_do_not_change_behavior_prediction(self):
  rows,keys,clocks=course();before=learned.observe(rows,keys,clocks)
  varied=[(t[0],t[1]+(i%7)*100,t[2]+(i%11)*500,t[3],t[4]) for i,t in enumerate(clocks)]
  self.assertEqual(learned.observe(rows,keys,varied),before)
 def test_normalized_duration_statistics_do_not_depend_on_render_frame_density(self):
  from tools.behavior_ml.synthetic import Trace
  results=[]
  for fps in (30,120):
   t=Trace(42,fps)
   for _ in range(30):t.hold(.8,1);t.hold(.25);t.hold(.8,0,1);t.hold(.25)
   windows=extract(t.rows,t.uints,t.clocks);results.append(windows[0]['values'])
  for name in ('movement_hold_p50','movement_hold_p90','idle_hold_p50','idle_hold_p90'):
   self.assertAlmostEqual(results[0][FEATURES.index(name)],results[1][FEATURES.index(name)],delta=.05)
 def test_pause_and_knockback_do_not_create_long_controller_windows(self):
  rows,keys,clocks=course();paused=[];offset=0
  for i,t in enumerate(clocks):
   if i%100==0:offset+=300000
   paused.append((t[0]+offset,t[1]+offset,t[2],t[3]+offset,t[4]+offset))
  self.assertEqual(learned.observe(rows,keys,paused)['score'],None)
  for row in rows:row[20]=.1
  self.assertEqual(extract(rows,keys,clocks),[])
 def test_model_threshold_mapping_is_continuous_and_not_a_fixed_grade(self):
  self.assertEqual(learned.suspicion(.9),50)
  self.assertAlmostEqual(learned.suspicion(.95),75)
  self.assertAlmostEqual(learned.suspicion(.975),87.5)
  self.assertAlmostEqual(learned.suspicion(1),100)
 def test_input_float32_conversion_matches_training_tree_boundary(self):
  model={'trees':[[[0,1.,1,2,.5],[-2,-2.,-1,-1,.2],[-2,-2.,-1,-1,.8]]]}
  values=[0.]*len(FEATURES);values[0]=1.+1e-9
  self.assertEqual(learned.predict(values,model),.2)
  values[0]=1.001;self.assertEqual(learned.predict(values,model),.8)
 def test_invalid_feature_vectors_are_rejected(self):
  for values in ([0.], [math.nan]*len(FEATURES),[math.inf]*len(FEATURES)):
   with self.assertRaises(learned.ModelError):learned.predict(values,learned.load_model())
 def test_loader_rejects_cycles_schema_changes_and_non_data(self):
  valid={'schema':SCHEMA,'features':list(FEATURES),'heads':{'held':{'trees':[[[-2,-2.,-1,-1,.4]]],'operatingPoint':.9}},'training':{'humanInputModes':['held']}}
  cycle=copy.deepcopy(valid);cycle['heads']['held']['trees']=[[[0,1.,0,0,.5]]]
  changed=copy.deepcopy(valid);changed['features'][0]='unknown'
  with tempfile.TemporaryDirectory() as directory:
   path=Path(directory)/'model.json'
   bad_mode=copy.deepcopy(valid);bad_mode['heads']['unknown']=bad_mode['heads']['held']
   bad_pulse=copy.deepcopy(valid);bad_pulse['heads']['pulse']={'trees':[[[0,1.,0,0,.5]]],'operatingPoint':.9}
   for invalid in (cycle,changed,bad_mode,bad_pulse,{'heads':{}},None):
    path.write_text(json.dumps(invalid));learned.load_model.cache_clear()
    with patch.object(learned,'PATH',path),self.assertRaises(learned.ModelError):learned.load_model()
   path.write_bytes(b'not JSON or an executable pickle');learned.load_model.cache_clear()
   with patch.object(learned,'PATH',path),self.assertRaises(learned.ModelError):learned.load_model()
  learned.load_model.cache_clear()
 def test_deadline_is_enforced_during_feature_extraction(self):
  rows,keys,clocks=course()
  def stop():raise TimeoutError()
  with self.assertRaises(TimeoutError):learned.observe(rows,keys,clocks,stop)
 def test_production_uses_only_the_model_and_preserves_two_decimals(self):
  from judge import behavior,defaults
  rows,keys,clocks=course();prediction={'available':True,'coveredProtocol':True,'sufficient':True,'score':67.83,'eligibleWindows':3}
  with patch('judge.learned_observations',return_value=prediction) as model:
   result=behavior(rows,keys,[0]*65536,defaults()['bot']['params'],input_mode='held',clocks=clocks)
  model.assert_called_once();self.assertEqual(result['score'],67.83);self.assertEqual(result['mode'],'model_only')
  self.assertEqual(set(result['patterns']),{'learned'})

if __name__=='__main__':unittest.main()
