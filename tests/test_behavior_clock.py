import math,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from timing import valid_tick_dt
from judge import defaults,behavior,policy

class BehaviorClockTests(unittest.TestCase):
 def test_zero_interval_resume_requires_pause_and_unchanged_state(self):
  old=[0.]*72;old[0]=.04;old[19]=100;new=old.copy();new[0]=0
  clocks=[(0,0,0,0,0),(2000000,2000000,0,1950000,2000000)]
  self.assertTrue(valid_tick_dt(1,new,old,clocks,.050001))
  for column in (2,6,9,19,22,24,29,35):
   forged=new.copy();forged[column]+=1
   self.assertFalse(valid_tick_dt(1,forged,old,clocks,.050001),column)
  self.assertFalse(valid_tick_dt(1,new,old,None,.050001))
  self.assertFalse(valid_tick_dt(1,new,old,[(0,0,0,0,0),(50000,50000,0,0,50000)],.050001))
  self.assertFalse(valid_tick_dt(1,new,old,[(0,0,0,0,0),(2000000,2000000,1000,1950000,2000000)],.050001))
 def test_old_weights_cannot_restore_route_or_keyboard_style_penalties(self):
  old={'min_signals':1,'optimal_weight':100,'grid_weight':15,'turn_weight':25,
       'separation_weight':100,'rhythm_weight':100,'sparse_weight':100,'min_turns':8,'pulse_weight':75}
  updated=policy({'bot':{'params':old}})['bot']['params']
  self.assertEqual(updated,dict(threshold=50,min_seconds=45))
  self.assertEqual(policy({'bot':{'params':{**old,'grid_weight':0}}})['bot']['params'],updated)
  with self.assertRaises(ValueError):policy({'bot':{'params':{**old,'optimal_weight':float('nan')}}})
  with self.assertRaises(ValueError):policy({'bot':{'params':{'typo_weight':100}}})
 def test_optimal_straight_uniform_held_input_never_deducts(self):
  rows=[]
  for tick in range(4000):
   r=[0.]*84;r[0]=.02;r[2]=.1;r[6]=3;r[8]=3+tick*.1;rows.append(r)
  distances=[255-z for z in range(256) for x in range(256)]
  result=behavior(rows,[[0,1] for _ in rows],distances,defaults()['bot']['params'],input_mode='held')
  self.assertFalse(result['sufficient']);self.assertIsNone(result['score'])
  self.assertEqual(result['unavailableReason'],'insufficient_activity_windows')
