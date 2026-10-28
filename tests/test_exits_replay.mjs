import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {decodeManifest} from '../web/replay/visual-codec.js';
import {exitAt,exitState,exitLabel,EXIT_CHANGED,EXIT_GREEN} from '../web/replay/exits.js';
const script=`
import sys,json,base64,tempfile
sys.path.insert(0,'tests')
from visual_fixture import write_visual
from visual_codec import *
with tempfile.TemporaryDirectory() as folder:
 write_visual(folder,health=(100,100,100,100))
 meta=load_manifest(folder)
 old=encode_manifest(meta)
 events=[{'time':0.,'cell':[5,1]},{'time':.000001,'cell':[17,20]},{'time':.050001,'cell':[5,1]}]
 meta.update(canonicalExit=[5,1],exitEvents=events,coins=[{'id':0,'cell':[8,9]}],coinPickups=[{'id':0,'time':.02}])
 timeline=encode_manifest(meta)
 meta.update(exitEvents=[],exitCompletionMismatch={'position':[31.75,49.125]})
 mismatch=encode_manifest(meta)
 print(json.dumps({key:base64.b64encode(value).decode() for key,value in [('old',old),('timeline',timeline),('mismatch',mismatch)]}))
`;
const run=spawnSync(process.env.HALLS_TEST_PYTHON||'python3',['-c',script],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8'});assert.equal(run.status,0,run.stderr);
const packets=JSON.parse(run.stdout),old=decodeManifest(Buffer.from(packets.old,'base64')),timeline=decodeManifest(Buffer.from(packets.timeline,'base64')),mismatch=decodeManifest(Buffer.from(packets.mismatch,'base64'));
assert.equal(old.canonicalExit,null);assert.deepEqual(old.exitEvents,[]);assert.equal(old.exitCompletionMismatch,null);assert.deepEqual(exitAt(old,100),old.exit);
assert.deepEqual(timeline.canonicalExit,[5,1]);assert.deepEqual(timeline.coinPickups,[{id:0,time:.02}]);
assert.deepEqual(exitAt(timeline,0),[5,1]);assert.deepEqual(exitAt(timeline,.000001),[17,20]);assert.deepEqual(exitAt(timeline,.049),[17,20]);assert.deepEqual(exitAt(timeline,.050001),[5,1]);assert.deepEqual(exitAt(timeline,0),[5,1],'seeking backward restores the recorded exit');
assert.equal(exitState(timeline,.01).color,EXIT_CHANGED);assert.equal(exitState(timeline,.06).color,EXIT_GREEN);assert.equal(exitState(timeline,.01).showOriginal,true);assert.equal(exitState(timeline,.06).showOriginal,false);
assert.equal(exitLabel(exitState(timeline,.01)), '当前出口');assert.equal(exitLabel(exitState(timeline,.01),true),'原始出口');
assert.deepEqual(mismatch.exitCompletionMismatch,{position:[31.75,49.125]});assert.deepEqual(mismatch.exitEvents,[]);assert.equal(exitState(mismatch,0).altered,false,'victory position is never treated as a known modified exit');
const declared={...old,canonicalExit:[10,10]};assert.equal(exitLabel(exitState(declared,0)),'声明出口');assert.equal(exitState(declared,0).recorded,false);
const body=Buffer.from(packets.timeline,'base64');
for(const bad of [body.subarray(0,-1),Buffer.concat([body,Buffer.from('x')])])assert.throws(()=>decodeManifest(bad));
const header=Buffer.from(packets.old,'base64');header[4]|=64;
for(const extension of [0,8,255])assert.throws(()=>decodeManifest(Buffer.concat([header,Buffer.from([extension])])));
// Test production scene state without a GPU: no geometry rebuild is needed to
// change an exit, and old carpet cells no longer retain a baked green tile.
const vendor=new URL('../web/replay/vendor/three.module.js',import.meta.url).href;
const source=fs.readFileSync(new URL('../web/replay/scene.js',import.meta.url),'utf8').replace('/replay-assets/vendor/three.module.js',vendor);
const {ReplayWorld}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const world=new ReplayWorld(null,{tile:2,ceiling:2.65,spawnPosition:[3,3],exit:[5,1],lampBits:new Uint8Array(8192)},()=>false);
world.setExit([17,20],true);assert.deepEqual(world.uniforms.exitCell.value.toArray(),[17,20]);assert.deepEqual(world.uniforms.exitColor.value.toArray(),[.9,.28,.09]);
world.setExit([5,1],false);assert.deepEqual(world.uniforms.exitCell.value.toArray(),[5,1]);world.dispose();
console.log('Exit metadata Python/browser interoperability, sub-sample changes, backward seeks, original/declared distinction, legacy victory mismatch, corruption rejection and dynamic floor uniforms passed');
