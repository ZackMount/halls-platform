import {test} from 'node:test';
import assert from 'node:assert/strict';
import {confirmKeyAction} from '../web/key-actions.js';
function page(){
 let current,focus;
 globalThis.document={body:{append(dialog){current=dialog;}},createElement(name){
  assert.equal(name,'dialog');const listeners={};const buttons={cancel:{focus(){focus='cancel';}},confirm:{focus(){focus='confirm';}}};
  return {setAttribute(){},addEventListener(event,fn){listeners[event]=fn;},querySelector(selector){return buttons[selector==='[data-key-cancel]'?'cancel':'confirm'];},showModal(){this.open=true;},close(value=''){this.returnValue=value;this.open=false;listeners.close();},remove(){this.removed=true;}};
 }};
 return {dialog:()=>current,focus:()=>focus};
}
test('revocation names the key, escapes its label and defaults to cancellation',async()=>{
 const p=page(),answer=confirmKeyAction({label:'<img src=x>'},'revoke'),d=p.dialog();assert.equal(p.focus(),'cancel');assert.match(d.innerHTML,/确认撤销/);assert.match(d.innerHTML,/&lt;img src=x&gt;/);assert.doesNotMatch(d.innerHTML,/<img/);
 d.querySelector('[data-key-cancel]').onclick();assert.equal(await answer,false);assert.equal(d.removed,true);
});
test('explicit confirmation resolves true; Esc or window dismissal resolves false',async()=>{
 let p=page(),answer=confirmKeyAction({label:'KOH'},'restore');assert.match(p.dialog().innerHTML,/确认恢复/);p.dialog().querySelector('[data-key-confirm]').onclick();assert.equal(await answer,true);
 p=page();answer=confirmKeyAction({label:'KOH'},'revoke');p.dialog().close();assert.equal(await answer,false);
 assert.throws(()=>confirmKeyAction({label:'KOH'},'delete'));
});
