// Background work waits for visible imagery and one real paint, never vice versa.
export async function afterFirstScreen(work,{doc=document,win=window}={}){
 const images=[...doc.querySelectorAll('#app img')].filter(image=>{const box=image.getBoundingClientRect();return !image.complete&&box.top<win.innerHeight&&box.bottom>0;});
 await Promise.all(images.map(image=>new Promise(resolve=>{const finish=()=>{win.clearTimeout(timer);image.removeEventListener('load',finish);image.removeEventListener('error',finish);resolve();},timer=win.setTimeout(finish,4000);image.addEventListener('load',finish,{once:true});image.addEventListener('error',finish,{once:true});if(image.complete)finish();})));
 await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
 if(doc.visibilityState==='hidden'||win.navigator?.connection?.saveData||/2g/.test(win.navigator?.connection?.effectiveType||''))return;
 if(win.requestIdleCallback)await new Promise(resolve=>win.requestIdleCallback(resolve,{timeout:1500}));
 return work();
}
