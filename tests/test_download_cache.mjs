import assert from 'node:assert/strict';
import {createDownloadCache} from '../web/download-cache.js';
let clock=0,calls=0,html='open';
const cache=createDownloadCache({now:()=>clock,load:async()=>{calls++;return html;}});
cache.seed('scheduled');
for(let i=0;i<50;i++)assert.equal((await cache.get()).html,'scheduled');
await cache.prefetch();assert.equal(calls,0,'SSR and repeated navigation reuse a fresh page');
clock=30000;html='closed';const updates=[],controller=new AbortController();
cache.subscribe(entry=>updates.push(entry?.html),{signal:controller.signal});
assert.equal((await cache.get()).html,'scheduled','expired content is immediately visible during refresh');
await cache.refresh();assert.equal(calls,1);assert.deepEqual(updates,['closed']);
assert.equal((await cache.get()).html,'closed');assert.equal(cache.age(cache.snapshot()),0);
controller.abort();clock=60000;html='new version';await cache.prefetch();assert.deepEqual(updates,['closed'],'navigation abort detaches the previous page');
assert.equal((await cache.get()).html,'new version');

let finish,sharedCalls=0;const shared=createDownloadCache({load:()=>{sharedCalls++;return new Promise(resolve=>finish=resolve);}});
const warm=shared.prefetch(),click=shared.get(),deadline=shared.refresh();await Promise.resolve();finish('new manifest');
await warm;assert.equal((await click).html,'new manifest');await deadline;assert.equal(sharedCalls,1,'prefetch, click and opening-time refresh share one request');

let failureClock=0,failures=0,recover=false;const offline=createDownloadCache({now:()=>failureClock,load:async()=>{failures++;if(!recover)throw Error('offline');return 'closed';}});
offline.seed('old download links');const values=[];offline.subscribe(entry=>values.push(entry?.html??null));
failureClock=30001;assert.equal((await offline.get()).html,'old download links');await offline.prefetch();assert.equal(failures,1);
assert.equal((await offline.get()).html,'old download links');assert.equal(failures,1,'failed refreshes back off');
failureClock=120000;assert.equal(offline.snapshot(),null,'old links expire after two minutes even offline');
await assert.rejects(offline.get(),/offline/);assert.equal(values.at(-1),null);assert.equal(failures,2);
failureClock+=5000;recover=true;assert.equal((await offline.get()).html,'closed');assert.equal(values.at(-1),'closed');
console.log('Download preload reuse, request coalescing, 30s freshness, live updates, abort cleanup and 2m expiry passed');
