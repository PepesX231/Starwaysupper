(() => {
 'use strict';const hero=document.querySelector('.hero');if(!hero)return;
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 canvas.className='hero-atmosphere';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
 let w=0,h=0,visible=false,raf=0,last=0,time=0,frames=0,px=0,py=0,tx=0,ty=0;
 function size(){const r=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);w=r.width;h=r.height;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw();}
 function draw(){
  ctx.clearRect(0,0,w,h);const mobile=w<760,cx=w*(mobile?.60:.79)+px,cy=h*(mobile?.77:.47)+py,r=Math.min(w*.26,h*.31),t=time*.001;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.30);ctx.strokeStyle='#75e6ff';
  for(let i=0;i<3;i++){ctx.globalAlpha=.12-i*.025;ctx.lineWidth=i===0?1.3:.7;ctx.beginPath();ctx.ellipse(0,0,r+i*18,r*.65+i*12,0,.3+t*.06+i,5.3+t*.06+i);ctx.stroke();}
  for(let i=0;i<12;i++){const a=i*.5236+t*.08,x=Math.cos(a)*(r+14),y=Math.sin(a)*(r*.65+9);ctx.globalAlpha=.25;ctx.fillStyle='#a8efff';ctx.beginPath();ctx.arc(x,y,i%3===0?2:1,0,Math.PI*2);ctx.fill();}ctx.restore();
  // Far shards orbit slowly, with a different depth from the near floor grid.
  for(let i=0;i<9;i++){const a=i*2.399+t*(i%2?.025:-.02),rx=r*(1.1+(i%3)*.2),x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*rx*.75;ctx.save();ctx.translate(x,y);ctx.rotate(a*.2+t*.04);ctx.globalAlpha=.10+(i%3)*.025;ctx.strokeStyle='#75e6ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-7,-9);ctx.lineTo(8,-6);ctx.lineTo(5,9);ctx.lineTo(-10,5);ctx.closePath();ctx.stroke();ctx.restore();}
  const horizon=h*(mobile?.88:.79),base=h+15;ctx.save();ctx.strokeStyle='#75e6ff';ctx.globalAlpha=.065;ctx.lineWidth=1;
  for(let i=-5;i<9;i++){ctx.beginPath();ctx.moveTo(cx+i*26,horizon);ctx.lineTo(cx+i*170,base);ctx.stroke();}
  for(let i=0;i<7;i++){const q=((i/7+t*.025)%1),y=horizon+(base-horizon)*q*q;ctx.beginPath();ctx.moveTo(w*.48,y);ctx.lineTo(w,y);ctx.stroke();}ctx.restore();
  canvas.dataset.frame=String(++frames);
 }
 function allowed(){return visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){raf=0;if(!allowed()){last=0;return;}const dt=last?Math.min(now-last,50):0;last=now;time+=dt;px+=(tx-px)*.045;py+=(ty-py)*.045;draw();raf=requestAnimationFrame(tick);}
 function sync(){if(!allowed()){cancelAnimationFrame(raf);raf=0;last=0;}else if(!raf)raf=requestAnimationFrame(tick);}
 hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*14;ty=((e.clientY-r.top)/r.height-.5)*10;},{passive:true});hero.addEventListener('pointerleave',()=>{tx=0;ty=0;});
 new ResizeObserver(size).observe(hero);new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.02}).observe(hero);document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',()=>{if(reduced.matches){time=0;px=py=0;draw();}sync();});size();
})();
