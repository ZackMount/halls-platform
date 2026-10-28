// Cache immutable public assets and the data-free replay shell. Other
// navigation, API responses and proofs stay online.
const VERSION='__ASSET_VERSION__',REPLAY_SHELL='__REPLAY_SHELL__',CACHE='halls-assets-v2',MEDIA=__MEDIA_MAP__,inflight=new Map();
const publicAsset=path=>/^\/static\/[a-f0-9]{16}\/(?:assets|replay-assets)\//.test(path);
async function migrate(){
 const target=await caches.open(CACHE);
 for(const name of await caches.keys()){
  if(!name.startsWith('halls-static-'))continue;
  const old=await caches.open(name);
  for(const request of await old.keys()){
   const relative=new URL(request.url).pathname.replace(/^\/static\/[a-f0-9]+\//,'');const item=MEDIA[relative];if(!item||await target.match(item.url))continue;
   const response=await old.match(request);if(!response||response.status!==200)continue;
   const data=await response.clone().arrayBuffer(),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(n=>n.toString(16).padStart(2,'0')).join('');
   if(hash===item.sha256)await target.put(item.url,response);
  }
  await caches.delete(name);
 }
}
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await migrate().catch(()=>{});await self.clients.claim();})()));
async function fullResponse(request,event){
 const cache=await caches.open(CACHE),cached=await cache.match(request.url);if(cached)return cached;
 let task=inflight.get(request.url);
 if(!task){
  const headers=new Headers(request.headers);headers.delete('Range');
  const response=fetch(new Request(request,{headers,cache:'force-cache',credentials:'omit'}));
  const stored=response.then(async r=>{if(r.status===200)await cache.put(request.url,r.clone());}).catch(()=>{}).finally(()=>inflight.delete(request.url));
  task={response,stored};inflight.set(request.url,task);
 }
 event.waitUntil(task.stored);return (await task.response).clone();
}
async function asset(request,event){
 const cache=await caches.open(CACHE),cached=await cache.match(request.url),range=request.headers.get('Range');
 // On a cold media request stream one complete response to both the player and
 // cache writer. A simultaneous guide preload joins the same network fetch.
 if(!cached)return fullResponse(request,event);
 if(!range)return cached;
 const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match)return cached;
 const blob=await cached.blob(),length=blob.size;let start=match[1]?Number(match[1]):Math.max(0,length-Number(match[2])),end=match[1]?(match[2]?Number(match[2]):length-1):length-1;end=Math.min(end,length-1);
 if(start>end||start>=length)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${length}`}});
 const headers=new Headers(cached.headers);headers.delete('Content-Encoding');headers.set('Content-Range',`bytes ${start}-${end}/${length}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');
 return new Response(blob.slice(start,end+1),{status:206,headers});
}
async function replayNavigation(request,event){
 const cache=await caches.open(CACHE),shell=new URL('/replay',self.location.origin).href;
 try{
  // The online shell selects the current decoder. A worker installed before a
  // protocol upgrade must not pin navigation to its own immutable old shell.
  const response=await fetch(new Request(request,{cache:'no-store'}));
  if(response.status===200&&(response.headers.get('Content-Type')||'').includes('text/html'))event.waitUntil(cache.put(shell,response.clone()).catch(()=>{}));
  return response;
 }catch{
  return await cache.match(shell)||asset(new Request(new URL(REPLAY_SHELL,self.location.origin)),event);
 }
}
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;if(url.pathname==='/replay')event.respondWith(replayNavigation(request,event));else if(publicAsset(url.pathname))event.respondWith(asset(request,event));});
