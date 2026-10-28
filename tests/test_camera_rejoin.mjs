import assert from 'node:assert/strict';
import {stepThirdPerson,sweepFraction} from '../web/replay/camera-rig.js';
import {frameTimes,followSteps} from '../web/replay/camera-transition.js';
// A full recording, including every intervening corner, must drive camera time.
const cells=new Set(),points=[];
for(let row=0;row<12;row++){
 const z=1+row*4,from=row%2?30:1,to=row%2?1:30;
 for(let x=1;x<=30;x++)cells.add(`${x},${z}`);
 if(!row)points.push({x:from*2+1,z:z*2+1});points.push({x:to*2+1,z:z*2+1});
 if(row<11){for(let next=z;next<=z+4;next++)cells.add(`${to},${next}`);points.push({x:to*2+1,z:(z+4)*2+1});}
}
const maze=(x,z)=>!cells.has(`${x},${z}`),segments=points.slice(1).map((p,i)=>({a:points[i],b:p,length:Math.hypot(p.x-points[i].x,p.z-points[i].z)})),total=segments.reduce((sum,s)=>sum+s.length,0);
function pose(meters){for(const s of segments){if(meters<=s.length)return {focus:{x:s.a.x+(s.b.x-s.a.x)*meters/s.length,y:1.2,z:s.a.z+(s.b.z-s.a.z)*meters/s.length},yaw:Math.atan2(s.b.x-s.a.x,s.b.z-s.a.z)};meters-=s.length;}const p=points.at(-1),a=points.at(-2);return {focus:{...p,y:1.2},yaw:Math.atan2(p.x-a.x,p.z-a.z)};}

const duration=total/4.6,recording=Float64Array.from({length:Math.ceil(duration*30)+1},(_,i)=>Math.min(duration,i/30));
for(const rate of [1,4,16,64])for(const fps of [3,30,60,144]){
 let time=0,maxLag=0,rig=stepThirdPerson(null,{...pose(0),height:1.8,isWall:maze,allowNoclip:false,dt:0});
 for(let frame=1;frame<=Math.ceil((duration/rate+1)*fps);frame++){
  const end=Math.min(duration,frame/fps*rate),wallDt=frameTimes(1/fps,rate,true).camera;
  for(const sample of followSteps(recording,time,end,wallDt)){
   rig=stepThirdPerson(rig,{...pose(sample.time*4.6),height:1.8,isWall:maze,allowNoclip:false,dt:sample.dt});
   maxLag=Math.max(maxLag,rig.distance);
   assert.ok(sweepFraction(rig.position,rig.position,maze,2.65)>.9999,'camera stays outside walls');
   assert.ok(!rig.rejoin,'normal playback never enters a delayed catch-up flight');
  }
  time=end;
 }
 assert.ok(maxLag<5.5,`continuous follow cannot get stranded: ${rate}x / ${fps} FPS, lag ${maxLag}`);
 assert.ok(rig.distance<3.4,`follow settles after repeated corners at ${rate}x / ${fps} FPS`);
}
console.log('Continuous recorded-path camera follow passed at 1–64x and 3–144 FPS, without timeout flights');
