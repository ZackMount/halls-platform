import {createReferenceRouteLoader,createReferenceRouteMesh,createReferenceRouteMap,drawReferenceRouteMap} from '/replay-assets/reference-route.js';
import {coinCollected,coinPose,replayCoins} from '/replay-assets/coins.js';
import {createCoinModel,updateCoinModel} from '/replay-assets/coin-model.js';
import {exitState,exitLabel,EXIT_GREEN,EXIT_CHANGED} from '/replay-assets/exits.js';
import {bindFonts} from '/assets/font-loader.js';
import {flightEase,flightDuration,frameTimes,followSteps,poseDiscontinuous} from '/replay-assets/camera-transition.js';
import {touchShape,touchChange,pinchMap} from '/replay-assets/touch-controls.js';
import {decodeInitial,decodeChunk} from '/replay-assets/visual-codec.js';
import {ReplayTransport,fetchReplay,responseJSON,publicReplayBase} from '/replay-assets/replay-network.js';
import {ReplayBuffer} from '/replay-assets/replay-buffer.js';
import {PauseTimeline} from '/replay-assets/pause-timeline.js';
import {markerPlacement,markerLabels,attachedLabel} from '/replay-assets/hud-markers.js';
import {applyLanguage,currentLanguage} from '/assets/i18n.js';
import * as THREE from '/replay-assets/vendor/three.module.js';
import {zoomMapAt} from '/replay-assets/map-controls.js';
import {stepThirdPerson,targetEmbedded} from '/replay-assets/camera-rig.js';
import {ReplayWorld,updateCableGeometry,updateParticles} from '/replay-assets/scene.js';
import {showImportStatus,importError} from '/replay-assets/import-status.js';
import {updateReplayWorker} from '/replay-assets/replay-worker.js';
const $=id=>document.getElementById(id), modes=[...document.querySelectorAll('[data-mode]')];
const state={active:window.parent===window,meta:null,f:null,u:null,times:null,index:0,time:0,playing:false,speed:1,mode:'top',zoom:1,pan:[0,0],drag:null,keys:new Set(),freeYaw:0,freePitch:0,orbit:0,orbitHeight:4.5,subject:-1,flySpeed:7,mouseButton:-1};
import {createEntityModel} from '/replay-assets/entity-model.js';
import {recordedSpeed} from '/replay-assets/player-speed.js';
import {updateBattery} from '/replay-assets/battery.js';
import {healthLabel,abnormalHealth,healthAt} from '/replay-assets/health.js';
const proceduralEntity=createEntityModel();
let loadId=0,loadController=null,sceneModel=null,thirdRig=null,thirdTime=0,viewFlight=null,mapFlight=null;
let renderer=null,world=null,camera=null,ceiling=null,playerMarker=null,entityMarkers=[],entityMeshes=[],exitParticles=null,pathLine=null,flash=null,lastPose=-1;
let hudNodes=[],coinMeshes=[],originalExitParticles=null,winPositionMarker=null;
let referenceMesh=null,referenceMapPath=null,referenceData=null;
const referenceRoutes=createReferenceRouteLoader({load:async(id,{signal})=>{
 const response=await fetchReplay('/api/runs/'+id+'/race-reference',{signal});const value=await responseJSON(response);
 if(!response.ok)throw Error('参考路线暂不可用，请重试。');return value;
},onChange:updateReferenceRoute});
function updateReferenceRoute(view){
 const toggle=$('optimal-route'),english=currentLanguage()==='en';toggle.checked=view.enabled;toggle.disabled=!state.ready||!view.id||view.status==='unavailable';toggle.setAttribute('aria-busy',String(view.status==='loading'));
 toggle.title=view.status==='loading'?(english?'Loading route…':'正在载入参考路线…'):view.status==='error'?(english?'Route unavailable; select to retry.':'路线载入失败，点击重试。'):!view.id||view.status==='unavailable'?(english?'This replay has no reference route.':'此回放没有参考路线。'):(english?'Spawn to original exit.':'出生点至原始出口。');
 if(referenceData!==view.data){
  if(referenceMesh){world?.remove(referenceMesh);referenceMesh.geometry.dispose();referenceMesh.material.dispose();referenceMesh=null;}
  referenceData=view.data;referenceMapPath=null;
  if(referenceData?.available){
   referenceMapPath=createReferenceRouteMap(referenceData);
   if(world){referenceMesh=createReferenceRouteMesh(referenceData);world.add(referenceMesh);}
  }
 }
 if(referenceMesh)referenceMesh.visible=view.enabled&&state.active;
}
$('optimal-route').onchange=()=>referenceRoutes.select($('optimal-route').checked);
function configureMarkers(entities){$('free-markers').replaceChildren();hudNodes=Array.from({length:entities+4+(state.coins?.length||0)},(_,i)=>{
 const coin=i>=entities+4?state.coins[i-entities-4]:null,exit=i===entities+1?'current':i===entities+2?'original':i===entities+3?'mismatch':null,node=document.createElement('div');node.className='hud-marker '+(coin?'hud-coin':exit==='mismatch'?'hud-exit-mismatch':exit?'hud-exit':i===0?'hud-player':'hud-entity');node.dataset.noI18n='';if(coin)node.dataset.coinId=coin.id;
 const glyph=coin?'<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m8 4 2.5 4L8 12 5.5 8Z" fill="currentColor"/>':'<path d="M8 1 15 8 8 15 1 8Z" fill="none" stroke="currentColor" stroke-width="1.5"/>';
 node.innerHTML='<svg class="hud-dot" viewBox="0 0 16 16">'+glyph+'</svg><svg class="hud-arrow" viewBox="0 0 20 20"><path d="m5 4 10 6-10 6" fill="none" stroke="currentColor" stroke-width="2"/></svg><span class="hud-label"><b></b><small></small></span>';
 $('free-markers').append(node);return {node,coin,exit,label:node.querySelector('.hud-label'),name:node.querySelector('b'),distance:node.querySelector('small'),arrow:node.querySelector('.hud-arrow')};
});}
function updateCoinHUD(){
 const coins=state.coins||[],counter=$('coin-status');counter.hidden=!state.ready||!coins.length||!$('show-hud').checked;if(counter.hidden)return;
 const collected=coins.reduce((total,coin)=>total+Number(coinCollected(coin,state.time)),0),english=currentLanguage()==='en',label=english?'Coins':'金币',value=`${collected} / ${coins.length}`;
 if($('coin-status-label').textContent!==label)$('coin-status-label').textContent=label;
 if($('coin-count').textContent!==value)$('coin-count').textContent=value;
 const description=english?`Coins collected: ${collected} of ${coins.length}`:`已拾取 ${collected} / ${coins.length} 枚金币`;if(counter.getAttribute('aria-label')!==description)counter.setAttribute('aria-label',description);
}
const touchUI=matchMedia('(pointer: coarse), (max-width:700px)');
const hudPoint=new THREE.Vector3();
function drawMarkers(width,height){
 if(state.mode==='top'||!$('show-hud').checked)return;camera.updateMatrixWorld();const i=state.index,info=exitState(state.meta,state.time),original=info.canonical||info.cell,win=state.meta.exitCompletionMismatch?.position||[0,0];
 const targets=[[at(i,6),at(i,7),-at(i,8)],...Array.from({length:state.meta.entities},(_,e)=>[at(i,24+12*e),2.15,-at(i,25+12*e)]),[info.cell[0]*2+1,.15,-info.cell[1]*2-1],[original[0]*2+1,.15,-original[1]*2-1],[win[0],.15,-win[1]],...(state.coins||[]).map(coin=>[coin.position[0],coinPose(at(i,22),null,at(i,22),coin.id).height,-coin.position[1]])];
 const points=targets.map(target=>{hudPoint.set(...target).applyMatrix4(camera.matrixWorldInverse);return markerPlacement(hudPoint,width,height,camera.projectionMatrix.elements[0],camera.projectionMatrix.elements[5]);});
 const distances=targets.map(t=>Math.hypot(t[0]-camera.position.x,t[1]-camera.position.y,t[2]-camera.position.z));
 const visible=points.map((_,n)=>n).filter(n=>hudNodes[n].exit==='original'?info.showOriginal:hudNodes[n].exit==='mismatch'?!!state.meta.exitCompletionMismatch:hudNodes[n].coin?!coinCollected(hudNodes[n].coin,state.time):state.mode==='free'?distances[n]>=.3:n!==state.subject+1);
 const placed=visible.map(n=>attachedLabel(points[n],width,height)),labels=Object.fromEntries(visible.map((n,j)=>[n,placed[j]])),english=currentLanguage()==='en';
 hudNodes.forEach((item,n)=>{item.node.hidden=!labels[n];if(item.node.hidden)return;const distance=distances[n],p=points[n];
  item.node.classList.toggle('edge',p.edge);item.node.style.transform=`translate(${p.x}px,${p.y}px)`;item.arrow.style.transform=`translate(-50%,-50%) rotate(${p.angle}rad)`;
  item.node.classList.toggle('hud-exit-altered',item.exit==='current'&&info.altered);
  item.label.style.transform=labels[n].transform||'translateX(-50%)';item.label.style.left=labels[n].x+'px';item.label.style.top=labels[n].y+'px';const title=item.coin?`${english?'COIN':'金币'} ${item.coin.id+1}`:item.exit==='mismatch'?(english?'VICTORY POSITION':'胜利位置'):item.exit?exitLabel(info,item.exit==='original',english):n===0?(english?'PLAYER':'玩家'):`E${String(n).padStart(2,'0')}`,range=distance<1000?`${Math.round(distance)} m`:`${(distance/1000).toFixed(1)} km`;
  if(item.name.textContent!==title)item.name.textContent=title;if(item.distance.textContent!==range)item.distance.textContent=range;
 });
}
let pauseTimeline=new PauseTimeline(0);
const pausesHidden=()=>!$('show-pauses').checked;
function recordedPause(time){return !!pauseTimeline.pauseAt(time);}
function timelineScale(){const hidden=pausesHidden();$('timeline').max=hidden?pauseTimeline.active:pauseTimeline.duration;$('timeline').style.background=pauseTimeline.background(hidden);$('duration').textContent=stamp(hidden?pauseTimeline.active:pauseTimeline.duration);$('time-basis').textContent=hidden?'已隐藏暂停':'实际经过时间';transport(true);maintainBuffer(true);}

const mapCanvas=$('map'),ctx=mapCanvas.getContext('2d'),bitmapCanvas=document.createElement('canvas');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const at=(i,k)=>{const a=state.f[i*state.meta.words+k];if(k===19)return healthAt(visual?.healthEvents,i===state.index?state.time:state.times[i],a);if(i!==state.index||i+1>=state.meta.frames||!loaded.has(Math.floor((i+1)/360)))return a;const subject=k>=6&&k<=18?-1:k>=24&&(k-24)%12<=2?Math.floor((k-24)/12):null;if(subject!==null&&recordedTeleport(i,subject))return a;const t=clamp((state.time-state.times[i])/(state.times[i+1]-state.times[i]),0,1),b=state.f[(i+1)*state.meta.words+k];return a+((k===9||k===15||k>=24&&(k-24)%12===2)?((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI:b-a)*t;}, bits=(i,k)=>state.u[i*state.meta.words+k];
const stamp=t=>{const ms=Math.floor(Math.max(0,t)*1000);return `${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
const size=n=>n>1048576?`${(n/1048576).toFixed(2)} MiB`:`${(n/1024).toFixed(1)} KiB`;
function error(message,checks){$('error').hidden=false;$('error').textContent=message;if(checks)showImportStatus($('error'),checks);}
function setBuffering(on){state.buffering=on;$('buffering').hidden=!on;}
function setPlaying(on){state.playing=on;$('play').textContent=on?'暂停':'播放';if(!on&&state.seekTargetTime==null){state.pendingPlayback=null;state.waitingChunk=null;setBuffering(false);}if(on&&state.ready){maintainBuffer(true);if(!replayBuffer.canResume())setBuffering(true);}}
function chooseIndex(time){let lo=0,hi=state.meta.frames-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(state.times[mid]<=time)lo=mid;else hi=mid-1;}return lo;}
let seekSerial=0;async function seek(i,requestedTime=null){
 const serial=++seekSerial;viewFlight=null;mapFlight=null;$('error').hidden=true;if(!state.meta||!state.meta.playbackSafe)return;
 const index=clamp(Math.round(i),0,state.meta.frames-1);state.pendingPlayback=null;state.waitingChunk=null;state.seekTargetTime=requestedTime==null?state.times[index]:clamp(requestedTime,0,state.meta.duration);maintainBuffer(true);setBuffering(!loaded.has(Math.floor(index/360)));
 try{await ensureChunk(Math.floor(index/360));if(index%360===359&&index+1<state.meta.frames)await ensureChunk(Math.floor(index/360)+1);if(serial!==seekSerial)return;state.index=index;state.time=state.seekTargetTime;lastPose=-1;thirdRig=null;updateHUD();}
 catch(e){if(serial===seekSerial&&e.name!=='AbortError'){setPlaying(false);error(e.message);}}
 finally{if(serial===seekSerial){state.seekTargetTime=null;maintainBuffer(true);setBuffering(state.playing&&!replayBuffer?.canResume());}}
}
function seekTime(time){return seek(chooseIndex(clamp(time,0,state.meta.duration)),time);}
function transport(force=false){$('timeline').value=pauseTimeline.display(state.time,pausesHidden());const tick=Math.floor(state.time*20);if(force||state.displayClock!==tick){$('time').textContent=stamp(pauseTimeline.display(state.time,pausesHidden()));state.displayClock=tick;}}
function clearReplay(){referenceRoutes.reset();replayBuffer?.dispose();replayBuffer=null;state.pendingPlayback=null;$('recorded-pause').hidden=true;$('time-basis').textContent='';++seekSerial;state.waitingChunk=null;state.seekTargetTime=null;setBuffering(false);$('input-panel').hidden=true;updateBattery($('battery-status'),NaN);$('battery-status').hidden=false;$('current-subject').textContent='玩家';state.ready=false;setPlaying(false);state.meta=null;state.coins=[];$('coin-status').hidden=true;state.f=null;state.u=null;state.times=null;state.playedPath=null;state.index=0;state.time=0;state.subject=-1;state.paths=[];state.bitmap=null;state.keys.clear();disposeWorld();world=null;camera=null;ceiling=null;playerMarker=null;pathLine=null;entityMeshes=[];coinMeshes=[];exitParticles=null;originalExitParticles=null;winPositionMarker=null;modes.forEach(b=>b.disabled=true);renderer?.clear();ctx.clearRect(0,0,mapCanvas.width,mapCanvas.height);$('timeline').disabled=true;$('play').disabled=true;$('empty').hidden=false;$('subjects').replaceChildren();for(const id of ['subject-speed','focus-detail','time','tick','duration'])$(id).textContent='—';setMode('top');}
async function load(file,token=null,targetTick=0,publicBase=''){
 if(!file&&!token)return;if(file)history.replaceState(null,'',location.pathname);const generation=++loadId;loadController?.abort();loadController=new AbortController();clearReplay();referenceRoutes.reset(!privatePreview&&token?token:'');$('loading').hidden=false;$('loading').textContent='正在载入回放…';$('error').hidden=true;
 try{
  if(file&&file.size>64*1024*1024)throw Error('文件超过 64 MiB 导入限制。');
  const meta=await openVisual(token,loadController.signal,generation,publicBase);
  if(generation!==loadId)return;
  state.meta=meta;state.coins=replayCoins(meta);configureMarkers(meta.entities);pauseTimeline=new PauseTimeline(meta.duration,meta.idleRanges,meta.chaseRanges);
  state.index=0;state.time=0;state.pan=[0,0];state.zoom=1;state.orbit=0;lastPose=-1;
  $('duration').textContent=stamp(meta.duration);$('time-basis').textContent=meta.timeBasis==='recorded_wall'?'实际经过时间':'计时信息不可用';
  for(let subject=-1;subject<meta.entities;subject++){
   const row=document.createElement('button');row.className='subject-row';row.dataset.subject=subject;row.disabled=true;row.setAttribute('aria-pressed',String(subject===state.subject));
   row.innerHTML=`<span class="subject-name">${subject<0?'玩家':`E${String(subject+1).padStart(2,'0')}`}</span><span class="subject-state">—</span><span class="subject-meter" aria-hidden="true"><i></i></span>`;
   row.onclick=()=>selectSubject(subject);$('subjects').append(row);
  }
  if(!meta.playbackSafe){$('empty-title').textContent='这份记录需要复核';$('empty-description').textContent='部分坐标、时钟或相机参数超出安全播放范围。三维播放已停用，仍可进入 Judge 查看逐项证据。';updateHUD();return;}
  $('empty').hidden=true;buildMap();await buildWorld(()=>generation!==loadId);if(generation!==loadId)return;
  modes.forEach(b=>b.disabled=b.dataset.mode!=='top'&&!camera);[...$('subjects').children].forEach(b=>b.disabled=false);$('timeline').disabled=false;timelineScale();$('timeline').step='0.001';$('timeline').value=0;$('play').disabled=false;state.ready=true;updateReferenceRoute(referenceRoutes.snapshot());setMode('first');seek(targetTick);updateHUD();
 }catch(e){if(generation!==loadId||e.name==='AbortError')return;clearReplay();$('empty-title').textContent='回放加载失败';$('empty-description').textContent='请重试；如果仍无法加载，请重新提交凭证。';error(e.message,e.checks);}
 finally{if(generation===loadId)$('loading').hidden=true;}
}


$('play').onclick=()=>{if(state.meta){if(!state.playing)$('error').hidden=true;if(state.time>=state.meta.duration)seek(0);setPlaying(!state.playing);}};
function stepSample(direction){if(!state.ready)return;setPlaying(false);let i=clamp(state.index+direction,0,state.meta.frames-1);if(pausesHidden()){while(i>0&&i<state.meta.frames-1&&recordedPause(state.times[i]))i+=direction;}seek(i);}
$('previous').onclick=()=>stepSample(-1);$('next').onclick=()=>stepSample(1);
$('timeline').oninput=e=>{setPlaying(false);seekTime(pauseTimeline.wall(+e.target.value,pausesHidden()));};$('speed').onchange=e=>{state.speed=+e.target.value;maintainBuffer(true);};
function jumpSeconds(delta){if(state.ready)seekTime(pauseTimeline.wall(pauseTimeline.display(state.seekTargetTime??state.time,pausesHidden())+delta,pausesHidden()));}
$('back-five').onclick=()=>jumpSeconds(-5);$('forward-five').onclick=()=>jumpSeconds(5);
function updateMarkerVisibility(){$('free-markers').hidden=state.mode==='top'||!$('show-hud').checked;document.querySelector('.legend').hidden=state.mode!=='top'&&!$('show-hud').checked;updateCoinHUD();}
$('show-hud').onchange=updateMarkerVisibility;
$('show-pauses').onchange=()=>{if(!state.meta)return;timelineScale();if(pausesHidden()&&recordedPause(state.time))seekTime(pauseTimeline.pauseAt(state.time)[1]);};
$('skip-pause').onclick=e=>{e.stopPropagation();const range=pauseTimeline.pauseAt(state.time);if(range)seekTime(range[1]);};
$('skip-pause').addEventListener('pointerdown',e=>e.stopPropagation());
$('expand').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.body.classList.toggle('theatre');}};document.addEventListener('fullscreenchange',()=>{$('expand').textContent=document.fullscreenElement?'退出全屏':'放大预览';});
$('home').onclick=()=>resetCamera();modes.forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
function subjectName(n){return n<0?'玩家':`实体 E${String(n+1).padStart(2,'0')}`;}
function updateSpeed(){if(!state.meta)return;const player=state.subject<0,x=player?6:24+state.subject*12,z=player?8:x+1;const value=recordedSpeed(state.index,state.meta.frames,{paused:recordedPause(state.time),available:i=>loaded.has(Math.floor(i/360)),position:i=>[state.f[i*state.meta.words+x],state.f[i*state.meta.words+z]],time:i=>pauseTimeline.display(state.times[i],true)}).toFixed(2)+' m/s';if($('subject-speed').textContent!==value)$('subject-speed').textContent=value;}
function updateHUD(){if(!state.meta)return;const i=state.index,player=state.subject<0;state.displayHealth=at(i,19);
 transport(true);updateSpeed();$('battery-status').hidden=!player;if(player)updateBattery($('battery-status'),at(i,3));
 [...$('subjects').children].forEach(row=>{const e=Number(row.dataset.subject),k=24+e*12,value=e<0?at(i,19):at(i,k+6),selected=e===state.subject;
  row.classList.toggle('active',selected);row.setAttribute('aria-pressed',String(selected));row.querySelector('i').style.width=`${clamp(value,0,100)}%`;
  row.classList.toggle('health-anomaly',e<0&&abnormalHealth(value));row.querySelector('.subject-state').title=e<0?String(value):'';
  row.querySelector('.subject-state').textContent=e<0?healthLabel(value):['游荡','调查','追逐','搜索'][bits(i,k+11)]||'—';
 });
 $('current-subject').textContent=subjectName(state.subject);
 $('focus-detail').textContent=state.subject<0?(bits(i,1)&512?'手电筒开启':'手电筒关闭'):`仇恨 ${Math.round(at(i,24+state.subject*12+6))}%`;
 $('input-panel').hidden=!player;if(!player)return;$('input-unavailable').hidden=state.meta.format==='HVR5';$('input-keys').hidden=state.meta.format!=='HVR5';
 document.querySelectorAll('[data-input]').forEach(key=>{const bit=Number(key.dataset.input),held=!!(bits(i,1)&bit),tap=!!(bits(i,2)&bit);key.classList.toggle('held',held);key.classList.toggle('tap',tap&&!held);key.setAttribute('aria-label',key.dataset.label+(held?' · 按下':tap?' · 短按':' · 松开'));});
 $('run-state').hidden=state.meta.format!=='HVR5';$('run-state').textContent=bits(i,1)&256?'奔跑':'步行';

}
function selectSubject(subject){
 if(subject===state.subject&&state.mode==='first')return;
 const origin=subjectPose(),from=camera&&state.mode!=='top'?{position:camera.position.clone(),rotation:camera.quaternion.clone(),fov:camera.fov}:null;
 const startPan=[...state.pan],startZoom=state.zoom;
 state.subject=subject;updateHUD();
 if(state.mode==='free'&&camera)focusSubject();
 else if(state.mode==='top'){mapFlight={pan:startPan,zoom:startZoom,toZoom:Math.max(startZoom,2),started:performance.now(),duration:Math.min(500,flightDuration(Math.hypot(subjectPose().x-origin.x,subjectPose().z-origin.z)))};return;}
 else resetCamera();
 if(from){viewFlight={...from,destination:camera.position.clone(),subjectStart:subjectPose(),started:performance.now(),duration:flightDuration(from.position.distanceTo(camera.position))};camera.position.copy(from.position);camera.quaternion.copy(from.rotation);camera.fov=from.fov;}
}
function animateMapFlight(){
 if(!mapFlight)return;const f=mapFlight,progress=(performance.now()-f.started)/f.duration,t=flightEase(progress),r=$('viewport').getBoundingClientRect(),p=subjectPose(),scale=Math.min(r.width-50,r.height-50)/512*f.toZoom;
 state.zoom=f.zoom+(f.toZoom-f.zoom)*t;state.pan=[f.pan[0]+((256-p.x)*scale-f.pan[0])*t,f.pan[1]+((p.z-256)*scale-f.pan[1])*t];
 if(progress>=1)mapFlight=null;
}
function interruptFreeFlight(){
 mapFlight=null;if(!viewFlight||state.mode!=='free'||!camera)return;
 const direction=camera.getWorldDirection(new THREE.Vector3());state.freeYaw=Math.atan2(direction.x,-direction.z);state.freePitch=Math.asin(clamp(direction.y,-1,1));viewFlight=null;
}
function animateCameraFlight(){
 if(!viewFlight)return;const f=viewFlight,progress=(performance.now()-f.started)/f.duration,t=flightEase(progress),destination=camera.position.clone(),rotation=camera.quaternion.clone(),fov=camera.fov;
 camera.position.lerpVectors(f.position,destination,t);camera.quaternion.slerpQuaternions(f.rotation,rotation,t);camera.fov=f.fov+(fov-f.fov)*t;
 if(progress>=1)viewFlight=null;
}

function buildMap(){const m=state.meta;state.bitmap=m.bitmap;bitmapCanvas.width=256;bitmapCanvas.height=256;
 state.pathStep=Math.max(1,Math.ceil(m.frames/30000));state.paths=[];for(let e=-1;e<state.meta.entities;e++){const path=new Path2D(),k=e<0?6:24+e*12,zk=e<0?8:k+1;for(const [i,p] of (e<0?visual.path:[]).entries()){if(i===0)path.moveTo(...p);else path.lineTo(...p);}state.paths.push(path);}state.playedPath=new Path2D();state.playedUntil=-1;
 const c=bitmapCanvas.getContext('2d'),image=c.createImageData(256,256);for(let i=0;i<65536;i++){const wall=state.bitmap[i>>3]&(1<<(i&7));const rgb=wall?[35,43,29]:[87,91,64];image.data.set([...rgb,255],((255-Math.floor(i/256))*256+i%256)*4);}c.putImageData(image,0,0);

}
function isWall(x,z){if(x<0||z<0||x>=256||z>=256)return true;const n=z*256+x;return !!(state.bitmap[n>>3]&(1<<(n&7)));}
function mapTransform(){const r=$('viewport').getBoundingClientRect(),scale=Math.min(r.width-50,r.height-50)/512*state.zoom;return {w:r.width,h:r.height,s:scale,x:r.width/2-256*scale+state.pan[0],y:r.height/2-256*scale+state.pan[1]};}
function drawMap(){if(!state.meta)return;animateMapFlight();const {w,h,s,x,y}=mapTransform(),d=Math.min(devicePixelRatio,2);if(mapCanvas.width!==Math.round(w*d)||mapCanvas.height!==Math.round(h*d)){mapCanvas.width=Math.round(w*d);mapCanvas.height=Math.round(h*d);}ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle='#0c100b';ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=false;ctx.drawImage(bitmapCanvas,x,y,512*s,512*s);
 ctx.save();ctx.translate(x,y+512*s);ctx.scale(s,-s);ctx.lineWidth=1.3/s;
 if($('trails').checked){for(let p=0;p<state.paths.length;p++){ctx.strokeStyle=p===0?'#d9d39f':'#a66454';ctx.globalAlpha=p===0?.3:.3;ctx.stroke(state.paths[p]);}ctx.globalAlpha=1;}
 if(state.index<state.playedUntil){state.playedPath=new Path2D();state.playedUntil=-1;}
 for(let i=state.playedUntil+1;i<=state.index;i++){if(!loaded.has(Math.floor(i/360)))continue;if(i===0||i%360===0)state.playedPath.moveTo(at(i,6),at(i,8));else if(i%state.pathStep===0)state.playedPath.lineTo(at(i,6),at(i,8));}state.playedUntil=state.index;
 ctx.strokeStyle='#eee8aa';ctx.stroke(state.playedPath);
 if(referenceRoutes.snapshot().enabled)drawReferenceRouteMap(ctx,referenceMapPath,s);
 ctx.restore();
 const point=(px,pz)=>({x:x+px*s,y:y+(512-pz)*s}),english=currentLanguage()==='en',radius=touchUI.matches?7:6;
 const markers=[{...point(at(state.index,6),at(state.index,8)),color:'#fff1af',name:english?'PLAYER':'玩家',yaw:at(state.index,9)}];
 for(let e=0;e<state.meta.entities;e++){const k=24+e*12;markers.push({...point(at(state.index,k),at(state.index,k+1)),color:'#e4a18c',name:`E${String(e+1).padStart(2,'0')}`});}
 const info=exitState(state.meta,state.time),currentPoint=point(info.cell[0]*2+1,info.cell[1]*2+1);
 if(info.showOriginal){const originalPoint=point(info.canonical[0]*2+1,info.canonical[1]*2+1);ctx.save();ctx.strokeStyle=EXIT_CHANGED;ctx.globalAlpha=.6;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(originalPoint.x,originalPoint.y);ctx.lineTo(currentPoint.x,currentPoint.y);ctx.stroke();ctx.restore();markers.push({...originalPoint,color:EXIT_GREEN,name:exitLabel(info,true,english),exit:true});}
 markers.push({...currentPoint,color:info.color,name:exitLabel(info,false,english),exit:true});
 if(state.meta.exitCompletionMismatch)markers.push({...point(...state.meta.exitCompletionMismatch.position),color:'#e6a0d2',name:english?'VICTORY POSITION':'胜利位置',exit:true});
 for(const coin of state.coins||[])if(!coinCollected(coin,state.time))markers.push({...point(...coin.position),color:'#e5bd5c',name:english?'COIN':'金币',coin:true});
 const shown=markers.filter(p=>p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h),labels=markerLabels(shown,w,h);
 ctx.font=`600 ${touchUI.matches?15:13}px "Noto Sans SC",sans-serif`;ctx.textBaseline='middle';
 shown.forEach((p,n)=>{ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle=p.color;ctx.strokeStyle='#10140c';ctx.lineWidth=2;ctx.beginPath();
  if(p.yaw!=null){ctx.rotate(p.yaw);ctx.moveTo(0,-radius*1.8);ctx.lineTo(-radius,radius);ctx.lineTo(0,radius*.45);ctx.lineTo(radius,radius);ctx.closePath();}
  else if(p.coin){ctx.moveTo(0,-radius*1.25);ctx.lineTo(radius,0);ctx.lineTo(0,radius*1.25);ctx.lineTo(-radius,0);ctx.closePath();}else if(p.exit)ctx.rect(-radius,-radius,radius*2,radius*2);else ctx.arc(0,0,radius,0,Math.PI*2);
  ctx.fill();ctx.stroke();ctx.restore();const label=labels[n],width=ctx.measureText(p.name).width+12,lx=p.x+label.x-width/2,ly=p.y+label.y;
  ctx.fillStyle='#171b10ed';ctx.fillRect(lx,ly,width,23);ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.strokeRect(lx,ly,width,23);ctx.fillStyle=p.color;ctx.fillText(p.name,lx+6,ly+11.5);
 });
}
function disposeWorld(){if(sceneModel){sceneModel.dispose();sceneModel=null;}}
function prepareRenderer(){if(renderer)return true;try{renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;return true;}catch(e){error('WebGL 不可用，仍可使用俯视轨迹。');return false;}}
async function buildWorld(cancel){if(!prepareRenderer())return;
 const model=sceneModel=new ReplayWorld(renderer,state.meta,isWall);world=model.scene;ceiling=model.roof;camera=new THREE.PerspectiveCamera(80,1,.04,1000);
 await model.build(n=>{$('loading').textContent=`正在重建场景 · ${n}%`;},cancel);if(cancel())return;
 playerMarker=new THREE.Group();const ring=new THREE.Mesh(new THREE.RingGeometry(.20,.245,32),new THREE.MeshBasicMaterial({color:0xb9d6b3,side:THREE.DoubleSide,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;const heading=new THREE.Mesh(new THREE.ConeGeometry(.07,.18,3),new THREE.MeshBasicMaterial({color:0xd4e4be}));heading.rotation.x=-Math.PI/2;heading.position.z=-.12;playerMarker.add(ring,heading);world.add(playerMarker);
 coinMeshes=(state.coins||[]).map(coin=>{const mesh=createCoinModel(coin);world.add(mesh);return mesh;});
 exitParticles=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({color:0x3bd651,side:THREE.DoubleSide}));world.add(exitParticles);
 originalExitParticles=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({color:0x3bd651,side:THREE.DoubleSide}));originalExitParticles.visible=false;world.add(originalExitParticles);
 winPositionMarker=new THREE.Mesh(new THREE.RingGeometry(.55,.62,4),new THREE.MeshBasicMaterial({color:0xe6a0d2,side:THREE.DoubleSide}));winPositionMarker.rotation.x=-Math.PI/2;winPositionMarker.visible=!!state.meta.exitCompletionMismatch;if(winPositionMarker.visible){const p=state.meta.exitCompletionMismatch.position;winPositionMarker.position.set(p[0],.035,-p[1]);}world.add(winPositionMarker);
 const trace=[];for(const p of visual.path)trace.push(p[0],.04,-p[1]);pathLine=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(trace,3)),new THREE.LineBasicMaterial({color:0xdfd39b,transparent:true,opacity:.6}));world.add(pathLine);
 entityMeshes=[];for(let i=0;i<state.meta.entities;i++){const group=new THREE.Group(),wire=new THREE.Mesh(new THREE.BufferGeometry(),model.actorMaterial()),particles=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}));group.add(wire,particles);group.userData.wire=wire;group.userData.particles=particles;world.add(group);entityMeshes.push(group);}resetCamera();
}
function wireModel(entityIndex,cloudOnly=false,exitCell=null){const i=state.index,k=24+entityIndex*12,cell=exitCell||exitState(state.meta,state.time).cell;
 const args=cloudOnly?[[cell[0]*2+1,0,cell[1]*2+1],0,at(i,22),0,-state.meta.ceiling/3.5,0,0,0,1]:[[at(i,k),0,at(i,k+1)],at(i,k+2),at(i,22),Number(BigInt(state.meta.formSeeds[entityIndex])%997n),state.meta.ceiling/3.5,at(i,k+3),at(i,k+4),at(i,k+5),clamp((at(i,k+6)-70)/30,0,1)];
 return proceduralEntity(...args);
}
function setMode(mode){if(mode!==state.mode)release();if(mode!=='top'&&state.meta&&!state.meta.playbackSafe){error('记录含超出安全播放范围的状态，请在 Judge 中查看证据。');return;}if(mode!=='top'&&state.meta&&!renderer){error('当前浏览器不支持 WebGL，可继续使用俯视地图。');return;}state.mode=mode;updateMarkerVisibility();$('cutaway').disabled=mode==='first'||mode==='top';$('map-compass').hidden=mode!=='top';modes.forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});$('map').style.visibility=mode==='top'?'visible':'hidden';$('scene').style.visibility=mode==='top'?'hidden':'visible';$('crosshair').hidden=mode!=='first';$('view-label').textContent={top:'俯视全图',first:'第一人称',third:'第三人称',free:'自由视角'}[mode];$('hint').textContent={top:'滚轮缩放 · 拖动平移 · 双击定位自由视角',first:'玩家记录视角 / 实体朝向重建 · 拖动时间轴定位',third:'拖动旋转跟随视角 · 滚轮调整高度',free:'右键 + WASD 飞行 · Q/E 升降 · Shift 加速 · 滚轮调速 · Alt 左键环绕 · 中键平移 · F 聚焦'}[mode];resetCamera();touchHint();}
function touchHint(){if(touchUI.matches)$('hint').textContent={top:'单指平移 · 双指缩放',first:'轻触播放 / 暂停 · 拖动下方进度条',third:'单指旋转 · 双指调整高度',free:'单指转向 · 双指平移和推拉'}[state.mode];}
touchUI.addEventListener('change',()=>setMode(state.mode));
function resetCamera(){viewFlight=null;mapFlight=null;thirdRig=null;state.zoom=1;state.pan=[0,0];state.orbit=0;state.orbitHeight=1.8;if(state.meta&&camera){camera.position.set(at(state.index,6),at(state.index,7),-at(state.index,8));const pose=subjectPose();camera.position.set(pose.x,pose.y,-pose.z);state.freeYaw=pose.yaw;state.freePitch=-.15;lastPose=-1;}}
function focusSubject(){if(!camera)return;setMode('free');const {x,z,yaw}=subjectPose();let found=false;
 for(const distance of [2.8,1.6]){for(const a of [yaw,yaw+Math.PI/2,yaw+Math.PI,yaw-Math.PI/2,0,Math.PI/2,Math.PI,Math.PI*1.5]){const dx=Math.sin(a)*distance,dz=Math.cos(a)*distance;let clear=true;for(let n=0;n<=20;n++){if(isWall(Math.floor((x+dx*n/20)/2),Math.floor((z+dz*n/20)/2))){clear=false;break;}}if(clear){camera.position.set(x+dx,1.4,-z-dz);found=true;break;}}if(found)break;}
 if(!found)camera.position.set(x+.01,5,-z);lookToward(x,1.35,z);
}
function lookToward(x,y,z){const d=new THREE.Vector3(x,y,-z).sub(camera.position);state.freeYaw=Math.atan2(d.x,-d.z);state.freePitch=Math.atan2(d.y,Math.hypot(d.x,d.z));}
function recordedPenetration(focus,radius,index=state.index){
 if(isWall(Math.floor(focus.x/2),Math.floor(focus.z/2)))return true;
 const xField=state.subject<0?6:24+state.subject*12,zField=state.subject<0?8:xField+1;
 for(const tick of [index,index+1]){
  if(tick>=state.meta.frames||!loaded.has(Math.floor(tick/360)))continue;
  const offset=tick*state.meta.words;
  if(targetEmbedded({x:state.f[offset+xField],y:focus.y,z:state.f[offset+zField]},isWall,state.meta.ceiling,radius))return true;
 }
 return false;
}
function recordedTeleport(index,subject=state.subject){
 const next=index+1;if(index<0||next>=state.meta.frames||!loaded.has(Math.floor(index/360))||!loaded.has(Math.floor(next/360)))return false;
 const k=subject<0?6:24+subject*12,z=subject<0?8:k+1,a=index*state.meta.words,b=next*state.meta.words;
 // Pausing does not grant travel time, regardless of the visible timeline mode.
 const seconds=pauseTimeline.display(state.times[next],true)-pauseTimeline.display(state.times[index],true);
 return poseDiscontinuous({x:state.f[a+k],z:state.f[a+z]},{x:state.f[b+k],z:state.f[b+z]},seconds);
}
function drawWorld(dt){if(!state.meta||!state.meta.playbackSafe||!renderer||!camera||!sceneModel||!playerMarker||!pathLine||!exitParticles||entityMeshes.length!==state.meta.entities||state.mode==='top')return;const rect=$('viewport').getBoundingClientRect();if(renderer.domElement.width!==Math.round(rect.width*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(rect.height*renderer.getPixelRatio()))renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;const i=state.index,x=at(i,6),z=at(i,8),yaw=at(i,9);
 const subject=subjectPose();if(state.mode==='first'){camera.position.set(state.subject<0?at(i,12):subject.x,state.subject<0?at(i,13):subject.y,-(state.subject<0?at(i,14):subject.z));const a=state.subject<0?at(i,15):subject.yaw,p=state.subject<0?at(i,16):0;camera.up.set(0,1,0);camera.lookAt(camera.position.x+Math.sin(a)*Math.cos(p),camera.position.y+Math.sin(p),camera.position.z-Math.cos(a)*Math.cos(p));if(state.subject<0)camera.rotateZ(at(i,17));camera.fov=2*Math.atan(Math.tan(at(i,18)/2)/camera.aspect)*180/Math.PI;}
 else if(state.mode==='third'){
  if(!thirdRig)thirdTime=state.time;
  const hidden=pausesHidden(),radius=state.subject<0?.22:.26;
  for(const sample of followSteps(state.times,thirdTime,state.time,dt,t=>pauseTimeline.display(t,hidden))){
   if(!loaded.has(Math.floor(sample.index/360))){thirdRig=null;continue;}
   const pose=subjectPose(sample.index,sample.time),focus={x:pose.x,y:state.subject<0?1.2:1.45,z:pose.z};
   let cut=false;for(let index=thirdRig?.recordedIndex??sample.index;index<sample.index;index++)if(recordedTeleport(index)){cut=true;break;}
   thirdRig=stepThirdPerson(thirdRig,{focus,yaw:pose.yaw+state.orbit,height:state.orbitHeight,ceiling:state.meta.ceiling,cutaway:$('cutaway').checked,targetRadius:radius,allowNoclip:recordedPenetration(focus,radius,sample.index),isWall,dt:sample.dt,cut});
   thirdRig.recordedIndex=sample.index;
  }
  thirdTime=state.time;const p=thirdRig.position;camera.position.set(p.x,p.y,-p.z);camera.up.set(0,1,0);camera.lookAt(subject.x,state.subject<0?1.2:1.45,-subject.z);camera.fov=65;
 }
 else{if(viewFlight){const f=viewFlight;camera.position.set(f.destination.x+subject.x-f.subjectStart.x,f.destination.y,f.destination.z-subject.z+f.subjectStart.z);lookToward(subject.x,1.35,subject.z);}const speed=state.mouseButton===2?state.flySpeed*(state.keys.has('Shift')?3:1)*dt:0,a=state.freeYaw;let forward=+(state.keys.has('w'))-+(state.keys.has('s')),right=+(state.keys.has('d'))-+(state.keys.has('a'));camera.position.x+=(Math.sin(a)*Math.cos(state.freePitch)*forward+Math.cos(a)*right)*speed;camera.position.z+=(-Math.cos(a)*Math.cos(state.freePitch)*forward+Math.sin(a)*right)*speed;camera.position.y+=(Math.sin(state.freePitch)*forward+(+(state.keys.has('e'))-+(state.keys.has('q'))))*speed;camera.up.set(0,1,0);camera.lookAt(camera.position.x+Math.sin(a)*Math.cos(state.freePitch),camera.position.y+Math.sin(state.freePitch),camera.position.z-Math.cos(a)*Math.cos(state.freePitch));camera.fov=70;}
 animateCameraFlight();
 camera.updateProjectionMatrix();sceneModel.update(camera,{x:at(i,12),y:at(i,13),z:at(i,14)},at(i,15),at(i,16),!!(bits(i,1)&512),state.mode!=='first'&&$('cutaway').checked);playerMarker.visible=state.mode!=='first'||state.subject>=0;playerMarker.position.set(x,.025,-z);playerMarker.rotation.y=-yaw;pathLine.visible=$('trails').checked;
 const poseTick=recordedPause(state.time)?'pause:'+i:state.playing?Math.floor(state.time*30):state.time;
 for(let e=0;e<state.meta.entities;e++){const k=24+e*12,mesh=entityMeshes[e],near=Math.hypot(at(i,k)-camera.position.x,-at(i,k+1)-camera.position.z)<60;mesh.visible=near&&!(state.mode==='first'&&state.subject===e);if(mesh.visible)mesh.userData.wire.material.uniforms.actorAmbient.value=sceneModel.probe(at(i,k),at(i,k+1));if(mesh.visible&&mesh.userData.tick!==poseTick){const model=wireModel(e),{wire,particles}=mesh.userData;updateCableGeometry(wire.geometry,model.vertices);updateParticles(particles.geometry,model.particles);mesh.userData.tick=poseTick;}}
 for(const coin of coinMeshes){const time=coin.userData.coin.pickupTime;updateCoinModel(coin,at(i,22),time==null?null:pauseTimeline.display(time,true),pauseTimeline.display(state.time,true));}
 const exits=exitState(state.meta,state.time),exitTick=`${i}:${exits.cell.join(':')}`;sceneModel.setExit(exits.cell,exits.altered);exitParticles.material.color.set(exits.altered?EXIT_CHANGED:0x3bd651);
 if(exitParticles.userData.tick!==exitTick){updateParticles(exitParticles.geometry,wireModel(0,true,exits.cell).particles);exitParticles.userData.tick=exitTick;}
 originalExitParticles.visible=exits.showOriginal;if(exits.showOriginal&&originalExitParticles.userData.tick!==i){updateParticles(originalExitParticles.geometry,wireModel(0,true,exits.canonical).particles);originalExitParticles.userData.tick=i;}lastPose=i;
 renderer.render(world,camera);drawMarkers(rect.width,rect.height);
}

function subjectPose(i=state.index,time=state.time){
 const player=state.subject<0,k=player?6:24+state.subject*12,yawField=player?9:k+2,next=Math.min(i+1,state.meta.frames-1);
 const fraction=next>i&&loaded.has(Math.floor(next/360))&&!recordedTeleport(i)?clamp((time-state.times[i])/(state.times[next]-state.times[i]),0,1):0;
 const value=field=>{const a=state.f[i*state.meta.words+field],b=state.f[next*state.meta.words+field];return a+(field===yawField?((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI:b-a)*fraction;};
 return {x:value(k),y:player?value(7):2.05,z:value(player?8:k+1),yaw:value(yawField)};
}

const touchPoints=new Map();let lastTouch=null,touchOrigin=null,touchMoved=false;
function startTouch(e){if(!state.ready)return;interruptFreeFlight();e.preventDefault();const r=viewport.getBoundingClientRect();touchPoints.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});viewport.setPointerCapture(e.pointerId);lastTouch=touchShape(touchPoints.values());if(touchPoints.size===1){touchOrigin=lastTouch;touchMoved=false;}else touchMoved=true;}
function moveTouch(e){if(!touchPoints.has(e.pointerId))return;e.preventDefault();const r=viewport.getBoundingClientRect();touchPoints.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});const shape=touchShape(touchPoints.values()),change=touchChange(lastTouch,shape);if(touchOrigin&&Math.hypot(shape.x-touchOrigin.x,shape.y-touchOrigin.y)>6)touchMoved=true;
 if(change){const {dx,dy,ratio,multi}=change;
  if(state.mode==='top')Object.assign(state,pinchMap(state,lastTouch,shape,r.width,r.height));
  else if(state.mode==='third'){state.orbit+=dx*.008;state.orbitHeight=clamp(multi?state.orbitHeight/ratio:state.orbitHeight+dy*.012,.6,12);}
  else if(state.mode==='free'&&camera){if(!multi){state.freeYaw+=dx*.004;state.freePitch=clamp(state.freePitch-dy*.004,-1.5,1.5);}else{const pan=.006*state.flySpeed,dolly=Math.log(ratio)*6,a=state.freeYaw;camera.position.x-=Math.cos(a)*dx*pan;camera.position.z-=Math.sin(a)*dx*pan;camera.position.y+=dy*pan;camera.position.x+=Math.sin(a)*Math.cos(state.freePitch)*dolly;camera.position.z-=Math.cos(a)*Math.cos(state.freePitch)*dolly;camera.position.y+=Math.sin(state.freePitch)*dolly;}}
 }lastTouch=shape;
}
function endPointer(e){if(e.pointerType!=='touch'){release();return;}if(!touchPoints.has(e.pointerId))return;touchPoints.delete(e.pointerId);lastTouch=touchShape(touchPoints.values());if(!lastTouch&&!touchMoved&&state.mode==='first'&&e.type==='pointerup')$('play').click();}
const viewport=$('viewport');viewport.addEventListener('contextmenu',e=>e.preventDefault());
viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){startTouch(e);return;}if(!state.meta)return;interruptFreeFlight();state.drag=[e.clientX,e.clientY];state.mouseButton=e.button;state.alt=e.altKey;viewport.setPointerCapture(e.pointerId);e.preventDefault();});
viewport.addEventListener('pointermove',e=>{if(e.pointerType==='touch'){moveTouch(e);return;}if(!state.drag)return;const dx=e.clientX-state.drag[0],dy=e.clientY-state.drag[1];state.drag=[e.clientX,e.clientY];if(state.mode==='top'){state.pan[0]+=dx;state.pan[1]+=dy;}else if(state.mode==='free'){
 if(state.mouseButton===2){state.freeYaw+=dx*.004;state.freePitch=clamp(state.freePitch-dy*.004,-1.5,1.5);}
 else if(state.mouseButton===1){const speed=.012*state.flySpeed;camera.position.x-=Math.cos(state.freeYaw)*dx*speed;camera.position.z-=Math.sin(state.freeYaw)*dx*speed;camera.position.y+=dy*speed;}
 else if(state.alt&&state.mouseButton===0){const p=subjectPose(),dist=Math.max(.5,Math.hypot(camera.position.x-p.x,camera.position.y-1.2,camera.position.z+p.z));state.freeYaw+=dx*.005;state.freePitch=clamp(state.freePitch-dy*.005,-1.45,1.45);camera.position.set(p.x-Math.sin(state.freeYaw)*Math.cos(state.freePitch)*dist,1.2-Math.sin(state.freePitch)*dist,-p.z+Math.cos(state.freeYaw)*Math.cos(state.freePitch)*dist);}
 }else if(state.mode==='third'){state.orbit+=dx*.008;state.orbitHeight=clamp(state.orbitHeight+dy*.012,.6,12);}});
function release(){touchPoints.clear();lastTouch=null;touchMoved=true;state.drag=null;state.mouseButton=-1;state.keys.clear();}
viewport.addEventListener('pointerup',endPointer);viewport.addEventListener('pointercancel',endPointer);viewport.addEventListener('lostpointercapture',endPointer);window.addEventListener('blur',release);
viewport.addEventListener('wheel',e=>{mapFlight=null;e.preventDefault();if(state.mode==='top'){const r=viewport.getBoundingClientRect();Object.assign(state,zoomMapAt(state,{x:e.clientX-r.left,y:e.clientY-r.top},r.width,r.height,e.deltaY));}if(state.mode==='free'){state.flySpeed=clamp(state.flySpeed*Math.exp(-e.deltaY*.001),.2,100);$('hint').textContent=`飞行速度 ${state.flySpeed.toFixed(1)} m/s · 右键 + WASD · Q/E · Shift · F 聚焦`;}if(state.mode==='third')state.orbitHeight=clamp(state.orbitHeight+e.deltaY*.005,.6,12);},{passive:false});
viewport.addEventListener('dblclick',e=>{if(state.mode!=='top'||!state.meta)return;const r=viewport.getBoundingClientRect(),t=mapTransform(),x=(e.clientX-r.left-t.x)/t.s,z=512-(e.clientY-r.top-t.y)/t.s;setMode('free');camera.position.set(x,3,-z);});
function editingInput(target){return !!target?.closest('textarea,select,[contenteditable="true"],input:not([type="range"]):not([type="checkbox"]):not([type="radio"])');}
function playbackKey(e){
 if(!state.active||e.ctrlKey||e.metaKey||e.altKey||!['Space','ArrowLeft','ArrowRight'].includes(e.code))return false;
 if(!state.ready)return true;
 if(e.code==='Space'){if(!e.repeat)$('play').click();}
 else{const time=pauseTimeline.display(state.seekTargetTime??state.time,pausesHidden())+(e.code==='ArrowRight'?5:-5);seekTime(pauseTimeline.wall(time,pausesHidden()));}
 return true;
}
window.addEventListener('keydown',e=>{if(!state.active||editingInput(e.target))return;if(playbackKey(e)){e.preventDefault();e.stopImmediatePropagation();return;}if('1234'.includes(e.key))setMode(['top','first','third','free'][+e.key-1]);const key=e.key==='Shift'?'Shift':e.key.toLowerCase();state.keys.add(key);if(key==='f'&&state.mode==='free'&&camera){interruptFreeFlight();const p=subjectPose();camera.position.set(p.x-Math.sin(p.yaw)*3,1.8,-p.z+Math.cos(p.yaw)*3);lookToward(p.x,1.2,p.z);}},{capture:true});
window.addEventListener('keyup',e=>{if(e.code==='Space'&&!editingInput(e.target)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();e.stopImmediatePropagation();}state.keys.delete(e.key==='Shift'?'Shift':e.key.toLowerCase());},{capture:true});
function replayVisibility(visible){
 document.body.classList.toggle('parked',!visible);
 if(visible){state.active=true;referenceRoutes.resume();last=performance.now();if(state.ready&&replayTransport&&loadController?.signal.aborted){loadController=new AbortController();replayTransport.signal=loadController.signal;}replayBuffer?.resume(bufferTarget());maintainBuffer(true);lastPose=-1;return;}
 state.active=false;referenceRoutes.suspend();replayBuffer?.suspend();setPlaying(false);release();++loadId;++seekSerial;loadController?.abort();state.waitingChunk=null;state.seekTargetTime=null;setBuffering(false);$('loading').hidden=true;
}
function openReplay(kind,id,publicBase=''){
 if(!['run','preview'].includes(kind)||typeof id!=='string'||!/^[a-f0-9]{24}$/.test(id))return;
 publicBase=kind==='run'?publicReplayBase(publicBase,id):'';
 replayVisibility(true);prepareRenderer();const key=kind+':'+id+':'+publicBase;if(key===currentReplay&&state.ready)return;currentReplay=key;privatePreview=kind==='preview';load(null,id,0,publicBase);
}
window.addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==window.parent)return;
 if(e.data?.type==='halls-replay-key')playbackKey(e.data);
 if(e.data?.type==='halls-replay-visibility')replayVisibility(e.data.visible===true);
 if(e.data?.type==='halls-replay-open')openReplay(e.data.kind,e.data.id,e.data.publicBase);
});
for(const checkbox of document.querySelectorAll('input[type=checkbox]'))checkbox.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkbox.click();}});

let last=performance.now();function animate(now){
 const elapsed=(now-last)/1000,{camera:dt,playback:replayDelta}=frameTimes(elapsed,state.speed,state.playing);last=now;
 if(state.active&&state.ready&&state.meta&&state.meta.playbackSafe){
  maintainBuffer();
  if(state.playing&&state.seekTargetTime==null&&!state.buffering){
   const time=Math.min(state.meta.duration,pauseTimeline.wall(pauseTimeline.display(state.time,pausesHidden())+replayDelta,pausesHidden())),next=chooseIndex(time);
   const required=Math.floor((next%360===359&&next+1<state.meta.frames&&time>state.times[next]?next+1:next)/360);
   if(!loaded.has(required)){state.pendingPlayback={index:next,time};state.waitingChunk=required;setBuffering(true);maintainBuffer(true);ensureChunk(required).catch(()=>{});}
   else{state.time=time;if(next!==state.index){state.index=next;updateHUD();}if(state.time>=state.meta.duration)setPlaying(false);}
  }
  updateCoinHUD();transport();$('recorded-pause').hidden=!recordedPause(state.time);updateSpeed();if(at(state.index,19)!==state.displayHealth)updateHUD();if(state.mode==='top')drawMap();else drawWorld(dt);
 }
 requestAnimationFrame(animate);
}requestAnimationFrame(animate);


let privatePreview=new URLSearchParams(location.search).has('preview'),currentReplay='';
let visual=null,replayTransport=null,replayBuffer=null,lastBufferUpdate=0;const loaded=new Set();
function bufferTarget(){const time=state.seekTargetTime??state.pendingPlayback?.time??state.time;return {index:state.seekTargetTime!=null?chooseIndex(time):state.pendingPlayback?.index??state.index,time,speed:state.speed};}
function maintainBuffer(force=false){
 if(!replayBuffer||!state.meta||!state.active)return;const now=performance.now();if(force||now-lastBufferUpdate>250){lastBufferUpdate=now;replayBuffer.update(bufferTarget());}
 if(state.buffering&&state.playing&&state.seekTargetTime==null&&(state.waitingChunk==null||loaded.has(state.waitingChunk))&&replayBuffer.canResume()){
  if(state.pendingPlayback){state.index=state.pendingPlayback.index;state.time=state.pendingPlayback.time;state.pendingPlayback=null;updateHUD();}state.waitingChunk=null;setBuffering(false);
 }
}
async function openVisual(id,abortSignal,generation,publicBase=''){
 if(!privatePreview&&!publicBase){const response=await fetchReplay('/api/runs/'+id,{signal:abortSignal}),detail=await responseJSON(response);if(!response.ok)throw Error(detail.error||'回放不可访问。');publicBase=publicReplayBase(detail.replayBase,id);}
 const transport=new ReplayTransport({session:(privatePreview?'/api/previews/':'/api/runs/')+id+'/replay-session',parts:(privatePreview?'/api/previews/'+id+'/replay/':'/api/replay/'+id+'/'),publicBase},abortSignal),buffer=await(await transport.fetch('manifest')).arrayBuffer();
 if(abortSignal.aborted||generation!==loadId)throw new DOMException('Replay changed','AbortError');
 const {meta:manifest,first}=decodeInitial(buffer);replayTransport=transport;visual=manifest;loaded.clear();
 const meta={...visual,frames:visual.samples,words:visual.words,formSeeds:visual.forms.map(String),playbackSafe:true,fileBytes:0,violations:[],testFixture:false};
 state.f=new Float32Array(meta.frames*meta.words);state.u=new Uint32Array(state.f.buffer);state.u.set(first);loaded.add(0);state.times=visual.times;state.meta=meta;pauseTimeline=new PauseTimeline(meta.duration,meta.idleRanges,meta.chaseRanges);
 const scheduler=new ReplayBuffer({times:state.times,duration:meta.duration,loaded,display:t=>pauseTimeline.display(t,pausesHidden()),load:loadChunk,
  onChange:()=>{if(replayBuffer===scheduler){maintainBuffer(true);}},
  onError:(n,e)=>{if(replayBuffer===scheduler&&(state.waitingChunk===n||state.buffering&&state.playing)&&e.status!==0&&e.status!==429&&!(e.status>=500)){setPlaying(false);error(e.message);}}});
 replayBuffer=scheduler;scheduler.update({index:0,time:0,speed:state.speed});return meta;
}
function ensureChunk(n){return replayBuffer.request(n);}
async function loadChunk(n,signal,priority){
 if(signal.aborted)throw new DOMException('Aborted','AbortError');const generation=loadId,parent=loadController.signal,transport=replayTransport,meta=visual,controller=new AbortController(),abort=()=>controller.abort();
 signal.addEventListener('abort',abort,{once:true});parent.addEventListener('abort',abort,{once:true});if(parent.aborted)abort();
 try{const buffer=await(await transport.fetch(String(n),{signal:controller.signal,priority:priority===0?'high':'low'})).arrayBuffer();if(controller.signal.aborted||generation!==loadId)throw new DOMException('Aborted','AbortError');state.u.set(decodeChunk(buffer,meta,n),n*360*meta.words);}
 finally{signal.removeEventListener('abort',abort);parent.removeEventListener('abort',abort);}
}
if(window.parent!==window)document.body.classList.add('parked');bindFonts();updateReplayWorker();const requested=new URLSearchParams(location.search);if(window.parent===window)prepareRenderer();if(requested.has('preview'))openReplay('preview',requested.get('preview'));else if(requested.has('run'))openReplay('run',requested.get('run'));if(window.parent!==window)window.parent.postMessage({type:'halls-replay-ready'},location.origin);

new ResizeObserver(()=>{if(window.parent!==window&&touchUI.matches)window.parent.postMessage({type:'halls-replay-height',height:Math.ceil(document.querySelector('main').getBoundingClientRect().height)},location.origin);}).observe(document.querySelector('main'));
