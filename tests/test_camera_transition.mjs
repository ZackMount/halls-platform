import assert from 'node:assert/strict';import {flightEase,flightDuration,frameTimes,followSteps} from '../web/replay/camera-transition.js';
assert.equal(flightEase(-1),0);assert.equal(flightEase(2),1);assert.equal(flightEase(.5),.5);
let previous=0;for(let n=0;n<=100;n++){const t=n/100,v=flightEase(t);assert.ok(v>=previous);assert.ok(Math.abs(v+flightEase(1-t)-1)<1e-12);previous=v;}
assert.ok(flightEase(.01)<.00002);assert.ok(1-flightEase(.99)<.00002);
assert.ok(flightDuration(2)<flightDuration(200));assert.ok(flightDuration(200)<flightDuration(700));assert.equal(flightDuration(0),325);assert.equal(flightDuration(1e9),900);
console.log('Camera flight ease, smooth endpoints, symmetry and bounded distance-dependent durations passed');

for(const rate of [.125,.5,1,4,16]){assert.deepEqual(frameTimes(.02,rate,true),{camera:.02,playback:.02*rate});assert.deepEqual(frameTimes(.02,rate,false),{camera:.02,playback:0});}
assert.equal(frameTimes(5,16,true).camera,.1);

// Fast rendering must retain the intervening recording ticks and their clock.
const ticks=Float64Array.from([0,.1,.2,.3,.4]);
const fast=followSteps(ticks,.05,.35,.02);assert.deepEqual(fast.map(s=>[s.index,s.time]),[[1,.1],[2,.2],[3,.3],[3,.35]]);assert.ok(Math.abs(fast.reduce((sum,s)=>sum+s.dt,0)-.3)<1e-12);
assert.deepEqual(followSteps(ticks,.2,.2,.02),[{index:2,time:.2,dt:.02}]);
const slow=followSteps(ticks,0,.001,.02);assert.equal(slow.length,1);assert.equal(slow[0].dt,.02,'slow playback does not make dragging sluggish');
const hidden=t=>Math.min(t,.1)+Math.max(0,t-.3),steps=followSteps(ticks,0,.4,.02,hidden);
assert.ok(Math.abs(steps.reduce((sum,s)=>sum+s.dt,0)-.2)<1e-12,'skipped recorded pauses do not accelerate camera recovery');
assert.ok(steps.every(s=>s.dt>0));
console.log('Recorded ticks, partial frames, paused controls and hidden-pause camera time passed');
