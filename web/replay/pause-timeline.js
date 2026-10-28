// Keep stored replay timestamps intact; only the visible timeline is compressed.
export class PauseTimeline {
 constructor(duration,ranges=[],chaseRanges=[]){
  this.duration=Math.max(0,duration);this.ranges=[];this.removed=[];this.starts=[];let total=0;
  for(const [a,b] of ranges.filter(r=>r.length===2&&r.every(Number.isFinite)).sort((a,b)=>a[0]-b[0])){
   const start=Math.max(0,a),end=Math.min(this.duration,b),last=this.ranges.at(-1);if(end<=start)continue;
   if(last&&start<=last[1])last[1]=Math.max(last[1],end);else this.ranges.push([start,end]);
  }
  for(const [a,b] of this.ranges){this.starts.push(a-total);total+=b-a;this.removed.push(total);}
  this.active=this.duration-total;this.chaseRanges=chaseRanges.filter(r=>r.length===2&&r.every(Number.isFinite)&&r[1]>r[0]);
 }
 upper(values,t){let lo=0,hi=values.length;while(lo<hi){const m=(lo+hi)>>1;if(values[m]<=t)lo=m+1;else hi=m;}return lo;}
 index(t){let lo=0,hi=this.ranges.length;while(lo<hi){const m=(lo+hi)>>1;if(this.ranges[m][0]<=t)lo=m+1;else hi=m;}return lo-1;}
 pauseAt(t){const i=this.index(t);return i>=0&&t<this.ranges[i][1]?this.ranges[i]:null;}
 display(t,hidden=false){t=Math.max(0,Math.min(this.duration,t));if(!hidden)return t;const i=this.index(t);return i<0?t:t-(i?this.removed[i-1]:0)-Math.min(t-this.ranges[i][0],this.ranges[i][1]-this.ranges[i][0]);}
 wall(t,hidden=false){if(!hidden)return Math.max(0,Math.min(this.duration,t));t=Math.max(0,Math.min(this.active,t));const i=this.upper(this.starts,t);return Math.min(this.duration,t+(i?this.removed[i-1]:0));}
 background(hidden=false){
  const duration=hidden?this.active:this.duration,bins=new Uint8Array(1024),paint=(ranges,value)=>{
   if(duration<=0)return;for(const range of ranges){const a=this.display(range[0],hidden),b=this.display(range[1],hidden);if(b>a)bins.fill(value,Math.max(0,Math.floor(a/duration*1024)),Math.min(1024,Math.ceil(b/duration*1024)));}
  };
  paint(this.chaseRanges,2);if(!hidden)paint(this.ranges,1);
  const colors=['#647143','#c9ac72','#b94d42'],stops=[];let start=0;
  for(let i=1;i<=1024;i++)if(i===1024||bins[i]!==bins[start]){stops.push(`${colors[bins[start]]} ${start/10.24}% ${i/10.24}%`);start=i;}
  return `linear-gradient(to right,${stops.join(',')})`;
 }
}
