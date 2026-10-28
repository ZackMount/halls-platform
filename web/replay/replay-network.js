// Do not interpret an nginx/Cloudflare HTML error page as JSON.
const retryable=new Set([429,500,502,503,504]);
const failure=(message,status)=>Object.assign(new Error(message),{status});
export async function responseJSON(response){
 if(!(response.headers.get('Content-Type')||'').includes('application/json'))throw failure(`服务器暂未返回有效的回放信息（HTTP ${response.status}），请重试。`,response.status);
 try{return await response.json();}catch{throw failure('回放信息不完整，请重试。',response.status);}
}
function wait(ms,signal){return new Promise((resolve,reject)=>{
 if(signal?.aborted){reject(signal.reason||new DOMException('Aborted','AbortError'));return;}
 const abort=()=>{clearTimeout(timer);reject(signal.reason||new DOMException('Aborted','AbortError'));};
 const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve();},ms);signal?.addEventListener('abort',abort,{once:true});
});}
export async function fetchReplay(url,options={},fetcher=fetch,sleep=wait){
 for(let attempt=0;;attempt++){
  let response;
  try{response=await fetcher(url,options);}catch(error){if(error.name==='AbortError'||options.signal?.aborted)throw error;if(attempt>=2)throw failure('网络连接中断，请重新尝试播放。',0);await sleep(500*(attempt+1),options.signal);continue;}
  if(retryable.has(response.status)&&attempt<2){
   const seconds=Number(response.headers.get('Retry-After')),delay=seconds>0?Math.min(10000,seconds*1000):500*(attempt+1);
   await response.body?.cancel();await sleep(delay,options.signal);continue;
  }
  return response;
 }
}
export function publicReplayBase(value,id){return typeof value==='string'&&/^\/replay-public\/[a-f0-9]{24}\/[a-f0-9]{64}\/$/.test(value)&&(!id||value.split('/')[2]===id)?value:'';}
export class ReplayTransport{
 constructor(base,signal,fetcher=fetch,sleep=wait){this.base=base;this.publicBase=publicReplayBase(base.publicBase);this.signal=signal;this.fetcher=fetcher;this.sleep=sleep;this.ticket='';this.expires=0;this.renewing=null;}
 async request(url,options={}){return fetchReplay(url,{...options,headers:{Accept:'application/vnd.halls.replay.v5',...options.headers},signal:options.signal||this.signal},this.fetcher,this.sleep);}
 async authorize(){
  if(this.renewing)return this.renewing;
  this.renewing=(async()=>{const r=await this.request(this.base.session,{method:'POST'}),data=await responseJSON(r);if(!r.ok)throw failure(data.error||'回放不可访问或已下架。',r.status);if(typeof data.ticket!=='string')throw failure('回放授权信息不完整，请重试。',r.status);this.ticket=data.ticket;this.expires=Date.now()+Math.max(1000,((data.expiresIn||900)-60)*1000);})();
  try{await this.renewing;}finally{this.renewing=null;}
 }
 async fetch(part,options={}){
  if(this.publicBase){
   if(!/^(manifest|[1-9]\d{0,3})$/.test(String(part)))throw failure('回放分段超出范围。',404);
   const r=await this.request(this.publicBase+part+'.bin',{...options,credentials:'omit'});
   if(!r.ok){const data=await responseJSON(r);throw failure(data.error||'回放暂不可用，请稍后重试。',r.status);}return r;
  }
  if(!this.ticket||Date.now()>=this.expires)await this.authorize();
  const token=this.ticket;let r=await this.request(this.base.parts+part,{...options,headers:{...options.headers,'X-Replay-Ticket':token}});
  // Expiry or a mobile network/IP change: one fresh authorization, still
  // subject to the server's visibility and owner checks.
  if(r.status===404){await r.body?.cancel();if(this.ticket===token)this.ticket='';if(!this.ticket)await this.authorize();r=await this.request(this.base.parts+part,{...options,headers:{...options.headers,'X-Replay-Ticket':this.ticket}});}
  if(!r.ok){const data=await responseJSON(r);throw failure(data.error||'回放暂不可用，请稍后重试。',r.status);}return r;
 }
}
