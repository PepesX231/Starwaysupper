/* Small additive-light engine plumes, independent of the car illustration. */
(() => {
 'use strict';
 const holder=document.querySelector('[data-jet-car]');if(!holder)return;
 const canvas=holder.querySelector('canvas'),image=holder.querySelector('img'),ctx=canvas?.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),root=document.documentElement;
 let visible=false,raf=0,last=0,phase=0,draws=0;
 const engines=[[.22,.516,2.65],[.454,.616,2.45]];
 function draw(){
  ctx.clearRect(0,0,400,280);ctx.save();ctx.scale(2,2);ctx.globalCompositeOperation='screen';
  for(let i=0;i<engines.length;i++){
   const [u,v,angle]=engines[i],x=65+100*u,y=20+100*v,dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx;
   const length=34+3*Math.sin(phase*6+i);
   const glow=ctx.createRadialGradient(x,y,0,x,y,19);glow.addColorStop(0,'rgba(255,255,230,.95)');glow.addColorStop(.25,'rgba(255,206,87,.68)');glow.addColorStop(1,'rgba(255,53,30,0)');ctx.fillStyle=glow;ctx.fillRect(x-20,y-20,40,40);
   for(const [width,reach,alpha] of [[6,1,.75],[3.5,.87,.95],[1.5,.65,1]]){
    const tx=x+dx*length*reach,ty=y+dy*length*reach;
    const g=ctx.createLinearGradient(x,y,tx,ty);g.addColorStop(0,`rgba(255,255,240,${alpha})`);g.addColorStop(.22,`rgba(255,227,143,${alpha})`);g.addColorStop(.67,`rgba(255,85,35,${alpha*.6})`);g.addColorStop(1,'rgba(255,30,25,0)');
    ctx.fillStyle=g;ctx.shadowColor='#ff8c32';ctx.shadowBlur=width===6?8:2;
    ctx.beginPath();ctx.moveTo(x+nx*width,y+ny*width);ctx.bezierCurveTo(x+dx*length*.4+nx*width,y+dy*length*.4+ny*width,tx+nx*width*.15,ty+ny*width*.15,tx,ty);ctx.bezierCurveTo(tx-nx*width*.15,ty-ny*width*.15,x+dx*length*.4-nx*width,y+dy*length*.4-ny*width,x-nx*width,y-ny*width);ctx.closePath();ctx.fill();
   }
   ctx.shadowBlur=3;ctx.lineCap='round';
   for(let j=0;j<5;j++){
    const progress=(phase*.55+j*.21+i*.1)%1,dist=8+progress*44,spread=Math.sin(j*9.1)*3*progress;
    ctx.strokeStyle=`rgba(255,223,151,${(1-progress)*.65})`;ctx.lineWidth=1-progress*.65;ctx.beginPath();ctx.moveTo(x+dx*dist+nx*spread,y+dy*dist+ny*spread);ctx.lineTo(x+dx*(dist+3)+nx*spread,y+dy*(dist+3)+ny*spread);ctx.stroke();
   }
  }
  ctx.restore();canvas.dataset.frame=String(++draws);
 }
 function allowed(){return visible&&image.complete&&image.naturalWidth>0&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){raf=0;if(!allowed()){last=0;return;}if(!last||now-last>=32){phase+=last?Math.min(now-last,64)/1000:0;last=now;draw();}raf=requestAnimationFrame(tick);}
 function sync(){if(!allowed()){cancelAnimationFrame(raf);raf=0;last=0;if(image.complete&&image.naturalWidth)draw();}else if(!raf){last=0;raf=requestAnimationFrame(tick);}}
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.1}).observe(holder);else visible=true;
 image.addEventListener('load',sync);document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);sync();
})();
