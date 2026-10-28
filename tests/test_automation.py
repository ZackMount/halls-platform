import math,random,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from automation import adjustment

def f32(x):return struct.unpack('<f',struct.pack('<f',x))[0]

def corner_course(turns=24,offset=0.,angle_error=0.,dt=.02,speed=5.):
 """Detector fixtures, not claimed to be a representative human dataset."""
 rows=[];x=z=3.+offset;yaw=0.
 def add(dt,forward=0.,turn=0.):
  nonlocal x,z,yaw
  yaw=f32((yaw+turn)%math.tau);x=f32(x+math.sin(yaw)*forward);z=f32(z+math.cos(yaw)*forward)
  r=[0.]*84;r[0]=f32(dt);r[2]=f32(forward);r[4]=f32(turn);r[6]=x;r[8]=z;r[9]=yaw;rows.append(r)
 add(0.)
 for i in range(turns):
  distance=6.+2*(i%3);ticks=round(distance/(speed*dt))
  along_x=abs(math.sin(yaw))>=abs(math.cos(yaw));direction=math.sin(yaw) if along_x else math.cos(yaw)
  target=(x if along_x else z)+direction*distance
  for step in range(ticks):
   # Close a waypoint's remaining distance instead of accumulating a different
   # float32 drift for every rendering frequency.
   forward=(target-(x if along_x else z))/direction if step==ticks-1 else distance/ticks
   add(distance/(speed*ticks),forward)
  rotation=(math.pi/2+angle_error)*(1 if i%2==0 else -1)
  ticks=math.ceil(abs(rotation)/(1.65*dt))
  for _ in range(ticks):add(abs(rotation)/(1.65*ticks),turn=rotation/ticks)
  add(dt)
 return rows

def strafe_course(count=50,fps=60,jitter=0.,noise=0.,one_axis=False,stationary=False,lengths=(2,4,6,8,10)):
 rows=[];x=z=31.37;rng=random.Random(4312)
 def add(dt,forward=0.,strafe=0.):
  nonlocal x,z
  if not stationary:x=f32(x+strafe);z=f32(z+forward)
  r=[0.]*84;r[0]=f32(dt);r[2]=f32(forward);r[3]=f32(strafe);r[6]=x;r[8]=z;rows.append(r)
 add(0.)
 for i in range(count):
  dx,dz=((0,1),(0,-1))[i%2] if one_axis else ((1,0),(0,1),(-1,0),(0,1))[i%4]
  remaining=lengths[i%len(lengths)]+rng.uniform(-noise,noise)
  while remaining>1e-7:
   dt=min((1+rng.uniform(-jitter,jitter))/fps,remaining/5)
   distance=5*dt;add(dt,dz*distance,dx*distance);remaining-=distance
 add(.02)
 return rows

class AutomationTests(unittest.TestCase):
 def test_log_curve_is_continuous_increasing_concave_and_capped(self):
  points=[adjustment({'sufficient':True,'score':x})['deduction'] for x in range(101)]
  self.assertTrue(all(x==0 for x in points[:51]));self.assertEqual(points[-1],40)
  self.assertEqual(points[60],17.89);self.assertEqual(points[75],29.61);self.assertEqual(points[90],36.55)
  self.assertTrue(all(a<=b for a,b in zip(points,points[1:])))
  increments=[points[x+10]-points[x] for x in (50,60,70,80,90)]
  self.assertEqual(increments,sorted(increments,reverse=True))
  self.assertEqual(adjustment({'sufficient':True,'score':100},100)['deduction'],40)
  self.assertEqual(adjustment({'sufficient':True,'score':100},10)['deduction'],10)
 def test_missing_insufficient_invalid_or_disabled_scores_never_deduct(self):
  for score in (None,False,math.nan,math.inf,-1,101,'100'):
   self.assertEqual(adjustment({'sufficient':True,'score':score})['deduction'],0)
  self.assertEqual(adjustment({'sufficient':False,'score':100})['deduction'],0)
  self.assertEqual(adjustment({'sufficient':True,'score':100},enabled=False)['deduction'],0)
 def test_retired_weights_cannot_override_a_fractional_model_score(self):
  from judge import behavior,defaults
  from unittest.mock import patch
  rows=corner_course();prediction={'available':True,'coveredProtocol':True,'sufficient':True,'score':43.24,'eligibleWindows':3}
  for weight in (0,25,100):
   with patch('judge.learned_observations',return_value=prediction):
    result=behavior(rows,[[0,1] for _ in rows],[0]*65536,{**defaults()['bot']['params'],'precision_weight':weight},input_mode='held')
   self.assertEqual(result['score'],43.24);self.assertEqual(result['scoreBasis'],'learned');self.assertEqual(adjustment(result)['deduction'],0)
 def test_exact_grid_motion_cannot_replace_the_model_output(self):
  from judge import behavior,defaults
  from unittest.mock import patch
  rows=strafe_course();prediction={'available':True,'coveredProtocol':True,'sufficient':True,'score':12.73,'eligibleWindows':3}
  with patch('judge.learned_observations',return_value=prediction):
   result=behavior(rows,[[0,0] for _ in rows],[0]*65536,defaults()['bot']['params'],input_mode='held')
  self.assertEqual(result['scoreBasis'],'learned');self.assertEqual(result['score'],12.73)
  self.assertEqual(set(result['patterns']),{'learned'})
