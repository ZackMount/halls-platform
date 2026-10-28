import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {File} from 'node:buffer';
const source=readFileSync(new URL('./web/app.js',import.meta.url),'utf8'),html=readFileSync(new URL('./web/index.html',import.meta.url),'utf8');
const GOOD={code:200,score:77.36,max_score:100,feedback:'成绩与回放：https://halls.z4ck.dev/run/'+'a'.repeat(24)},TOKEN='hkr1_'+'A'.repeat(43);
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.text='';this.listeners={};this.dataset={};this.attributes={};this.hidden=false;this.value='';this.disabled=false;}
 get textContent(){return this.text+this.children.map(c=>typeof c==='string'?c:c.textContent).join('');}
 set textContent(value){this.text=String(value);this.children=[];}
 replaceChildren(...children){this.text='';this.children=children;}
 append(...children){this.children.push(...children);}
 addEventListener(name,fn){this.listeners[name]=fn;}
 setAttribute(name,value){this.attributes[name]=value;}
 click(){this.clicked=true;}
 focus(){this.focused=true;}
 select(){this.selected=true;}
}
function walk(node){return [node,...node.children.flatMap(child=>typeof child==='string'?[]:walk(child))];}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function page(options={}){
 const nodes=new Map(),calls=[],requests=[],downloads=[],created=[],copies=[],clipboardWrites=[],events={},storage=options.storage??new Map(),browser=options.context??{problem_id:2,submission_id:1};
 let activeContext={...browser},hasSubmission=!!options.hasSubmission,storedResult=options.savedResult??null,storedCode=options.savedCode??null,submissionName=options.submissionName??'',history=options.history??[];
 const config=()=>({uploadsEnabled:options.enabled??true,maxUploadBytes:15728640,context:{...activeContext},hasSubmission,receiptDownloadEnabled:options.receiptEnabled??true,problemUrl:options.problemUrl??'https://www.nssctf.cn/team/problem/42',result:storedResult,submissionName,history});
 for(const match of html.matchAll(/id="([^"]+)"/g))nodes.set('#'+match[1],new Element());nodes.get('#submission').hidden=true;nodes.get('#retry').hidden=true;
 class BrowserURL extends URL{static createObjectURL(blob){downloads.push(blob);return 'blob:test-download';}static revokeObjectURL(){}}
 const context=vm.createContext({FormData,Blob,URL:BrowserURL,addEventListener:(event,listener)=>{events[event]=listener;},navigator:options.modernClipboard?{clipboard:{writeText:async text=>{clipboardWrites.push(text);if(options.clipboardError)throw Error('denied');}}}:{},sessionStorage:{getItem:key=>{if(options.storageBlocked)throw Error('blocked');return storage.get(key)??null;},setItem:(key,value)=>{if(options.storageBlocked)throw Error('blocked');storage.set(key,value);}},document:{querySelector:name=>nodes.get(name),createElement:tag=>{const el=new Element(tag);created.push(el);return el;},execCommand:command=>{assert.equal(command,'copy');const code=created.findLast(el=>el.selected&&el.focused);assert.ok(code);copies.push(code.value);return options.copySupported??true;}},fetch:async(url,request={})=>{
  calls.push(url);requests.push({url,...request});let value,status=200,type='application/json';
  if(url==='/web-config')value=options.configResponse??config();
  if(url==='/upload'){if(options.uploadWait)await options.uploadWait;value=options.uploadResponse??{code:200};status=options.uploadStatus??200;if(status===200){assert.deepEqual(JSON.parse(request.body.get('context')),activeContext);hasSubmission=true;submissionName=request.body.get('name');}}
  if(url==='/check'){if(options.checkWait)await options.checkWait;value=options.checkResponse??GOOD;status=options.checkStatus??200;if(status===200)storedResult=value;}
  if(url==='/receipt'){if(options.receiptWait)await options.receiptWait;value=options.receiptResponse??TOKEN;status=options.receiptStatus??200;type=options.receiptType??(status<400?'text/plain; charset=utf-8':'application/json');if(status===200)storedCode=value;}
  if(url==='/new-submission'){
   if(options.newWait)await options.newWait;status=options.newStatus??200;
   if(status===200){assert.deepEqual(JSON.parse(request.body).context,activeContext);if(storedResult)history=[{context:{...activeContext},name:submissionName,result:storedResult,submissionCode:storedCode},...history].slice(0,10);activeContext={...activeContext,submission_id:activeContext.submission_id+1};hasSubmission=false;storedResult=null;storedCode=null;value=options.newResponse??config();}
   else value=options.newResponse??{message:'当前评判仍在进行，请稍后重试。'};
  }
  return {ok:status<400,headers:{get:()=>type},json:async()=>value,text:async()=>value};
 }});
 const ready=vm.runInContext(source,context);await tick();if(!options.checkWait&&!options.receiptWait)await ready;
 return {nodes,calls,requests,downloads,created,copies,clipboardWrites,storage,options,ready,events,config};
}
async function click(view,selector){let prevented=false;await view.nodes.get(selector).listeners.click({preventDefault(){prevented=true;}});return prevented;}
async function advance(view,one='#intro-confirm',two='#download-confirm'){await click(view,one);await click(view,two);}
function state(view,step){return view.nodes.get('#step-'+step).dataset.state;}
function choose(view,name='sample.hproof'){view.nodes.get('#proof-file').files=[new File(['dedicated UI regression file '+name],name)];view.nodes.get('#proof-file').listeners.change();}
async function submit(view,unlock=true){if(unlock)await advance(view);choose(view);await view.nodes.get('#proof-form').listeners.submit({preventDefault(){}});return view.nodes.get('#result');}
let view=await page({enabled:false});assert.equal(view.nodes.get('#submission').hidden,true);assert.deepEqual(view.calls,['/web-config']);
view=await page();assert.equal(view.nodes.get('#submission').hidden,false);assert.equal(state(view,1),'active');assert.equal(state(view,2),'locked');assert.equal(state(view,3),'locked');assert.equal(view.nodes.get('#upload-fields').disabled,true);assert.equal(await click(view,'#download-link'),true);assert.equal(state(view,2),'locked');await submit(view,false);assert.deepEqual(view.calls,['/web-config']);
for(const first of ['#intro-link','#intro-confirm'])for(const second of ['#download-link','#download-confirm']){view=await page();assert.equal(await click(view,first),false);assert.equal(state(view,1),'done');assert.equal(state(view,2),'active');assert.equal(view.nodes.get('#badge-1').textContent,'✓');await click(view,second);assert.equal(state(view,2),'done');assert.equal(state(view,3),'active');assert.equal(view.nodes.get('#upload-fields').disabled,false);}
view=await page();let result=await submit(view);assert.match(result.textContent,/77\.36\/ 100/);assert.equal(state(view,3),'done');assert.equal(state(view,4),'done');assert.equal(view.nodes.get('#upload-fields').disabled,true);assert.equal(view.nodes.get('#retry').hidden,true);assert.deepEqual(view.calls,['/web-config','/upload','/check','/receipt']);assert.equal(walk(result).find(el=>el.className==='result-link').href,'https://halls.z4ck.dev/run/'+'a'.repeat(24));assert.doesNotMatch(result.textContent,/对应 NSSCTF|积分/);
let resolveUpload,resolveCheck;view=await page({uploadWait:new Promise(resolve=>resolveUpload=resolve),checkWait:new Promise(resolve=>resolveCheck=resolve)});const pending=submit(view);await tick();assert.equal(state(view,3),'loading');assert.equal(state(view,4),'locked');assert.equal(view.nodes.get('#submit').disabled,true);resolveUpload();await tick();assert.equal(state(view,3),'done');assert.equal(state(view,4),'loading');assert.equal(view.nodes.get('#badge-4').textContent,'');assert.match(view.nodes.get('#result').textContent,/正在评判/);resolveCheck();await pending;assert.equal(state(view,4),'done');
view=await page({uploadStatus:503,uploadResponse:{message:'上传暂不可用。'}});await submit(view);assert.equal(state(view,3),'error');assert.equal(state(view,4),'locked');assert.match(view.nodes.get('#upload-message').textContent,/上传暂不可用/);assert.equal(view.nodes.get('#upload-fields').disabled,false);view.options.uploadStatus=200;view.options.uploadResponse={code:200};await submit(view);assert.equal(state(view,4),'done');
view=await page({checkStatus:503,checkResponse:{message:'评分服务暂时不可用，请重试。'}});result=await submit(view);assert.equal(state(view,3),'done');assert.equal(state(view,4),'error');assert.equal(view.nodes.get('#retry').hidden,false);assert.doesNotMatch(result.textContent,/0\.00|本次得分/);view.options.checkStatus=200;view.options.checkResponse=GOOD;await click(view,'#retry');assert.equal(state(view,4),'done');assert.equal(view.calls.filter(url=>url==='/upload').length,1);assert.equal(view.calls.filter(url=>url==='/check').length,2);
for(const feedback of ['凭证校验未通过，得分为 0。','凭证已被提交，本次得分为 0。']){view=await page({checkResponse:{...GOOD,score:0,feedback}});result=await submit(view);assert.equal(state(view,4),'error');assert.equal(view.nodes.get('#badge-4').textContent,'×');assert.match(result.textContent,/0\.00\/ 100/);assert.equal(walk(result).some(el=>el.className==='result-link'),false);assert.equal(view.nodes.get('#retry').hidden,false);}
view=await page({checkResponse:{...GOOD,score:0}});result=await submit(view);assert.equal(state(view,4),'done');assert.match(result.textContent,/本次得分0\.00/);
for(const score of [NaN,Infinity,-1,101,true,'0']){view=await page({checkResponse:{...GOOD,score}});result=await submit(view);assert.equal(state(view,4),'error');assert.match(result.textContent,/评分结果格式无效/);assert.doesNotMatch(result.textContent,/0\.00/);}
view=await page();await click(view,'#intro-link');let restored=await page({storage:view.storage});assert.equal(state(restored,1),'done');assert.equal(state(restored,2),'active');await click(restored,'#download-confirm');restored=await page({storage:view.storage});assert.equal(state(restored,2),'done');assert.equal(state(restored,3),'active');assert.deepEqual(restored.calls,['/web-config']);const fresh=await page({storage:view.storage,context:{problem_id:2,submission_id:99}});assert.equal(state(fresh,1),'active');assert.equal(state(fresh,2),'locked');
view=await page({hasSubmission:true});assert.equal(state(view,1),'done');assert.equal(state(view,2),'done');assert.equal(state(view,3),'done');assert.equal(state(view,4),'done');assert.deepEqual(view.calls,['/web-config','/check','/receipt']);
view=await page({hasSubmission:true,checkStatus:503,checkResponse:{message:'评分服务暂不可用'}});assert.equal(state(view,3),'done');assert.equal(state(view,4),'error');view.options.checkStatus=200;view.options.checkResponse=GOOD;await click(view,'#retry');assert.deepEqual(view.calls,['/web-config','/check','/check','/receipt']);
view=await page({storageBlocked:true});await advance(view);assert.equal(state(view,3),'active');
view=await page();result=await submit(view);let code=walk(result).find(el=>el.className==='submission-code'),copy=walk(result).find(el=>el.className==='receipt-copy');assert.equal(code.value,TOKEN);assert.equal(code.readOnly,true);assert.equal(code.hidden,false);assert.equal(copy.disabled,false);assert.equal(view.copies.length,0);assert.equal(view.clipboardWrites.length,0);assert.equal(view.downloads.length,0);await copy.listeners.click();assert.deepEqual(view.copies,[TOKEN]);assert.match(result.textContent,/已复制提交码/);assert.equal(walk(result).find(el=>el.className==='contest-link').href,'https://www.nssctf.cn/team/problem/42');
view=await page({copySupported:false});result=await submit(view);await walk(result).find(el=>el.className==='receipt-copy').listeners.click();assert.equal(walk(result).find(el=>el.className==='submission-code').selected,true);assert.match(result.textContent,/请选中并复制提交码/);
view=await page({copySupported:false,modernClipboard:true});result=await submit(view);assert.equal(view.clipboardWrites.length,0);await walk(result).find(el=>el.className==='receipt-copy').listeners.click();assert.deepEqual(view.clipboardWrites,[TOKEN]);assert.match(result.textContent,/已复制提交码/);
view=await page({copySupported:false,modernClipboard:true,clipboardError:true});result=await submit(view);await walk(result).find(el=>el.className==='receipt-copy').listeners.click();assert.match(result.textContent,/请选中并复制提交码/);
for(const badUrl of ['javascript:alert(1)','https://www.nssctf.cn.evil.test/','https://user:secret@www.nssctf.cn/']){view=await page({problemUrl:badUrl});result=await submit(view);assert.equal(walk(result).find(el=>el.className==='contest-link').href,'https://www.nssctf.cn/team/problem');}
for(const host of ['www.nssctf.cn','nssctf.cn']){const configured='https://'+host+'/custom-event/entry?pid=42&from=koh#assessment';view=await page({problemUrl:configured,context:{problem_id:98765,submission_id:1}});result=await submit(view);assert.equal(walk(result).find(el=>el.className==='contest-link').href,configured);}
for(const receipt of [TOKEN.slice(0,47),TOKEN+'x',TOKEN+'\n','x'+TOKEN.slice(1),'hkr1_'+'A'.repeat(42)+'B','',JSON.stringify({version:1,token:TOKEN})]){view=await page({receiptResponse:receipt});result=await submit(view);assert.equal(walk(result).find(el=>el.className==='receipt-copy').disabled,true);assert.equal(walk(result).find(el=>el.className==='submission-code').hidden,true);assert.equal(view.copies.length,0);assert.match(result.textContent,/提交码格式无效/);assert.match(result.textContent,/77\.36\/ 100/);}
view=await page({receiptType:'application/json'});result=await submit(view);assert.match(result.textContent,/提交码格式无效/);
view=await page({receiptStatus:503,receiptResponse:{message:'提交码暂不可用，请重试。'}});result=await submit(view);assert.match(result.textContent,/提交码暂不可用/);assert.equal(state(view,4),'done');assert.equal(walk(result).find(el=>el.className==='receipt-retry').hidden,false);view.options.receiptStatus=200;view.options.receiptResponse=TOKEN;await walk(result).find(el=>el.className==='receipt-retry').listeners.click();assert.equal(walk(result).find(el=>el.className==='submission-code').value,TOKEN);assert.equal(view.calls.filter(url=>url==='/upload').length,1);assert.equal(view.calls.filter(url=>url==='/check').length,1);assert.equal(view.calls.filter(url=>url==='/receipt').length,2);
view=await page({receiptEnabled:false,checkResponse:{...GOOD,feedback:'<img src=x onerror=alert(1)> https://evil.test/'}});result=await submit(view);assert.match(result.textContent,/<img src=x/);assert.equal(walk(result).some(el=>['img','a'].includes(el.tagName)),false);
// A restored completed result stays available without asking the judge again.
view=await page({hasSubmission:true,savedResult:GOOD,submissionName:'Alice'});
assert.deepEqual(view.calls,['/web-config','/receipt']);assert.equal(view.nodes.get('#new-submission').hidden,false);assert.equal(view.nodes.get('#new-submission').disabled,false);
assert.equal(view.nodes.get('#player-name').value,'Alice');const oldContext=view.config().context;
await click(view,'#new-submission');
assert.deepEqual(view.calls,['/web-config','/receipt','/new-submission']);
assert.deepEqual(JSON.parse(view.requests.at(-1).body),{context:oldContext});
assert.equal(state(view,1),'done');assert.equal(state(view,2),'done');assert.equal(state(view,3),'active');assert.equal(state(view,4),'locked');
assert.equal(view.nodes.get('#upload-fields').disabled,false);assert.equal(view.nodes.get('#proof-file').value,'');assert.equal(view.nodes.get('#player-name').value,'Alice');
assert.equal(view.nodes.get('#new-submission').hidden,true);assert.equal(view.nodes.get('#history').hidden,false);
const past=view.nodes.get('#history-list');assert.match(past.textContent,/Alice77\.36/);assert.equal(walk(past).find(el=>el.className==='submission-code history-code').value,TOKEN);
assert.equal(view.copies.length,0);await walk(past).find(el=>el.className==='history-copy').listeners.click();assert.deepEqual(view.copies,[TOKEN]);
const SECOND={...GOOD,score:42.15},SECOND_TOKEN='hkr1_'+'B'.repeat(42)+'A';view.options.checkResponse=SECOND;view.options.receiptResponse=SECOND_TOKEN;
choose(view,'second.hproof');await view.nodes.get('#proof-form').listeners.submit({preventDefault(){}});
assert.equal(state(view,4),'done');assert.match(view.nodes.get('#result').textContent,/42\.15/);assert.match(past.textContent,/77\.36/);
assert.equal(walk(view.nodes.get('#result')).find(el=>el.className==='submission-code').value,SECOND_TOKEN);
assert.equal(view.requests.filter(r=>r.url==='/upload').at(-1).body.get('file').name,'second.hproof');
for(const req of view.requests.filter(r=>r.url==='/check'||r.url==='/receipt'))assert.equal(req.headers['X-HALLS-Submission-ID'],String(req===view.requests[1]?oldContext.submission_id:view.config().context.submission_id));
const nextConfig=view.config();restored=await page({context:nextConfig.context,storage:view.storage,hasSubmission:true,savedResult:SECOND,submissionName:'Alice',history:nextConfig.history,receiptResponse:SECOND_TOKEN});
assert.deepEqual(restored.calls,['/web-config','/receipt']);assert.equal(restored.nodes.get('#history').hidden,false);assert.equal(restored.nodes.get('#new-submission').disabled,false);
await click(restored,'#new-submission');assert.equal(restored.config().history.length,2);assert.equal(restored.config().history[0].submissionCode,SECOND_TOKEN);
assert.ok(restored.storage.has('halls-koh-steps:'+restored.config().context.problem_id+':'+restored.config().context.submission_id));

// New-round failures leave the old result/code intact; rate-limit failures keep
// the new file selected, so retrying does not require a reset or a fresh upload ID.
view=await page({hasSubmission:true,savedResult:GOOD,newStatus:503,newResponse:{message:'暂时无法开始新提交。'}});
const previousResult=view.nodes.get('#result').textContent,previousCode=walk(view.nodes.get('#result')).find(el=>el.className==='submission-code');
await click(view,'#new-submission');assert.equal(view.nodes.get('#result').textContent,previousResult);assert.equal(previousCode.value,TOKEN);assert.equal(view.nodes.get('#new-submission').disabled,false);assert.match(view.nodes.get('#new-message').textContent,/暂时无法/);
view.options.newStatus=200;delete view.options.newResponse;await click(view,'#new-submission');
view.options.uploadStatus=429;view.options.uploadResponse={message:'每分钟只能提交一次成绩。'};choose(view,'another.hproof');
await view.nodes.get('#proof-form').listeners.submit({preventDefault(){}});assert.equal(state(view,3),'error');assert.equal(view.nodes.get('#upload-fields').disabled,false);assert.equal(view.nodes.get('#file-label').textContent,'another.hproof');assert.match(view.nodes.get('#upload-message').textContent,/每分钟/);
const retryContext=view.config().context;view.options.uploadStatus=200;view.options.uploadResponse={code:200};await view.nodes.get('#proof-form').listeners.submit({preventDefault(){}});
assert.equal(state(view,4),'done');for(const req of view.requests.filter(r=>r.url==='/upload'))assert.deepEqual(JSON.parse(req.body.get('context')),retryContext);
for(const feedback of ['凭证校验未通过，得分为 0。','凭证已被提交，本次得分为 0。']){
 view=await page({hasSubmission:true,savedResult:{...GOOD,score:0,feedback}});assert.equal(state(view,4),'error');assert.equal(view.nodes.get('#new-submission').disabled,false);await click(view,'#new-submission');assert.equal(state(view,3),'active');assert.equal(state(view,4),'locked');
}

let resolveReceipt;view=await page({hasSubmission:true,savedResult:GOOD,receiptWait:new Promise(resolve=>resolveReceipt=resolve)});
assert.equal(view.nodes.get('#new-submission').disabled,true);await click(view,'#new-submission');assert.ok(!view.calls.includes('/new-submission'));resolveReceipt();await view.ready;assert.equal(view.nodes.get('#new-submission').disabled,false);
let resolveNew;view=await page({hasSubmission:true,savedResult:GOOD,newWait:new Promise(resolve=>resolveNew=resolve)});
const starting=click(view,'#new-submission');await tick();assert.equal(view.nodes.get('#new-submission').disabled,true);await click(view,'#new-submission');assert.equal(view.calls.filter(url=>url==='/new-submission').length,1);resolveNew();await starting;assert.equal(state(view,3),'active');

// Returning from the page cache refreshes state. Late work from the departed
// round cannot repaint a newly restored round or request that round's receipt.
for(const delayed of ['check','receipt']){
 let finish;view=await page({hasSubmission:true,...(delayed==='receipt'?{savedResult:GOOD}:{}),[delayed+'Wait']:new Promise(resolve=>finish=resolve)});
 assert.equal(view.nodes.get('#new-submission').disabled,true);view.events.pagehide();
 view.options[delayed+'Wait']=null;view.options.configResponse={...view.config(),context:{problem_id:2,submission_id:99},hasSubmission:false,result:null,history:[]};
 view.events.pageshow({persisted:true});await tick();assert.equal(state(view,4),'locked');
 finish();await view.ready;await tick();assert.equal(state(view,4),'locked');assert.equal(view.nodes.get('#result').textContent,'上传后自动开始评判。');assert.equal(view.nodes.get('#new-submission').hidden,true);
}
view=await page({history:[{name:'<img src=x onerror=alert(1)>',result:{...GOOD,feedback:'<script>x</script>'},submissionCode:'invalid'}]});
assert.match(view.nodes.get('#history-list').textContent,/<img src=x/);assert.equal(walk(view.nodes.get('#history-list')).some(el=>['img','script','textarea'].includes(el.tagName)),false);
console.log('Multi-round UI passed: cached restoration, independent contexts/codes, bounded history, retries, busy guards and stale-response isolation.');
const css=readFileSync(new URL('./web/site.css',import.meta.url),'utf8'),main=readFileSync(new URL('../web/site.js',import.meta.url),'utf8');assert.match(html,/<h1>HALLS<\/h1>/);assert.match(css,/h1\{white-space:nowrap/);assert.equal((html.match(/class="step"/g)||[]).length,4);assert.match(html,/前往查看游戏介绍/);assert.match(html,/前往游戏下载/);assert.match(html,/我已知晓/);assert.match(html,/我已下载/);assert.match(html,/自动评判/);const downloadPath='M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4';assert.ok(html.includes(downloadPath)&&main.includes(downloadPath));assert.doesNotMatch(html+source,/对应 NSSCTF 积分|暂不计分|先看游戏介绍|程序旁会生成|下载提交回执|回到 NSSCTF 提交回执/);assert.match(css,/\.action\{[^}]*background:#373b23;color:#fbf7de/);
console.log('Timeline UI passed: sequential links/acknowledgements, upload/check loading, success/failure/retry, per-context restoration, real scores and explicit-click submission code copy with HTTP/manual fallback.');
