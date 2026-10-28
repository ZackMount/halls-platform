// Recorded horizontal motion over active wall time, independent of playback rate.
export function recordedSpeed(index,frames,{position,time,available=()=>true,paused=false}){
 if(paused||frames<2||index<0||index>=frames)return 0;
 for(const [a,b] of [[index,index+1],[index-1,index]]){
  if(a<0||b>=frames||!available(a)||!available(b))continue;
  const dt=time(b)-time(a),p=position(a),q=position(b);
  if(dt<=1e-6||!p.every(Number.isFinite)||!q.every(Number.isFinite))continue;
  const speed=Math.hypot(q[0]-p[0],q[1]-p[1])/dt;
  if(Number.isFinite(speed))return speed;
 }
 return 0;
}
