import assert from 'node:assert/strict';
import {loopOpacity} from '../web/guide-media.js';
for(const duration of [6,6.25,7.2,30]){
 assert.equal(loopOpacity(0,duration),0);assert.equal(loopOpacity(duration,duration),0);assert.equal(loopOpacity(duration/2,duration),1);
 assert.equal(loopOpacity(.2,duration),.5);assert.ok(Math.abs(loopOpacity(duration-.2,duration)-.5)<1e-10);
 let last=0;for(let t=0;t<=.4;t+=.01){const a=loopOpacity(t,duration);assert.ok(a>=last&&a<=1);last=a;}
}
assert.equal(loopOpacity(0,NaN),1);console.log('Whole-picture fade endpoints, symmetry and easing passed');
