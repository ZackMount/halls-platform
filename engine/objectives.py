"""Deterministic 1.0 objectives, independently recovered from verified gameplay."""
import math
from collections import deque

VERSION='coins-1'
COIN_COUNT=3
CHASE_SECONDS=3.
ESCAPE_SECONDS=5.
CLOSE_CHASE_METERS=12.
CHASE_TRAVEL_METERS=6.
MASK=(1<<64)-1


COIN_GENERATION_CHECKS=frozenset(('map','spawn','exit'))
COIN_PICKUP_CHECKS=frozenset(('map','spawn','exit','route','input','player_model','player_speed','clock','speed_control','combat','completion','coin_generation'))
COIN_AWARD_CHECKS=COIN_PICKUP_CHECKS|{'coin_pickup'}


def prerequisite_states(rules,required):
 """Non-passing or absent prerequisites; a duplicate pass cannot hide a failure."""
 seen={}
 for rule in rules:
  key=rule.get('id');status=rule.get('status','missing')
  if key not in seen or status=='fail' or seen[key]=='pass':seen[key]=status
 return {key:seen.get(key,'missing') for key in sorted(required) if seen.get(key)!='pass'}


def current_coin_engine(engine,build=0x01000000):
 return (isinstance(engine,dict) and engine.get('build') in ('0x01000000','0x01000001')
         and isinstance(engine.get('supportedBuilds'),(list,tuple)) and f'0x{build:08x}' in engine['supportedBuilds']
         and isinstance(engine.get('file'),str) and engine['file'].startswith('judge-current-'))


def coin_award_blockers(report):
 blocked=prerequisite_states(report.get('rules',[]),COIN_AWARD_CHECKS)
 build={'1.0.0':0x01000000,'1.0.1':0x01000001}.get(report.get('proof',{}).get('version'))
 if build is None:blocked.setdefault('coin_generation','unsupported_build')
 if build is None or not current_coin_engine(report.get('engine'),build):blocked.setdefault('coin_generation','model_unavailable')
 return blocked


def tie_hash(seed,index):
 value=(int(seed)^((index*0x9e3779b97f4a7c15)&MASK))&MASK
 value=((value^(value>>30))*0xbf58476d1ce4e5b9)&MASK
 value=((value^(value>>27))*0x94d049bb133111eb)&MASK
 return value^(value>>31)


def distances(world,start,check=lambda:None):
 width=getattr(world,'width',256);height=getattr(world,'height',256)
 result=[-1]*(width*height)
 x,z=start
 if not 0<=x<width or not 0<=z<height or world.wall(x,z):return result
 index=z*width+x;result[index]=0;queue=deque([index]);steps=0
 while queue:
  current=queue.popleft();x,z=current%width,current//width;steps+=1
  if steps%2048==0:check()
  for dx,dz in ((0,-1),(1,0),(0,1),(-1,0)):
   nx,nz=x+dx,z+dz
   if not 0<=nx<width or not 0<=nz<height or world.wall(nx,nz):continue
   other=nz*width+nx
   if result[other]<0:result[other]=result[current]+1;queue.append(other)
 return result


def coin_cells(world,seed,spawn,exit_cell,check=lambda:None):
 """Matches src/coins.rs using integer-only scores and wrapping u64 hashes."""
 width=getattr(world,'width',256)
 ds=distances(world,spawn,check);de=distances(world,exit_cell,check)
 exit_index=exit_cell[1]*width+exit_cell[0]
 if not 0<=exit_index<len(ds) or ds[exit_index]<0:return []
 direct=ds[exit_index];candidates=[]
 for minimum in (8,2,1):
  candidates=[i for i,(a,b) in enumerate(zip(ds,de)) if a>=minimum and b>=minimum]
  if len(candidates)>=COIN_COUNT:break
 if not candidates:return []
 first=min(candidates,key=lambda i:(abs(3*ds[i]-direct)+4*(ds[i]+de[i]-direct),tie_hash(seed,i),i))
 selected=[first];separation=[min(a,b) for a,b in zip(ds,de)]
 while len(selected)<min(COIN_COUNT,len(candidates)):
  last=selected[-1];away=distances(world,(last%width,last//width),check)
  separation=[min(a,b) for a,b in zip(separation,away)]
  chosen=min((i for i in candidates if i not in selected),key=lambda i:(-separation[i],-(ds[i]+de[i]-direct),tie_hash(seed,i),i))
  selected.append(chosen)
 return [[i%width,i//width] for i in selected]


def collect_coins(rows,cells,tile=2.,clocks=None,check=lambda:None):
 remaining={tuple(cell):i for i,cell in enumerate(cells)};pickups=[];elapsed=0.
 for tick,row in enumerate(rows):
  if tick%2048==0:check()
  elapsed=clocks[tick][0]/1e6 if clocks is not None else elapsed+max(0.,row[0])
  cell=(math.floor(row[6]/tile),math.floor(row[8]/tile))
  if row[19]>0 and cell in remaining:
   pickups.append({'id':remaining.pop(cell),'tick':tick,'time':round(elapsed,6)})
   if not remaining:break
 return pickups


def tactical_metrics(rows,expected,uints,offsets,hit_ticks,check=lambda:None):
 """Reward clean escapes from distinct real pursuers, never time spent farming hate."""
 offsets=list(offsets);episodes=[None]*len(offsets);earned=set();events=[]
 effective_chase=False;elapsed=0.;previous=None
 for tick,(row,model,states) in enumerate(zip(rows,expected,uints)):
  if tick%2048==0:check()
  dt=max(0.,row[0]);elapsed+=dt
  if previous is None:previous=row;continue
  moved=math.hypot(row[6]-previous[6],row[8]-previous[8]);previous=row
  chasing=[states[offset+11]==2 for offset in offsets]
  hit=tick in hit_ticks
  for entity,offset in enumerate(offsets):
   episode=episodes[entity]
   if chasing[entity]:
    if episode is None:episode={'chase':0.,'travel':0.,'near':False,'safe':0.,'hit':False,'qualified':False,'active':False}
    # Continuous chase is required; an interrupted short encounter cannot be
    # accumulated into a reward by repeatedly toggling the same pursuer.
    if not episode['active']:episode['chase']=0.;episode['travel']=0.;episode['near']=False
    episode['chase']+=dt;episode['travel']+=moved;episode['safe']=0.;episode['active']=True
    episode['near']|=math.hypot(model[offset]-row[6],model[offset+1]-row[8])<=CLOSE_CHASE_METERS
    episode['hit']|=hit
    if episode['chase']+1e-6>=CHASE_SECONDS:
     effective_chase=True
     episode['qualified']|=episode['near'] and episode['travel']+1e-6>=CHASE_TRAVEL_METERS
    episodes[entity]=episode
   elif episode is not None:
    episode['active']=False
    episode['hit']|=hit
    episode['safe']=0. if any(chasing) else episode['safe']+dt
    if episode['safe']+1e-6>=ESCAPE_SECONDS:
     if episode['qualified'] and not episode['hit'] and entity not in earned:
      earned.add(entity);events.append({'entity':entity+1,'tick':tick,'time':round(elapsed,6)})
     episodes[entity]=None
  # Continue through the entire record even after two rewards: a later chase or
  # injury must still disable the alternative clean-stealth outcome.
 clean=not hit_ticks and all(row[19]>=99.999 for row in rows)
 stealth=clean and not effective_chase
 escape_count=min(2,len(earned));factor=max(1. if stealth else 0.,escape_count/2)
 return {'available':True,'factor':factor,'stealth':stealth,'effectiveChase':effective_chase,'distinctEscapes':escape_count,'escapes':events[:2],'method':'verified-distinct-escapes-1'}
