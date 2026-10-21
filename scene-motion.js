(() => {
 'use strict';
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),scenes=[...document.querySelectorAll('[data-scroll-scene]')];
 let scheduled=0;
 function update(){scheduled=0;if(reduced.matches||root.classList.contains('motion-paused'))return;const height=window.innerHeight;const readings=scenes.map(scene=>({scene,rect:scene.getBoundingClientRect()}));readings.forEach(({scene,rect})=>{if(rect.bottom<0||rect.top>height)return;const p=Math.max(0,Math.min(1,(height-rect.top)/(height+rect.height)));scene.style.setProperty('--scene-progress',p.toFixed(4));});}
 function request(){if(!scheduled)scheduled=requestAnimationFrame(update);}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});document.addEventListener('starways:motion-change',request);reduced.addEventListener('change',request);request();
 const holder=document.querySelector('[data-flag-wave]');if(!holder)return;
 const canvas=holder.querySelector('canvas'),fallback=holder.querySelector('img'),context=canvas.getContext('2d');if(!context)return;
 const image=new Image();let ready=false,visible=!('IntersectionObserver' in window),frame=0,last=0,phase=0,bounds=null;
 function alphaBounds(){const scratch=document.createElement('canvas');scratch.width=image.naturalWidth;scratch.height=image.naturalHeight;const c=scratch.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);const data=c.getImageData(0,0,scratch.width,scratch.height).data;let l=scratch.width,t=scratch.height,r=0,b=0;for(let y=0;y<scratch.height;y++)for(let x=0;x<scratch.width;x++)if(data[(y*scratch.width+x)*4+3]>80){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}return r>=l&&b>=t?{x:l,y:t,w:r-l+1,h:b-t+1}:{x:0,y:0,w:image.naturalWidth,h:image.naturalHeight};}
 function draw(){
  if(!ready)return;const w=canvas.width,h=canvas.height,n=48,dw=w*.96,dh=Math.min(h*.72,dw*bounds.h/bounds.w),top=(h-dh)*.45,amplitude=h*.105;
  context.clearRect(0,0,w,h);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
  for(let i=0;i<n;i++){const u=i/n,x=dw*u,shift=Math.sin(phase-u*3.4)*amplitude*Math.pow(u,1.25),scale=1+Math.sin(phase-u*3)*.045*u,stripW=bounds.w/n;context.drawImage(image,bounds.x+i*stripW,bounds.y,Math.min(stripW+1,bounds.w-i*stripW),bounds.h,x,top+shift-(dh*scale-dh)/2,dw/n+1,dh*scale);}
 }
 function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){frame=0;if(!allowed()){last=0;return;}const dt=last?Math.min(now-last,80):0;last=now;phase+=dt*.0025;draw();frame=requestAnimationFrame(tick);}
 function sync(){if(reduced.matches){phase=0;draw();}if(allowed()&&!frame){last=0;frame=requestAnimationFrame(tick);}else if(!allowed()&&frame){cancelAnimationFrame(frame);frame=0;last=0;}}
 image.onload=()=>{try{bounds=alphaBounds();ready=true;draw();holder.classList.add('is-ready');sync();}catch{holder.classList.remove('is-ready');}};image.onerror=()=>holder.classList.remove('is-ready');image.src=fallback.src;
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.05});observer.observe(holder);}
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
