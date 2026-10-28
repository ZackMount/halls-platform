import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {publicUploadLinks} from '../web/public-upload.js';
const source=readFileSync(new URL('../web/site.js',import.meta.url),'utf8');
const markup='<a class="entry" href="/upload"><svg><path/></svg>submit</a><a HREF = \'/upload?x=1#last\'>resume</a><a href="/uploading">keep</a><a data-href="/upload" href="/admin">admin</a>';
assert.equal(publicUploadLinks(markup,true),markup);
const closed=publicUploadLinks(markup,false);assert.doesNotMatch(closed,/>submit<|>resume</);assert.match(closed,/href="\/uploading"/);assert.match(closed,/href="\/admin"/);
const fragment=source.slice(source.indexOf('async function fragment('),source.indexOf('\nlet warmTimer;'));
const board=source.slice(source.indexOf('async function refreshBoard('),source.indexOf('\n\nfunction bindUpload('));
const upload=source.slice(source.indexOf('async function uploadPage('),source.indexOf('\nasync function runPage('));
for(const enabled of [false,true]){
 const nodes=new Map();const $=id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);};
 const context=vm.createContext({publicHTML:html=>publicUploadLinks(html,enabled),cachedHTML:()=>true,pageCache:{get:async()=>markup},routeController:{signal:{aborted:false}},location:{pathname:'/leaderboard'},boardURL:()=>'/api/runs?board=ranked',board:'ranked',page:1,query:'',sort:'score',label:{ranked:'正式榜',unranked:'非排名榜',all:'积分总榜'},document:{querySelectorAll:()=>[]},$,duration:()=>'',icon:()=>'',notify:text=>{throw Error(text);}});
 const html=await vm.runInContext(fragment+'\nfragment("/assets/home-content.html");',context);assert.equal(html,publicUploadLinks(markup,enabled),'cached home is filtered before mounting, with no new config fetch');
 context.data={items:[],boards:['ranked'],stats:{n:0,fastest:null,best:null},total:0,pages:0};
 await vm.runInContext(board+'\nrefreshBoard(data);',context);
 assert.equal(/href="\/upload"/.test($('#records').innerHTML),enabled,'an empty board refresh cannot reintroduce upload buttons');
}
const noForm=vm.createContext({document:{querySelector:()=>null},$:()=>null,root:{},bindUpload:()=>{throw Error('Closed form was bound');}});
await vm.runInContext(upload+'\nuploadPage(true);',noForm);
console.log('Server-selected upload availability carries through cached home fragments, board refreshes and direct closed upload routes without configuration fetches');
