const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const isScore=value=>Number.isFinite(value)&&value>=0&&value<=100;

// A score belongs to a completed report, never to an upload or a pending job.
export function uploadScore(submission={}){
 const report=submission.report,performance=report?.performance;
 if(submission.status!=='done'||!Array.isArray(report?.rules)||!performance||performance.completed===false)return '';
 const ranked=submission.board==='ranked'&&submission.decision==='approved';
 const score=ranked?submission.score:performance.referenceScore;
 if(!isScore(score))return '';
 return `<div class="upload-score"><h2>${ranked?'本次得分':'本次参考分'}</h2><div class="upload-score-value"><strong data-no-i18n>${score.toFixed(2)}</strong><span>/ 100</span>${performance.grade?`<span class="tag">${esc(performance.grade)}</span>`:''}</div>${ranked?'':'<p>此分数不参与正式排名。</p>'}</div>`;
}
