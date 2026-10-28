'use strict';
const $=s=>document.querySelector(s);let settings,file,storageKey,accepted=false,uploadState='idle',scoreState='idle',receiptPending=false,newPending=false,epoch=0,restoreSerial=0;const completed=[false,false];
async function response(r){const type=r.headers.get('Content-Type')||'';if(!type.includes('application/json'))throw Error('请求未完成，请稍后重试。');const value=await r.json();if(!r.ok)throw Error(value.message||'请求未完成，请稍后重试。');return value;}
const working=()=>uploadState==='loading'||scoreState==='loading'||receiptPending||newPending;
const taskScope=()=>({epoch,context:{...settings.context}}),current=scope=>scope.epoch===epoch;
const submissionHeaders=scope=>({'X-HALLS-Submission-ID':String(scope.context.submission_id)});
const validCode=text=>typeof text==='string'&&text.length===48&&/^hkr1_[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/.test(text);
function checkedScore(value){if(!value||value.code!==200||value.max_score!==100||!Number.isFinite(value.score)||value.score<0||value.score>100||typeof value.feedback!=='string')throw Error('评分结果格式无效，请重试。');return value;}
function mark(step,state){$('#step-'+step).dataset.state=state;const badge=$('#badge-'+step);badge.textContent=state==='done'?'✓':state==='error'?'×':state==='loading'?'':String(step);badge.setAttribute('aria-label','步骤 '+step+'，'+({done:'已完成',error:'未通过',loading:'进行中',locked:'未解锁',active:'待完成'}[state]));}
function stages(){
 mark(1,completed[0]?'done':'active');mark(2,completed[1]?'done':completed[0]?'active':'locked');
 $('#download-link').setAttribute('aria-disabled',String(!completed[0]));$('#download-link').tabIndex=completed[0]?0:-1;$('#download-confirm').disabled=!completed[0];
 mark(3,accepted?'done':uploadState==='loading'?'loading':uploadState==='error'?'error':completed[1]?'active':'locked');mark(4,accepted?(scoreState==='idle'?'active':scoreState):'locked');
 $('#upload-fields').disabled=!completed[1]||accepted||working();$('#submit').disabled=$('#upload-fields').disabled;$('#retry').hidden=scoreState!=='error';$('#retry').disabled=working();
 $('#new-submission').hidden=!accepted;$('#new-submission').disabled=working();
}
function saveProgress(){try{sessionStorage.setItem(storageKey,JSON.stringify(completed));}catch{}}
function complete(step,event){if(!settings?.uploadsEnabled||(step===2&&!completed[0])){event.preventDefault();return;}completed[step-1]=true;saveProgress();stages();}
for(const selector of ['#intro-link','#intro-confirm'])$(selector).addEventListener('click',event=>complete(1,event));
for(const selector of ['#download-link','#download-confirm'])$(selector).addEventListener('click',event=>complete(2,event));
function message(text,error=false){const result=$('#result');result.replaceChildren();result.className=error?'error':'';result.textContent=text;}
function validate(candidate){if(!candidate||!candidate.name.toLowerCase().endsWith('.hproof'))throw Error('请选择 .hproof 凭证文件。');if(!candidate.size||candidate.size>settings.maxUploadBytes)throw Error('凭证文件不能超过 15 MiB。');return candidate;}
function contestUrl(){try{const url=new URL(settings.problemUrl);if(url.protocol==='https:'&&['nssctf.cn','www.nssctf.cn'].includes(url.hostname)&&!url.username&&!url.password&&(!url.port||url.port==='443'))return url.href;}catch{}return 'https://www.nssctf.cn/team/problem';}
function appendReplay(result,feedback){const link=feedback.match(/https:\/\/halls\.z4ck\.dev\/run\/[a-f0-9]{24}\b/);if(link){const a=document.createElement('a');a.className='result-link';a.href=link[0];a.target='_blank';a.rel='noopener';a.textContent='查看成绩与回放 →';result.append(a);}return !!link;}
function bindCopy(copy,code,status){copy.addEventListener('click',async()=>{
 code.focus();code.select();
 try{if(document.execCommand('copy')){status.textContent='已复制提交码。';return;}}catch{}
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(code.value);status.textContent='已复制提交码。';}
 catch{status.textContent='请选中并复制提交码。';}
});}
function renderHistory(){
 const list=$('#history-list');list.replaceChildren();let count=0;
 for(const entry of (Array.isArray(settings.history)?settings.history:[]).slice(0,10)){
  let value;try{value=checkedScore(entry.result);}catch{continue;}
  const item=document.createElement('article');item.className='history-entry';const title=document.createElement('h3');title.textContent=typeof entry.name==='string'?entry.name:'历史提交';item.append(title);
  const score=document.createElement('p');score.className='history-score';score.textContent=value.score.toFixed(2)+' / 100';item.append(score);
  if(!appendReplay(item,value.feedback)){const detail=document.createElement('p');detail.textContent=value.feedback;item.append(detail);}
  if(validCode(entry.submissionCode)){
   const code=document.createElement('textarea');code.className='submission-code history-code';code.value=entry.submissionCode;code.readOnly=true;code.rows=2;code.spellcheck=false;code.setAttribute('aria-label','历史提交码');item.append(code);
   const copy=document.createElement('button');copy.type='button';copy.className='history-copy';copy.textContent='复制此提交码';item.append(copy);
   const status=document.createElement('p');status.className='code-status';status.setAttribute('role','status');item.append(status);bindCopy(copy,code,status);
  }
  list.append(item);count++;
 }
 $('#history').hidden=!count;
}
async function resultScore(value,scope=taskScope()){
 checkedScore(value);if(!current(scope))return;
 const result=$('#result'),invalid=value.score===0&&/校验未通过|校验失败|凭证无效/.test(value.feedback),duplicate=value.score===0&&/凭证已被提交|重复提交/.test(value.feedback);
 scoreState=invalid||duplicate?'error':'done';result.replaceChildren();result.className='score-result'+(invalid?' invalid':duplicate?' duplicate':'');
 const label=document.createElement('p');label.className='result-label';label.textContent=invalid?'凭证未通过校验':duplicate?'凭证已提交':'本次得分';result.append(label);
 const total=document.createElement('div');total.className='result-score';const number=document.createElement('strong');number.textContent=value.score.toFixed(2);const maximum=document.createElement('span');maximum.textContent='/ 100';total.append(number,maximum);result.append(total);
 const detail=document.createElement('p');const link=/https:\/\/halls\.z4ck\.dev\/run\/[a-f0-9]{24}\b/.test(value.feedback);detail.textContent=link?'评判完成。':value.feedback;result.append(detail);appendReplay(result,value.feedback);
 if(settings.receiptDownloadEnabled){
  const note=document.createElement('p');note.textContent='复制提交码后，回到题目页面粘贴提交。';result.append(note);
  const code=document.createElement('textarea');code.className='submission-code';code.readOnly=true;code.rows=2;code.spellcheck=false;code.hidden=true;code.setAttribute('aria-label','提交码');result.append(code);
  const status=document.createElement('p');status.className='code-status';status.setAttribute('role','status');result.append(status);
  const actions=document.createElement('div');actions.className='receipt-actions';result.append(actions);
  const copy=document.createElement('button');copy.type='button';copy.className='receipt-copy';copy.textContent='复制提交码';copy.disabled=true;actions.append(copy);
  const retry=document.createElement('button');retry.type='button';retry.className='receipt-retry';retry.textContent='重新获取';retry.hidden=true;actions.append(retry);
  const back=document.createElement('a');back.className='contest-link';back.href=contestUrl();back.target='_blank';back.rel='noopener';back.textContent='回到 NSSCTF 粘贴提交 →';actions.append(back);
  async function loadCode(){
   if(!current(scope)||receiptPending||newPending)return;receiptPending=true;stages();copy.disabled=true;retry.disabled=true;retry.hidden=true;status.className='code-status';status.textContent='正在获取提交码…';
   try{
    const reply=await fetch('/receipt',{method:'POST',headers:submissionHeaders(scope)});if(!reply.ok)await response(reply);
    if(reply.headers.get('Content-Type')?.split(';')[0]!=='text/plain')throw Error('提交码格式无效，请重试。');
    const text=await reply.text();if(!validCode(text))throw Error('提交码格式无效，请重试。');if(!current(scope))return;
    code.value=text;code.hidden=false;copy.disabled=false;status.textContent='';
   }catch(problem){if(current(scope)){status.className='code-status error';status.textContent=problem.message;retry.hidden=false;}}
   finally{if(current(scope)){receiptPending=false;retry.disabled=false;stages();}}
  }
  bindCopy(copy,code,status);retry.addEventListener('click',loadCode);await loadCode();
 }
}
async function score(){
 if(!accepted||working())return;const scope=taskScope();scoreState='loading';stages();message('正在评判…');
 try{const value=await response(await fetch('/check',{method:'POST',headers:submissionHeaders(scope)}));if(current(scope))await resultScore(value,scope);}
 catch(error){if(current(scope)){scoreState='error';message(error.message,true);}}
 finally{if(current(scope))stages();}
}
$('#retry').addEventListener('click',score);
$('#proof-file').addEventListener('change',()=>{
 if(!completed[1]||accepted||working())return;
 try{file=validate($('#proof-file').files[0]);$('#file-label').textContent=file.name;if(!$('#player-name').value.trim())$('#player-name').value=[...file.name.replace(/\.hproof$/i,'').normalize('NFKC').replace(/\p{C}/gu,'').trim()].slice(0,32).join('');uploadState='idle';$('#upload-message').textContent='';$('#upload-message').className='status';}
 catch(error){file=null;$('#proof-file').value='';$('#file-label').textContent='选择 .hproof 文件';uploadState='error';$('#upload-message').textContent=error.message;$('#upload-message').className='status error';}stages();
});
$('#proof-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!completed[1]||accepted||working())return;const scope=taskScope();
 try{
  validate(file);const name=$('#player-name').value.normalize('NFKC').trim();if(!name||[...name].length>32||/\p{C}/u.test(name))throw Error('名字应为 1–32 个字符，不含控制符。');
  uploadState='loading';stages();$('#upload-message').textContent='正在上传…';$('#upload-message').className='status';
  const data=new FormData();data.append('file',file);data.append('name',name);data.append('context',JSON.stringify(scope.context));await response(await fetch('/upload',{method:'POST',body:data}));if(!current(scope))return;
  accepted=true;uploadState='idle';$('#upload-message').textContent='凭证已上传。';await score();
 }catch(error){if(current(scope)){uploadState='error';$('#upload-message').textContent=error.message;$('#upload-message').className='status error';}}
 finally{if(current(scope))stages();}
});
async function applySettings(value,preserveSteps=false){
 settings=value;epoch++;receiptPending=false;if(!value.uploadsEnabled){$('#submission').hidden=true;return;}
 storageKey='halls-koh-steps:'+value.context.problem_id+':'+value.context.submission_id;
 if(!preserveSteps){completed[0]=completed[1]=false;try{const old=JSON.parse(sessionStorage.getItem(storageKey));if(Array.isArray(old)&&old.length===2&&old.every(item=>typeof item==='boolean')){completed[0]=old[0];completed[1]=old[0]&&old[1];}}catch{}}
 accepted=!!value.hasSubmission;uploadState='idle';scoreState='idle';file=null;$('#proof-file').value='';$('#file-label').textContent='选择 .hproof 文件';$('#upload-message').className='status';$('#new-message').textContent='';
 if(accepted){completed[0]=completed[1]=true;$('#upload-message').textContent='凭证已上传。';if(typeof value.submissionName==='string'&&value.submissionName)$('#player-name').value=value.submissionName;}
 else{$('#upload-message').textContent='';}
 saveProgress();message('上传后自动开始评判。');renderHistory();$('#submission').hidden=false;stages();
 if(accepted){if(value.result){try{await resultScore(value.result);}catch(error){scoreState='error';message(error.message,true);}finally{stages();}}else await score();}
}
$('#new-submission').addEventListener('click',async()=>{
 if(!accepted||working())return;const scope=taskScope();let ownEpoch=epoch;newPending=true;stages();$('#new-message').textContent='';
 try{
  const value=await response(await fetch('/new-submission',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({context:scope.context})}));if(!current(scope))return;
  newPending=false;const applied=applySettings(value,true);ownEpoch=epoch;await applied;if(epoch===ownEpoch){$('#step-3').scrollIntoView?.({behavior:'smooth',block:'start'});if(!accepted)$('#proof-file').focus();}
 }catch(error){if(current(scope))$('#new-message').textContent=error.message;}
 finally{if(epoch===ownEpoch){newPending=false;stages();}}
});
async function restore(){const serial=++restoreSerial,generation=epoch;try{const value=await response(await fetch('/web-config'));if(serial===restoreSerial&&generation===epoch)await applySettings(value);}catch{if(serial===restoreSerial&&generation===epoch)$('#page-error').textContent='页面未能载入，请刷新重试。';}}
globalThis.addEventListener?.('pagehide',()=>{epoch++;});
globalThis.addEventListener?.('pageshow',event=>{if(event.persisted){newPending=false;restore();}});
restore();
