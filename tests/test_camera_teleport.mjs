import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stepThirdPerson,sweepFraction,targetEmbedded} from '../web/replay/camera-rig.js';
import {poseDiscontinuous,followSteps} from '../web/replay/camera-transition.js';
import {decodeInitial} from '../web/replay/visual-codec.js';
import {PauseTimeline} from '../web/replay/pause-timeline.js';

const ceiling=2.65,focus=(x,z)=>({x,y:1.2,z}),wall=(x,z)=>x===5;
const options={height:1.8,ceiling,yaw:0,isWall:wall,allowNoclip:false,dt:1/60};
const start=focus(5,5),destination=focus(15,5);
const before=stepThirdPerson(null,{...options,focus:start});
const trapped=stepThirdPerson(before,{...options,focus:destination});
assert.ok(trapped.distance>5,'fixture must exercise rooms separated by a wall');
const relocated=stepThirdPerson(before,{...options,focus:destination,cut:true});
assert.ok(relocated.distance<=3.21,'a teleport reacquires its target immediately');
assert.ok(sweepFraction(relocated.position,relocated.position,wall,ceiling)>.9999,'destination camera has wall clearance');
assert.ok(sweepFraction(destination,relocated.position,wall,ceiling)>.9999,'destination camera sees the target');
assert.ok(relocated.position.x>12,'camera must be in the destination room');
assert.equal(relocated.noclip,undefined,'a floor-to-floor teleport must not enable permanent noclip');
let settled=relocated;for(let i=0;i<120;i++)settled=stepThirdPerson(settled,{...options,focus:destination});
assert.ok(settled.distance<=3.21,'remaining stationary after teleport does not return to the old room');

for(const dt of [1/120,1/60,1/12,.5,2])for(const speed of [2,5,6.5,12])assert.equal(poseDiscontinuous(focus(5,5),focus(5+speed*dt,5),dt),false,'ordinary recording movement is continuous');
assert.equal(poseDiscontinuous(start,destination,1/12),true);
assert.equal(poseDiscontinuous(start,focus(105,5),.1),true);

// Tick-based cut decisions are identical at every playback rate, even when a
// render frame crosses multiple teleports or no render happens between them.
const times=Float64Array.from([0,.1,.2,.3,.4,.5]),poses=[start,start,destination,destination,focus(5,25),focus(5,25)];
for(const rate of [.125,1,4,16,64])for(const fps of [3,30,144]){
 let time=0,index=0,cuts=0,rig=stepThirdPerson(null,{...options,focus:start});
 for(let frame=1;time<times.at(-1);frame++){
  const end=Math.min(times.at(-1),frame*rate/fps);
  for(const sample of followSteps(times,time,end,1/fps)){
   let cut=false;
   for(let i=index;i<sample.index;i++)if(poseDiscontinuous(poses[i],poses[i+1],times[i+1]-times[i]))cut=true;
   cuts+=Number(cut);index=sample.index;
   rig=stepThirdPerson(rig,{...options,focus:poses[index],dt:sample.dt,cut});
   assert.ok(rig.distance<=3.21,`target stays acquired at ${rate}x / ${fps} FPS`);
   assert.ok(sweepFraction(rig.position,rig.position,wall,ceiling)>.9999);
  }
  time=end;
 }
 assert.equal(cuts,2,`all recorded jumps are visited at ${rate}x / ${fps} FPS`);
}
console.log('Teleport cuts, destination clearance, stationary recovery and playback-rate independence passed');

// A long pause cannot turn a teleport into plausible continuous movement. This
// decision always uses active record time, even when paused time stays visible.
const pause=new PauseTimeline(1800.3,[[.1,1800.1]]),pauseTimes=Float64Array.from([0,.1,1800.1,1800.2,1800.3]);
const active=t=>pause.display(t,true),pausedPoses=[start,start,destination,destination,destination];
assert.equal(poseDiscontinuous(start,destination,pauseTimes[2]-pauseTimes[1]),false,'wall time alone misses the paused teleport');
assert.equal(poseDiscontinuous(start,destination,active(pauseTimes[2])-active(pauseTimes[1])),true);
assert.equal(poseDiscontinuous(start,focus(5.5,5),active(1800.2)-active(.1)),false,'ordinary travel after a long pause remains continuous');
assert.equal(poseDiscontinuous(start,focus(17,5),new PauseTimeline(2).display(2,true)),false,'a genuinely sparse active interval retains its travel allowance');
for(const hidden of [false,true]){
 let index=0,cuts=0,rig=stepThirdPerson(null,{...options,focus:start});
 for(const sample of followSteps(pauseTimes,0,1800.3,.1,t=>pause.display(t,hidden))){
  let cut=false;for(let i=index;i<sample.index;i++)if(poseDiscontinuous(pausedPoses[i],pausedPoses[i+1],active(pauseTimes[i+1])-active(pauseTimes[i])))cut=true;
  cuts+=Number(cut);index=sample.index;rig=stepThirdPerson(rig,{...options,focus:pausedPoses[index],dt:sample.dt,cut});
  assert.ok(rig.distance<=3.21,'camera follows across visible or skipped pauses');
 }
 assert.equal(cuts,1,'a jump at the exact skipped-pause boundary is not lost');
}
console.log('Paused teleports, skipped-pause boundaries and sparse continuous records passed');

// Optional local regression against a public HVI packet; never commit player
// replay data. Example: node tests/test_camera_teleport.mjs /path/to/case.hvi
if(process.argv[2]){
 const {meta,first}=decodeInitial(readFileSync(process.argv[2])),frames=new Float32Array(first.buffer,first.byteOffset,first.length);
 assert.equal(meta.chunks,1,'local case runner expects its complete first chunk');
 const cell=(x,z)=>x<0||z<0||x>=256||z>=256||!!(meta.bitmap[(z*256+x)>>3]&(1<<((z*256+x)&7)));
 const positions=Array.from(meta.times,(_,i)=>focus(frames[i*meta.words+6],frames[i*meta.words+8]));
 const timeline=new PauseTimeline(meta.duration,meta.idleRanges);
 let rig=null,cuts=[];
 for(let i=0;i<meta.samples;i++){
  const dt=i?meta.times[i]-meta.times[i-1]:0,activeDt=i?timeline.display(meta.times[i],true)-timeline.display(meta.times[i-1],true):0,cut=i>0&&poseDiscontinuous(positions[i-1],positions[i],activeDt);
  const embedded=targetEmbedded(positions[i],cell,meta.ceiling);
  rig=stepThirdPerson(rig,{...options,isWall:cell,ceiling:meta.ceiling,focus:positions[i],yaw:frames[i*meta.words+9],allowNoclip:embedded,dt,cut});
  if(cut){cuts.push(meta.times[i]);assert.ok(rig.distance<=3.21,'real teleport must reacquire immediately');if(embedded)assert.equal(rig.noclip,true);else assert.ok(sweepFraction(rig.position,rig.position,cell,meta.ceiling)>.9999);}
 }
 assert.ok(cuts.length>0,'case must contain a teleport');console.log(JSON.stringify({realCaseSamples:meta.samples,teleportTimes:cuts,finalCameraDistance:rig.distance}));
}
