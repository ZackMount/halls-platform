export function zoomMapAt(view,pointer,width,height,delta){
 const zoom=Math.max(.7,Math.min(18,view.zoom*Math.exp(-delta*.001))),ratio=zoom/view.zoom;
 return {zoom,pan:[(pointer.x-width/2)*(1-ratio)+view.pan[0]*ratio,(pointer.y-height/2)*(1-ratio)+view.pan[1]*ratio]};
}
