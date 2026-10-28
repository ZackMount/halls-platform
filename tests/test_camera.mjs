import {frameTimes} from '../web/replay/camera-transition.js';
import assert from 'node:assert/strict';
import {stepThirdPerson,sweepFraction,targetEmbedded} from '../web/replay/camera-rig.js';
const ceiling=2.65,step=(p,args)=>stepThirdPerson(p,{height:1.8,ceiling,dt:1/60,...args});
const safe=(r,wall)=>assert.ok(sweepFraction(r.position,r.position,wall,ceiling)>.999,'camera volume must remain outside walls');
const delta=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const focus={x:5,y:1.2,z:5},wall=(x,z)=>x===2&&z===1;
let rig=step(null,{focus,yaw:0,isWall:wall});
assert.ok(rig.distance>2.5,'a side solution preserves distance instead of pulling into the target');safe(rig,wall);
const first={...rig.position};rig=step(rig,{focus,yaw:0,isWall:()=>false});assert.ok(delta(first,rig.position)<=16/60+1e-8);
for(let i=0;i<240;i++)rig=step(rig,{focus,yaw:0,isWall:()=>false});
assert.ok(delta(rig.position,{x:5,y:1.8,z:1.8})<.01,'returns behind the target after the obstruction clears');
// Two-metre-wide L corridor: translate, turn, then move through the corner.
const corridor=(x,z)=>!((x===2&&z>=1&&z<=6)||(z===6&&x>=2&&x<=8));
let previous=null,minDistance=Infinity,maxStep=0,blocked=0,longest=0;
for(let i=0;i<420;i++){
 const t=i/60;const f=t<3?{x:5,y:1.2,z:3+t*3.2}:t<3.5?{x:5,y:1.2,z:12.6}:{x:5+(t-3.5)*3.2,y:1.2,z:12.6};
 const yaw=t<3?0:Math.min(Math.PI/2,(t-3)*Math.PI);
 rig=step(previous,{focus:f,yaw,isWall:corridor,allowNoclip:false});safe(rig,corridor);
 if(previous)maxStep=Math.max(maxStep,delta(previous.position,rig.position));
 assert.ok(rig.distance<5,'camera must not get stranded behind the corner');minDistance=Math.min(minDistance,rig.distance);blocked=sweepFraction(f,rig.position,corridor,ceiling)<.99?blocked+1:0;longest=Math.max(longest,blocked);previous=rig;
}
assert.ok(maxStep<=16/60+1e-8,'normal corners must not jump');assert.ok(minDistance>.5,'camera does not collapse into target');assert.ok(longest<90,'temporary occlusion resolves around the corner');
// Normal wall-adjacent bodies must not activate the noclip policy.
for(const clearance of [.22,.26,.3]){const r=step(null,{focus:{x:5,y:1.2,z:6-clearance},yaw:Math.PI,isWall:(x,z)=>x===2&&z===3});assert.ok(!r.noclip);safe(r,(x,z)=>x===2&&z===3);}
const crossingWall=(x,z)=>z===3;
let cross=null,last=null,entered=false,recovered=false;
for(let i=0;i<300;i++){
 const f={x:5,y:1.2,z:5+i*.04};cross=step(cross,{focus:f,yaw:0,isWall:crossingWall});
 if(f.z>=6&&f.z<=8){assert.equal(cross.noclip,true);entered=true;assert.ok(cross.distance>3);}
 if(f.z>8&&f.z<11.3)assert.equal(cross.noclip,true);
 if(last)assert.ok(delta(cross.position,last)<.15,'noclip entry and recovery must also remain continuous');
 if(entered&&!cross.noclip)recovered=true;last=cross.position;
}assert.ok(recovered);
const skin=step(null,{focus:{x:5,y:1.2,z:5.811},yaw:Math.PI,isWall:crossingWall});assert.equal(skin.noclip,true);
assert.equal(step(null,{focus:{x:5,y:1.45,z:5.75},yaw:Math.PI,targetRadius:.26,isWall:crossingWall}).noclip,true);
const interpolationOnly=step(null,{focus:skin.focus,yaw:Math.PI,isWall:crossingWall,allowNoclip:false});assert.ok(!interpolationOnly.noclip);safe(interpolationOnly,crossingWall);
assert.equal(step({...skin,noclip:false},{focus:skin.focus,yaw:Math.PI,isWall:crossingWall,allowNoclip:false}).noclip,true);
// Explicit cuts (seek/subject/mode change) reset lag and stay below a closed roof.
let high=step(null,{focus,yaw:0,height:8,cutaway:true,isWall:wall});high=step(high,{focus,yaw:0,height:8,cutaway:false,isWall:wall});assert.ok(high.position.y<=ceiling-.2);safe(high,wall);
for(const fps of [30,60,144]){let r=null;for(let i=0;i<fps*4;i++)r=stepThirdPerson(r,{focus:{x:5,y:1.2,z:5+i/fps},yaw:0,height:1.8,isWall:()=>false,dt:1/fps});assert.ok(Math.abs(r.distance-3.27)<.06);}
console.log('Distance-preserving side solutions, swept corner routes, bounded motion, recovery, FPS stability and noclip passed');

for(const speed of [.125,1,4,16])for(const fps of [30,60,144]){let r=null;for(let i=0;i<fps*4;i++){const replayDt=speed/fps;r=stepThirdPerson(r,{focus:{x:5,y:1.2,z:5+i*replayDt*4.6},yaw:0,height:1.8,isWall:()=>false,dt:replayDt});assert.ok(r.distance<4.1,`follow must keep up at ${speed}x / ${fps} FPS`);}}
for(const speed of [.5,4,16]){let r=null;for(let time=0;time<7;time+=speed/60){const focus=time<3?{x:5,y:1.2,z:3+time*3.2}:time<3.5?{x:5,y:1.2,z:12.6}:{x:5+(time-3.5)*3.2,y:1.2,z:12.6};r=stepThirdPerson(r,{focus,yaw:time<3?0:Math.min(Math.PI/2,(time-3)*Math.PI),height:1.8,isWall:corridor,allowNoclip:false,dt:speed/60});safe(r,corridor);assert.ok(r.distance<5.5,'fast replay must keep up around corners');}}

// Paused controls use wall time regardless of the selected playback multiplier.
const controlPoses=[];for(const rate of [.125,1,16]){let r=step(null,{focus,yaw:0,isWall:()=>false});for(let i=0;i<30;i++)r=stepThirdPerson(r,{focus,yaw:1.2,height:2.2,isWall:()=>false,dt:frameTimes(1/60,rate,false).camera});controlPoses.push({angle:r.angle,height:r.height,position:r.position});}for(const pose of controlPoses)assert.deepEqual(pose,controlPoses[0],'paused camera controls must evolve identically at every selected playback rate');

// Halving the drag response time reaches the previous half-second response in .25s.
let drag=step(null,{focus,yaw:0,isWall:()=>false});
for(let i=0;i<15;i++)drag=step(drag,{focus,yaw:1.2,height:2.2,isWall:()=>false});
assert.ok(Math.abs(drag.angle-1.2*(1-Math.exp(-10*.5)))<1e-10);
assert.ok(Math.abs(drag.height-(2.2-.4*Math.exp(-8*.5)))<1e-10);
console.log('Third-person drag rotation and height damping settle in half the previous time');
