import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {uploadScore} from '../web/upload-score.js';

const completed={status:'done',board:'ranked',decision:'approved',score:78.28,report:{performance:{score:78.28,referenceScore:78.28,grade:'A'},rules:[{title:'通关完整性',status:'pass'}]}};
let html=uploadScore(completed);
assert.match(html,/本次得分/);assert.match(html,/78\.28/);assert.match(html,/\/ 100/);
assert.doesNotMatch(html,/参考分|不参与正式排名/);

// Zero is a real final score; null, numeric strings and non-finite values are not.
assert.match(uploadScore({...completed,score:0}),/>0\.00</);
for(const score of [null,undefined,'78.28',NaN,Infinity,-1,101])assert.equal(uploadScore({...completed,score}),'');
for(const status of ['queued','receiving','processing','invalid','error','deleting'])assert.equal(uploadScore({...completed,status}),'');
for(const report of [null,{}, {rules:[]}, {performance:{score:78.28}}, {rules:[],performance:{completed:false,referenceScore:0}}])assert.equal(uploadScore({...completed,report}),'');

// Only approved ranked rows may display a formal score. Other reports use the
// server's referenceScore, even if their row contains an unrelated score.
for(const [board,decision] of [['unranked','approved'],['hidden','pending'],['ranked','pending']]){
 html=uploadScore({...completed,board,decision,score:99.99,report:{...completed.report,performance:{referenceScore:64.5}}});
 assert.match(html,/本次参考分/);assert.match(html,/64\.50/);assert.match(html,/不参与正式排名/);assert.doesNotMatch(html,/99\.99/);
 assert.equal(uploadScore({...completed,board,decision,report:{...completed.report,performance:{}}}),'');
}
assert.match(uploadScore({...completed,board:'unranked',report:{...completed.report,performance:{referenceScore:0}}}),/>0\.00</);
html=uploadScore({...completed,report:{...completed.report,performance:{grade:'<img src=x onerror=alert(1)>'}}});
assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img/);

// Exercise the actual upload polling renderer with a safe public API response:
// a pending result must not render stale scores, and the finished score must
// precede the checks rather than requiring a trip to the public run page.
const source=readFileSync(new URL('../web/site.js',import.meta.url),'utf8');
const start=source.indexOf('async function poll('),end=source.indexOf('\nasync function uploadPage(',start);
let reads=0,scoreRevealed=false;
const responses=[{...completed,status:'processing'},completed],target={isConnected:true,innerHTML:'',querySelector:selector=>{assert.equal(selector,'.upload-score');return {scrollIntoView:()=>{scoreRevealed=true;}};}};
const context=vm.createContext({target,uploadScore,api:async()=>{assert.equal(target.innerHTML,'');reads++;return responses.shift();},setTimeout:fn=>fn(),esc:value=>String(value??''),label:{done:'评判完成',approved:'已通过',ranked:'正式榜'},icon:()=>'',resultReport:()=>'<p>检查详情</p>'});
await vm.runInContext(source.slice(start,end)+'\npoll("/api/submissions/test","private-receipt",target);',context);
assert.equal(reads,2);assert.ok(target.innerHTML.indexOf('78.28')<target.innerHTML.indexOf('评判完成'));assert.ok(target.innerHTML.indexOf('78.28')<target.innerHTML.indexOf('检查详情'));
assert.equal(scoreRevealed,true);
assert.doesNotMatch(target.innerHTML,/private-receipt/);
console.log('Upload results show finite final scores first, distinguish reference scores and keep pending or invalid uploads score-free.');
