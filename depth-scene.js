(() => {
 const scene=document.querySelector('[data-depth-scene]');if(!scene)return;
 const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,x=0,y=0;
 const reset=()=>{x=y=0;scene.style.setProperty('--depth-x','0');scene.style.setProperty('--depth-y','0');};
 scene.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||media.matches||document.documentElement.classList.contains('motion-paused'))return;
  const r=scene.getBoundingClientRect();x=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));y=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));
  if(!frame)frame=requestAnimationFrame(()=>{frame=0;scene.style.setProperty('--depth-x',x.toFixed(3));scene.style.setProperty('--depth-y',y.toFixed(3));});
 },{passive:true});
 scene.addEventListener('pointerleave',reset);media.addEventListener('change',reset);document.addEventListener('starways:motion-change',reset);
})();
