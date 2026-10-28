import assert from 'node:assert/strict';import {touchShape,touchChange,pinchMap} from '../web/replay/touch-controls.js';
const one=touchShape([{x:80,y:100}]),moved=touchShape([{x:110,y:120}]);assert.deepEqual(touchChange(one,moved),{dx:30,dy:20,ratio:1,multi:false});assert.equal(touchChange(one,touchShape([{x:80,y:100},{x:120,y:100}])),null);
const a=touchShape([{x:60,y:100},{x:140,y:100}]),b=touchShape([{x:40,y:110},{x:200,y:110}]);const before={zoom:1,pan:[10,-5]},next=pinchMap(before,a,b,360,300);assert.equal(next.zoom,2);
const world=(p,v)=>({x:(p.x-180-v.pan[0])/v.zoom,y:(p.y-150-v.pan[1])/v.zoom});assert.deepEqual(world(a,before),world(b,next),'pinch stays anchored beneath the moving midpoint');
assert.deepEqual(pinchMap(before,one,moved,360,300),{zoom:1,pan:[40,15]});assert.equal(touchShape([]),null);
console.log('Touch pan, two-finger midpoint zoom and pointer-count transitions passed');
