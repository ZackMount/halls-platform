import * as THREE from '/replay-assets/vendor/three.module.js';
// Continuous procedural surfaces: same motif dimensions, palette and lamp rules
// as the client, without the terminal's pixel grid or low-resolution textures.
const vertex=`attribute float illumination;attribute float surface;attribute vec2 lightUv;varying vec2 vLightUv;varying vec2 vUV;varying vec3 vWorld;varying vec3 vN;varying float vLight;varying float vKind;void main(){vLightUv=lightUv;vUV=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;vN=normalize(mat3(modelMatrix)*normal);vLight=illumination;vKind=surface;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const torchShader=`
uniform sampler2D wallMap;uniform vec3 torchPosition;uniform vec3 torchDirection;uniform float torchOn;
float solid(vec2 cell){if(any(lessThan(cell,vec2(0.)))||any(greaterThanEqual(cell,vec2(256.))))return 1.;return texture2D(wallMap,(cell+.5)/256.).r;}
float torchVisible(vec3 target){
 vec2 a=torchPosition.xz*vec2(.5,-.5),b=target.xz*vec2(.5,-.5),d=b-a;
 a+=d*.00001;vec2 cell=floor(a),stepDir=mix(vec2(-1.),vec2(1.),step(vec2(0.),d)),delta=1./max(abs(d),vec2(.00000001));
 vec2 next=(cell+step(vec2(0.),d)-a)*stepDir*delta;
 for(int i=0;i<32;i++){
  if(solid(cell)>.5)return 0.;if(min(next.x,next.y)>=.99999)return 1.;
  if(abs(next.x-next.y)<.000001){if(solid(cell+vec2(stepDir.x,0.))>.5||solid(cell+vec2(0.,stepDir.y))>.5)return 0.;cell+=stepDir;next+=delta;}
  else if(next.x<next.y){cell.x+=stepDir.x;next.x+=delta.x;}else{cell.y+=stepDir.y;next.y+=delta.y;}
 }return 0.;
}
float torchLight(vec3 at,vec3 normal){
 if(torchOn<.5)return 0.;vec3 delta=at-torchPosition;float d2=dot(delta,delta);if(d2>=196.)return 0.;
 vec3 ray=delta*inversesqrt(max(d2,.000001));float cone=clamp((dot(ray,torchDirection)-.79)/.17,0.,1.);float facing=max(dot(-ray,normalize(normal)),0.);
 if(cone*facing<=0.)return 0.;return 1.8*cone*cone*facing*(1.-smoothstep(100.,196.,d2))*torchVisible(at+normal*.025)/(1.+d2*.12);
}`;
const fragment=`
${torchShader}
uniform float brightness;uniform sampler2D lightMap;uniform vec2 lightMapSize;uniform vec2 exitCell;uniform vec3 exitColor;varying vec2 vLightUv;
varying vec2 vUV;varying vec3 vWorld;varying vec3 vN;varying float vLight;varying float vKind;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=vUV;vec3 base;float light=vLightUv.x<0.?vLight:texture2D(lightMap,vLightUv/lightMapSize).r*1.9921875;
 float fine=1.-smoothstep(.06,.3,length(fwidth(uv)));float grain=(noise(uv*160.)-.5)*.035*fine;
 if(vKind<.5){
  vec2 p=fract(uv*5.)-.5;float edge=abs(abs(p.x)+abs(p.y)-.31);float aa=max(fwidth(edge),.005);float pattern=1.-smoothstep(.045-aa,.055+aa,edge);
  float stain=max(sin(uv.x*.61+.3)*sin(uv.y*1.9),0.);float dirt=1.-.22*stain-.17*clamp(1.-uv.y/.55,0.,1.);
  float trim=clamp((.12-uv.y)/max(fwidth(uv.y),.000001)+.5,0.,1.);base=mix((vec3(.64,.48,.19)+grain)*(1.-.24*pattern)*dirt,vec3(.025,.029,.031),trim);
 }else if(vKind<1.5){
  float fiber=(noise(uv*120.)-.5)*.045*fine;float damp=max(sin(uv.x*.71)*sin(uv.y*.83+1.),0.);
  base=(vec3(.16,.115,.058)+vec3(fiber,fiber*.8,fiber*.5))*(1.-.36*damp);
  if(all(equal(floor(vec2(vWorld.x,-vWorld.z)*.5),exitCell))){base=exitColor;light=1.;}
 }else if(vKind<2.5){
  vec2 p=mod(uv,.6);float seam=min(min(p.x,.6-p.x),min(p.y,.6-p.y));float aa=max(length(fwidth(uv)),.001);
  float panel=smoothstep(.006-aa,.016+aa,seam);float stain=.035*max(sin(uv.x*1.1)*sin(uv.y*.73),0.);
  base=(vec3(.43,.40,.29)+grain-stain)*mix(.42,1.,panel);
 }else if(vKind<4.5){base=vec3(.045,.65,.085);light=1.;}
 else if(vKind<5.5){base=vec3(.12,.13,.105);}
 else if(vKind<6.5){float tube=1.-smoothstep(.08,.105,min(abs(uv.y-.28),abs(uv.y-.72)));base=mix(vec3(.27,.28,.22),vec3(1.2,1.15,1.02),tube);light=1.;}
 else{base=vec3(.46,.38,.23)+grain;light=.85;}
 if(vKind<3.5){if(dot(vN,cameraPosition-vWorld)<0.)light=.025;else light+=torchLight(vWorld,vN);}
 float dist=distance(cameraPosition,vWorld);float fog=1.-exp(-dist*.055);vec3 result=mix(base*light*1.05*brightness,vec3(.012,.009,.004),fog);
 gl_FragColor=vec4(result,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export function lightingVisible(wall,a,b,tile=2){
 const ox=Math.floor(a[0]/tile),oz=Math.floor(a[2]/tile),edgeX=a[0]-ox*tile<.0001,edgeZ=a[2]-oz*tile<.0001;
 if(wall(ox,oz)||edgeX&&wall(ox-1,oz)||edgeZ&&wall(ox,oz-1)||edgeX&&edgeZ&&wall(ox-1,oz-1))return false;
 const dx=b[0]-a[0],dz=b[2]-a[2];let x=Math.floor((a[0]+dx*.00001)/tile),z=Math.floor((a[2]+dz*.00001)/tile);
 const sx=dx>0?1:-1,sz=dz>0?1:-1,tx=Math.abs(dx)<.000001?Infinity:tile/Math.abs(dx),tz=Math.abs(dz)<.000001?Infinity:tile/Math.abs(dz);
 let nx=Number.isFinite(tx)?((x+(sx>0?1:0))*tile-a[0])/dx:Infinity,nz=Number.isFinite(tz)?((z+(sz>0?1:0))*tile-a[2])/dz:Infinity;
 for(;;){if(wall(x,z))return false;if(Math.min(nx,nz)>=.99999)return true;
  if(Math.abs(nx-nz)<.000001){if(wall(x+sx,z)||wall(x,z+sz))return false;x+=sx;z+=sz;nx+=tx;nz+=tz;}
  else if(nx<nz){x+=sx;nx+=tx;}else{z+=sz;nz+=tz;}
 }
}
export function lampActive(x,z,seed,spawn,reduced=true){if(x===spawn[0]&&z===spawn[1])return true;const s=BigInt(seed);if((BigInt(x*37+z*19)^s)%7n===0n)return false;if(!reduced)return true;let h=(Math.imul(x,0x1f123bb5)^Math.imul(z,0x5f356495)^Number(s&0xffffffffn)^Number(s>>32n))>>>0;h=Math.imul(h^(h>>>16),0x7feb352d)>>>0;h=Math.imul(h^(h>>>15),0x846ca68b)>>>0;return ((h^(h>>>16))>>>0)%10>=3;}
export function lampPlaced(x,z,spawn,active=false,terrain=false){return (x+2*z)%4===0||(x===spawn[0]&&z===spawn[1])||(terrain&&active);}
export class ReplayWorld {
 constructor(renderer,meta,wall){this.renderer=renderer;this.meta=meta;this.wall=wall;this.scene=new THREE.Scene();this.scene.background=new THREE.Color().setRGB(.012,.009,.004);this.scene.fog=new THREE.FogExp2(0x1f1b12,.026);this.roof=new THREE.Group();this.scene.add(this.roof);this.wallCaps=new THREE.Group();this.wallCaps.visible=false;this.scene.add(this.wallCaps);this.lamps=new Array(65536);this.fixtures=[];this.patches=[];this.floorPatches=new Int32Array(65536).fill(-1);this.disposed=false;
  const spawn=meta.spawnPosition.map(n=>Math.floor(n/meta.tile)),lampBits=meta.lampBits;
  for(let z=0;z<256;z++)for(let x=0;x<256;x++){if(wall(x,z))continue;const active=!!(lampBits[(z*256+x)>>3]&(1<<((z*256+x)&7)));if(!lampPlaced(x,z,spawn,active,meta.terrainLighting))continue;const at=[(x+.5)*2,meta.ceiling-.15,(z+.5)*2];this.fixtures.push({x,z,at,active});if(active)this.lamps[z*256+x]=at;}
  const mask=new Uint8Array(65536);for(let z=0;z<256;z++)for(let x=0;x<256;x++)mask[z*256+x]=wall(x,z)?255:0;
  this.wallTexture=new THREE.DataTexture(mask,256,256,THREE.RedFormat);this.wallTexture.needsUpdate=true;
  this.lightTexture=new THREE.DataTexture(new Uint8Array(1),1,1,THREE.RedFormat);this.lightTexture.magFilter=THREE.LinearFilter;this.lightTexture.minFilter=THREE.LinearFilter;this.lightTexture.needsUpdate=true;
  this.uniforms={torchPosition:{value:new THREE.Vector3()},torchDirection:{value:new THREE.Vector3(0,0,-1)},torchOn:{value:1},brightness:{value:1},wallMap:{value:this.wallTexture},lightMap:{value:this.lightTexture},lightMapSize:{value:new THREE.Vector2(2000,1)},exitCell:{value:new THREE.Vector2(...meta.exit)},exitColor:{value:new THREE.Color().setRGB(.045,.65,.085)}};
  this.material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:this.uniforms,side:THREE.DoubleSide});
 }
 setExit(cell,altered=false){this.uniforms.exitCell.value.set(...cell);this.uniforms.exitColor.value.setRGB(...(altered?[.9,.28,.09]:[.045,.65,.085]));}
 visible(a,b){return lightingVisible(this.wall,a,b,this.meta.tile);}
 illumination(p,n){const at=p.map((v,i)=>v+n[i]*.025),cx=Math.floor(at[0]/2),cz=Math.floor(at[2]/2);let light=.025+.015*(n[1]*.5+.5);
  for(let z=Math.max(0,cz-4);z<=Math.min(255,cz+4);z++)for(let x=Math.max(0,cx-4);x<=Math.min(255,cx+4);x++){const lamp=this.lamps[z*256+x];if(!lamp)continue;const dx=lamp[0]-at[0],dy=lamp[1]-at[1],dz=lamp[2]-at[2],d2=dx*dx+dy*dy+dz*dz;if(d2>49)continue;const incidence=Math.max(0,(n[0]*dx+n[1]*dy+n[2]*dz)/Math.sqrt(d2));if(this.visible(at,lamp)){const fade=Math.max(0,1-d2/49);light+=2.7*(.12+.88*incidence)*fade*fade/(1.+d2*.35);}}
  return Math.min(light,1.6);
 }
 actorMaterial(){return new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{...this.uniforms,actorAmbient:{value:.04}},vertexShader:`varying vec3 vWorld;varying vec3 vN;void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`${torchShader}
 uniform float actorAmbient;varying vec3 vWorld;varying vec3 vN;
 void main(){float beam=torchLight(vWorld,vN);float light=actorAmbient*(.75+.25*max(vN.y,0.))+beam;vec3 base=vec3(.009,.011,.009)*light;if(beam>0.)base+=vec3(.01*beam*pow(max(dot(normalize(torchPosition-vWorld),vN),0.),20.));float dist=distance(cameraPosition,vWorld);gl_FragColor=vec4(mix(base,vec3(.012,.009,.004),1.-exp(-dist*.055)),1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});}
 probe(x,z){const cx=Math.floor(x/2),cz=Math.floor(z/2);if(cx<0||cz<0||cx>=256||cz>=256)return .035;const id=this.floorPatches[cz*256+cx];if(id<0)return .035;
  const u=Math.min(4,Math.max(0,(x-cx*2)*2)),v=Math.min(4,Math.max(0,(z-cz*2)*2)),i=Math.min(3,Math.floor(u)),j=Math.min(3,Math.floor(v)),a=((Math.floor(id/400)*5+j)*2000+(id%400)*5+i),data=this.lightTexture.image.data,fx=u-i,fy=v-j;
  return ((data[a]+(data[a+1]-data[a])*fx)*(1-fy)+(data[a+2000]+(data[a+2001]-data[a+2000])*fx)*fy)/128;
 }

 bucket(){return {positions:[],normals:[],uv:[],light:[],kind:[],lightUv:[]};}
 quad(bucket,p,uv,kind){const a=new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0])),b=new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0])),normal=a.cross(b).normalize().toArray();let chart=-1;
  if(kind<=2){chart=this.patches.length;const patch=new Uint8Array(25),swap=uv[1][0]===uv[0][0];for(let y=0;y<5;y++)for(let x=0;x<5;x++){const u=(swap?y:x)/4,v=(swap?x:y)/4,at=p[0].map((_,k)=>(p[0][k]*(1-u)+p[1][k]*u)*(1-v)+(p[3][k]*(1-u)+p[2][k]*u)*v);patch[y*5+x]=Math.round(this.illumination(at,normal)*128);}this.patches.push(patch);if(kind===1)this.floorPatches[Math.floor(p[0][2]/2)*256+Math.floor(p[0][0]/2)]=chart;}
  const values=p.map(q=>kind===4||kind===6||kind===7?1:this.illumination(q,normal));for(const i of [0,1,2,0,2,3]){bucket.positions.push(p[i][0],p[i][1],-p[i][2]);bucket.normals.push(normal[0],normal[1],-normal[2]);bucket.uv.push(...uv[i]);bucket.light.push(values[i]);bucket.kind.push(kind);bucket.lightUv.push(...(chart<0?[-1,-1]:[(chart%400)*5+.5+(uv[i][0]-uv[0][0])*4/(uv[2][0]-uv[0][0]||1),Math.floor(chart/400)*5+.5+(uv[i][1]-uv[0][1])*4/(uv[2][1]-uv[0][1]||1)]));}
 }

 // World-space UVs keep wallpaper stains continuous on both winding directions.
 wallFace(bucket,p){this.quad(bucket,p,p.map(v=>[v[0]+v[2],v[1]]),0);}
 attach(b,group){if(!b.positions.length)return;const g=new THREE.BufferGeometry();for(const [name,values,size] of [['position',b.positions,3],['normal',b.normals,3],['uv',b.uv,2],['illumination',b.light,1],['surface',b.kind,1],['lightUv',b.lightUv,2]])g.setAttribute(name,new THREE.Float32BufferAttribute(values,size));g.computeBoundingSphere();group.add(new THREE.Mesh(g,this.material));}
 async build(progress=()=>{},cancel=()=>false){const c=this.meta.ceiling;let done=0;const chunks=[];const [sx,sz]=this.meta.spawnPosition;for(let bz=0;bz<256;bz+=16)for(let bx=0;bx<256;bx+=16)chunks.push([bx,bz]);chunks.sort((a,b)=>Math.hypot(a[0]*2-sx,a[1]*2-sz)-Math.hypot(b[0]*2-sx,b[1]*2-sz));
  for(const [bx,bz] of chunks){if(cancel())return;const floor=this.bucket(),roof=this.bucket(),caps=this.bucket();for(let z=bz;z<bz+16;z++)for(let x=bx;x<bx+16;x++){const a=x*2,b=z*2,d=a+2,e=b+2;if(this.wall(x,z)){this.quad(caps,[[a,c,b],[a,c,e],[d,c,e],[d,c,b]],[[a,b],[a,e],[d,e],[d,b]],7);continue;}this.quad(floor,[[a,0,b],[a,0,e],[d,0,e],[d,0,b]],[[a,b],[a,e],[d,e],[d,b]],1);this.quad(roof,[[a,c,b],[d,c,b],[d,c,e],[a,c,e]],[[a,b],[d,b],[d,e],[a,e]],2);
   if(this.wall(x,z-1))this.wallFace(floor,[[a,0,b],[d,0,b],[d,c,b],[a,c,b]]);if(this.wall(x+1,z))this.wallFace(floor,[[d,0,b],[d,0,e],[d,c,e],[d,c,b]]);if(this.wall(x,z+1))this.wallFace(floor,[[d,0,e],[a,0,e],[a,c,e],[d,c,e]]);if(this.wall(x-1,z))this.wallFace(floor,[[a,0,e],[a,0,b],[a,c,b],[a,c,e]]);
  }this.attach(floor,this.scene);this.attach(roof,this.roof);this.attach(caps,this.wallCaps);if(++done%8===0){progress(Math.round(done/256*100));await new Promise(resolve=>requestAnimationFrame(resolve));}}
  if(cancel())return;const lamps=this.bucket();for(const f of this.fixtures){const x=f.at[0],z=f.at[2],y=c-.015;this.quad(lamps,[[x-.59,y+.005,z-.31],[x+.59,y+.005,z-.31],[x+.59,y+.005,z+.31],[x-.59,y+.005,z+.31]],[[0,0],[1,0],[1,1],[0,1]],5);this.quad(lamps,[[x-.55,y,z-.27],[x+.55,y,z-.27],[x+.55,y,z+.27],[x-.55,y,z+.27]],[[0,0],[1,0],[1,1],[0,1]],f.active?6:5);}this.attach(lamps,this.roof);
  const width=2000,height=Math.max(5,Math.ceil(this.patches.length/400)*5),data=new Uint8Array(width*height);
  this.patches.forEach((patch,i)=>{for(let row=0;row<5;row++)data.set(patch.subarray(row*5,row*5+5),(Math.floor(i/400)*5+row)*width+(i%400)*5);});this.patches=[];
  this.lightTexture.image={data,width,height};this.lightTexture.needsUpdate=true;this.uniforms.lightMapSize.value.set(width,height);progress(100);
 }
 update(camera,player,yaw,pitch,lamp,cutaway){this.roof.visible=!cutaway;this.wallCaps.visible=cutaway;this.uniforms.torchPosition.value.set(player.x,player.y,-player.z);this.uniforms.torchDirection.value.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));this.uniforms.torchOn.value=lamp?1:0;
 }
 dispose(){this.disposed=true;const materials=new Set();this.scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [].concat(o.material))materials.add(m);});for(const m of materials)m.dispose();this.lightTexture.dispose();this.wallTexture.dispose();this.patches=[];}
}
// Each procedural tube has eight sides. Its fixed index topology avoids a
// per-frame coordinate-string hash map, GPU reallocations and garbage collection.
export function updateCableGeometry(g,vertices){
 const tubes=vertices.length/144,count=tubes*16;
 if(!Number.isInteger(tubes))throw Error('Invalid procedural tube topology');
 if(g.getAttribute('position')?.count!==count){
  g.dispose();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(count*3),3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(count*3),3).setUsage(THREE.DynamicDrawUsage));
  const indices=new Uint32Array(tubes*48);
  for(let t=0;t<tubes;t++)for(let side=0;side<8;side++){const base=t*16,a=base+side,b=base+(side+1)%8;indices.set([a,b,b+8,a,b+8,a+8],t*48+side*6);}
  g.setIndex(new THREE.BufferAttribute(indices,1));
 }
 const position=g.getAttribute('position'),out=position.array;
 for(let t=0;t<tubes;t++)for(let side=0;side<8;side++)for(let j=0;j<3;j++){
  const source=t*144+side*18;out[t*48+side*3+j]=vertices[source+j];out[t*48+24+side*3+j]=vertices[source+15+j];
 }
 position.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();g.setDrawRange(0,tubes*48);return g;
}
export function updateParticles(g,vertices){
 let p=g.getAttribute('position');
 if(!p||p.array.length<vertices.length){g.dispose();p=new THREE.BufferAttribute(new Float32Array(Math.max(vertices.length,1296)),3).setUsage(THREE.DynamicDrawUsage);g.setAttribute('position',p);}
 p.array.fill(0);p.array.set(vertices);p.needsUpdate=true;g.setDrawRange(0,vertices.length/3);g.computeBoundingSphere();return g;
}
