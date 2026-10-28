"""Grouped human nuisance probes; these never become independent human labels."""
import math,random
from behavior_features import FEATURES,extract,sign

PULSE_PROFILES=((.20,1/15),(.35,1/25),(.50,1/40))

def tempo_style(windows,group):
 result=[];names={name:i for i,name in enumerate(FEATURES)}
 temporal=('movement_hold_p50','movement_hold_p90','look_hold_p50','look_hold_p90','idle_hold_p50','idle_hold_p90','move_turn_lag_p50')
 rates=('movement_changes','look_changes','joint_changes','run_changes')
 for w in windows:
  for scale in (.7,.85,1.,1.2,1.4):
   values=list(w['values'])
   for key in temporal:values[names[key]]*=scale
   for key in rates:values[names[key]]/=scale
   result.append({**w,'values':values,'label':0,'group':group,'kind':'human_augmentation'})
   frozen=values.copy()
   for key in ('look_changes','look_hold_cv','look_hold_p50','look_hold_p90','look_duration_entropy','look_single_frame','turn_angle_p50','turn_angle_p90','turn_angle_grid','turn_duration_cv','turn_profile_variation','turn_profile_reuse','look_rate_variation','move_turn_lag_p50'):frozen[names[key]]=0
   frozen[names['joint_changes']]=values[names['movement_changes']]+values[names['run_changes']]
   result.append({**w,'values':frozen,'label':0,'group':group,'kind':'human_style_projection'})
 return result

def pulse_projection(rows,uints,clocks,delay,period,last_key_only,seed=20261023):
 """Replay observed human key intentions through the client's finite buffer.

 Same displacement increments, saturation and draining as app.rs Input. Probe
 repeat delay/rate and single-key terminal repeat. Geometry is retained only for
 activity gating; projections are not complete physically valid game recordings.
 """
 rng=random.Random(seed);buffer=[0.]*4;previous=[0]*4;repeat=[0.]*4;last_axis=0
 projected=[list(rows[0])];keys=[list(uints[0])]
 for i in range(1,len(rows)):
  source=rows[i];row=list(source);now=clocks[i][0]/1e6;dt=max(0.,source[0]);intent=[sign(v) for v in source[2:6]];running=bool(uints[i][1]&256)
  for axis,code in enumerate(intent):
   amount=(.32 if running else .18) if axis<2 else .1 if axis==2 else .08
   if code and code!=previous[axis]:
    buffer[axis]+=code*amount;repeat[axis]=now+delay;last_axis=axis
   elif code and (not last_key_only or axis==last_axis):
    while repeat[axis]<=now:
     buffer[axis]+=code*amount;repeat[axis]+=period*rng.uniform(.95,1.05)
   if last_key_only and axis!=last_axis:repeat[axis]=now+period
   buffer[axis]=max(-2.,min(2.,buffer[axis]));limit=((5 if running else 2) if axis<2 else 1.65 if axis==2 else 1.1)*dt
   row[axis+2]=max(-limit,min(limit,buffer[axis]));buffer[axis]-=row[axis+2]
  length=math.hypot(*row[2:4]);limit=(5 if running else 2)*dt
  if length>limit and length:
   row[2]*=limit/length;row[3]*=limit/length
  flags=(uints[i][1]&~255)
  for axis,(positive,negative) in enumerate(((1,2),(8,4),(32,16),(64,128))):flags|=positive if row[axis+2]>0 else negative if row[axis+2]<0 else 0
  projected.append(row);key=list(uints[i]);key[1]=flags;keys.append(key);previous=intent
 return extract(projected,keys,clocks)
