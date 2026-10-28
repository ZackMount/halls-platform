// No interpolation: an exit changes on the exact recorded tick. Seeking in
// either direction and skipping pauses use the same absolute replay clock.
export const EXIT_GREEN='#a4d484',EXIT_CHANGED='#f49b78';
export const sameCell=(a,b)=>!!a&&!!b&&a[0]===b[0]&&a[1]===b[1];
export function exitAt(meta,time){
 const events=meta.exitEvents||[];if(!events.length)return meta.exit;
 let lo=0,hi=events.length-1;
 while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(events[mid].time<=time)lo=mid;else hi=mid-1;}
 return events[lo].cell;
}
export function exitState(meta,time){
 const cell=exitAt(meta,time),canonical=meta.canonicalExit||null,recorded=!!meta.exitEvents?.length;
 const altered=canonical?!sameCell(cell,canonical):recorded&&!sameCell(cell,meta.exitEvents[0].cell);
 return {cell,canonical,recorded,altered,showOriginal:!!canonical&&!sameCell(cell,canonical),color:altered?EXIT_CHANGED:EXIT_GREEN};
}
export function exitLabel(state,original=false,english=false){
 if(original)return english?'ORIGINAL EXIT':'原始出口';
 if(state.altered)return state.recorded?(english?'CURRENT EXIT':'当前出口'):(english?'DECLARED EXIT':'声明出口');
 return english?'EXIT':'出口';
}
