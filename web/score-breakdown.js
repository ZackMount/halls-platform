const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const scoreNumber=value=>typeof value==='number'&&Number.isFinite(value)?String(Number(value.toFixed(2))):'—';
export function referenceTime(reference){
 if(reference?.available!==true||typeof reference.seconds!=='number'||!Number.isFinite(reference.seconds)||reference.seconds<0||reference.seconds>86400)return '';
 const ticks=Math.round(reference.seconds*100);
 return `${String(Math.floor(ticks/6000)).padStart(2,'0')}:${String(Math.floor(ticks/100)%60).padStart(2,'0')}.${String(ticks%100).padStart(2,'0')}`;
}
export function scoreComponents(perf={}){
 const names={completion:'通关',pace:'竞速',coins:'金币',tactics:'战术'};
 const time=referenceTime(perf.raceReference);
 return Object.entries(names).filter(([key])=>Object.hasOwn(perf.components||{},key)).map(([key,name])=>{
  const showTime=key==='pace'&&time;
  return `<div class="breakdown score-component${showTime?' with-reference':''}"><span>${name}</span><span class="score-component-value mono"><strong class="score-earned">${scoreNumber(perf.components[key])}</strong><span class="score-maximum">/ ${scoreNumber(perf.componentMaxima?.[key])}</span></span></div>${showTime?`<div class="race-reference"><span>理论最短时间</span><span class="mono">${perf.raceReference.approximate?'<span>约</span> ':''}${time}</span></div>`:''}`;
 }).join('');
}
const categories={movement:['地图与运动','地图、路线或移动记录存在异常。'],timing:['时间与速度','时间或速度记录存在异常。'],combat:['生存资源与战斗','电池、攻击、生命值或受伤记录存在不一致。'],entities:['实体行为','实体的运动或行为记录存在异常。'],automation:['自动化行为','操作记录呈现自动化倾向，按可疑度扣分。'],map_similarity:['地图相似','地图与已有成绩高度相似。'],path_similarity:['路径相似','行走路线与已有成绩高度相似。'],seed:['重复地图','地图种子与已有成绩重复，按重复地图规则折减。']};
export function scoreAdjustments(perf={}){
 const details=perf.adjustments||{items:Object.entries(categories).filter(([key])=>perf.deductions?.[key]>0).map(([key,[title,reason]])=>({title,reason,points:-perf.deductions[key]})),notes:[]};
 if(!perf.adjustments){
  if(perf.excludedBonuses?.navigation)details.notes.push('路线或移动记录存在异常，竞速与路线奖励未计入。');
  else if(perf.excludedBonuses?.pace)details.notes.push('时间或速度记录存在异常，竞速奖励未计入。');
 }
 const total=Number(perf.components?.integrity||0);
 const a=perf.automation,deduction=a?.deduction??perf.deductions?.automation;
 const suspicion=a?.available&&typeof a.suspicion==='number'&&a.suspicion>50&&a.suspicion<=100&&typeof deduction==='number'&&Number.isFinite(deduction)&&deduction>=.005?`<div class="breakdown"><span>自动化可疑度</span><span class="mono">${a.suspicion.toFixed(2)}%</span></div>`:'';
 const summary=Number.isFinite(total)&&Math.abs(total)>=.005?`<div class="breakdown"><span>评判调整</span><span class="mono">${total.toFixed(2)}</span></div>`:'';
 const content=summary+suspicion+details.items.filter(item=>Number.isFinite(item.points)&&item.points<0).map(item=>`<div class="score-loss"><div><strong>${esc(item.title)}</strong><span class="mono">${item.points.toFixed(2)}</span></div><p>${esc(item.reason)}</p></div>`).join('')+details.notes.map(note=>`<p class="score-note">${esc(note)}</p>`).join('');
 return content?`<section class="score-adjustments">${content}</section>`:'';
}
