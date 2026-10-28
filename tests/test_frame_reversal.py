"""Feedback-loop regressions and counter-strafe controls, not human calibration."""
import math,random,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))



def course(fps=30,bursts=12,flips=30,hold=1,seed=23,travel=True,clipped=False,single_axis=False,
           hit=False,pause=False,conflict=False,clock_scale=1,look=False):
 rng=random.Random(seed);rows=[[0.]*84];uints=[[0,0]];clocks=[(0,1800000000000000,0,0,0)]
 x=z=20.;rows[0][6]=x;rows[0][8]=z;ns=paused=0;tick=0;yaw=0.
 def add(code,correct=False):
  nonlocal x,z,ns,paused,tick,yaw
  actual=(1+rng.uniform(-.04,.04))/fps;raw=round(actual*1e9);ns+=round(raw*clock_scale);dt=min(actual,.05);tick+=1
  f,s=code;scale=5*dt/max(math.hypot(f,s),1);r=[0.]*84;r[0]=dt;r[2]=f*scale;r[3]=s*scale
  if look:yaw+=rng.uniform(-.01,.01);r[4]=yaw-rows[-1][9]
  dx=math.sin(yaw)*r[2]+math.cos(yaw)*r[3];dz=math.cos(yaw)*r[2]-math.sin(yaw)*r[3]
  if not clipped or not correct:x+=dx;z+=dz
  r[6]=x;r[8]=z;r[9]=yaw
  if correct and hit and tick%5==0:r[20]=.1
  if correct and pause and tick%5==0:paused+=300000
  flags=(1 if f>0 else 2 if f<0 else 0)|(8 if s>0 else 4 if s<0 else 0)
  if correct and conflict:flags=15
  rows.append(r);uints.append([0,flags]);t=round(ns/1000)+paused;clocks.append((t,1800000000000000+t,raw,paused,t))
 for b in range(bursts):
  for _ in range(round(7*fps)):add((0,1) if travel else (0,0))
  axis=(1,0) if single_axis or b%2==0 else (0,1)
  for turn in range(flips+1):
   code=tuple(v*(1 if turn%2==0 else -1) for v in axis)
   for _ in range(rng.randint(2,5) if hold is None else hold):add(code,True)
  add((0,0))
 return rows,uints,clocks


class FrameReversalTests(unittest.TestCase):
 def test_retired_signature_cannot_raise_the_model_score(self):
  from judge import behavior,defaults
  from unittest.mock import patch
  rows,uints,clocks=course();prediction={'available':True,'coveredProtocol':True,'sufficient':True,'score':8.12,'eligibleWindows':3}
  with patch('judge.learned_observations',return_value=prediction):
   result=behavior(rows,uints,[0]*65536,defaults()['bot']['params'],input_mode='held',clocks=clocks,platform='windows')
  self.assertEqual(result['score'],8.12);self.assertEqual(result['scoreBasis'],'learned')
  self.assertNotIn('frame_reversal',result['patterns'])
