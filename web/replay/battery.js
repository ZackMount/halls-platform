export function batteryDisplay(value){
 const valid=Number.isFinite(value),cells=valid?Math.ceil(Math.max(0,Math.min(100,value))/20):0;
 return {cells,level:cells>=4?'green':cells>=2?'yellow':'red',label:valid?`${Number(value.toFixed(1))}%`:'—',abnormal:!valid||value<0||value>100};
}
export function updateBattery(element,value){
 const view=batteryDisplay(value);element.dataset.level=view.level;element.classList.toggle('battery-anomaly',view.abnormal);
 element.querySelector('output').textContent=view.label;
 element.querySelectorAll('[data-cell]').forEach((cell,i)=>cell.style.opacity=i<view.cells?'1':'.14');
 element.setAttribute('aria-label',`Battery ${view.label}`);
}
