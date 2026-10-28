export function countdownText(seconds,language='zh'){
 let remaining=Math.max(0,Math.ceil(seconds));const days=Math.floor(remaining/86400);remaining%=86400;
 const hours=Math.floor(remaining/3600);remaining%=3600;const minutes=Math.floor(remaining/60),s=remaining%60;
 return language==='en'?`Downloads open in ${days}d ${hours}h ${minutes}m ${s}s`:`距离开放下载还有 ${days} 天 ${hours} 小时 ${minutes} 分 ${s} 秒`;
}
export function bindDownloadCountdown(root,{signal,language=()=> 'zh',refresh,elapsedSeconds=0,refreshOnVisible=true}){
 const node=root.querySelector('[data-download-countdown]');if(!node)return;
 const opens=Number(node.dataset.opensAt),server=Number(node.dataset.serverTime),started=performance.now();
 if(!Number.isFinite(opens)||!Number.isFinite(server))return;
 let refreshing=false;
 const update=()=>{
  if(signal.aborted)return;
  const remaining=opens-server-Math.max(0,elapsedSeconds)-(performance.now()-started)/1000;
  node.textContent=countdownText(remaining,language());
  if(remaining<=0&&!refreshing){refreshing=true;Promise.resolve().then(refresh).then(()=>clearInterval(timer)).catch(()=>{refreshing=false;});}
 };
 const timer=setInterval(update,1000);signal.addEventListener('abort',()=>clearInterval(timer),{once:true});
 if(refreshOnVisible)document.addEventListener('visibilitychange',()=>{
  if(document.hidden||signal.aborted||refreshing)return;
  refreshing=true;Promise.resolve().then(refresh).then(()=>clearInterval(timer)).catch(()=>{refreshing=false;update();});
 },{signal});update();
}
