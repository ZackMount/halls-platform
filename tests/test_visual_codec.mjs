import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {decodeInitial,decodeChunk,fieldsForEntities} from '../web/replay/visual-codec.js';
const script=`
import sys,json,base64,gzip,struct,tempfile,random
sys.path.insert(0,'tests')
from visual_fixture import write_visual
from visual_codec import *
entities=int(sys.argv[1]);terrain=bool(int(sys.argv[2]));coins=bool(int(sys.argv[3]));fields=fields_for_entities(entities);width=24+12*entities
with tempfile.TemporaryDirectory() as folder:
 write_visual(folder,health=(100,100000,99966,47.8583984375),entities=entities)
 m=load_manifest(folder);base=load_chunk(folder,m,0)
 m.update(terrainLighting=terrain,samples=361,times=[round(i*.096725,6) for i in range(361)],path=[[3.0001,4.0022],[4.0003,3.0004]],idleRanges=[[.189432,.283367]],chaseRanges=[[.000001,.096724]])
 if coins:m.update(coins=[{'id':i,'cell':[10+i*20,11+i*20]} for i in range(3)],coinPickups=[{'id':0,'time':.096725},{'id':2,'time':.283367}])
 rows=[];expected=[]
 for i in range(361):
  row=base[i%4].copy();row[-2]=i%1024;row[-1]=i%256
  for e in range(entities):row[2+len(fields)+e]=(i+e)%4
  rows.append(row);words=[0]*width
  for n,k in enumerate(fields):words[k]=bits(row[n+1])
  words[1]=int(row[-2]);words[2]=int(row[-1])
  for e in range(entities):words[35+12*e]=int(row[2+len(fields)+e])
  expected.append(words)
 save_replay(folder,m,rows)
 print(json.dumps({'initial':base64.b64encode(gzip.decompress((Path(folder)/'init.hvi.gz').read_bytes())).decode(),'last':base64.b64encode(gzip.decompress((Path(folder)/'1.hvc.gz').read_bytes())).decode(),'words':expected,'times':m['times'],'health':m['healthEvents'],'path':m['path'],'idle':m['idleRanges'],'chase':m['chaseRanges']}))
`;
for(const terrainLighting of [false,true])for(const entities of [4,5])for(const withCoins of entities===5?[false,true]:[false]){
const selected=fieldsForEntities(entities),width=24+12*entities;
const run=spawnSync(process.env.HALLS_TEST_PYTHON||'python3',['-c',script,String(entities),terrainLighting?'1':'0',withCoins?'1':'0'],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',maxBuffer:4*1024*1024});assert.equal(run.status,0,run.stderr);
const test=JSON.parse(run.stdout),initial=Buffer.from(test.initial,'base64'),last=Buffer.from(test.last,'base64'),{meta,first}=decodeInitial(initial),end=decodeChunk(last,meta,1);
assert.equal(meta.coins.length,withCoins?3:0);assert.deepEqual(meta.coinPickups,withCoins?[{id:0,time:.096725},{id:2,time:.283367}]:[]);if(withCoins){assert.deepEqual(meta.coins[1],{id:1,cell:[30,31],position:[61,63]});const duplicate=Buffer.from(initial),start=12+initial.readUInt32LE(4)-33;duplicate[start+11]=duplicate[start];assert.throws(()=>decodeInitial(duplicate),'duplicate coin IDs are rejected');}
assert.equal(meta.terrainLighting,terrainLighting);assert.equal(meta.entities,entities);assert.equal(meta.words,width);assert.equal(meta.forms.length,entities);
assert.deepEqual([...meta.times],test.times);assert.deepEqual(meta.path,test.path);assert.deepEqual(meta.healthEvents,test.health);assert.deepEqual(meta.idleRanges,test.idle);assert.deepEqual(meta.chaseRanges,test.chase);
for(let i=0;i<361;i++){const words=i<360?first:end,base=i<360?i*width:0;for(const key of [...selected,1,2,...Array.from({length:entities},(_,e)=>35+12*e)])assert.equal(words[base+key],test.words[i][key],`sample ${i}, word ${key}`);}
for(const changed of [initial.subarray(0,7),initial.subarray(0,initial.length-1),Buffer.concat([initial,Buffer.from('x')])])assert.throws(()=>decodeInitial(changed));
assert.throws(()=>decodeChunk(last,meta,0));assert.throws(()=>decodeChunk(last.subarray(0,last.length-1),meta,1));
}
console.log('Four/five entity Python/browser binary interoperability, microsecond clocks, pause/chase ranges, six-digit health, all control bits, optional coin collection times, duplicate-coin rejection and short/truncated chunks passed');
