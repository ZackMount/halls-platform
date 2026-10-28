// Quintic ease: zero velocity and acceleration at both ends.
export function flightEase(progress){const t=Math.max(0,Math.min(1,progress));return t*t*t*(t*(t*6-15)+10);}
export function flightDuration(distance){return Math.min(900,Math.max(325,275+Math.log1p(Math.max(0,distance))*90));}

// Free-camera controls use wall time; third-person follow consumes recorded poses.
export function frameTimes(elapsed,rate,playing){return {camera:Math.max(0,Math.min(.1,elapsed)),playback:playing?Math.max(0,elapsed)*rate:0};}

// A display cut, not a judge rule. Compare adjacent recording samples, never
// rendered-frame travel: fast playback may legitimately cover many metres.
// The allowance exceeds normal movement/knockback and tolerates sparse samples.
export function poseDiscontinuous(from,to,seconds){
 return Math.hypot(to.x-from.x,to.z-from.z)>Math.max(2,20*Math.max(0,seconds));
}

// Include intervening recording ticks so fast playback follows real corners,
// rather than interpolating a straight line through the walls between frames.
export function followSteps(times,start,end,wallDt,display=t=>t){
 let lo=0,hi=times.length-1;
 while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(times[mid]<=start)lo=mid;else hi=mid-1;}
 const elapsed=display(end)-display(start),gain=elapsed>0?Math.max(1,wallDt/elapsed):0,steps=[];let previous=display(start),index=lo;
 for(let i=lo+1;i<times.length&&times[i]<=end;i++){
  const next=display(times[i]);if(next>previous)steps.push({index:i,time:times[i],dt:(next-previous)*gain});previous=next;index=i;
 }
 const next=display(end);if(next>previous)steps.push({index,time:end,dt:(next-previous)*gain});
 if(!steps.length)steps.push({index,time:end,dt:wallDt});
 return steps;
}
