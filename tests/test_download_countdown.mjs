import assert from 'node:assert/strict';
import {bindDownloadCountdown,countdownText} from '../web/download-countdown.js';
const saved={setInterval:globalThis.setInterval,clearInterval:globalThis.clearInterval,document:globalThis.document,performance:globalThis.performance};
let clock=0,next=0,refreshes=0;const timers=new Map(),doc=new EventTarget();doc.hidden=false;
globalThis.performance={now:()=>clock};globalThis.document=doc;
globalThis.setInterval=fn=>{timers.set(++next,fn);return next;};globalThis.clearInterval=id=>timers.delete(id);
try{
 const node={dataset:{opensAt:'120',serverTime:'100'},textContent:''},root={querySelector:()=>node},controller=new AbortController();
 bindDownloadCountdown(root,{signal:controller.signal,elapsedSeconds:12,refreshOnVisible:false,refresh:async()=>{refreshes++;}});
 assert.equal(node.textContent,countdownText(8),'cached server time includes the elapsed cache age');
 doc.dispatchEvent(new Event('visibilitychange'));await Promise.resolve();assert.equal(refreshes,0,'the download page owns visibility refreshes');
 clock=8000;for(const update of [...timers.values()])update();await new Promise(setImmediate);
 assert.equal(refreshes,1);assert.equal(timers.size,0,'opening time fetch clears its countdown timer');
 const another=new AbortController();clock=0;
 bindDownloadCountdown(root,{signal:another.signal,elapsedSeconds:0,refresh:async()=>{refreshes++;}});
 assert.equal(timers.size,1);another.abort();assert.equal(timers.size,0,'replacing a cached page stops the old timer');
 doc.dispatchEvent(new Event('visibilitychange'));await Promise.resolve();assert.equal(refreshes,1,'aborted countdown does not refresh on visibility');
 controller.abort();
}finally{Object.assign(globalThis,saved);}
console.log('Cached countdown age, opening-time refresh and timer/listener cancellation passed');
