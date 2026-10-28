import * as THREE from './vendor/three.module.js';
import {coinPose} from './coins.js';
export function createCoinModel(coin){
 const root=new THREE.Group(),body=new THREE.Group(),sparks=new THREE.Group();
 root.add(body,sparks);root.position.set(coin.position[0],0,-coin.position[1]);
 const gold=new THREE.MeshBasicMaterial({color:0xf0961f}),edge=new THREE.MeshBasicMaterial({color:0x8b5c1b}),face=new THREE.MeshBasicMaterial({color:0x6e3c0a}),dark=new THREE.MeshBasicMaterial({color:0x6e3c0a}),shine=new THREE.MeshBasicMaterial({color:0xf5d979});
 const disc=(radius,depth,materials,z=0)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,20),materials);mesh.rotation.x=Math.PI/2;mesh.position.z=z;body.add(mesh);};
 disc(.23,.054,[edge,gold,gold]);
 for(const sign of [-1,1]){
  disc(.195,.008,face,sign*.038);const ring=new THREE.Mesh(new THREE.RingGeometry(.153,.167,20),gold);ring.position.z=sign*.045;ring.rotation.y=sign<0?Math.PI:0;body.add(ring);
  const diamondGeometry=new THREE.BufferGeometry();diamondGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,.112,0,.075,0,0,0,-.112,0,-.075,0,0],3));diamondGeometry.setIndex([0,2,1,0,3,2]);const diamond=new THREE.Mesh(diamondGeometry,shine);diamond.rotation.y=sign<0?Math.PI:0;diamond.position.z=sign*.052;body.add(diamond);
 }
 const particleGeometry=new THREE.OctahedronGeometry(.025),particleMaterial=new THREE.MeshBasicMaterial({color:0xf2c95d,transparent:true});
 for(let i=0;i<12;i++){const spark=new THREE.Mesh(particleGeometry,particleMaterial);sparks.add(spark);}
 root.userData={coin,body,sparks,particleMaterial};return root;
}
export function updateCoinModel(root,time,pickupTime,activeTime){
 const {body,sparks,particleMaterial}=root.userData,pose=coinPose(time,pickupTime,activeTime,root.userData.coin.id);root.visible=pose.visible;if(!pose.visible)return;
 body.position.y=pose.height;body.rotation.y=pose.yaw;body.scale.setScalar(pose.scale);
 sparks.visible=pose.collected;particleMaterial.opacity=1-pose.progress;
 if(pose.collected)for(const [i,spark] of sparks.children.entries()){
  const angle=i*Math.PI*2/12+root.userData.coin.id,r=pose.progress*(.60+.14*(i%3));
  spark.position.set(Math.cos(angle)*r,1.05+pose.progress*(.45+.16*(i%2))-.32*pose.progress**2,Math.sin(angle)*r);
  spark.scale.setScalar(Math.sqrt(1-pose.progress));
 }
}
