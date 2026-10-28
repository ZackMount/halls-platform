import {ensurePublicCache} from './preload.js';
export function loopOpacity(time,duration){
 if(!Number.isFinite(duration)||duration<=0)return 1;
 const t=Math.max(0,Math.min(1,time/.4,(duration-time)/.4));return t*t*(3-2*t);
}
const clips=new Map();let observer;
export function bindGuideMedia(){
 if(typeof document==='undefined')return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!observer){observer=new IntersectionObserver(entries=>{for(const entry of entries){const state=clips.get(entry.target);if(state){state.visible=entry.isIntersecting;state.sync();}}},{threshold:.1});
  const sync=()=>{for(const state of clips.values())state.sync();};document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 }
 for(const [video,state] of clips)if(!video.isConnected){state.stop();video.pause();observer.unobserve(video);clips.delete(video);}
 for(const video of document.querySelectorAll('video[data-guide-src]')){
  if(clips.has(video))continue;const wrapper=video.parentElement;let raf=0;
  const stop=()=>{cancelAnimationFrame(raf);raf=0;};
  const tick=()=>{raf=0;if(video.paused||!video.isConnected)return;video.style.opacity=String(loopOpacity(video.currentTime,video.duration));raf=requestAnimationFrame(tick);};
  const state={visible:false,starting:false,stop,sync(){
   if(reduced.matches){video.pause();wrapper.classList.remove('ready');video.style.visibility='hidden';return;}
   video.style.visibility='';
   if(state.visible&&document.visibilityState==='visible'){
    if(!state.starting){state.starting=true;ensurePublicCache().then(()=>{if(state.visible&&video.isConnected&&document.visibilityState==='visible'){if(!video.getAttribute('src'))video.src=video.dataset.guideSrc;video.muted=true;video.play().catch(()=>wrapper.classList.remove('ready'));}}).finally(()=>state.starting=false);}
   }else video.pause();
  }};
  video.addEventListener('playing',()=>{wrapper.classList.add('ready');stop();tick();});video.addEventListener('pause',stop);
  video.addEventListener('error',()=>wrapper.classList.remove('ready'));wrapper.addEventListener('click',()=>state.sync());
  clips.set(video,state);observer.observe(video);state.sync();
 }
}
