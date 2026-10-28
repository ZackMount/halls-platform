import assert from 'node:assert/strict';
import {createReplayHost} from '../web/replay-host.js';
const messages=[],events=new Map(),timers=new Map(),observed=new Set();let timerId=0,frameLoads=0,target=null,busy=false,mobile=false;
const makeNode=tag=>({tag,dataset:{},style:{removeProperty(key){delete this[key];}},children:[],isConnected:true,hidden:false,append(child){child.parent=this;this.children.push(child);},setAttribute(key,value){this[key]=value;},contentWindow:tag==='iframe'?{postMessage:data=>messages.push(data)}:undefined,set src(value){this.source=value;frameLoads++;}});
const body=makeNode('body'),doc={body,createElement:makeNode};
const win={location:{origin:'https://test.local'},scrollX:0,scrollY:20,setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),matchMedia:()=>({matches:mobile}),addEventListener:(name,fn)=>events.set(name,fn)};
class Resize{constructor(fn){this.fn=fn;}observe(node){observed.add(node);}unobserve(node){observed.delete(node);}}
class Mutation{constructor(fn){this.fn=fn;}observe(){}}
const root={hasAttribute:()=>busy,querySelector:()=>target},host=createReplayHost(root,{doc,win,Resize,Mutation});
const warmA=host.warm(),warmB=host.warm();assert.equal(warmA,warmB);assert.equal(frameLoads,1);assert.equal(body.children.length,1);assert.equal(messages.length,0,'first-screen warmup must not open a record or fetch replay data');
const dock=body.children[0],iframe=dock.children[0];
events.get('message')({origin:'https://evil.local',source:iframe.contentWindow,data:{type:'halls-replay-ready'}});assert.equal(iframe.dataset.playerReady,undefined);
events.get('message')({origin:win.location.origin,source:{},data:{type:'halls-replay-ready'}});assert.equal(iframe.dataset.playerReady,undefined);
events.get('message')({origin:win.location.origin,source:iframe.contentWindow,data:{type:'halls-replay-ready'}});await warmA;assert.equal(timers.size,0);
const slot=(kind,id)=>({...makeNode('slot'),dataset:{replayKind:kind,replayId:id},getBoundingClientRect:()=>({left:80,top:200,width:900,height:1000})});
target=slot('run','a'.repeat(24));host.sync();await Promise.resolve();assert.equal(host.frame(),iframe);assert.equal(dock.style.top,'220px');assert.equal(dock.style.width,'900px');assert.deepEqual(messages.at(-1),{type:'halls-replay-open',kind:'run',id:'a'.repeat(24)});
busy=true;host.sync();assert.equal(host.frame(),null);assert.equal(dock.inert,true);assert.equal(messages.at(-1).visible,false);busy=false;host.sync();assert.equal(host.frame(),iframe);assert.equal(messages.at(-1).visible,true);
target=null;host.sync();assert.equal(dock.hidden,true);assert.equal(host.frame(),null);
for(let n=0;n<20;n++){target=slot(n%2?'preview':'run',n%2?'b'.repeat(24):'a'.repeat(24));host.sync();await Promise.resolve();assert.equal(host.frame(),iframe);assert.equal(iframe.parent,dock);assert.equal(frameLoads,1);assert.equal(observed.size,2,'old slot resize observations are released');}
mobile=true;events.get('message')({origin:win.location.origin,source:iframe.contentWindow,data:{type:'halls-replay-height',height:1200}});assert.equal(target.style.height,'1202px');
events.get('message')({origin:win.location.origin,source:iframe.contentWindow,data:{type:'halls-replay-height',height:100000}});assert.equal(target.style.height,'1202px');
mobile=false;events.get('resize')();assert.equal(target.style.height,undefined);
target=slot('run','a'.repeat(24));target.dataset.replayBase='/replay-public/'+'a'.repeat(24)+'/'+'b'.repeat(64)+'/';host.sync();await Promise.resolve();assert.equal(messages.at(-1).publicBase,target.dataset.replayBase);
target=slot('run','../../private');host.sync();assert.equal(dock.hidden,true);assert.equal(frameLoads,1);
console.log('Single warm iframe, persistent document, public/private switching, source validation, pause on navigation and responsive positioning passed');
