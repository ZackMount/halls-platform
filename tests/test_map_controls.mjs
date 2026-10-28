import assert from 'node:assert/strict';
import {zoomMapAt} from '../web/replay/map-controls.js';
const w=800,h=600;
const world=(p,v)=>[(p.x-w/2-v.pan[0])/v.zoom,(p.y-h/2-v.pan[1])/v.zoom];
for(const zoom of [.7,1,6,18])for(const pan of [[0,0],[137,-84]])for(const pointer of [{x:25,y:40},{x:735,y:540},{x:400,y:300}])for(const delta of [-1000,-120,120,1000]){
 const before={zoom,pan},after=zoomMapAt(before,pointer,w,h,delta);world(pointer,before).forEach((v,i)=>assert.ok(Math.abs(v-world(pointer,after)[i])<1e-9));assert.ok(after.zoom>=.7&&after.zoom<=18);
}
console.log('Pointer-anchored map zoom passed at corners, centre, panned positions and both limits');
