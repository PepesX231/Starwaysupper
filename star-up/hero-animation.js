/* Registered hand-drawn poses: hold, lift the project cube, then settle. */
(() => {
 'use strict';
 const actor=document.querySelector('[data-dark-animation]');if(!actor)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),root=document.documentElement;
 const sequence=[0,1,2,0],durations=[2600,1050,950,1500],frames=[];
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 canvas.className='hero-frame-canvas';canvas.setAttribute('aria-hidden','true');actor.append(canvas);
 let visible=false,ready=false,index=0,timer=0;
 function draw(){if(!ready)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(frames[sequence[index]],0,0);actor.dataset.pose=String(sequence[index]);}
 const allowed=()=>ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');
 function step(){timer=0;if(!allowed())return;index=(index+1)%sequence.length;draw();timer=setTimeout(step,durations[index]);}
 function sync(){clearTimeout(timer);timer=0;if(reduced.matches&&ready){index=0;draw();}if(allowed())timer=setTimeout(step,durations[index]);}
 Promise.all([0,1,2].map(i=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src='assets/pose-'+i+'.webp';}))).then(images=>{frames.push(...images);canvas.width=images[0].naturalWidth;canvas.height=images[0].naturalHeight;ready=true;draw();actor.classList.add('hero-loop-ready');sync();}).catch(()=>canvas.remove());
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.05}).observe(actor);else visible=true;
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
