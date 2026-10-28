"""Bounded, private shadow observations; never an authenticity test or a penalty.

We deliberately overestimate perception (omnidirectional sight, no darkness, silent
entities within audio range, permanent recall). Sampling and prior map knowledge
still prevent any conclusion about what the player actually knew.
"""
import math

DIRECTIONS=((1,0),(-1,0),(0,1),(0,-1))
MAX_SAMPLES=12000
MAX_RAYS=120000
MAX_EVENTS=128
class BudgetExceeded(Exception):pass

def sight(world,a,b):
 """Supercover grid traversal: touching either wall at a corner occludes sight."""
 x,z=(math.floor(v/2) for v in a);ex,ez=(math.floor(v/2) for v in b)
 if world.wall(x,z) or world.wall(ex,ez):return False
 dx,dz=b[0]-a[0],b[1]-a[1];sx=1 if dx>0 else -1;sz=1 if dz>0 else -1
 tx=((x+(dx>0))*2-a[0])/dx if dx else math.inf
 tz=((z+(dz>0))*2-a[1])/dz if dz else math.inf
 stepx=2/abs(dx) if dx else math.inf;stepz=2/abs(dz) if dz else math.inf
 for _ in range(513):
  if (x,z)==(ex,ez):return True
  if abs(tx-tz)<1e-10:
   if world.wall(x+sx,z) or world.wall(x,z+sz):return False
   x+=sx;z+=sz;tx+=stepx;tz+=stepz
  elif tx<tz:x+=sx;tx+=stepx
  else:z+=sz;tz+=stepz
  if world.wall(x,z):return False
 return False

def information_audit(world,rows,exit_cell,distances,check=lambda:None):
 result={'version':'information-shadow-1','mode':'shadow','affectsScore':False,'affectsVerdict':False,'status':'observations_only','coverage':{},'junctions':{'considered':0,'unexplainedChoices':0,'exitImprovingChoices':0},'entities':{'earlyAvoidanceTurns':0},'evidence':[],
  'limitations':['这些是待复核的行为重合，不是作弊概率或判定。','视野按全方向、忽略黑暗处理；实体听觉范围保守取 32 米，并永久保留已感知信息。','采样可能遗漏短暂视听线索；曾玩过同一种子、记路、路线习惯和运气均可解释结果。','没有有效线索不证明未使用雷达；故意绕路可规避这种分析。']}
 if len(rows)<3:result['status']='insufficient';return result
 total=sum(max(0,rows[i][0]) for i in range(1,len(rows)))
 interval=max(.25,total/(MAX_SAMPLES-1));samples=[];elapsed=0.;next_sample=0.
 # Preserve tick identifiers; avoid retaining full state records a second time.
 for tick in range(len(rows)):
  if tick%1024==0:check()
  row=rows[tick];elapsed+=max(0,row[0]) if tick else 0
  if elapsed+1e-9>=next_sample or tick==len(rows)-1:
   samples.append((tick,elapsed,(row[6],row[8]),tuple((row[24+e*12],row[25+e*12]) for e in range((len(row)-24)//12))))
   next_sample=elapsed+interval
 rays=0;history=[];seen_entities=set();processed=set();last_event=-math.inf;events=0;previous_cell=None;incoming=None;pending=None
 def visible(a,b):
  nonlocal rays
  if math.dist(a,b)>96:return False
  rays+=1
  if rays>MAX_RAYS:raise BudgetExceeded
  return sight(world,a,b)
 def known(point):return any(visible(position,point) for position in reversed(history))
 def neighbors(c):return [(c[0]+dx,c[1]+dz) for dx,dz in DIRECTIONS if not world.wall(c[0]+dx,c[1]+dz)]
 def probe(origin,arm):
  prev=origin;current=arm
  for _ in range(16):
   options=[c for c in neighbors(current) if c!=prev]
   if len(options)!=1:break
   prev,current=current,options[0]
  return (current[0]*2+1,current[1]*2+1)
 def distance(c):return distances[c[1]*256+c[0]] if 0<=c[0]<256 and 0<=c[1]<256 else -1
 def evidence(item):
  if len(result['evidence'])<16:result['evidence'].append(item)
 try:
  for i,(tick,seconds,position,entities) in enumerate(samples):
   if i%64==0:check()
   for entity,point in enumerate(entities):
    if entity not in seen_entities and (math.dist(position,point)<=32 or visible(position,point)):seen_entities.add(entity)
   current=tuple(math.floor(v/2) for v in position)
   if pending and current!=pending['cell']:
    chosen=current;arms=pending['arms']
    if chosen in arms:
     result['junctions']['unexplainedChoices']+=1
     improving=distance(chosen)>=0 and distance(chosen)<distance(pending['cell'])
     result['junctions']['exitImprovingChoices']+=improving
     evidence({'kind':'unexplained_junction_choice','tick':tick,'seconds':round(seconds,3),'cell':list(pending['cell']),'chosen':list(chosen),'arms':list(map(list,arms)),'exitImproving':improving,'meaning':'出口与各分支远端未被此前采样视线解释；只记录是否向出口推进。'})
     events+=1;last_event=seconds
    pending=None
   if current!=previous_cell:
    # Only first visits to separated, corridor-like junctions. Skip open halls,
    # the known incoming arm, tied route costs and visible/remembered outcomes.
    incoming=previous_cell if previous_cell and sum(abs(a-b) for a,b in zip(current,previous_cell))==1 else None
    adjacent=neighbors(current)
    if incoming in adjacent and len(adjacent)==3 and current not in processed and seconds-last_event>=3:
     processed.add(current);arms=[c for c in adjacent if c!=incoming];result['junctions']['considered']+=1
     costs=[distance(c) for c in arms]
     if len(set(costs))>1 and all(c>=0 for c in costs) and not known((exit_cell[0]*2+1,exit_cell[1]*2+1)):
      if all(not known(probe(current,arm)) and not visible(position,probe(current,arm)) for arm in arms):pending={'cell':current,'arms':arms}
    previous_cell=current
   # A distant hidden entity coinciding with a large route change is only an
   # observation. Require approach followed by retreat; exclude all heard/seen
   # entities, including recall from much earlier in this run.
   if 3<=i<len(samples)-6 and seconds-last_event>=3:
    before=samples[i-3];after=samples[i+6];a=before[2];b=after[2]
    u=(position[0]-a[0],position[1]-a[1]);v=(b[0]-position[0],b[1]-position[1]);lu=math.hypot(*u);lv=math.hypot(*v)
    if lu>.5 and lv>.5 and sum(x*y for x,y in zip(u,v))/(lu*lv)<.3:
     for entity,point in enumerate(entities):
      if entity in seen_entities or not 32<math.dist(position,point)<48:continue
      vector=(point[0]-position[0],point[1]-position[1]);length=math.hypot(*vector)
      if sum(x*y for x,y in zip(u,vector))/(lu*length)>.5 and sum(x*y for x,y in zip(v,vector))<0 and math.dist(b,point)>length+1:
       result['entities']['earlyAvoidanceTurns']+=1;events+=1;last_event=seconds
       evidence({'kind':'hidden_entity_turn_coincidence','tick':tick,'seconds':round(seconds,3),'entity':entity,'distance':round(length,2),'meaning':'向隐藏且未曾在采样中感知的实体接近后转离；不能证明转向由该实体引起。'})
       if events>=MAX_EVENTS:break
   history.append(position)
   if events>=MAX_EVENTS:result['status']='partial';break
 except BudgetExceeded:result['status']='partial'
 result['evidenceOmitted']=max(0,events-len(result['evidence']))
 result['coverage']={'sampledPositions':len(history),'availableSamples':len(samples),'intervalSeconds':round(interval,6),'visibilityRays':min(rays,MAX_RAYS),'maxVisibilityRays':MAX_RAYS,'maxEvents':MAX_EVENTS,'complete':len(history)==len(samples)}
 return result
