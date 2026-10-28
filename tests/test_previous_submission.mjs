import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../web/site.js',import.meta.url),'utf8');
const start=source.indexOf('async function uploadPage('),end=source.indexOf('\nasync function runPage(',start);
for(const [last,receipt,visible] of [['a'.repeat(24),'saved-receipt',true],['a'.repeat(24),null,false],['<img src=x onerror=alert(1)>','saved-receipt',false],[null,null,false]]){
 const result={innerHTML:''};let bound=0,requests=0;
 const context=vm.createContext({document:{querySelector:()=>({classList:{add(){}}})},root:{},$:id=>id==='#upload-form'?{}:result,bindUpload:()=>bound++,sessionStorage:{getItem:key=>key==='lastSubmission'?last:receipt},api:()=>{requests++;throw Error('Opening a previous replay must not submit or poll');},poll:()=>{requests++;throw Error('Opening a previous replay must not poll');}});
 await vm.runInContext(source.slice(start,end)+'\nuploadPage(true);',context);
 assert.equal(bound,1);assert.equal(requests,0);
 if(visible){assert.match(result.innerHTML,/href="\/replay\?run=aaaaaaaaaaaaaaaaaaaaaaaa"/);assert.match(result.innerHTML,/<a\b/);assert.doesNotMatch(result.innerHTML,/正在评分|onclick|saved-receipt/);}
 else assert.equal(result.innerHTML,'');
}
console.log('Previous submission opens the replay directly without uploads, scoring, polling or exposing its receipt');
