import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {referenceRoute,createReferenceRouteLoader,createReferenceRouteMesh,createReferenceRouteMap,drawReferenceRouteMap,REFERENCE_ROUTE_COLOR,REFERENCE_ROUTE_HEIGHT} from '../web/replay/reference-route.js';

const A='a'.repeat(24),B='b'.repeat(24),fixture={available:true,seconds:3.5,approximate:true,path:[[3,3],[9,3],[9,9]]};
const validated=referenceRoute(fixture);assert.deepEqual(validated,fixture);validated.path[0][0]=42;assert.equal(fixture.path[0][0],3,'cached display data is a copy of the server response');
assert.deepEqual(referenceRoute({available:false,path:'ignored'}),{available:false});
assert.equal(referenceRoute({...fixture,seconds:86400}).seconds,86400);
for(const bad of [null,{}, {...fixture,available:1},{...fixture,seconds:Infinity},{...fixture,seconds:-1},{...fixture,seconds:86400.001},{...fixture,seconds:true},{...fixture,approximate:'yes'},{...fixture,path:[]},{...fixture,path:[[0,512]]},{...fixture,path:[[-1,0]]},{...fixture,path:[[0,'1']]},{...fixture,path:[[0,NaN]]},{...fixture,path:[[0,1,2]]},{...fixture,path:new Array(8193).fill([1,1])}])assert.throws(()=>referenceRoute(bad));

const requests=[],changes=[],loader=createReferenceRouteLoader({load:(id,{signal})=>new Promise((resolve,reject)=>requests.push({id,signal,resolve,reject})),onChange:value=>changes.push(value)});
loader.reset(A);assert.equal(requests.length,0,'loading a replay does not fetch an unused route');
const first=loader.select(true),same=loader.select(true);await Promise.resolve();assert.equal(first,same);assert.equal(requests.length,1);assert.equal(loader.snapshot().status,'loading');
requests[0].resolve(fixture);await first;assert.equal(loader.snapshot().status,'ready');
await loader.select(false);assert.equal(loader.snapshot().enabled,false);await loader.select(true);assert.equal(requests.length,1,'repeat toggles reuse the current run route');
loader.reset(B);assert.equal(loader.snapshot().data,null);assert.equal(loader.snapshot().enabled,false);
const off=loader.select(true);await Promise.resolve();const cancelled=requests[1];await loader.select(false);assert.equal(cancelled.signal.aborted,true);
cancelled.resolve(fixture);await off;assert.equal(loader.snapshot().data,null,'a late cancelled response must not draw a route');
const wrongRun=loader.select(true);await Promise.resolve();const old=requests[2];loader.reset(A);assert.equal(old.signal.aborted,true);old.resolve(fixture);await wrongRun;assert.equal(loader.snapshot().data,null);assert.equal(loader.snapshot().id,A);
const fail=loader.select(true);await Promise.resolve();requests[3].reject(Error('offline'));await fail;assert.equal(loader.snapshot().status,'error');assert.equal(loader.snapshot().enabled,false);
const retry=loader.select(true);await Promise.resolve();requests[4].resolve(fixture);await retry;assert.equal(loader.snapshot().status,'ready');
loader.reset(B);const paused=loader.select(true);await Promise.resolve();const suspended=requests[5];loader.suspend();assert.equal(suspended.signal.aborted,true);suspended.resolve(fixture);await paused;assert.equal(loader.snapshot().data,null);
const resumed=loader.resume();await Promise.resolve();requests[6].resolve({available:false});await resumed;assert.equal(loader.snapshot().status,'unavailable');assert.equal(loader.snapshot().enabled,false);await loader.select(true);assert.equal(requests.length,7);
loader.reset('../../private');await loader.select(true);assert.equal(requests.length,7,'only run IDs can request a route');assert.equal(loader.snapshot().id,'');

const mesh=createReferenceRouteMesh(referenceRoute(fixture)),positions=mesh.geometry.getAttribute('position');
assert.equal(positions.count,12);assert.equal(mesh.material.color.getHexString(),REFERENCE_ROUTE_COLOR.slice(1));assert.equal(mesh.material.depthTest,true);assert.equal(mesh.material.depthWrite,false);assert.equal(mesh.material.emissive,undefined);assert.ok(mesh.material.opacity<1);
for(let i=0;i<positions.count;i++){assert.ok(Math.abs(positions.getY(i)-REFERENCE_ROUTE_HEIGHT)<1e-6);assert.ok(positions.getX(i)>=2.9&&positions.getX(i)<=9.1);assert.ok(positions.getZ(i)<=-2.9&&positions.getZ(i)>=-9.1);}
for(const path of [[[3,4]],[[3,4],[3,4]]]){
 const one=createReferenceRouteMesh(referenceRoute({...fixture,seconds:0,path}));assert.equal(one.geometry.getAttribute('position').count,6);assert.ok([...one.geometry.getAttribute('position').array].every(Number.isFinite));one.geometry.dispose();one.material.dispose();
}
assert.equal(createReferenceRouteMesh({available:false}),null);mesh.geometry.dispose();mesh.material.dispose();

class MapPath{constructor(){this.points=[];}moveTo(x,z){this.points.push(['move',x,z]);}lineTo(x,z){this.points.push(['line',x,z]);}}
const map=createReferenceRouteMap(referenceRoute(fixture),MapPath);
assert.deepEqual(map.path.points,[['move',3,3],['line',9,3],['line',9,9]],'2D path uses the original positive-Z world coordinates without coin waypoints');
const draws=[],context={save(){draws.push('save');},restore(){draws.push('restore');},stroke(path){draws.push({path,color:this.strokeStyle,width:this.lineWidth,alpha:this.globalAlpha});},beginPath(){},arc(...args){draws.push({arc:args});},fill(){draws.push('fill');}};
drawReferenceRouteMap(context,map,2);assert.equal(draws[1].color,REFERENCE_ROUTE_COLOR);assert.equal(draws[1].width,.85);assert.equal(draws[1].path,map.path);assert.equal(draws.at(-1),'restore');
const pointMap=createReferenceRouteMap(referenceRoute({...fixture,seconds:0,path:[[3,4]]}),MapPath);drawReferenceRouteMap(context,pointMap,.5);assert.ok(draws.some(item=>item.arc&&item.arc[0]===3&&item.arc[1]===4&&item.arc[2]===2.8));
const drawCount=draws.length;drawReferenceRouteMap(context,map,0);drawReferenceRouteMap(context,map,NaN);assert.equal(draws.length,drawCount);
const html=readFileSync(new URL('../web/replay/index.html',import.meta.url),'utf8');
assert.ok(html.indexOf('id="optimal-route"')<html.indexOf('id="cutaway"'));
assert.match(html,/id="optimal-route" type="checkbox" disabled/);assert.doesNotMatch(html,/id="optimal-route"[^>]*checked/);
console.log('Reference route validation, lazy loading, coalescing, cancellation, run isolation, retry, map drawing and floor geometry passed');
