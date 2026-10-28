const compactQuery='(max-width: 850px), (orientation: portrait)';

export function bindRunDisclosures(root,{signal,media=matchMedia(compactQuery)}={}){
 const sections=[...root.querySelectorAll('[data-run-disclosure]')],chosen=new WeakSet();
 const defaults=()=>{for(const section of sections)if(!chosen.has(section))section.open=!media.matches;};
 defaults();
 for(const section of sections)section.querySelector('summary').addEventListener('click',()=>chosen.add(section),{signal});
 media.addEventListener('change',defaults,{signal});
}
