// Embedded players use the portal's registration. Standalone replay links
// also check for an updated worker, without requiring a visit to the portal.
export function updateReplayWorker(win=window){
 if(win.parent!==win||!win.navigator.serviceWorker)return Promise.resolve();
 const workers=win.navigator.serviceWorker;let controller=workers.controller,reloading=false;
 workers.addEventListener('controllerchange',()=>{
  const current=workers.controller;
  if(!controller){controller=current;return;}
  if(current&&current!==controller&&!reloading){reloading=true;win.location.reload();}
 });
 return workers.getRegistration('/').then(registration=>registration?registration.update():workers.register('/sw.js',{updateViaCache:'none'})).catch(()=>{});
}
