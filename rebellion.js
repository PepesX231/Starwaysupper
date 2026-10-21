(() => {
 'use strict';
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),pauseButton=document.querySelector('[data-motion-toggle]');
 const hero=document.querySelector('.hero'),heroArt=document.querySelector('.hero-art');
 const discover=document.querySelector('.discover'),story=document.querySelector('.creation-story'),steps=[...document.querySelectorAll('[data-creation-step]')],status=document.querySelector('.creation-status');
 const route=document.querySelector('.express-timeline');
 let paused=false,raf=0,selected=-1,manualScroll=null,observer;
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 function choose(index){
  if(index===selected||!story)return;selected=index;story.style.setProperty('--creation-focus',index);story.dataset.focus=String(index);
  steps.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  status.textContent=steps[index].querySelector('small').textContent;
 }
 steps.forEach((button,i)=>button.addEventListener('click',()=>{manualScroll=window.scrollY;choose(i);}));
 function update(){
  raf=0;
  const height=window.innerHeight,scroll=window.scrollY,total=root.scrollHeight-height;
  root.style.setProperty('--read-progress',clamp(total>0?scroll/total:0));
  if(!paused&&!reduced.matches)root.style.setProperty('--tape-progress',clamp(scroll/height,0,4));
  if(route){const rect=route.getBoundingClientRect();route.style.setProperty('--route-progress',clamp((height*.8-rect.top)/(height*.6+rect.height*.45)));}
  if(discover&&story&&!paused&&!reduced.matches&&window.innerWidth>760){
   const rect=discover.getBoundingClientRect(),travel=rect.height-height;
   if(manualScroll!==null&&Math.abs(scroll-manualScroll)>140)manualScroll=null;
   if(travel>100&&manualScroll===null){const progress=clamp((100-rect.top)/travel);choose(Math.min(2,Math.floor(progress*3)));}
  }
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 function motion(){
  const off=paused||reduced.matches;root.classList.toggle('motion-paused',off);
  if(pauseButton){pauseButton.hidden=reduced.matches;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.textContent=paused?'▶ เปิดภาพเคลื่อนไหว':'Ⅱ หยุดภาพเคลื่อนไหว';}
  document.dispatchEvent?.(new CustomEvent('starways:motion-change'));
  if(off){root.classList.remove('motion-ready');observer?.disconnect();return;}
  if('IntersectionObserver' in window){
   root.classList.add('motion-ready');observer?.disconnect();
   observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-arrived');if(entry.target.classList.contains('comic-scene')&&!entry.target.hasAttribute('data-scene-enter'))entry.target.setAttribute('data-scene-enter','');observer.unobserve(entry.target);}});},{threshold:.12});
   document.querySelectorAll('.comic-scene,.milestone-route li,.express-feature').forEach(el=>observer.observe(el));
  }
  schedule();
 }
 pauseButton?.addEventListener('click',()=>{paused=!paused;motion();});reduced.addEventListener('change',motion);
 if(hero&&heroArt&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  hero.addEventListener('pointermove',event=>{if(paused||reduced.matches)return;const rect=hero.getBoundingClientRect(),x=clamp((event.clientX-rect.left)/rect.width,-.5,1.5)-.5,y=clamp((event.clientY-rect.top)/rect.height,-.5,1.5)-.5;heroArt.style.setProperty('--tilt-x',x*23+'px');heroArt.style.setProperty('--tilt-y',y*18+'px');heroArt.style.setProperty('--tilt-angle',(-3+x*4)+'deg');},{passive:true});
  hero.addEventListener('pointerleave',()=>{heroArt.style.setProperty('--tilt-x','0px');heroArt.style.setProperty('--tilt-y','0px');heroArt.style.setProperty('--tilt-angle','-3deg');});
 }
 document.querySelectorAll('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==detail)other.open=false;});}));
 choose(0);motion();update();
})();
