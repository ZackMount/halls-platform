import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
const vendor=new URL('../web/replay/vendor/three.module.js',import.meta.url).href;
const source=fs.readFileSync(new URL('../web/replay/scene.js',import.meta.url),'utf8').replace('/replay-assets/vendor/three.module.js',vendor);
const {ReplayWorld,lightingVisible,lampActive,lampPlaced}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const [seed,expected] of [[0n,'56baa119e06df3b75aba04ebe5336320200441a5fc3a653b7f241ba1ab1c53f0'],[42n,'88dd64d46b039d028243aaa60f7a9aab3925035c2802099dfc2a57f0c9b052fa'],[104729n,'65c39f1e4e37ba25da5cb966e21a5d22b08902c7807babc2706ca9a36f90105b'],[1n<<40n,'61c64e96500e8703e55e5a68666c4627d8c2947dcf28bf2e96f9d66c34e00df3'],[(1n<<64n)-1n,'0eb22d6f7162a91dcf2a3b33bf634a9e6d75fe1d40f283d99f2d45819a3b8a1f']]){
 const bits=new Uint8Array(8192);for(let z=0;z<256;z++)for(let x=0;x<256;x++){const active=lampActive(x,z,seed,[127,131]);assert.ok(!active||lampActive(x,z,seed,[127,131],false));if(active){const i=z*256+x;bits[i>>3]|=1<<(i&7);}}
 assert.equal(createHash('sha256').update(bits).digest('hex'),expected,'renderer and server/client lamp bitmaps agree');
}
const barrier=(x,z)=>x<0||z<0||x>=8||z>=8||x===4;
assert.equal(lightingVisible(barrier,[3,1,3],[11,1,3]),false);
assert.equal(lightingVisible(barrier,[3,1,3],[7,1,5]),true);
assert.equal(lightingVisible((x,z)=>x===2&&z===2,[3.99,1,4.001],[5,1,3.98]),false,'short wall-corner crossings cannot be skipped');
assert.equal(lightingVisible((x,z)=>x===2&&z===1,[3,1,3],[5,1,5]),false,'diagonal cracks do not transmit light');
const split=(x,z)=>(x===1&&z===2)||(x===2&&z===1);
assert.equal(lightingVisible(split,[4,.025,4],[3,2.5,3]),false,'floor corner cannot sample a diagonally separate room');
assert.equal(lightingVisible(split,[4,2.625,4],[3,2.5,3]),false,'ceiling corner cannot sample a diagonally separate room');
const lamps=new Uint8Array(8192);lamps[(1*256+2)>>3]|=1<<((1*256+2)&7);
const world=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[3,3],exit:[7,7],lampBits:lamps},barrier);
assert.ok(world.illumination([5,0,3],[0,1,0])>.2);
assert.equal(world.illumination([11,0,3],[0,1,0]),.04,'sealed room gets only the small ambient floor');
const bucket=world.bucket();for(const x of [2,4])world.quad(bucket,[[x,0,4],[x,0,6],[x+2,0,6],[x+2,0,4]],[[x,4],[x,6],[x+2,6],[x+2,4]],1);
for(let y=0;y<5;y++)assert.equal(world.patches[0][y*5+4],world.patches[1][y*5],'coplanar patch edges use the same irradiance');
assert.equal(bucket.positions.length,36,'baking does not tessellate geometry');
for(const [start,step] of [[[2,2],[2,0]],[[12,2],[0,2]],[[12,12],[-2,0]],[[2,12],[0,-2]]]){
 const room=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[7,7],exit:[7,7],lampBits:new Uint8Array(8192)},(x,z)=>x<0||z<0||x>=7||z>=7);
 room.lamps[3*256+3]=[7,2.5,7];const faces=room.bucket();
 for(let i=0;i<2;i++){const x=start[0]+step[0]*i,z=start[1]+step[1]*i;room.wallFace(faces,[[x,0,z],[x+step[0],0,z+step[1]],[x+step[0],2.65,z+step[1]],[x,2.65,z]]);}
 assert.equal(faces.uv[2],faces.uv[12],`wallpaper shares the same coordinate at a joint facing ${step}`);
 for(let y=0;y<5;y++)assert.equal(room.patches[0][y*5+4],room.patches[1][y*5],'wall irradiance is identical across chart borders');
 for(let i=0;i<12;i++){
  assert.equal(faces.uv[i*2],faces.positions[i*3]-faces.positions[i*3+2],'wallpaper uses a continuous world coordinate');
  const chart=Math.floor(i/6),local=i%6,corner=[0,1,2,0,2,3][local];
  assert.equal(faces.lightUv[i*2]-chart*5,.5+([0,4,4,0][corner]),'reversed walls retain the full baked chart');
  assert.equal(faces.lightUv[i*2+1],.5+([0,0,4,4][corner]));
 }
 room.dispose();
}
assert.ok(!world.scene.children.some(n=>n.isLight),'no camera-selected unshadowed actor lights');
const extra=new Uint8Array(8192);for(const [x,z] of [[3,1],[4,1]])extra[(z*256+x)>>3]|=1<<((z*256+x)&7);
const legacy=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[3,3],exit:[7,7],lampBits:extra},barrier);
const terrain=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[3,3],exit:[7,7],lampBits:extra,terrainLighting:true},barrier);
assert.equal(legacy.lamps[259],undefined,'legacy bitmaps include unused off-grid bits; these must not create fixtures');
assert.deepEqual(terrain.lamps[259],[7,2.5,3],'terrain corner fixtures need not land on the old grid');
assert.equal(terrain.lamps[260],undefined,'emitting bits cannot create a lamp inside a wall');
assert.equal(terrain.fixtures.length,legacy.fixtures.length+1);
assert.ok(terrain.fixtures.some(f=>lampPlaced(f.x,f.z,[1,1])&&!f.active),'old grid fixtures remain visible while switched off');
legacy.dispose();terrain.dispose();
world.dispose();console.log('Light bake: exact occlusion, diagonal gaps, sealed-room darkness, continuous chart edges and fixed geometry passed');
