import assert from 'node:assert/strict';import {markerPlacement,markerLabels,attachedLabel} from '../web/replay/hud-markers.js';
const project=p=>markerPlacement(p,800,500,1,1);
assert.deepEqual(project({x:0,y:0,z:-10}),{x:400,y:250,edge:false,angle:0});
assert.ok(project({x:100,y:0,z:-10}).edge);assert.equal(project({x:100,y:0,z:-10}).x,778);
assert.equal(project({x:-100,y:0,z:-10}).x,22);assert.equal(project({x:0,y:100,z:-10}).y,44);
assert.ok(project({x:2,y:0,z:10}).x>400,'behind-right must point right, not mirror left');
assert.ok(project({x:0,y:0,z:10}).y>250,'straight behind has a stable back direction');
for(const z of [-100,-.01,0,.01,100])for(const x of [-100,0,100]){const p=project({x,y:12,z});assert.ok(Number.isFinite(p.x+p.y+p.angle));assert.ok(p.x>=22&&p.x<=778&&p.y>=44&&p.y<=456);}
const p=Array.from({length:4},()=>({x:400,y:250})),labels=markerLabels(p,800,500);assert.equal(new Set(labels.map(x=>x.y)).size,1);
console.log('HUD projection, behind-camera arrows, clipping and overlapping labels passed');

const same=Array.from({length:4},()=>attachedLabel({x:22,y:120,edge:true},390,300));assert.ok(same.every(p=>p.x===12&&p.y===-8),'labels must not spread apart to avoid overlap');assert.equal(same[0].transform,'none');assert.equal(attachedLabel({x:368,y:120,edge:true},390,300).transform,'translateX(-100%)');assert.equal(attachedLabel({x:190,y:120,edge:false},390,300).x,0);

const cluster=[{x:400,y:250},{x:410,y:255},{x:400,y:250}];
for(let i=0;i<cluster.length;i++)assert.deepEqual(markerLabels(cluster,800,500)[i],markerLabels([cluster[i]],800,500)[0],'map caption placement is independent of neighbours');
assert.deepEqual(cluster.map(p=>attachedLabel(p,800,500)),[...cluster].reverse().map(p=>attachedLabel(p,800,500)).reverse(),'3D captions are not reordered or displaced');
