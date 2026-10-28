import assert from 'node:assert/strict';
import {afterFirstScreen} from '../web/first-screen.js';
import {bindFonts} from '../web/font-loader.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function browser(images=[]){
 const frames=[],timers=new Map(),idle=[];let serial=0;
 const win={innerHeight:700,navigator:{connection:{}},requestAnimationFrame:fn=>frames.push(fn),setTimeout:fn=>{timers.set(++serial,fn);return serial;},clearTimeout:id=>timers.delete(id),requestIdleCallback:fn=>idle.push(fn)};
 const doc={visibilityState:'visible',querySelectorAll:()=>images};return {win,doc,frames,timers,idle};
}
{
 const events=new Map(),image={complete:false,getBoundingClientRect:()=>({top:50,bottom:300}),addEventListener:(kind,fn)=>events.set(kind,fn),removeEventListener:kind=>events.delete(kind)};
 const b=browser([image]);let started=false;
 const work=afterFirstScreen(()=>{started=true;},{doc:b.doc,win:b.win});await tick();
 assert.equal(started,false);assert.equal(b.frames.length,0,'visible imagery has priority over background transfers');
 events.get('load')();await tick();b.frames.shift()();assert.equal(started,false);b.frames.shift()();await tick();
 assert.equal(started,false,'background tasks wait for an idle opportunity after painting');b.idle.shift()();await work;assert.equal(started,true);
}
for(const mode of ['hidden','saveData','slow']){
 const b=browser();if(mode==='hidden')b.doc.visibilityState='hidden';if(mode==='saveData')b.win.navigator.connection.saveData=true;if(mode==='slow')b.win.navigator.connection.effectiveType='2g';
 let started=false;const work=afterFirstScreen(()=>{started=true;},{doc:b.doc,win:b.win});await tick();b.frames.shift()();b.frames.shift()();await work;assert.equal(started,false,mode);
}
{
 const b=browser([{complete:false,getBoundingClientRect:()=>({top:900,bottom:1000})}]);let started=false;
 const work=afterFirstScreen(()=>{started=true;},{doc:b.doc,win:b.win});await tick();assert.equal(b.timers.size,0,'off-screen images do not hold background preparation');b.frames.shift()();b.frames.shift()();await tick();b.idle.shift()();await work;assert.equal(started,true);
}
function fontDoc(text,scriptText=''){
 const links=[],style={textContent:'unicode-range:U+20-7E,U+4E2D'},listeners={},observers=[];
 const element=(tag,children=[])=>({nodeType:1,tag,childNodes:children,matches:()=>tag==='script',closest:()=>tag==='script'?{}:null,getClientRects:()=>[{}]});
 const parent=element('p'),textNode={nodeType:3,textContent:text,parentElement:parent};parent.childNodes=[textNode];
 const script=element('script');script.childNodes=[{nodeType:3,textContent:scriptText,parentElement:script}];
 const doc={body:element('body',[parent,script]),getElementById:()=>style,head:{insertBefore:(link,before)=>{assert.equal(before,style);links.push(link);}},createElement:()=>({}),addEventListener:(name,fn)=>listeners[name]=fn};
 const win={MutationObserver:class{constructor(fn){this.deliver=fn;observers.push(this);}observe(){this.observed=true;}disconnect(){this.disconnected=true;}}};
 return {doc,win,links,listeners,observers,textNode};
}
{
 const b=fontDoc('HALLS 中','龘');bindFonts(b.doc,b.win);assert.equal(b.links.length,0,'non-rendered JSON/scripts cannot trigger a font transfer');
 b.textNode.textContent='龘';b.observers[0].deliver([{type:'characterData',target:b.textNode}]);
 assert.equal(b.links.length,1);assert.equal(b.links[0].href,'/assets/fonts/noto.css');assert.equal(b.observers[0].disconnected,true);
 b.listeners.input({target:{value:'another 龘'}});assert.equal(b.links.length,1,'the full fallback stylesheet loads at most once');
}
console.log('First-paint priority, visible image gating, deferred idle work, slow/hidden page restraint and on-demand Noto fallback passed');
