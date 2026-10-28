import {build,transform} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),web=path.join(root,'web');
const check=process.argv.includes('--check'),artifacts={};
const digest=data=>createHash('sha256').update(data).digest('hex');
async function output(name,data,inputs){
 const bytes=Buffer.from(data),hashes={};
 for(const input of [...new Set(inputs)].sort())hashes[path.relative(web,input)]=digest(await readFile(input));
 artifacts[name]={sha256:digest(bytes),inputs:hashes};
 if(check){
  let actual;try{actual=await readFile(path.join(web,name));}catch{}
  if(!actual?.equals(bytes))throw Error(`${name} is stale; run npm run build:web before publishing.`);
 }else await writeFile(path.join(web,name),bytes);
}
const shell=await readFile(path.join(web,'replay/index.html'),'utf8');
await output('replay/frame.html',shell.replace('class="replay-page"','class="replay-page parked"'),[path.join(web,'replay/index.html')]);
const common={bundle:true,minify:true,charset:'utf8',format:'esm',platform:'browser',target:'es2022',legalComments:'eof',write:false,metafile:true,absWorkingDir:root};
const resolver={name:'local-assets',setup(plugin){
 plugin.onResolve({filter:/^\/(assets|replay-assets)\//},args=>{
  if(args.kind==='dynamic-import')return {path:args.path,external:true};
  return {path:path.join(web,args.path.replace(/^\/replay-assets\//,'replay/').replace(/^\/assets\//,''))};
 });
}};
for(const [entry,name] of [['site.js','site-entry.js'],['replay/app.js','replay/replay-entry.js']]){
 const result=await build({...common,entryPoints:[path.join(web,entry)],outfile:path.join(web,name),plugins:[resolver]});
 await output(name,result.outputFiles[0].contents,Object.keys(result.metafile.inputs).map(input=>path.resolve(root,input)));
}
const css=await transform(await readFile(path.join(web,'site.css'),'utf8'),{loader:'css',minify:true});
await output('site-inline.css',css.code,[path.join(web,'site.css')]);
const manifest=JSON.stringify({version:1,artifacts},null,2)+'\n',manifestPath=path.join(web,'.build-manifest.json');
if(check){if(await readFile(manifestPath,'utf8')!==manifest)throw Error('Web build manifest is stale; run npm run build:web before publishing.');}
else await writeFile(manifestPath,manifest);
