import assert from 'node:assert/strict';
import {fetchReplay,responseJSON,ReplayTransport,publicReplayBase} from '../web/replay/replay-network.js';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json'}}),html=status=>new Response('<!DOCTYPE html><h1>upstream error</h1>',{status,headers:{'Content-Type':'text/html'}});

let calls=0,delays=[];const r=await fetchReplay('/test',{},async()=>++calls===1?html(502):json({ok:true}),async ms=>delays.push(ms));assert.equal((await responseJSON(r)).ok,true);assert.equal(calls,2);assert.deepEqual(delays,[500]);
calls=0;const failed=await fetchReplay('/test',{},async()=>{calls++;return html(503);},async()=>{});assert.equal(calls,3);await assert.rejects(()=>responseJSON(failed),e=>e.message.includes('HTTP 503')&&!e.message.includes('Unexpected token'));
calls=0;await fetchReplay('/test',{},async()=>{calls++;return json({error:'limited'},429);},async()=>{});assert.equal(calls,3);
let sessions=0,gets=0;const transport=new ReplayTransport({session:'/session',parts:'/part/'},undefined,async(url,options)=>{
 if(url==='/session')return json({ticket:'ticket-'+(++sessions),expiresIn:900});
 gets++;return options.headers['X-Replay-Ticket']==='ticket-1'?json({error:'expired'},404):new Response('HVR3');
},async()=>{});
await Promise.all([transport.fetch('1'),transport.fetch('2')]);assert.equal(sessions,2,'parallel expiry shares one renewed session');assert.equal(gets,4);
const hidden=new ReplayTransport({session:'/session',parts:'/part/'},undefined,async()=>json({error:'record unavailable'},404),async()=>{});await assert.rejects(()=>hidden.fetch('1'),/record unavailable/);
const controller=new AbortController();controller.abort();let slept=0;await assert.rejects(()=>fetchReplay('/test',{signal:controller.signal},async()=>{throw new DOMException('Aborted','AbortError');},async()=>{slept++;}),e=>e.name==='AbortError');assert.equal(slept,0);
// Cancelling a stale prefetch must not cancel another segment or the shared ticket.
const lifetime=new AbortController(),segment=new AbortController(),seen=[];
const isolated=new ReplayTransport({session:'/session',parts:'/part/'},lifetime.signal,async(url,options)=>{
 seen.push([url,options.signal,options.priority]);return url==='/session'?json({ticket:'valid',expiresIn:900}):new Response('HVR5');
},async()=>{});
await isolated.fetch('2',{signal:segment.signal,priority:'low'});await isolated.fetch('3');
assert.equal(seen[0][1],lifetime.signal);assert.equal(seen[1][1],segment.signal);assert.equal(seen[1][2],'low');assert.equal(seen[2][1],lifetime.signal);
segment.abort();assert.equal(lifetime.signal.aborted,false);
const run='a'.repeat(24),revision='b'.repeat(64),base='/replay-public/'+run+'/'+revision+'/',directCalls=[];
const direct=new ReplayTransport({session:'/must-not-authorize',parts:'/private/',publicBase:base},lifetime.signal,async(url,options)=>{
 directCalls.push([url,options]);return new Response('HVI5');
});
await Promise.all([direct.fetch('manifest'),direct.fetch('1',{signal:new AbortController().signal,priority:'low'})]);
assert.deepEqual(directCalls.map(c=>c[0]),[base+'manifest.bin',base+'1.bin']);
assert.ok(directCalls.every(([,options])=>options.credentials==='omit'&&!options.headers['X-Replay-Ticket']));
assert.equal(direct.ticket,'');assert.equal(direct.expires,0);
await assert.rejects(direct.fetch('../private'),/超出范围/);assert.equal(directCalls.length,2);
assert.equal(publicReplayBase(base,run),base);
for(const value of ['https://evil.test'+base,'/api/previews/'+run+'/replay/','/replay-public/'+run+'/../','//evil.test/'+base])assert.equal(publicReplayBase(value,run),'');
assert.equal(publicReplayBase(base,'c'.repeat(24)),'');
let missingCalls=0;const missing=new ReplayTransport({publicBase:base},undefined,async()=>{missingCalls++;return json({error:'not published'},404);});
await assert.rejects(missing.fetch('manifest'),/not published/);assert.equal(missingCalls,1,'public 404 must not create a private ticket');
console.log('Anonymous CDN reads without cookies/tickets, public URL isolation, HTML 502 recovery, bounded retries, shared ticket renewal, private denial and independent segment cancellation passed');
