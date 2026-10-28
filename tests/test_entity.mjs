import assert from 'node:assert/strict';
import fs from 'node:fs';
import {legacy} from './entity_reference.mjs';
import {createEntityModel} from '../web/replay/entity-model.js';
import {healthLabel,abnormalHealth,healthAt} from '../web/replay/health.js';
const run=createEntityModel(),meta={formSeeds:['51'],ceiling:2.65};
for(const rage of [0,1])for(const travel of [0,.23,3]){
 const row=new Float32Array(72);row[24]=5;row[25]=5;row[26]=1;row[27]=travel;row[28]=1;row[30]=70+30*rage;row[22]=44;
 const before=legacy(meta,row),after=run([5,0,5],1,44,51,2.65/3.5,travel,1,0,rage);
 for(const key of ['vertices','particles']){assert.equal(before[key].length,after[key].length);let error=0;before[key].forEach((v,i)=>error=Math.max(error,Math.abs(v-after[key][i])));assert.ok(error<.0001,`${key} parity: ${error}`);}
}
const pose=(travel,attack)=>run([0,0,0],0,10,51,1,travel,1,attack,0).rig;
for(const travel of [.2,.25,.8])for(const attack of [.38,.33,.2]){
 const walking=pose(travel,0),attacking=pose(travel,attack);assert.deepEqual(attacking.slice(4,10),walking.slice(4,10),'legs keep gait throughout attacks');assert.notDeepEqual(attacking.slice(10,16),walking.slice(10,16),'arms still attack');
}
assert.notDeepEqual(pose(.2,.3).slice(4,10),pose(.25,.3).slice(4,10),'attacking legs are not frozen');
assert.equal(healthLabel(100000),'HP 100000');assert.equal(healthLabel(10000),'HP 10000');assert.equal(healthLabel(47.75),'HP 47.75');assert.equal(healthLabel(47.8583984375),'HP 47.8584');assert.ok(abnormalHealth(47.75));assert.ok(!abnormalHealth(66));
const vendor=new URL('../web/replay/vendor/three.module.js',import.meta.url).href;
const code=fs.readFileSync(new URL('../web/replay/scene.js',import.meta.url),'utf8').replace('/replay-assets/vendor/three.module.js',vendor);
const {updateCableGeometry,updateParticles}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64')),THREE=await import(vendor);
const g=new THREE.BufferGeometry(),p=new THREE.BufferGeometry();
const a=run([5,0,5],1,44,51,.757,3,1,0,1);updateCableGeometry(g,a.vertices);updateParticles(p,a.particles);const pos=g.getAttribute('position'),normal=g.getAttribute('normal'),index=g.index,particle=p.getAttribute('position');
for(let i=0;i<12;i++){const next=run([5,0,5],1,44+i*.033,51,.757,3+i*.1,1,.3,i%2);updateCableGeometry(g,next.vertices);updateParticles(p,next.particles);assert.equal(g.getAttribute('position'),pos);assert.equal(g.getAttribute('normal'),normal);assert.equal(g.index,index);assert.equal(p.getAttribute('position'),particle);assert.ok(pos.array.every(Number.isFinite));assert.ok(normal.array.every(Number.isFinite));assert.equal(p.drawRange.count,next.particles.length/3);}
assert.ok(pos.count<a.vertices.length/3*.4,'shared tube vertices reduce GPU payload');
console.log('Entity geometry parity, independent gait, persistent buffers and HP display passed');

const healthEvents=[[0,100],[.05,100000],[.06,99966],[.07,100000]];
assert.equal(healthAt(healthEvents,.049,0),100);assert.equal(healthAt(healthEvents,.05,0),100000);assert.equal(healthAt(healthEvents,.065,0),99966);assert.equal(healthAt(healthEvents,.07,0),100000);assert.equal(healthAt(null,1,47.75),47.75);
