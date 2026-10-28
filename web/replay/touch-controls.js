import {zoomMapAt} from './map-controls.js';
export function touchShape(points){const p=[...points];if(!p.length)return null;const a=p[0],b=p[1]||a;return {count:p.length,x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:p.length>1?Math.hypot(a.x-b.x,a.y-b.y):0};}
export function touchChange(before,after){if(!before||!after||before.count!==after.count)return null;return {dx:after.x-before.x,dy:after.y-before.y,ratio:before.distance>4?Math.max(.25,Math.min(4,after.distance/before.distance)):1,multi:after.count>1};}
export function pinchMap(view,before,after,width,height){const d=touchChange(before,after);if(!d)return {zoom:view.zoom,pan:[...view.pan]};const next=zoomMapAt(view,before,width,height,-Math.log(d.ratio)*1000);next.pan[0]+=d.dx;next.pan[1]+=d.dy;return next;}
