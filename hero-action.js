/* Registered drawing animation: anticipation, stroke, settle. */
(() => {
 'use strict';
 const actor=document.querySelector('[data-chibi-animation]');if(!actor)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const poses=[0,1,2,3,4,5,4,2],durations=[2400,550,400,400,450,700,450,700];
 const canvas=document.createElement('canvas'),context=canvas.getContext('2d');if(!context)return;
 canvas.className='hero-action-canvas';canvas.width=canvas.height=708;canvas.setAttribute('aria-hidden','true');actor.append(canvas);
 let ready=false,visible=!('IntersectionObserver' in window),index=0,timer=0,frames=[];
 function draw(){if(!frames.length)return;context.clearRect(0,0,708,708);context.drawImage(frames[index],0,0,708,708);actor.dataset.frame=String(poses[index]);}
 function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!document.documentElement.classList.contains('motion-paused');}
 function next(){timer=0;if(!allowed())return;index=(index+1)%poses.length;draw();timer=setTimeout(next,durations[index]);}
 function sync(){clearTimeout(timer);timer=0;if(reduced.matches){index=0;draw();}if(allowed())timer=setTimeout(next,durations[index]);}
 const preload=n=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src='assets/edge-v17/hero-'+String(n).padStart(2,'0')+'.webp';});
 Promise.all(poses.map(preload)).then(images=>{frames=images;ready=true;draw();actor.classList.add('action-ready');sync();}).catch(()=>actor.classList.remove('action-ready'));
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.05});observer.observe(actor);}
 reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);
})();
