export function bindFonts(doc=document,win=window){
 const style=doc.getElementById('ui-fonts');if(!style)return;
 const css=style.textContent||[...(style.sheet?.cssRules||[])].map(rule=>rule.cssText).join('');
 const ranges=[...css.matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/gi)].map(m=>[parseInt(m[1],16),parseInt(m[2]||m[1],16)]),known=new Set();let loaded=false;
 function inspect(text){
  if(loaded)return;
  for(const char of text){const code=char.codePointAt(0);if(code<32||known.has(code))continue;known.add(code);
   if(!ranges.some(([lo,hi])=>code>=lo&&code<=hi)){
    loaded=true;const link=doc.createElement('link');link.rel='stylesheet';link.href='/assets/fonts/noto.css';doc.head.insertBefore(link,style);break;
   }
  }
 }
 function scan(node){
  if(node.nodeType===3){if(node.parentElement&&!node.parentElement.closest('script,style,template,[hidden]')&&node.parentElement.getClientRects().length)inspect(node.textContent);return;}
  if(node.nodeType!==1||node.matches('script,style,template,[hidden]'))return;
  for(const child of node.childNodes)scan(child);
 }
 scan(doc.body);
 const observer=new win.MutationObserver(records=>{for(const change of records){if(change.type==='characterData')scan(change.target);else for(const node of change.addedNodes)scan(node);}if(loaded)observer.disconnect();});
 if(!loaded)observer.observe(doc.body,{subtree:true,childList:true,characterData:true});
 doc.addEventListener('input',event=>{if(!loaded)inspect(event.target.value||'');});
}
