"""Platform-neutral control statistics for the learned behavior detector.

No name, run ID, map seed, score, route optimum, OS label, or clock provenance
enters the vector. Durations use active wall seconds rather than frame counts.
Window groups are retained by training tools to prevent recording leakage.
"""
import math
from bisect import bisect_left
from collections import Counter
from statistics import mean,pstdev

SCHEMA='controls-2'
WINDOW_SECONDS=30.
ALL_FEATURES=(
 'movement_changes','look_changes','joint_changes','run_changes',
 'movement_entropy','joint_entropy','movement_hold_cv','movement_hold_p50','movement_hold_p90',
 'look_hold_cv','look_hold_p50','look_hold_p90','idle_hold_p50','idle_hold_p90',
 'movement_duration_entropy','look_duration_entropy','joint_duration_peak','duration_lag1',
 'movement_single_frame','look_single_frame','neutral_single_frame','frame_reversals','same_direction_resume',
 'code_trigram_reuse','timed_trigram_reuse','timed_quadgram_reuse',
 'turn_angle_p50','turn_angle_p90','turn_angle_grid','turn_duration_cv',
 'turn_profile_variation','turn_profile_reuse','move_look_overlap','look_rate_variation',
 'heading_error_p50','heading_error_p90','turn_endpoint_phase_x','turn_endpoint_phase_z',
 'forward_strafe_transitions','run_hold_cv','run_duration_peak','move_turn_lag_p50',
)
# Body-key style, heading/center-line preference and move/look overlap are
# nuisance variables. They must not become shortcuts for limited human labels.
EXCLUDED_STYLE_FEATURES={'movement_entropy','joint_entropy','heading_error_p50','heading_error_p90',
 'turn_endpoint_phase_x','turn_endpoint_phase_z','forward_strafe_transitions','move_look_overlap'}
FEATURES=tuple(name for name in ALL_FEATURES if name not in EXCLUDED_STYLE_FEATURES)

def quantile(values,q):
 if not values:return 0.
 a=sorted(values);k=(len(a)-1)*q;lo=int(k);return a[lo]+(a[min(lo+1,len(a)-1)]-a[lo])*(k-lo)
def cv(values):return pstdev(values)/max(mean(values),1e-9) if len(values)>1 else 0.
def entropy(values):
 counts=Counter(values);n=sum(counts.values())
 return -sum(c/n*math.log(c/n) for c in counts.values())/math.log(max(2,len(counts))) if n else 0.
def peak(values):return max(Counter(values).values(),default=0)/max(1,len(values))
def sign(v):return 1 if v>1e-5 else -1 if v<-1e-5 else 0
def phase(values):
 return math.hypot(sum(math.sin(math.pi*v) for v in values),sum(math.cos(math.pi*v) for v in values))/max(1,len(values))
def reuse(values,width):
 n=len(values)-width+1
 if n<=0:return 0.
 counts=Counter(tuple(values[i:i+width]) for i in range(n))
 return sum(c-1 for c in counts.values())/n
def lag1(values):
 if len(values)<4:return 0.
 a,b=values[:-1],values[1:];ma,mb=mean(a),mean(b)
 return sum((x-ma)*(y-mb) for x,y in zip(a,b))/max(1e-9,math.sqrt(sum((x-ma)**2 for x in a)*sum((y-mb)**2 for y in b)))

def summarize(samples):
 elapsed=sum(s['dt'] for s in samples);series={key:[] for key in ('move','look','joint','run')};profiles=[];endpoints=[];headings=[]
 for key in series:
  current=None
  for s in samples:
   code=s[key]
   if current is None or code!=current['code']:
    if current is not None:series[key].append(current)
    current={'code':code,'duration':0.,'frames':0,'start':s['time'],'angle':0.,'samples':[]}
   current['duration']+=s['dt'];current['frames']+=1;current['angle']+=abs(s['yaw']);current['samples'].append((current['duration'],current['angle']));current['end']=s
  # Incomplete window-edge actions are not completed holds or exact stops.
  if len(series[key])>1:series[key]=series[key][1:]
 move=series['move'];look=series['look'];joint=series['joint'];running=series['run']
 holds=[s['duration'] for s in move if s['code']!=(0,0)];looks=[s['duration'] for s in look if s['code']];idle=[s['duration'] for s in move if s['code']==(0,0)]
 angles=[];turn_times=[]
 for s in look:
  if not s['code'] or s['angle']<.15 or len(s['samples'])<4:continue
  angles.append(s['angle']);turn_times.append(s['duration']);endpoints.append(s['end'])
  profile=[];j=0;points=[(0.,0.)]+s['samples']
  for f in (.25,.5,.75):
   target=f*s['duration']
   while j+1<len(points)-1 and points[j+1][0]<target:j+=1
   t0,a0=points[j];t1,a1=points[j+1];profile.append((a0+(a1-a0)*(target-t0)/max(t1-t0,1e-9))/s['angle'])
  profiles.append(profile)
 for s in samples:
  if s['move']!=(0,0):headings.append(abs((s['heading']+math.pi/4)%(math.pi/2)-math.pi/4))
 variations=[min(math.sqrt(sum((x-y)**2 for x,y in zip(p,q))) for j,q in enumerate(profiles) if i!=j) for i,p in enumerate(profiles)] if 1<len(profiles)<=256 else []
 durations=[s['duration'] for s in joint];timed=[(s['code'],round(s['duration']/.02)) for s in joint]
 resumes=short=0
 for a,b,c in zip(move,move[1:],move[2:]):
  if a['code']!=(0,0) and b['code']==(0,0) and c['code']==a['code'] and b['duration']<=.15:
   short+=1;resumes+=b['frames']==1
 reversals=sum(a['frames']==b['frames']==1 and a['code']!=(0,0) and a['code']==tuple(-v for v in b['code']) for a,b in zip(move,move[1:]))
 look_starts=[s['start'] for s in look if s['code']];turn_lags=[]
 if look_starts:
  for s in move:
   if s['code']==(0,0):continue
   j=bisect_left(look_starts,s['start']);turn_lags.append(min(abs(s['start']-look_starts[k]) for k in {max(0,j-1),min(j,len(look_starts)-1)}))
 rates=[abs(s['yaw'])/max(s['dt'],1e-9) for s in samples if s['look']]
 minute=60/max(elapsed,1);nonzero=[s for s in move if s['code']!=(0,0)];nonlook=[s for s in look if s['code']]
 result=[
  len(move)*minute,len(look)*minute,len(joint)*minute,len(running)*minute,
  entropy([s['move'] for s in samples]),entropy([s['joint'] for s in samples]),cv(holds),quantile(holds,.5),quantile(holds,.9),
  cv(looks),quantile(looks,.5),quantile(looks,.9),quantile(idle,.5),quantile(idle,.9),
  entropy([round(v/.02) for v in holds]),entropy([round(v/.02) for v in looks]),peak([round(v/.02) for v in durations]),lag1(durations),
  sum(s['frames']==1 for s in nonzero)/max(1,len(nonzero)),sum(s['frames']==1 for s in nonlook)/max(1,len(nonlook)),
  sum(s['frames']==1 for s in move if s['code']==(0,0))/max(1,len(idle)),reversals/max(1,len(move)-1),resumes/max(1,short),
  reuse([s['code'] for s in joint],3),reuse(timed,3),reuse(timed,4),
  quantile(angles,.5),quantile(angles,.9),mean([math.exp(-(abs(a-round(a/(math.pi/2))*math.pi/2)/.02)**2) for a in angles]) if angles else 0.,cv(turn_times),
  mean(variations) if variations else 0.,sum(v<.005 for v in variations)/max(1,len(variations)),
  sum(s['dt'] for s in samples if s['move']!=(0,0) and s['look'])/max(elapsed,1e-9),cv(rates),
  quantile(headings,.5),quantile(headings,.9),phase([s['x'] for s in endpoints]),phase([s['z'] for s in endpoints]),
  sum(a['code'][0]*b['code'][1]!=a['code'][1]*b['code'][0] for a,b in zip(nonzero,nonzero[1:]))/max(1,len(nonzero)-1),
  cv([s['duration'] for s in running]),peak([round(s['duration']/.02) for s in running]),quantile(turn_lags,.5),
 ]
 assert len(result)==len(ALL_FEATURES)
 result=[value for name,value in zip(ALL_FEATURES,result) if name not in EXCLUDED_STYLE_FEATURES]
 return {'values':[round(max(-1e4,min(1e4,v)),9) for v in result],'seconds':elapsed,'events':len(move)+len(look),
         'positions':len({(int(s['x']//2),int(s['z']//2)) for s in samples}),'startSeconds':samples[0]['time'],'endSeconds':samples[-1]['time']+samples[-1]['dt']}

def extract(rows,uints,clocks=None,check=lambda:None):
 """Disjoint active-time windows, reusable for training and production."""
 windows=[];samples=[];elapsed=span=0.;before=rows[0] if len(rows) else None
 for i in range(1,len(rows)):
  if i%1024==0:check()
  row=rows[i];dt=max(0.,row[0]);valid=before[20]<=0 and row[20]<=0
  if clocks is not None:
   previous,current=clocks[i-1],clocks[i];dt=(current[0]-previous[0])/1e6
   valid=valid and previous[3]==current[3] and (current[0]-previous[0])-(current[4]-previous[4])<=1000000
  if not valid or not .001<=dt<=.2:
   if span>=20 and len(samples)>=100:windows.append(summarize(samples))
   samples=[];span=0.;before=row;continue
  move=tuple(sign(v) for v in row[2:4]);look=sign(row[4]);pitch=sign(row[5]);run=bool(uints[i][1]&256)
  heading=math.atan2(row[6]-before[6],row[8]-before[8])
  samples.append({'dt':dt,'time':elapsed,'move':move,'look':look,'joint':(*move,look,pitch,run),'run':run,
                  'yaw':row[4],'heading':heading,'x':row[6],'z':row[8]})
  elapsed+=dt;span+=dt;before=row
  if span>=WINDOW_SECONDS:
   windows.append(summarize(samples));samples=[];span=0.
 if span>=20 and len(samples)>=100:windows.append(summarize(samples))
 return windows


def eligible_windows(windows):
 # A held direction can traverse many cells without a key transition. Event
 # count is a feature, not an admission gate: sparse automation must be scored.
 return [w for w in windows if w['positions']>=3]
