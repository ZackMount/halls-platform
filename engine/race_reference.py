"""Clearance-safe feasible route. Grid and shortcut distances are upper bounds, not a global optimum."""
import heapq,math
from geometry import in_exit,exit_bounds

def segment_clear(world,a,b,radius=.22):
 # Intersect the centre segment against each wall expanded by player radius.
 for z in range(math.floor((min(a[1],b[1])-radius)/2),math.floor((max(a[1],b[1])+radius)/2)+1):
  for x in range(math.floor((min(a[0],b[0])-radius)/2),math.floor((max(a[0],b[0])+radius)/2)+1):
   if not world.wall(x,z):continue
   lo,hi=0.,1.
   for p,d,mn,mx in ((a[0],b[0]-a[0],x*2-radius,(x+1)*2+radius),(a[1],b[1]-a[1],z*2-radius,(z+1)*2+radius)):
    if abs(d)<1e-12:
     if p<mn or p>mx:lo,hi=1.,0.;break
    else:
     t,u=(mn-p)/d,(mx-p)/d;lo=max(lo,min(t,u));hi=min(hi,max(t,u))
   if lo<=hi:return False
 return True

def reference_route(world,start,exit_cell,speed=4.6,check=lambda:None):
 check()
 radius=.22;bounds=exit_bounds(exit_cell);x0,z0,x1,z1=bounds
 if not world.fits(*start,radius):return {'available':False,'reason':'invalid_start'}
 if in_exit(*start,exit_cell):return {'available':True,'distance':0.,'seconds':0.,'speed':speed,'path':[list(start)],'method':'clearance-grid-astar-v1'}
 q=(max(x0,min(x1-1e-4,start[0])),max(z0,min(z1-1e-4,start[1])))
 if world.fits(*q,radius) and segment_clear(world,start,q):
  distance=math.dist(start,q)
  return {'available':True,'distance':distance,'seconds':distance/speed,'speed':speed,'path':[list(start),list(q)],'method':'clearance-direct-v1','exactOptimality':start[0]<x1 and start[1]<z1,'optimality':'direct_euclidean_lower_bound' if start[0]<x1 and start[1]<z1 else 'feasible_upper_bound'}
 def center(n):return (n%256*2+1,n//256*2+1)
 def heuristic(p):return math.hypot(max(x0-p[0],0,p[0]-x1),max(z0-p[1],0,p[1]-z1))
 targets={};ex,ez=exit_cell
 for z in range(ez-1,ez+2):
  for x in range(ex-1,ex+2):
   if world.wall(x,z):continue
   p=(x*2+1,z*2+1);q=(max(x0+1e-4,min(x1-1e-4,p[0])),max(z0+1e-4,min(z1-1e-4,p[1])))
   if not world.fits(*q,radius):
    c=(ex*2+1,ez*2+1);lo,hi=0.,1.
    for _ in range(24):
     t=(lo+hi)/2;r=(q[0]+(c[0]-q[0])*t,q[1]+(c[1]-q[1])*t)
     if world.fits(*r,radius):hi=t
     else:lo=t
    q=(q[0]+(c[0]-q[0])*hi,q[1]+(c[1]-q[1])*hi)
   if segment_clear(world,p,q):targets[z*256+x]=(math.dist(p,q),q)
 sx,sz=(math.floor(v/2) for v in start);cost={};parent={};queue=[];goal=65536;goal_point=None
 for z in range(sz-1,sz+2):
  for x in range(sx-1,sx+2):
   if world.wall(x,z):continue
   n=z*256+x;p=center(n)
   if segment_clear(world,start,p):
    g=math.dist(start,p);cost[n]=g;parent[n]=-1;heapq.heappush(queue,(g+heuristic(p),g,n))
 steps=0
 while queue:
  _,g,n=heapq.heappop(queue)
  if g!=cost[n]:continue
  steps+=1
  if steps%256==0:check()
  if n==goal:
   path=[goal_point];node=parent[goal]
   while node!=-1:path.append(center(node));node=parent[node]
   path.append(tuple(start));path.reverse();path=[p for i,p in enumerate(path) if i==0 or p!=path[i-1]]
   # Linear-work string pulling with a bounded lookahead: never accept a shortcut
   # without checking the entire segment against radius-expanded wall boxes.
   smooth=[path[0]];anchor=0
   while anchor<len(path)-1:
    check();following=anchor+1
    for candidate in range(min(len(path)-1,anchor+32),anchor+1,-1):
     if segment_clear(world,path[anchor],path[candidate]):following=candidate;break
    smooth.append(path[following]);anchor=following
   distance=sum(math.dist(a,b) for a,b in zip(smooth,smooth[1:]))
   return {'available':True,'distance':round(distance,6),'seconds':round(distance/speed,6),'speed':speed,'path':smooth,'method':'clearance-shortcut-v2','exactOptimality':False,'optimality':'feasible_upper_bound','gridDistance':round(g,6),'shortcutSavingMeters':round(max(0.,g-distance),6),'assumptions':'No entities or turning delay. Every shortcut is clearance checked. This is a feasible upper bound, not the globally shortest continuous route; a faster legal route is not evidence of cheating.'}
  if n in targets:
   distance,p=targets[n];candidate=g+distance
   if candidate<cost.get(goal,math.inf):cost[goal]=candidate;parent[goal]=n;goal_point=p;heapq.heappush(queue,(candidate,candidate,goal))
  x,z=n%256,n//256
  for dx,dz in ((-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)):
   nx,nz=x+dx,z+dz
   if world.wall(nx,nz) or dx and dz and (world.wall(nx,z) or world.wall(x,nz)):continue
   other=nz*256+nx;candidate=g+(math.sqrt(8) if dx and dz else 2.)
   if candidate<cost.get(other,math.inf):cost[other]=candidate;parent[other]=n;heapq.heappush(queue,(candidate+heuristic(center(other)),candidate,other))
 return {'available':False,'reason':'unreachable'}
