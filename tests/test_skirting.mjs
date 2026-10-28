import assert from 'node:assert/strict';import fs from 'node:fs';
const vendor=new URL('../web/replay/vendor/three.module.js',import.meta.url).href;
const source=fs.readFileSync(new URL('../web/replay/scene.js',import.meta.url),'utf8').replace('/replay-assets/vendor/three.module.js',vendor);
const {ReplayWorld}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const world=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[3,3],exit:[5,5],lampBits:new Uint8Array(8192)},(x,z)=>x===2&&z===2);
const bucket=world.bucket();const pairs=[[[6,4],[4,4]],[[6,6],[6,4]],[[4,6],[6,6]],[[4,4],[4,6]]];
for(const [a,b] of pairs)world.wallFace(bucket,[[a[0],0,a[1]],[b[0],0,b[1]],[b[0],2.65,b[1]],[a[0],2.65,a[1]]]);
assert.equal(bucket.positions.length,4*6*3,'black base adds no overlapping triangles');
assert.ok(bucket.kind.every(v=>v===0),'one wall material shades wallpaper and the black base');
for(let i=0;i<bucket.positions.length;i+=3){assert.ok([4,6].includes(bucket.positions[i]));assert.ok([-4,-6].includes(bucket.positions[i+2]));}
world.dispose();console.log('Integrated skirting: no overlay, no displaced geometry, same wall surface at every corner passed');
