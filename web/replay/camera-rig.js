// Collision-safe spring arm in game coordinates (positive Z), independent of Three.
const mix=(a,b,t)=>a+(b-a)*t;
const angle=a=>((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
export function sweepFraction(a,b,isWall,ceiling,radius=.18){
 let allowed=1;const length=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z);
 for(let z=Math.floor((Math.min(a.z,b.z)-radius)/2);z<=Math.floor((Math.max(a.z,b.z)+radius)/2);z++)for(let x=Math.floor((Math.min(a.x,b.x)-radius)/2);x<=Math.floor((Math.max(a.x,b.x)+radius)/2);x++){
  if(!isWall(x,z))continue;
  let lo=0,hi=1;
  for(const [start,delta,min,max] of [[a.x,b.x-a.x,x*2-radius,(x+1)*2+radius],[a.y,b.y-a.y,-radius,ceiling+radius],[a.z,b.z-a.z,z*2-radius,(z+1)*2+radius]]){
   if(Math.abs(delta)<1e-9){if(start<min||start>max){lo=1;hi=0;break;}}
   else{const t=(min-start)/delta,u=(max-start)/delta;lo=Math.max(lo,Math.min(t,u));hi=Math.min(hi,Math.max(t,u));}
  }
  if(lo<=hi)allowed=Math.min(allowed,Math.max(0,lo-.025/Math.max(length,1e-9)));
 }
 return allowed;
}
export function targetEmbedded(focus,isWall,ceiling,targetRadius=.22){
 return sweepFraction(focus,focus,isWall,ceiling,Math.max(.18,targetRadius-.003))<1;
}
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const blend=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t)});
const atAngle=(focus,yaw,height,distance=3.2)=>({x:focus.x-Math.sin(yaw)*distance,y:height,z:focus.z-Math.cos(yaw)*distance});
const clear=(a,b,isWall,ceiling)=>sweepFraction(a,b,isWall,ceiling)>.9999;

// Fixed-height distance-preserving candidates. Continuity cost and a retained
// side prevent alternating left/right solutions at nearly symmetric corners.
function resolveGoal(rig,focus,isWall,ceiling,dt){
 const ideal=atAngle(focus,rig.angle,rig.height),unblocked=clear(focus,ideal,isWall,ceiling);
 rig.freeTime=unblocked?(rig.freeTime||0)+dt:0;
 if(unblocked&&(rig.avoidAngle==null||rig.freeTime>.25)){rig.avoidAngle=null;return ideal;}
 const reference=rig.position||ideal,angles=[rig.angle];
 if(rig.avoidAngle!=null)angles.push(rig.avoidAngle);
 for(const degrees of [15,30,45,60,80,100,130,160,180])for(const sign of [-1,1])angles.push(rig.angle+degrees*sign*Math.PI/180);
 let best=null,bestCost=Infinity;
 for(const yaw of angles){
  const desired=atAngle(focus,yaw,rig.height),fraction=sweepFraction(focus,desired,isWall,ceiling),point=blend(focus,desired,fraction),distance=3.2*fraction;
  const switching=rig.avoidAngle==null?0:Math.abs(angle(yaw-rig.avoidAngle))*.25;
  const cost=length(point,ideal)**2*.22+length(point,reference)**2*.4+(3.2-distance)**2*4+switching;
  if(cost<bestCost){bestCost=cost;best=point;rig.nextAngle=yaw;}
 }
 rig.avoidAngle=rig.nextAngle;return best;
}

// Short local grid routes keep a smooth correction from cutting across a solid
// corner. The map is axis-aligned; cell centres have guaranteed camera clearance.
function nextWaypoint(start,goal,isWall,ceiling){
 if(clear(start,goal,isWall,ceiling))return goal;
 const cell=p=>[Math.floor(p.x/2),Math.floor(p.z/2)],a=cell(start),b=cell(goal),key=(x,z)=>x+','+z;
 if(isWall(...a)||isWall(...b))return goal;
 const queue=[a],parents=new Map([[key(...a),null]]);let found=false;
 for(let i=0;i<queue.length&&i<100;i++){
  const [x,z]=queue[i];if(x===b[0]&&z===b[1]){found=true;break;}
  for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=key(nx,nz);
   if(Math.abs(nx-a[0])>5||Math.abs(nz-a[1])>5||isWall(nx,nz)||parents.has(k))continue;
   parents.set(k,[x,z]);queue.push([nx,nz]);
  }
 }
 if(!found)return goal;
 const points=[goal];for(let c=b;c;c=parents.get(key(...c)))points.push({x:c[0]*2+1,y:goal.y,z:c[1]*2+1});
 for(const point of points)if(clear(start,point,isWall,ceiling))return point;
 return goal;
}
function moveSafe(start,end,isWall,ceiling){
 const contact=blend(start,end,sweepFraction(start,end,isWall,ceiling));
 let best=contact;
 for(const axes of [['x','z','y'],['z','x','y']]){
  let p={...contact};for(const axis of axes){const q={...p,[axis]:end[axis]};p=blend(p,q,sweepFraction(p,q,isWall,ceiling));}
  if(length(p,end)<length(best,end))best=p;
 }
 return best;
}

function safeAnchor(focus,isWall){
 let best=focus,cost=Infinity;const x=Math.floor(focus.x/2),z=Math.floor(focus.z/2);
 for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
  const cx=x+dx,cz=z+dz;if(isWall(cx,cz))continue;
  const p={x:Math.max(cx*2+.22,Math.min(cx*2+1.78,focus.x)),y:focus.y,z:Math.max(cz*2+.22,Math.min(cz*2+1.78,focus.z))},d=length(p,focus);
  if(d<cost){cost=d;best=p;}
 }return best;
}

function stepCamera(previous,{focus,yaw,height,ceiling=2.65,cutaway=false,targetRadius=.22,allowNoclip=true,isWall,dt}){
 dt=Math.max(0,Math.min(.1,dt));height=Math.max(.4,Math.min(cutaway?12:ceiling-.2,height));
 // The caller resets seeks/subjects. Large continuous replay steps are not cuts.
 const cut=!previous||previous.cutaway!==cutaway;
 const rig=cut?{angle:yaw,height,distance:3.2,freeTime:0}:{...previous};
 if(!cut){rig.angle+=angle(yaw-rig.angle)*(1-Math.exp(-20*dt));rig.height=mix(rig.height,height,1-Math.exp(-16*dt));}
 if(!cutaway)rig.height=Math.min(rig.height,ceiling-.2);
 const desired=atAngle(focus,rig.angle,rig.height),embedded=targetEmbedded(focus,isWall,ceiling,targetRadius);
 if(embedded&&allowNoclip)rig.penetrationSeen=true;
 if(embedded&&rig.penetrationSeen){rig.noclip=true;rig.noclipClearTime=0;}
 if(rig.noclip){
  const safe=!embedded&&clear(focus,desired,isWall,ceiling)&&(!rig.position||clear(rig.position,rig.position,isWall,ceiling));
  rig.noclipClearTime=safe?(rig.noclipClearTime||0)+dt:0;
  if(rig.noclipClearTime>=.2){rig.noclip=false;rig.freeTime=0;rig.avoidAngle=null;}
 }
 const anchor=embedded?(rig.anchor||safeAnchor(focus,isWall)):focus;if(!embedded)rig.anchor={...focus};
 const goal=rig.noclip?desired:resolveGoal(rig,anchor,isWall,ceiling,dt);
  if(rig.noclip){
   const carried=cut?desired:{x:rig.position.x+focus.x-previous.focus.x,y:rig.position.y+focus.y-previous.focus.y,z:rig.position.z+focus.z-previous.focus.z};
   const delta=length(carried,desired);rig.position=blend(carried,desired,cut?1:Math.min(1-Math.exp(-16*dt),4.8*dt/Math.max(delta,1e-9)));
  }else if(cut||!clear(rig.position,rig.position,isWall,ceiling))rig.position=goal;
  else{
   const translation=length(focus,previous.focus),extra=Math.max(0,translation-5*dt),weight=extra/Math.max(translation,1e-9);
   const carried={x:rig.position.x+(focus.x-previous.focus.x)*weight,y:rig.position.y+(focus.y-previous.focus.y)*weight,z:rig.position.z+(focus.z-previous.focus.z)*weight};
   if(clear(rig.position,carried,isWall,ceiling))rig.position=carried;
   else{
    const follow=nextWaypoint(rig.position,goal,isWall,ceiling),distance=length(rig.position,follow);
    rig.position=moveSafe(rig.position,blend(rig.position,follow,Math.min(1,extra/Math.max(distance,1e-9))),isWall,ceiling);
   }
   const waypoint=nextWaypoint(rig.position,goal,isWall,ceiling),distance=length(rig.position,waypoint),rate=rig.avoidAngle==null?14:28;
   rig.position=moveSafe(rig.position,blend(rig.position,waypoint,Math.min(1-Math.exp(-rate*dt),16*dt/Math.max(distance,1e-9))),isWall,ceiling);
  }
 rig.distance=Math.hypot(rig.position.x-focus.x,rig.position.z-focus.z);rig.focus={...focus};rig.cutaway=cutaway;return rig;
}

// Follow each recorded pose, substepping sparse frames without a timeout flight.
export function stepThirdPerson(previous,options){
 const dt=Math.max(0,Math.min(1,Number.isFinite(options.dt)?options.dt:0));
 // Teleports have no traversable path from the old room. Resolve a fresh,
 // collision-safe arm at the recorded destination instead of routing there.
 if(!previous||options.cut)return stepCamera(null,{...options,dt});
 const steps=Math.max(1,Math.ceil(dt*60)),from=previous.focus;let rig=previous;
 for(let i=1;i<=steps;i++)rig=stepCamera(rig,{...options,focus:blend(from,options.focus,i/steps),dt:dt/steps});
 return rig;
}
