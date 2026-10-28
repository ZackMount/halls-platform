import * as THREE from './vendor/three.module.js';

export const REFERENCE_ROUTE_COLOR='#c98ca7';
export const REFERENCE_ROUTE_HEIGHT=.055;
const MAX_POINTS=8192;
const invalid=()=>new Error('参考路线数据无效，请重试。');
export function referenceRoute(value){
 if(value?.available===false)return {available:false};
 if(!value||value.available!==true||typeof value.seconds!=='number'||!Number.isFinite(value.seconds)||value.seconds<0||value.seconds>86400||typeof value.approximate!=='boolean'||!Array.isArray(value.path)||!value.path.length||value.path.length>MAX_POINTS)throw invalid();
 const path=value.path.map(point=>{
  if(!Array.isArray(point)||point.length!==2||point.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>=512))throw invalid();
  return [...point];
 });
 return {available:true,seconds:value.seconds,approximate:value.approximate,path};
}

// A single run's display data only. Every in-flight response is bound to the
// selected run and request generation, including transports that ignore abort.
export function createReferenceRouteLoader({load,onChange=()=>{}}){
 let id='',enabled=false,suspended=false,status='idle',data=null,pending=null,generation=0;
 const snapshot=()=>({id,enabled,status,data});
 const publish=()=>onChange(snapshot());
 function cancel(){generation++;pending?.controller.abort();pending=null;if(status==='loading')status='idle';}
 function request(){
  if(!enabled||suspended||!id||data)return Promise.resolve(data);
  if(pending)return pending.task;
  const current=++generation,controller=new AbortController(),run=id;status='loading';
  const request={controller,task:null};pending=request;publish();
  request.task=Promise.resolve().then(()=>load(run,{signal:controller.signal})).then(value=>{
   if(generation!==current||id!==run||controller.signal.aborted)return null;
   data=referenceRoute(value);status=data.available?'ready':'unavailable';if(!data.available)enabled=false;publish();return data;
  }).catch(error=>{
   if(generation!==current||id!==run||controller.signal.aborted)return null;
   status='error';enabled=false;publish();return null;
  }).finally(()=>{if(pending===request)pending=null;});
  return request.task;
 }
 return {
  snapshot,
  reset(run=''){cancel();id=/^[a-f0-9]{24}$/.test(run)?run:'';enabled=false;data=null;status='idle';publish();},
  select(value){enabled=!!value&&!!id&&status!=='unavailable';if(!enabled){cancel();publish();return Promise.resolve(data);}publish();return request();},
  suspend(){suspended=true;cancel();publish();},
  resume(){suspended=false;publish();return request();},
 };
}

export function createReferenceRouteMap(reference,Path=Path2D){
 if(!reference?.available)return null;
 const path=new Path();for(const [i,point] of reference.path.entries())if(i)path.lineTo(...point);else path.moveTo(...point);
 const first=reference.path[0],stationary=reference.path.every(point=>point[0]===first[0]&&point[1]===first[1]);
 return {path,point:stationary?[...first]:null};
}
export function drawReferenceRouteMap(ctx,route,scale){
 if(!route||!Number.isFinite(scale)||scale<=0)return;
 ctx.save();ctx.strokeStyle=REFERENCE_ROUTE_COLOR;ctx.fillStyle=REFERENCE_ROUTE_COLOR;ctx.lineWidth=1.7/scale;ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha=.9;ctx.stroke(route.path);
 if(route.point){ctx.beginPath();ctx.arc(route.point[0],route.point[1],1.4/scale,0,Math.PI*2);ctx.fill();}ctx.restore();
}

export function createReferenceRouteMesh(reference){
 if(!reference?.available)return null;
 const positions=[],half=.02,y=REFERENCE_ROUTE_HEIGHT;
 const triangle=(a,b,c)=>positions.push(a[0],y,-a[1],b[0],y,-b[1],c[0],y,-c[1]);
 for(let i=1;i<reference.path.length;i++){
  const a=reference.path[i-1],b=reference.path[i],dx=b[0]-a[0],dz=b[1]-a[1],distance=Math.hypot(dx,dz);if(distance<1e-8)continue;
  const ox=-dz/distance*half,oz=dx/distance*half,l=[a[0]+ox,a[1]+oz],r=[a[0]-ox,a[1]-oz],nextL=[b[0]+ox,b[1]+oz],nextR=[b[0]-ox,b[1]-oz];
  triangle(l,r,nextL);triangle(r,nextR,nextL);
 }
 if(!positions.length){const [x,z]=reference.path[0],a=[x-half,z-half],b=[x+half,z-half],c=[x+half,z+half],d=[x-half,z+half];triangle(a,b,c);triangle(a,c,d);}
 const geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 const material=new THREE.MeshBasicMaterial({color:REFERENCE_ROUTE_COLOR,side:THREE.DoubleSide,transparent:true,opacity:.86,depthTest:true,depthWrite:false});
 const mesh=new THREE.Mesh(geometry,material);mesh.name='race-reference-route';mesh.renderOrder=1;return mesh;
}
