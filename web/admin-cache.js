// Private data lives only in this document, never in localStorage or the SW.
export function createAdminCache(load,{now=()=>Date.now(),ttl=30000}={}){
 const entries=new Map();let epoch=0;
 const allowed=url=>['settings','keys','storage','audit','upload-page','runs','submission-sources'].some(name=>url.split('?')[0]==='/api/admin/'+name)||/^\/api\/admin\/audit\/\d+$/.test(url);
 return {
  seed(url,value){if(!allowed(url))throw Error('Not an admin read');entries.set(url,{at:now(),value:structuredClone(value)});},
  clear(){epoch++;entries.clear();},
  async get(url,{fresh=false,priority='auto'}={}){
   if(!allowed(url))throw Error('Not an admin read');
   const old=entries.get(url);
   if(!fresh&&old?.value!==undefined&&now()-old.at<ttl)return structuredClone(old.value);
   if(old?.pending)return structuredClone(await old.pending);
   const generation=epoch,item={at:0};item.pending=load(url,{priority});entries.set(url,item);
   try{const value=await item.pending;if(generation===epoch&&entries.get(url)===item){item.value=structuredClone(value);item.at=now();delete item.pending;}return structuredClone(value);}
   catch(error){if(entries.get(url)===item)entries.delete(url);throw error;}
  },
 };
}
