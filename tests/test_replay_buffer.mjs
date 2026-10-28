import assert from 'node:assert/strict';
import {ReplayBuffer} from '../web/replay/replay-buffer.js';
import {PauseTimeline} from '../web/replay/pause-timeline.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({chunks=30,last=360,speed=1,times=null,display=t=>t}={}){
 times??=Float64Array.from({length:(chunks-1)*360+last},(_,i)=>i/12);
 let now=0;const calls=[],loaded=new Set([0]),errors=[];
 const buffer=new ReplayBuffer({times,duration:times.at(-1),loaded,display,clock:()=>now,
  load:(n,signal,priority)=>new Promise((resolve,reject)=>calls.push({n,signal,priority,resolve,reject})),
  onError:(n,error)=>errors.push({n,error})});
 buffer.update({index:0,time:0,speed});
 return {buffer,calls,loaded,errors,times,advance:ms=>now+=ms};
}
// Start fetching before Play and finish the whole recording without user input.
{
 const f=fixture({chunks:7});await tick();assert.deepEqual(f.calls.map(c=>c.n),[1,2]);
 assert.equal(f.buffer.running,2);assert.equal(f.buffer.canResume(),true);
 const same=f.buffer.request(1);assert.equal(f.calls.length,2,'in-flight requests are shared');
 f.calls[0].resolve();await same;await tick();assert.ok(f.loaded.has(1));
 assert.equal(f.calls.at(-1).n,3,'background loading continues while paused at the start');
 for(let n=2;n<7;n++){f.calls.find(c=>c.n===n).resolve();await tick();}
 assert.equal(f.loaded.size,7);assert.equal(f.buffer.jobs.size,0);assert.equal(f.buffer.running,0);
 const fetched=f.calls.length;f.buffer.update({index:1800,time:150});await f.buffer.request(5);await tick();
 assert.equal(f.calls.length,fetched,'seeking a fully buffered replay makes no extra request');
 f.buffer.dispose();await tick();
}
// A 16x replay still waits for enough playing time rather than one short segment.
{
 const f=fixture({speed:16});await tick();
 assert.equal(f.buffer.canResume(),false,'initial 30 seconds only gives 1.875 seconds at 16x');
 assert.equal(f.buffer.jobs.size,29,'all remaining chunks are scheduled');
 f.calls[0].resolve();await tick();assert.equal(f.buffer.canResume(),false);
 f.calls[1].resolve();await tick();assert.equal(f.buffer.canResume(),true);
 assert.equal(f.buffer.running,2,'whole-record loading stays bounded');
 f.advance(12000);f.calls.at(-1).resolve();await tick();
 assert.ok(f.buffer.resumeSeconds>4,'slow responses increase the recovery watermark');
 f.buffer.dispose();await tick();
}
// When pauses are hidden, collapsed pause time must not count toward resuming.
{
 const times=Float64Array.from({length:12*360},(_,i)=>i/12+(i>=720?300:0));
 const pauses=new PauseTimeline(times.at(-1),[[60,360]]);
 const shown=fixture({times,speed:16}),hidden=fixture({times,display:t=>pauses.display(t,true),speed:16});
 for(const f of [shown,hidden]){f.loaded.add(1);f.loaded.add(2);f.buffer.update({index:719,time:times[719]});}
 assert.equal(shown.buffer.canResume(),true);assert.equal(hidden.buffer.canResume(),false);
 shown.buffer.dispose();hidden.buffer.dispose();await tick();
}
// A distant seek cancels old prefetches and schedules the requested chunk first.
{
 const f=fixture();await tick();const old=f.calls.slice();
 f.buffer.update({index:10*360,time:300,speed:1});const wanted=f.buffer.request(10);
 await tick();assert.ok(old.every(c=>c.signal.aborted));
 assert.deepEqual(f.calls.slice(2).map(c=>c.n),[10,11]);assert.equal(f.calls[2].priority,0);
 f.calls[2].resolve();await wanted;await tick();assert.ok(f.loaded.has(10));
 // Old responses arriving late cannot mark the abandoned chunks as loaded.
 old.forEach(c=>c.resolve());await tick();assert.ok(!f.loaded.has(1)&&!f.loaded.has(2));
 f.buffer.dispose();await tick();
}
// Immediately seeking back can replace an aborted job of the same chunk.
{
 const f=fixture();await tick();f.buffer.update({index:3600,time:300});f.buffer.update({index:0,time:0});
 const request=f.buffer.request(1);await tick();const replacement=f.calls.findLast(c=>c.n===1&&!c.signal.aborted);
 assert.ok(replacement);replacement.resolve();await request;assert.ok(f.loaded.has(1));
 f.buffer.dispose();await tick();
}
// Hidden replay hosts stop new work; reopening retains loaded chunks.
{
 const f=fixture();await tick();f.buffer.suspend();await tick();const before=f.calls.length;
 assert.ok(f.calls.every(c=>c.signal.aborted));f.buffer.update({index:720,time:60});await tick();assert.equal(f.calls.length,before);
 await assert.rejects(f.buffer.request(1),e=>e.name==='AbortError');
 f.buffer.resume({index:0,time:0});await tick();assert.equal(f.calls.length,before+2);
 f.buffer.dispose();await tick();assert.equal(f.buffer.running,0);
}
// Network failures back off instead of starting a retry storm every frame.
{
 const f=fixture();await tick();f.calls[0].reject(Object.assign(Error('offline'),{status:0}));await tick();
 const before=f.calls.length;for(let i=0;i<10;i++)f.buffer.update({index:0,time:0});await tick();assert.equal(f.calls.length,before);
 await assert.rejects(f.buffer.request(1),/offline/);f.advance(2001);f.buffer.update({index:0,time:0});f.calls.find(c=>c.n===2).resolve();await tick();
 assert.equal(f.calls.at(-1).n,1);f.calls.at(-1).resolve();await tick();assert.equal(f.buffer.failures.size,0);
 f.buffer.dispose();await tick();
}
// A missing chunk interrupts readiness, including the final partial chunk.
{
 const f=fixture({chunks:4,last:4,speed:16});await tick();f.loaded.add(2);
 assert.equal(f.buffer.canResume(),false,'a hole interrupts contiguous buffering');
 f.loaded.add(1);f.buffer.update({index:1080,time:90});
 assert.equal(f.buffer.canResume(),false);const request=f.buffer.request(3);await tick();
 f.calls.findLast(c=>c.n===3).resolve();await request;await tick();
 assert.equal(f.buffer.canResume(),true,'the final partial chunk can resume without a full watermark');
 f.buffer.dispose();await tick();
}
console.log('Whole-record buffering while paused, no repeat transfers, 16x readiness, seek priority, cancellation, retries and final chunks passed');
