const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function confirmRunDeletion(name){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='key-action-dialog';dialog.setAttribute('aria-labelledby','run-delete-title');
  dialog.innerHTML=`<h2 id="run-delete-title">彻底删除成绩？</h2><p class="key-action-name" data-no-i18n>${esc(name)}</p><p>将删除成绩、凭证、回放及关联预览和赛事提交记录，无法恢复。</p><div class="actions"><button type="button" data-delete-cancel autofocus>取消</button><button type="button" data-delete-confirm class="danger">确认彻底删除</button></div>`;
  dialog.addEventListener('close',()=>{const confirmed=dialog.returnValue==='confirm';dialog.remove();resolve(confirmed);},{once:true});
  dialog.querySelector('[data-delete-cancel]').onclick=()=>dialog.close('cancel');dialog.querySelector('[data-delete-confirm]').onclick=()=>dialog.close('confirm');
  document.body.append(dialog);dialog.showModal();dialog.querySelector('[data-delete-cancel]').focus();
 });
}
