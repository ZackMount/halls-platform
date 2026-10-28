export function createPageTransition(root,{host=document.body,delay=120,schedule=setTimeout,cancel=clearTimeout,reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
 let generation=0,timer,shown=false;
 function begin(){
  cancel(timer);const token=++generation;shown=false;host.classList.remove('page-loading');
  root.inert=true;root.setAttribute('aria-busy','true');
  timer=schedule(()=>{if(token===generation){shown=true;host.classList.add('page-loading');}},delay);
  return token;
 }
 function finish(token){
  if(token!==generation)return;
  cancel(timer);host.classList.remove('page-loading');root.inert=false;root.removeAttribute('aria-busy');
  if(shown&&!reduced())root.animate?.(root.querySelector?.('.replay-slot')?[{opacity:.85},{opacity:1}]:[{opacity:.85,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:160,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 return {begin,finish};
}
