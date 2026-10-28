// Public download HTML only, held in this tab's memory. File access is always
// checked separately by the server; this cache never requests game packages.
export function createDownloadCache({load,now=()=>performance.now(),maxAge=30000,maxStale=120000}){
 let entry=null,pending=null,retryAt=0;const listeners=new Set();
 const snapshot=()=>entry&&now()-entry.at<maxStale?entry:null;
 const age=value=>Math.max(0,now()-value.at);
 function publish(){const value=snapshot();for(const listener of listeners)listener(value);}
 function seed(html){entry={html,at:now()};retryAt=0;publish();return entry;}
 function request(priority='auto'){
  if(pending)return pending;
  if(now()<retryAt)return Promise.reject(Error('下载列表暂时无法更新，请稍后重试。'));
  pending=Promise.resolve().then(()=>load({priority})).then(seed).catch(error=>{retryAt=now()+5000;publish();throw error;}).finally(()=>pending=null);
  return pending;
 }
 async function get(){
  const cached=snapshot();
  if(cached){if(age(cached)>=maxAge)request('low').catch(()=>{});return cached;}
  return request();
 }
 function prefetch(){if(!entry||age(entry)>=maxAge)return request('low').catch(()=>{});return Promise.resolve(entry);}
 function subscribe(listener,{signal}={}){
  if(signal?.aborted)return ()=>{};
  listeners.add(listener);const stop=()=>listeners.delete(listener);signal?.addEventListener('abort',stop,{once:true});return stop;
 }
 return {get,prefetch,refresh:request,seed,subscribe,snapshot,age,maxAge};
}
