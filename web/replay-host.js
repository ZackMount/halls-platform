// Keep the iframe in one permanent DOM location. Reparenting an iframe would
// recreate its document and WebGL context, even when its assets are cached.
export function createReplayHost(root,{doc=document,win=window,Resize=ResizeObserver,Mutation=MutationObserver}={}){
 let host,player,ready=false,pending,resolveReady,rejectReady,timer,slot=null,serial=0,suspended=true;
 const valid=target=>target&&['run','preview'].includes(target.dataset.replayKind)&&/^[a-f0-9]{24}$/.test(target.dataset.replayId);
 function send(data){player?.contentWindow?.postMessage(data,win.location.origin);}
 function position(){if(!host||host.hidden||!slot?.isConnected)return;const rect=slot.getBoundingClientRect();Object.assign(host.style,{left:(rect.left+win.scrollX)+'px',top:(rect.top+win.scrollY)+'px',width:rect.width+'px',height:rect.height+'px'});}
 function suspend(){if(suspended)return;suspended=true;send({type:'halls-replay-visibility',visible:false});}
 function park(){++serial;suspend();if(slot)resize.unobserve(slot);slot=null;if(host){host.hidden=true;host.inert=true;}}
 function warm(){
  if(ready)return Promise.resolve(player);if(pending)return pending;
  pending=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
  timer=win.setTimeout(()=>{pending=null;rejectReady(Error('回放界面未能载入，请重试。'));},30000);
  if(!player){
   host=doc.createElement('div');host.className='replay-host';host.hidden=true;host.inert=true;
   player=doc.createElement('iframe');player.className='replay-frame';player.title='HALLS 交互回放';player.setAttribute('allow','fullscreen');host.append(player);doc.body.append(host);
  }
  player.src='/replay-assets/frame.html';return pending;
 }
 function sync(){
  if(root.hasAttribute('aria-busy')){suspend();if(host)host.inert=true;return;}
  const target=root.querySelector('.replay-slot');if(!valid(target)){park();return;}
  if(slot===target){if(host)host.inert=false;if(suspended&&ready){suspended=false;send({type:'halls-replay-visibility',visible:true});}position();return;}
  if(slot)resize.unobserve(slot);slot=target;const generation=++serial;suspended=false;resize.observe(target);
  const task=warm();host.hidden=false;host.inert=false;position();
  task.then(()=>{if(generation!==serial||!slot?.isConnected)return;send({type:'halls-replay-open',kind:slot.dataset.replayKind,id:slot.dataset.replayId,...(slot.dataset.replayBase?{publicBase:slot.dataset.replayBase}:{})});}).catch(error=>{if(generation!==serial||!slot?.isConnected)return;host.hidden=true;slot.textContent=error.message;const retry=doc.createElement('button');retry.textContent='重试';retry.onclick=()=>{slot=null;sync();};target.append(retry);});
 }
 win.addEventListener('message',event=>{
  if(event.origin!==win.location.origin||event.source!==player?.contentWindow)return;
  if(event.data?.type==='halls-replay-ready'){ready=true;win.clearTimeout(timer);player.dataset.playerReady='true';resolveReady?.(player);}
  if(event.data?.type==='halls-replay-height'&&slot?.isConnected&&win.matchMedia('(pointer:coarse), (max-width:700px)').matches){const height=event.data.height;if(Number.isFinite(height)&&height>=400&&height<=1800){slot.style.height=(Math.ceil(height)+2)+'px';position();}}
 });
 const resize=new Resize(position);resize.observe(root);
 new Mutation(sync).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-busy']});
 win.addEventListener('resize',()=>{if(slot&&!win.matchMedia('(pointer:coarse), (max-width:700px)').matches)slot.style.removeProperty('height');position();});
 return {warm,sync,suspend,frame:()=>ready&&slot?.isConnected&&!host.hidden&&!root.hasAttribute('aria-busy')?player:null};
}
