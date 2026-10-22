/* Artwork stays in exterior gutters; depth movement never crosses the reading area. */
(() => {
 'use strict';
 const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)'),scenes=[...document.querySelectorAll('[data-edge-scene]')];let frame=0;
 const clamp=x=>Math.min(1,Math.max(0,x));
 function update(){
  frame=0;const off=media.matches||root.classList.contains('motion-paused');
  for(const scene of scenes){
   const r=scene.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight*.75));
   scene.style.setProperty('--edge-in',off?'1':p.toFixed(3));
   scene.style.setProperty('--edge-rise',off?'0px':((1-p)*80).toFixed(2)+'px');
  }
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 document.addEventListener('starways:motion-change',schedule);media.addEventListener('change',schedule);update();
})();
