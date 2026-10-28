// Camera-space projection, with a direction that remains stable behind the eye.
export function markerPlacement(point,width,height,fx,fy){
 const cx=width/2,cy=height/2,depth=Math.max(Math.abs(point.z),.001);
 let dx=point.x*fx/depth*cx,dy=-point.y*fy/depth*cy;
 const front=point.z<-.04,inside=front&&Math.abs(dx)<cx-60&&Math.abs(dy)<cy-48;
 if(inside)return {x:cx+dx,y:cy+dy,edge:false,angle:0};
 if(Math.abs(dx)+Math.abs(dy)<1e-8){dx=0;dy=1;}
 const scale=Math.min(Math.max(1,cx-22)/Math.max(Math.abs(dx),1e-9),Math.max(1,cy-44)/Math.max(Math.abs(dy),1e-9));
 return {x:cx+dx*scale,y:cy+dy*scale,edge:true,angle:Math.atan2(dy,dx)};
}
export function markerLabels(points,width,height){
 return points.map(p=>{const x=Math.max(58,Math.min(width-58,p.x)),y=Math.max(8,Math.min(height-30,p.y>height-66?p.y-32:p.y+16));return {x:x-p.x,y:y-p.y};});
}
export function attachedLabel(point,width,height){
 if(point.edge&&point.x<60)return {x:12,y:-8,transform:'none'};
 if(point.edge&&point.x>width-60)return {x:-12,y:-8,transform:'translateX(-100%)'};
 return {x:0,y:point.y>height-66?-30:12,transform:'translateX(-50%)'};
}
