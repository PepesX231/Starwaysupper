/* Whole scenery is already visible. Scroll only changes its depth by a few pixels. */
(() => {
 'use strict';
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),scenes=[...document.querySelectorAll('[data-edge-scene]')];
 if(!scenes.length)return;let frame=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function update(){
  frame=0;if(document.hidden)return;
  const off=reduced.matches||root.classList.contains('motion-paused'),height=window.innerHeight;
  const reads=scenes.map(scene=>({scene,rect:scene.getBoundingClientRect()}));
  for(const {scene,rect} of reads){
   if(off){scene.style.setProperty('--edge-travel','0px');continue;}
   // Finish the small entrance travel well before the heading reaches the screen center.
   // Never normalize by the full section height, which can span many viewports.
   if(rect.top>height+450||rect.bottom< -450)continue;
   const entrance=clamp((height-rect.top)/(height*.55));
   scene.style.setProperty('--edge-travel',((entrance-.5)*26).toFixed(2)+'px');
  }
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('starways:motion-change',schedule);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);schedule();
})();
