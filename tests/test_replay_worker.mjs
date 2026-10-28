import assert from 'node:assert/strict';
import {updateReplayWorker} from '../web/replay/replay-worker.js';
function fixture(controller={},registration={update:async()=>{updated++;}}){
 let listener,reloads=0,registered=0;const workers={controller,addEventListener:(name,fn)=>{assert.equal(name,'controllerchange');listener=fn;},getRegistration:async scope=>{assert.equal(scope,'/');return registration;},register:async(url,options)=>{assert.equal(url,'/sw.js');assert.deepEqual(options,{updateViaCache:'none'});registered++;}};
 const win={navigator:{serviceWorker:workers},location:{reload:()=>reloads++}};win.parent=win;
 return {win,workers,change:()=>listener(),counts:()=>({reloads,registered})};
}
let updated=0;
const existing=fixture();await updateReplayWorker(existing.win);assert.equal(updated,1);
existing.workers.controller={};existing.change();existing.change();assert.equal(existing.counts().reloads,1,'one reload for a worker replacement, no controllerchange loop');
const initial=fixture(null,null);await updateReplayWorker(initial.win);assert.equal(initial.counts().registered,1);initial.workers.controller={};initial.change();assert.equal(initial.counts().reloads,0,'initial control does not reload');
initial.workers.controller={};initial.change();assert.equal(initial.counts().reloads,1);
const embedded=fixture();embedded.win.parent={};await updateReplayWorker(embedded.win);assert.equal(updated,1,'iframe leaves worker registration to its parent');
await updateReplayWorker({parent:{},navigator:{}});
const failed=fixture({}, {update:async()=>{throw Error('Offline');}});await updateReplayWorker(failed.win);assert.equal(failed.counts().reloads,0,'worker update failure does not interrupt playback');
console.log('Standalone worker refresh, initial install, one-shot controller replacement, embedded isolation and offline update failure passed');
