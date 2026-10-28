"""Seeded, labeled controller traces, never signed or uploaded as game proofs.

These are automatic control simulations, not invented human observations. Each
trace obeys the game's speed/turn caps. Human traces are supplied separately.
"""
import math,random

FAMILIES=('timer','refresh','bangbang','waypoint','noisy_waypoint','pursuit','pid','easing','macro','grid')

class Trace:
 def __init__(self,seed,fps):
  self.rng=random.Random(seed);self.fps=fps;self.rows=[[0.]*84];self.uints=[[0,0]];self.clocks=[(0,1800000000000000,0,0,0)]
  self.x=self.z=250.;self.yaw=self.rng.random()*math.tau;self.elapsed=0.;self.ns=0
  self.rows[0][6]=self.x;self.rows[0][8]=self.z;self.rows[0][9]=self.yaw;self.rows[0][19]=100
 def tick(self,f=0.,s=0.,turn=0.,run=True,dt=None):
  actual=dt or max(.002,(1+self.rng.uniform(-.12,.12))/self.fps);step=min(actual,.05);speed=5 if run else 2
  length=max(1.,math.hypot(f,s));f=f/length*speed*step;s=s/length*speed*step;turn=max(-1.65*step,min(1.65*step,turn))
  self.yaw=(self.yaw+turn)%math.tau;self.x+=math.sin(self.yaw)*f+math.cos(self.yaw)*s;self.z+=math.cos(self.yaw)*f-math.sin(self.yaw)*s
  r=[0.]*84;r[0]=step;r[2:6]=[f,s,turn,0];r[6:11]=[self.x,1.55,self.z,self.yaw,0];r[19]=100
  flags=(1 if f>0 else 2 if f<0 else 0)|(8 if s>0 else 4 if s<0 else 0)|(32 if turn>0 else 16 if turn<0 else 0)|(256 if run else 0)
  self.rows.append(r);self.uints.append([0,flags]);self.ns+=round(actual*1e9);t=round(self.ns/1000);self.clocks.append((t,1800000000000000+t,round(actual*1e9),0,t));self.elapsed+=actual
  return actual
 def hold(self,seconds,f=0.,s=0.,rate=0.,run=True):
  end=self.elapsed+seconds
  while self.elapsed<end:self.tick(f,s,rate/self.fps,run)

def generate(family,seed,seconds=180):
 if family not in FAMILIES:raise ValueError(family)
 rng=random.Random(seed);trace=Trace(seed,rng.choice((20,30,45,60,90,120)));period=rng.uniform(.15,.65);index=0;previous_error=0.
 macro=[(1.1,1,0,0),(.7,0,0,1),(1.2,1,1,0),(.9,0,0,-1),(1.3,0,-1,0),(.8,0,0,0),(1.4,1,0,.3),(1.1,1,0,-.3),(1.2,-1,0,0),(1.6,0,1,0)]
 while trace.elapsed<seconds:
  index+=1;direction=((1,0),(0,1),(-1,0),(0,-1))[rng.randrange(4)]
  if family=='refresh':
   for _ in range(rng.randrange(3,9)):
    trace.hold(period*rng.randrange(1,9),*direction)
    trace.tick()
  elif family=='bangbang':
   trace.hold(rng.uniform(1.,4),*direction)
   for k in range(rng.randrange(12,80)):trace.tick(*(v*(1 if k%2 else -1) for v in direction))
  elif family=='timer':
   trace.hold(rng.choice((.4,.8,1.6,2.4,3.2)),*direction);trace.hold(rng.choice((.05,.1,.2)))
  elif family=='macro':
   for duration,f,s,rate in macro:trace.hold(duration*(1+rng.uniform(-.0005,.0005)),f,s,rate)
  elif family=='easing':
   angle=rng.choice((-1,1))*rng.uniform(.4,1.6);duration=max(2.7,abs(angle)*2);power=rng.uniform(1.4,2.8);start=trace.elapsed;last=0.
   while trace.elapsed-start<duration:
    fraction=min(1.,(trace.elapsed-start+1/trace.fps)/duration);value=angle*fraction**power
    trace.tick(turn=value-last);last=value
   trace.hold(rng.uniform(1.,4),1)
  elif family in ('waypoint','grid','noisy_waypoint'):
   # Axis-key controller with target tolerance, optional delayed/noisy feedback.
   axis=rng.randrange(2);direction=1 if rng.random()<.5 else -1;start=(trace.x,trace.z)[axis]
   target=start+direction*rng.randrange(2,8)*2
   target=target if family=='grid' else round(target/2)*2+rng.uniform(-.4,.4)
   if not 10<target<500:target=start-direction*10
   target_direction=1 if target>start else -1;tolerance=0 if family=='grid' else rng.uniform(.04,.3);j=0
   while ((target-(trace.x,trace.z)[axis])*target_direction>tolerance) and j<3000:
    j+=1;world=(target_direction,0) if axis==0 else (0,target_direction)
    # Invert the camera transform so geometry is independent of view style.
    dx,dz=world;sine,cosine=math.sin(trace.yaw),math.cos(trace.yaw);f=sine*dx+cosine*dz;s=cosine*dx-sine*dz
    if family=='noisy_waypoint' and rng.random()<.025:trace.hold(rng.uniform(.06,.2))
    if family=='grid':
     remaining=abs(target-(trace.x,trace.z)[axis]);dt=min(1/trace.fps,remaining/5)
     if dt<.0001:break
     trace.tick(f,s,dt=dt)
    else:trace.tick(f,s)
   trace.tick()
   if family=='noisy_waypoint':trace.hold(rng.uniform(.04,.25))
  else:
   target=(rng.uniform(100,400),rng.uniform(100,400));stop=trace.elapsed+rng.uniform(2.,7)
   gain=rng.uniform(1.2,5.)
   while trace.elapsed<stop:
    desired=math.atan2(target[0]-trace.x,target[1]-trace.z);error=(desired-trace.yaw+math.pi)%math.tau-math.pi
    rate=max(-1.65,min(1.65,gain*error))
    if family=='pid':rate=max(-1.65,min(1.65,gain*error+.12*(error-previous_error)*trace.fps));previous_error=error
    trace.tick(1,turn=rate/trace.fps,run=abs(error)<rng.uniform(.4,.8))
  # Reflect the local test course at a roomy boundary; no portal is recorded.
  if not 30<trace.x<480 or not 30<trace.z<480:
   trace.hold(2,rate=1.65);trace.hold(3,1)
 return trace.rows,trace.uints,trace.clocks
