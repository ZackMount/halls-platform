import {test} from 'node:test';
import assert from 'node:assert/strict';
import {confirmRunDeletion} from '../web/run-deletion.js';
function page(){
 let current,focus;
 globalThis.document={body:{append(dialog){current=dialog;}},createElement(name){
  assert.equal(name,'dialog');const listeners={},buttons={cancel:{focus(){focus='cancel';}},confirm:{}};
  return {setAttribute(){},addEventListener(event,fn){listeners[event]=fn;},querySelector(selector){return buttons[selector==='[data-delete-cancel]'?'cancel':'confirm'];},showModal(){this.open=true;},close(value=''){this.returnValue=value;listeners.close();},remove(){this.removed=true;}};
 }};
 return {dialog:()=>current,focus:()=>focus};
}
test('permanent deletion identifies and escapes the record, with cancellation focused',async()=>{
 const p=page(),answer=confirmRunDeletion('<img src=x onerror=evil>'),d=p.dialog();assert.equal(p.focus(),'cancel');assert.match(d.innerHTML,/无法恢复/);assert.match(d.innerHTML,/&lt;img/);assert.doesNotMatch(d.innerHTML,/<img/);
 d.querySelector('[data-delete-cancel]').onclick();assert.equal(await answer,false);
});
test('only explicit confirmation proceeds; Escape cancels',async()=>{
 let p=page(),answer=confirmRunDeletion('test');p.dialog().querySelector('[data-delete-confirm]').onclick();assert.equal(await answer,true);
 p=page();answer=confirmRunDeletion('test');p.dialog().close();assert.equal(await answer,false);
});
