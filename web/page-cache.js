// Small public page responses stay in this document's memory, never in a
// persistent API cache. Expired entries refresh without blanking the page.
export function createPageCache({allowed,load,maxAge=60000,limit=16,now=Date.now}){
 const entries=new Map(),pending=new Map(),retryAfter=new Map();
 function seed(key,value){
  if(!allowed(key))return;
  entries.delete(key);entries.set(key,{value,at:now()});
  while(entries.size>limit){const oldest=entries.keys().next().value;entries.delete(oldest);retryAfter.delete(oldest);}
 }
 function fresh(key,entry){return entry&&now()-entry.at<(typeof maxAge==='function'?maxAge(key):maxAge);}
 function refresh(key,priority){
  if(pending.has(key))return pending.get(key);
  const task=Promise.resolve().then(()=>load(key,{priority})).then(value=>{seed(key,value);retryAfter.delete(key);return value;}).catch(error=>{retryAfter.set(key,now()+5000);throw error;}).finally(()=>pending.delete(key));
  pending.set(key,task);return task;
 }
 function abortable(task,signal){
  if(!signal)return task;
  if(signal.aborted)return Promise.reject(new DOMException('Navigation cancelled','AbortError'));
  return new Promise((resolve,reject)=>{
   const abort=()=>{cleanup();reject(new DOMException('Navigation cancelled','AbortError'));},cleanup=()=>signal.removeEventListener('abort',abort);
   signal.addEventListener('abort',abort,{once:true});
   task.then(value=>{cleanup();if(signal.aborted)abort();else resolve(value);},error=>{cleanup();reject(error);});
  });
 }
 function get(key,{signal,priority='auto'}={}){
  if(!allowed(key))return Promise.reject(Error('This response cannot be cached'));
  if(signal?.aborted)return Promise.reject(new DOMException('Navigation cancelled','AbortError'));
  const entry=entries.get(key);
  if(entry){
   entries.delete(key);entries.set(key,entry);
   if(!fresh(key,entry)&&now()>=(retryAfter.get(key)||0))refresh(key,'low').catch(()=>{});
   return abortable(Promise.resolve(entry.value),signal);
  }
  return abortable(refresh(key,priority),signal);
 }
 function prefetch(key){
  if(!allowed(key)||fresh(key,entries.get(key))||now()<(retryAfter.get(key)||0))return Promise.resolve();
  return refresh(key,'low').catch(()=>{});
 }
 return {get,prefetch,seed};
}
