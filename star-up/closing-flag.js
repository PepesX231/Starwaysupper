/* Animate the original artwork, so the cloth retains its exact ink and reds. */
(() => {
 'use strict';
 const host=document.querySelector('.closing-composition'),image=host?.querySelector('.closing-art');
 if(!host||!image)return;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 canvas.className='closing-wave-canvas';canvas.setAttribute('aria-hidden','true');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),root=document.documentElement;
 let ready=false,visible=false,frame=0,last=0,phase=0,draws=0;
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 function draw(){
  if(!ready)return;
  const w=image.naturalWidth,h=image.naturalHeight,n=240,pad=w*.07;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.translate(pad,pad);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  for(let i=0;i<n;i++){
   const x=i*w/n,sw=Math.min(w/n,w-x),u=(x+sw/2)/w;
   // Fix the pole at 35% width; stop the deformation above the three faces.
   const cut=h*(.300+.085*smooth((u-.60)/.15));
   const strength=Math.pow(smooth((u-.35)/.60),1.1);
   const wind=Math.sin(phase-u*7.2)+.3*Math.sin(phase*1.7-u*12);
   const shift=h*.060*strength*wind;
   ctx.drawImage(image,x,0,sw,cut,x,shift,sw,cut-shift);
   ctx.drawImage(image,x,cut,sw,h-cut,x,cut,sw,h-cut);
  }
  canvas.dataset.frame=String(++draws);canvas.dataset.waveAmplitude='0.060';
 }
 function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){
  frame=0;if(!allowed()){last=0;return;}
  if(!last||now-last>=32){phase+=last?Math.min(now-last,80)*.0023:0;last=now;draw();}
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  if(!allowed()){cancelAnimationFrame(frame);frame=0;last=0;if(reduced.matches){phase=0;draw();}}
  else if(!frame){last=0;frame=requestAnimationFrame(tick);}
 }
 function init(){
  if(ready||!image.naturalWidth)return;
  canvas.width=Math.round(image.naturalWidth*1.14);canvas.height=Math.round(image.naturalHeight*1.14);
  host.append(canvas);ready=true;draw();host.classList.add('closing-wave-ready');sync();
 }
 image.addEventListener('load',init);if(image.complete)init();
 if('IntersectionObserver'in window)new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.01}).observe(host);else visible=true;
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
