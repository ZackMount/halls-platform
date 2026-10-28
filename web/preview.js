export async function previewPage(root,api,esc,fragment,seeded=false){
 document.querySelector('[data-nav=preview]')?.classList.add('active');
 if(!seeded)root.innerHTML=await fragment('/api/pages/preview');
 const target=document.querySelector('#private-preview'),id=new URLSearchParams(location.search).get('id');
 async function show(key){
  if(!/^[a-f0-9]{24}$/.test(key))throw Error('预览不存在或已过期。');
  target.innerHTML='<div class="panel"><p role="status">正在准备回放…</p></div>';
  for(let n=0;n<250;n++){
   if(!target.isConnected)return;
   const result=await api('/api/previews/'+key);if(!target.isConnected)return;
   if(result.status==='ready'){
    target.innerHTML=`<div class="section-top"><p>此预览仅当前浏览器可访问，24 小时内有效。</p><a class="button" href="/preview">预览其他文件</a></div><div class="replay-slot" data-replay-kind="preview" data-replay-id="${key}" aria-label="HALLS 私有回放"></div>`;return;
   }
   if(['invalid','error'].includes(result.status))throw Error(result.error||'预览未完成，请重新上传。');
   await new Promise(resolve=>setTimeout(resolve,2000));
  }
  throw Error('回放仍在处理中，请稍后刷新此页。');
 }
 if(id){try{await show(id);}catch(e){target.innerHTML=`<div class="panel"><p class="error">${esc(e.message)}</p><a class="button" href="/preview">重新选择文件</a></div>`;}return;}
 if(!document.querySelector('#preview-form'))return;
 let selected=null;const file=document.querySelector('#preview-file'),drop=document.querySelector('#preview-drop'),message=document.querySelector('#preview-message');
 function choose(value){if(!value)return;selected=value;document.querySelector('#preview-filename').textContent=value.name;document.querySelector('#preview-size').textContent=(value.size/1024).toFixed(1)+' KiB';drop.classList.add('selected');message.textContent='';}
 if(file.files[0])choose(file.files[0]);file.onchange=()=>choose(file.files[0]);drop.ondragover=e=>{e.preventDefault();drop.classList.add('dragging');};drop.ondragleave=()=>drop.classList.remove('dragging');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('dragging');choose(e.dataTransfer.files[0]);};
 document.querySelector('.file-pick').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();file.click();}};
 document.querySelector('#preview-form').onsubmit=async e=>{
  e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;
  try{
   if(!selected)throw Error('请选择凭证文件');
   if(!selected.name.toLowerCase().endsWith('.hproof'))throw Error('请选择 .hproof 凭证文件。');
   if(selected.size<308||selected.size>15*1024*1024)throw Error('文件长度无效或超过上传上限。');
   message.textContent='正在准备回放…';
   const nonce=await api('/api/previews/session',{method:'POST',body:'{}'});
   // Send bytes only. Filenames are display text, never server paths or parameters.
   const result=await api('/api/previews',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Preview-Token':nonce.token},body:selected});
   history.replaceState(null,'',result.previewUrl);await show(result.id);
  }catch(error){if(message.isConnected)message.textContent=error.message;else target.innerHTML=`<div class="panel"><p class="error">${esc(error.message)}</p><a class="button" href="/preview">重新选择文件</a></div>`;}
  finally{button.disabled=false;}
 };
}
