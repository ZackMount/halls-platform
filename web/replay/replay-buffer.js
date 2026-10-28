// Fetch the whole opened replay in the background, with the current position first.
// Playback only waits for its resume watermark, never for the entire recording.
const abortError=()=>new DOMException('Buffer request cancelled','AbortError');
export class ReplayBuffer{
 constructor({times,duration,loaded,load,display=t=>t,onChange=()=>{},onError=()=>{},clock=()=>performance.now(),concurrency=2}){
  Object.assign(this,{times,duration,loaded,load,display,onChange,onError,clock,concurrency});
  this.jobs=new Map();this.failures=new Map();this.running=0;this.latency=1;this.active=true;this.disposed=false;this.target={index:0,time:0,speed:1};
 }
 get chunks(){return Math.ceil(this.times.length/360);}
 get resumeSeconds(){return Math.max(4,Math.min(10,this.latency*3));}
 ahead(){
  let n=Math.floor(this.target.index/360);if(!this.loaded.has(n))return 0;
  while(n+1<this.chunks&&this.loaded.has(n+1))n++;
  const end=n===this.chunks-1?this.duration:this.times[Math.min(this.times.length-1,(n+1)*360-1)];
  return Math.max(0,(this.display(end)-this.display(this.target.time))/this.target.speed);
 }
 canResume(){const remaining=Math.max(0,(this.display(this.duration)-this.display(this.target.time))/this.target.speed);return this.loaded.has(Math.floor(this.target.index/360))&&this.ahead()+1e-6>=Math.min(this.resumeSeconds,remaining);}
 update(target){
  const previous=Math.floor(this.target.index/360);Object.assign(this.target,target);const current=Math.floor(this.target.index/360);
  if(current!==previous&&!this.loaded.has(current))for(const [n,job] of this.jobs)if(job.started&&(n<current||n>current+1))job.controller.abort();
  this.fill();
 }
 fill(){
  if(!this.active||this.disposed)return;const current=Math.floor(this.target.index/360);
  for(let n=0;n<this.chunks;n++){
   if(this.loaded.has(n)||(this.failures.get(n)?.retryAt||0)>this.clock())continue;
   const priority=(n-current+this.chunks)%this.chunks,job=this.jobs.get(n);
   if(job&&!job.controller.signal.aborted)job.priority=priority;
   else this.enqueue(n,priority).catch(()=>{});
  }
  this.pump();
 }
 request(n){
  if(!Number.isInteger(n)||n<0||n>=this.chunks)return Promise.reject(Error('回放分段超出范围。'));
  if(this.loaded.has(n))return Promise.resolve();if(!this.active||this.disposed)return Promise.reject(abortError());
  const retry=this.failures.get(n);if(retry&&retry.retryAt>this.clock())return Promise.reject(retry.error);
  const task=this.enqueue(n,0);this.pump();return task;
 }
 enqueue(n,priority){
  let job=this.jobs.get(n);if(job&&!job.controller.signal.aborted){job.priority=Math.min(job.priority,priority);return job.promise;}
  job={priority,controller:new AbortController(),started:false};job.promise=new Promise((resolve,reject)=>{job.resolve=resolve;job.reject=reject;});this.jobs.set(n,job);return job.promise;
 }
 pump(){
  if(!this.active||this.disposed)return;
  while(this.running<this.concurrency){
   const next=[...this.jobs].filter(([,job])=>!job.started).sort(([a,x],[b,y])=>x.priority-y.priority||a-b)[0];if(!next)break;
   const [n,job]=next;job.started=true;this.running++;const began=this.clock(),signal=job.controller.signal;
   const aborted=new Promise((_,reject)=>{job.abort=()=>reject(abortError());signal.addEventListener('abort',job.abort,{once:true});});
   Promise.race([Promise.resolve().then(()=>this.load(n,signal,job.priority)),aborted]).then(()=>{
    if(signal.aborted||this.disposed)throw abortError();this.loaded.add(n);this.failures.delete(n);this.latency=this.latency*.7+Math.max(.01,(this.clock()-began)/1000)*.3;job.resolve();
   }).catch(error=>{
    if(error.name!=='AbortError'&&!this.disposed){const attempts=(this.failures.get(n)?.attempts||0)+1;this.failures.set(n,{error,attempts,retryAt:this.clock()+Math.min(30000,2000*2**(attempts-1))});this.onError(n,error);}
    job.reject(error);
   }).finally(()=>{
    signal.removeEventListener('abort',job.abort);this.running--;if(this.jobs.get(n)===job)this.jobs.delete(n);this.onChange();this.fill();
   });
  }
 }
 suspend(){this.active=false;for(const [n,job] of this.jobs){job.controller.abort();if(!job.started){this.jobs.delete(n);job.reject(abortError());}}}
 resume(target){this.active=true;this.update(target);}
 dispose(){this.disposed=true;this.suspend();}
}
