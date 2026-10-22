(() => {
 'use strict';
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),scenes=[...document.querySelectorAll('[data-scroll-scene]')];
 let scheduled=0;
 function update(){scheduled=0;if(root.classList.contains('motion-paused'))return;const height=window.innerHeight;const readings=scenes.map(scene=>({scene,rect:scene.getBoundingClientRect()}));readings.forEach(({scene,rect})=>{if(rect.bottom<0||rect.top>height)return;const p=Math.max(0,Math.min(1,(height-rect.top)/(height+rect.height)));scene.style.setProperty('--scene-progress',p.toFixed(4));});}
 function request(){if(!scheduled)scheduled=requestAnimationFrame(update);}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});document.addEventListener('starways:motion-change',request);reduced.addEventListener('change',request);request();

 const holder=document.querySelector('[data-flag-wave]');if(!holder)return;
 const canvas=holder.querySelector('canvas'),fallback=holder.querySelector('img'),context=canvas?.getContext('2d');if(!context)return;
 const image=new Image();let ready=false,visible=true,frame=0,last=0,phase=0,bounds=null;

 function computeBounds(){
  const w=image.naturalWidth||1100,h=image.naturalHeight||550;
  try{
   const scratch=document.createElement('canvas');scratch.width=w;scratch.height=h;
   const c=scratch.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
   const data=c.getImageData(0,0,w,h).data;
   let l=w,t=h,r=0,b=0;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>80){if(x<l)l=x;if(x>r)r=x;if(y<t)t=y;if(y>b)b=y;}
   if(r>=l&&b>=t)return{x:l,y:t,w:r-l+1,h:b-t+1};
  }catch(_){
   /* When opened via file://, getImageData throws SecurityError; use exact precomputed alpha bounds */
  }
  return{
   x:Math.round(w*0.0124),
   y:Math.round(h*0.0575),
   w:Math.round(w*0.9758),
   h:Math.round(h*0.8794)
  };
 }

 function draw(){
  if(!ready||!bounds)return;
  const w=canvas.width,h=canvas.height,n=64,dw=w*.95,dh=Math.min(h*.70,dw*bounds.h/bounds.w),top=(h-dh)*.46,amplitude=h*.135;
  context.clearRect(0,0,w,h);
  context.imageSmoothingEnabled=true;
  context.imageSmoothingQuality='high';
  for(let i=0;i<n;i++){
   const u=i/n;
   const x=dw*u;
   const envelope=Math.pow(u,1.15);
   const wave1=Math.sin(phase-u*4.2);
   const wave2=Math.sin(phase*1.7-u*7.5)*0.28;
   const shift=(wave1+wave2)*amplitude*envelope;
   const scale=1+Math.cos(phase-u*3.8)*.055*u;
   const stripW=bounds.w/n;
   context.drawImage(
    image,
    bounds.x+i*stripW,
    bounds.y,
    Math.min(stripW+1.2,bounds.w-i*stripW),
    bounds.h,
    x,
    top+shift-(dh*scale-dh)/2,
    dw/n+1.2,
    dh*scale
   );
  }
 }

 function allowed(){return ready&&visible&&!document.hidden&&!root.classList.contains('motion-paused');}
 function tick(now){
  frame=0;
  if(!allowed()){last=0;return;}
  const dt=last?Math.min(now-last,80):16;
  last=now;
  phase+=dt*.0052;
  draw();
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  if(allowed()&&!frame){last=0;frame=requestAnimationFrame(tick);}
  else if(!allowed()&&frame){cancelAnimationFrame(frame);frame=0;last=0;}
 }
 function initFlag(){
  if(ready)return;
  bounds=computeBounds();
  ready=true;
  draw();
  holder.classList.add('is-ready');
  sync();
 }
 image.onload=initFlag;
 image.onerror=()=>holder.classList.remove('is-ready');
 image.src=fallback.getAttribute('src')||fallback.src;
 if(image.complete&&image.naturalWidth>0)initFlag();

 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   visible=entries.some(entry=>entry.isIntersecting);
   sync();
  },{threshold:.02});
  observer.observe(holder);
 }
 document.addEventListener('visibilitychange',sync);
 document.addEventListener('starways:motion-change',sync);
 reduced.addEventListener('change',sync);
})();
