let cacheReady,guideRoot,controller;
export function ensurePublicCache(){
 if(!cacheReady)cacheReady=(async()=>{if('serviceWorker' in navigator){try{const registration=await navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'});if(registration.installing)await new Promise(resolve=>{const worker=registration.installing;worker.addEventListener('statechange',()=>{if(['activated','redundant'].includes(worker.state))resolve();});});await navigator.serviceWorker.ready;}catch{}}})();
 return cacheReady;
}
export async function startPreload(){
 ensurePublicCache();const root=document.querySelector('#overview video[data-guide-src]');
 if(location.pathname!=='/about'||!root){controller?.abort();controller=null;guideRoot=null;return;}
 if(guideRoot===root)return;controller?.abort();guideRoot=root;const current=controller=new AbortController();
 await ensurePublicCache();if(current.signal.aborted)return;
 const list=[...new Set([...document.querySelectorAll('video[data-guide-src]')].map(v=>new URL(v.dataset.guideSrc,location.origin).href))];let index=0;
 async function fill(){while(index<list.length&&!current.signal.aborted){const url=list[index++];try{
  if('caches' in window&&await caches.match(url))continue;
  const response=await fetch(url,{priority:'low',cache:'force-cache',credentials:'omit',signal:current.signal});
  if(response.ok){if(!navigator.serviceWorker?.controller&&'caches' in window){const cache=await caches.open('halls-assets-v2');await cache.put(url,response.clone());}await response.arrayBuffer();}
 }catch{}}}
 await Promise.all([fill(),fill()]);
}
