// Health is a discrete recorded state, never a tweened animation channel.
export const abnormalHealth=value=>![0,32,66,100].some(h=>Math.abs(value-h)<.001);
export const healthLabel=value=>`HP ${Number.isInteger(value)?value:Number(value.toFixed(4))}`;

// Sparse health changes retain brief modifications between 12 Hz motion samples.
export function healthAt(events,time,fallback){
 if(!events?.length||time<events[0][0])return fallback;
 let lo=0,hi=events.length-1;
 while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(events[mid][0]<=time)lo=mid;else hi=mid-1;}
 return events[lo][1];
}
