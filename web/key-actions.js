const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function confirmKeyAction(key,action){
 if(!['revoke','restore'].includes(action))throw Error('Key 操作无效。');
 const revoke=action==='revoke';
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='key-action-dialog';dialog.setAttribute('aria-labelledby','key-action-title');
  dialog.innerHTML=`<h2 id="key-action-title">${revoke?'撤销 API Key':'恢复 API Key'}</h2><p class="key-action-name" data-no-i18n>${esc(key.label)}</p><p>${revoke?'使用这把 Key 的程序将无法提交。可在列表中恢复。':'恢复后，使用这把 Key 的程序可继续提交。'}</p><div class="actions"><button type="button" data-key-cancel autofocus>取消</button><button type="button" data-key-confirm class="${revoke?'danger':'primary'}">${revoke?'确认撤销':'确认恢复'}</button></div>`;
  dialog.addEventListener('close',()=>{const confirmed=dialog.returnValue==='confirm';dialog.remove();resolve(confirmed);},{once:true});
  dialog.querySelector('[data-key-cancel]').onclick=()=>dialog.close('cancel');
  dialog.querySelector('[data-key-confirm]').onclick=()=>dialog.close('confirm');
  document.body.append(dialog);dialog.showModal();dialog.querySelector('[data-key-cancel]').focus();
 });
}
