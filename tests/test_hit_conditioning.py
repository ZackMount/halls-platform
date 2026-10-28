import math,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from judge import damage_hit,conditional_camera,adjudicate,World
from test_competitive import world
import base64

def frame(hp=100):
 f=[0.]*72;f[0]=.05;f[6:11]=[3,1.55,3,0,0];f[12:19]=[3,1.55,3,0,0,0,1.4];f[19]=hp;return f
class HitConditioningTests(unittest.TestCase):
 def test_hit_uses_prediction_not_frozen_recorded_health(self):
  previous=frame(10000);expected=frame(9966)
  self.assertTrue(damage_hit(previous,expected))
  expected[19]=10000;expected[20]=.18;expected[21]=.30
  self.assertFalse(damage_hit(previous,expected))
 def test_surviving_fatal_prediction_uses_hit_camera(self):
  expected=frame(0);expected[20:23]=[.18,.30,44.29662323]
  expected[12:19]=[3,1.55,3,0,-.18,0,1.4]
  camera=conditional_camera(expected,34.125)
  self.assertAlmostEqual(camera[1],1.41);self.assertAlmostEqual(camera[4],-.08)
  self.assertAlmostEqual(camera[5],math.sin(expected[22]*16)*.025)
  self.assertAlmostEqual(camera[3],math.sin(expected[22]*54)*.015*.3)
  self.assertEqual(conditional_camera(expected,0),expected[12:19])
 def test_health_lock_does_not_excuse_forged_motion_or_camera(self):
  def judge_case(extra_move=0,extra_yaw=0,predict_hit=True,hp=34.125):
   a=frame(100 if hp==100 else 32);a[0]=0;b=frame(hp);b[0]=.05;b[6]+=.85;b[12]=b[6];b[20:23]=[.18,.3,.05]
   e=b.copy();e[19]=(66 if hp==100 else 0) if predict_hit else 32
   if not predict_hit:e[6]=3;e[20:22]=[0,0]
   b[12:19]=conditional_camera(e,b[19]);b[6]+=extra_move;b[15]+=extra_yaw
   data=b''.join(struct.pack('<72f',*r) for r in (a,b));pred=b''.join(struct.pack('<72f',*r) for r in (a,e));w=world();meta={'bitmap':base64.b64encode(w.bits).decode(),'exit':[1,1],'formSeeds':['1','2','3','4'],'testFixture':False,'eye':1.55,'tile':2,'sha256':'a','signature':'verified','keyId':'k','fileBytes':len(data),'version':2,'runId':'1','seed':'1','frames':2}
   model=lambda *_:dict(frames=pred,engine={},bitmap=w.bits,exit=[1,1],forms=[1,2,3,4])
   r=adjudicate(meta,data,{'bot':{'enabled':False}},model_runner=model)
   return {v['id']:v['status'] for v in r['rules']}
  r=judge_case();self.assertEqual(r['player_speed'],'pass');self.assertEqual(r['camera'],'pass');self.assertEqual(r['combat'],'fail')
  self.assertEqual(judge_case(extra_move=.5)['player_speed'],'fail')
  self.assertEqual(judge_case(extra_yaw=.2)['camera'],'fail')
  self.assertEqual(judge_case(predict_hit=False)['player_speed'],'fail')
  # HP remains a legal value (100), but an independently predicted hit must
  # still fail combat when damage is suppressed or the hitbox is reduced.
  self.assertEqual(judge_case(hp=100)['combat'],'fail')
