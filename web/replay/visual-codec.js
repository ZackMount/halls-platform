// Platform display packets only. Proof authentication/decoding stays on the server.
export const fieldsForEntities=entities=>[6,7,8,9,10,12,13,14,15,16,17,18,19,22,...Array.from({length:entities},(_,e)=>Array.from({length:7},(_,k)=>24+e*12+k)).flat(),3];
export const FIELDS=fieldsForEntities(4);
const fail=()=>new Error('回放数据格式无效或不完整，请刷新后重试。');
class Reader{
 constructor(buffer){this.bytes=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);this.view=new DataView(this.bytes.buffer,this.bytes.byteOffset,this.bytes.byteLength);this.at=0;}
 take(n){if(!Number.isSafeInteger(n)||n<0||this.at+n>this.bytes.length)throw fail();const bytes=this.bytes.subarray(this.at,this.at+n);this.at+=n;return bytes;}
 u8(){return this.take(1)[0];}u16(){const at=this.at;this.take(2);return this.view.getUint16(at,true);}u32(){const at=this.at;this.take(4);return this.view.getUint32(at,true);}f64(){const at=this.at;this.take(8);return this.view.getFloat64(at,true);}
 magic(value){if([...value].some(c=>this.u8()!==c.charCodeAt(0)))throw fail();}
 integer(max=Number.MAX_SAFE_INTEGER){let value=0,scale=1;for(let n=0;n<8;n++){const byte=this.u8();value+=(byte&127)*scale;if(!Number.isSafeInteger(value)||value>max)throw fail();if(byte<128){if(n&&byte===0)throw fail();return value;}scale*=128;}throw fail();}
 end(){if(this.at!==this.bytes.length)throw fail();}
}
function column(reader,count,put){let previous=0,index=0;while(index<count){const delta=reader.integer(0xffffffff);if(delta===0){const run=reader.integer(count-index);if(!run)throw fail();for(let n=0;n<run;n++)put(index++,previous);}else{previous=(previous^delta)>>>0;put(index++,previous);}}}
export function decodeManifest(buffer){
 const r=new Reader(buffer);r.magic('HVM5');const flags=r.u8(),entities=r.u8(),fields=r.u8(),reserved=r.u8(),samples=r.u32(),nh=r.u32(),ni=r.u32(),nc=r.u32(),np=r.u32();
 if(flags&~127||![4,5].includes(entities)||fields!==fieldsForEntities(entities).length||reserved||samples<1||samples>200000||nh>1000000||ni>samples||nc>1000000||np>5000)throw fail();
 const exit=[r.u8(),r.u8()],forms=Array.from({length:entities},()=>r.u16()),scalars=Array.from({length:9},()=>r.f64());
 if(scalars.some(v=>!Number.isFinite(v))||scalars.slice(0,3).some(v=>v<0)||scalars[3]<=0||scalars[4]<=0||forms.some(v=>v>=997))throw fail();
 const [duration,activeDuration,simulationDuration,rate,tile,ceiling,eye,sx,sz]=scalars,bitmap=r.take(8192).slice(),lampBits=r.take(8192).slice();
 function times(count,delta=true){const values=new Float64Array(count);let previous=0;for(let i=0;i<count;i++){if(flags&4)values[i]=r.f64();else{const n=r.integer();previous=delta?previous+n:n;if(!Number.isSafeInteger(previous))throw fail();values[i]=previous/1000000;}if(!Number.isFinite(values[i])||values[i]<0)throw fail();}return values;}
 const timeline=times(samples);for(let i=1;i<samples;i++)if(timeline[i]<=timeline[i-1])throw fail();
 const healthTimes=times(nh),healthWords=new Uint32Array(nh);column(r,nh,(i,v)=>healthWords[i]=v);const health=new Float32Array(healthWords.buffer);
 if(health.some(v=>!Number.isFinite(v)))throw fail();const healthEvents=Array.from(healthTimes,(time,i)=>[time,health[i]]);
 const idle=times(ni*2,false),chase=times(nc*2,false),path=Array.from({length:np},()=>[0,0]);
 for(let axis=0;axis<2;axis++){let previous=0;for(const point of path){if(flags&8)point[axis]=r.f64();else{const n=r.integer(0xffffffff);previous+=n%2?-(Math.floor(n/2)+1):n/2;point[axis]=previous/10000;}if(!Number.isFinite(point[axis]))throw fail();}}
 const coins=[],coinPickups=[];
 if(flags&32){const count=r.u8();if(count<1||count>3)throw fail();const ids=new Set(),cells=new Set();
  for(let i=0;i<count;i++){const id=r.u8(),x=r.u8(),z=r.u8(),time=r.f64(),key=z*256+x;
   if(id>=3||ids.has(id)||cells.has(key)||!Number.isFinite(time)||(time!==-1&&(time<0||time>duration+1e-6)))throw fail();
   ids.add(id);cells.add(key);coins.push({id,cell:[x,z],position:[(x+.5)*tile,(z+.5)*tile]});if(time>=0)coinPickups.push({id,time});
  }
 }
 let canonicalExit=null,exitCompletionMismatch=null;const exitEvents=[];
 if(flags&64){const extension=r.u8();if(extension<1||extension>7)throw fail();if(extension&1)canonicalExit=[r.u8(),r.u8()];
  if(extension&2){const count=r.integer(900000);if(!count)throw fail();let previous=null;
   for(let i=0;i<count;i++){const time=r.f64(),cell=[r.u8(),r.u8()];if(!Number.isFinite(time)||time<0||time>duration+1e-6||(!previous&&time!==0)||(previous&&(time<=previous.time||cell.every((n,j)=>n===previous.cell[j]))))throw fail();previous={time,cell};exitEvents.push(previous);}
  }
  if(extension&4){const position=[r.f64(),r.f64()];if(position.some(v=>!Number.isFinite(v)||v<0||v>=512))throw fail();exitCompletionMismatch={position};}
 }
 r.end();return {format:'HVR5',canonicalExit,exitEvents,exitCompletionMismatch,coins,coinPickups,terrainLighting:!!(flags&16),inputMode:flags&1?'events':'held',timeBasis:flags&2?'recorded_wall':'simulation_legacy',samples,chunks:Math.ceil(samples/360),duration,activeDuration,simulationDuration,rate,tile,ceiling,eye,entities,exit,forms,spawnPosition:[sx,sz],bitmap,lampBits,times:timeline,healthEvents,idleRanges:Array.from({length:ni},(_,i)=>[idle[i*2],idle[i*2+1]]),chaseRanges:Array.from({length:nc},(_,i)=>[chase[i*2],chase[i*2+1]]),path,fields:fieldsForEntities(entities),words:24+12*entities};
}
export function decodeChunk(buffer,meta,index){
 const r=new Reader(buffer);r.magic('HVC5');const count=r.u16(),fields=r.u16();
 if(!Number.isInteger(index)||index<0||index>=meta.chunks||count!==Math.min(360,meta.samples-index*360)||count<1||count>360||fields!==fieldsForEntities(meta.entities).length)throw fail();
 const width=24+12*meta.entities,selected=fieldsForEntities(meta.entities),words=new Uint32Array(count*width);
 for(const k of selected)column(r,count,(i,v)=>words[i*width+k]=v);
 column(r,count,(i,v)=>{if(v>>>(18+2*meta.entities))throw fail();const base=i*width;words[base+1]=v&1023;words[base+2]=(v>>>10)&255;for(let e=0;e<meta.entities;e++)words[base+35+e*12]=(v>>>(18+2*e))&3;});r.end();
 const values=new Float32Array(words.buffer);for(let i=0;i<count;i++){const sample=index*360+i;values[i*width]=sample?meta.times[sample]-meta.times[sample-1]:0;}
 if(selected.some(k=>{for(let i=0;i<count;i++)if(!Number.isFinite(values[i*width+k]))return true;return false;}))throw fail();return words;
}
export function decodeInitial(buffer){const r=new Reader(buffer);r.magic('HVI5');const metadataSize=r.u32(),chunkSize=r.u32(),meta=decodeManifest(r.take(metadataSize)),first=decodeChunk(r.take(chunkSize),meta,0);r.end();return {meta,first};}
