"""Synthetic input-protocol regressions, not a representative human data set."""
import math,random,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))



def course(fps=30,period=.31,bursts=200,seed=7,mode='scheduled',moving=True,single_axis=False,gap_frames=1,hold_frames=None,pause=False,hit=False,conflict=False,look=False):
 rng=random.Random(seed);rows=[[0.]*84];uints=[[0,0]];clocks=[(0,1800000000000000,0,0,0)]
 x=z=200.;rows[0][6]=x;rows[0][8]=z;ns=0;paused=0
 def add(code,neutral=False):
  nonlocal x,z,ns,paused
  actual=(1+rng.uniform(-.04,.04))/fps;raw=round(actual*1e9);ns+=raw;dt=min(actual,.05)
  if neutral and pause:paused+=300000
  r=[0.]*84;r[0]=dt;f,s=code;length=math.hypot(f,s);scale=5*dt/max(length,1);r[2]=f*scale;r[3]=s*scale
  if moving:x+=r[3];z+=r[2]
  r[6]=x;r[8]=z
  if look:r[4]=rng.choice((-1,0,1))*dt*.8
  if neutral and hit:r[20]=.1
  flags=(1 if f>0 else 2 if f<0 else 0)|(8 if s>0 else 4 if s<0 else 0)
  if neutral and conflict:flags=3
  rows.append(r);uints.append([0,flags]);t=round(ns/1000)+paused;clocks.append((t,1800000000000000+t,raw,paused,t));return actual
 for i in range(bursts):
  code=(1,0) if single_axis else ((1,0),(0,1),(-1,0),(0,-1))[(i//5)%4]
  if mode=='scheduled':duration=period*(1,2,4,1,3,2,1)[i%7]
  elif mode=='single':duration=period
  elif mode=='irregular':duration=rng.uniform(.12,2.0)
  elif mode=='lognormal':duration=min(3.,max(.09,rng.lognormvariate(-1,.75)))
  else:raise ValueError(mode)
  elapsed=0.;frames=0
  while frames<(hold_frames or 0) or hold_frames is None and elapsed<duration:
   elapsed+=add(code);frames+=1
  count=rng.randint(1,4) if gap_frames is None else gap_frames
  for _ in range(count):add((0,0),True)
 add((0,0),True)
 return rows,uints,clocks


class HeldRefreshTests(unittest.TestCase):


 def test_retired_signature_cannot_raise_the_model_score(self):
  from judge import behavior,defaults
  from unittest.mock import patch
  rows,uints,clocks=course();prediction={'available':True,'coveredProtocol':True,'sufficient':True,'score':34.56,'eligibleWindows':3}
  with patch('judge.learned_observations',return_value=prediction):
   result=behavior(rows,uints,[0]*65536,defaults()['bot']['params'],input_mode='held',clocks=clocks,platform='windows')
  self.assertEqual(result['score'],34.56);self.assertEqual(result['scoreBasis'],'learned')
  self.assertNotIn('held_refresh',result['patterns'])
