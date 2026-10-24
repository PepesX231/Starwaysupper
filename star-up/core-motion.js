/* Authored attack / coast / magnetic recall. All pieces use the original emblem. */
(() => {
 'use strict';const img=document.querySelector('.course-identity>img');if(!img)return;
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const host=document.createElement('button');host.type='button';host.className='core-motion';host.setAttribute('aria-label','เล่นอนิเมชันโลโก้ Star Up อีกครั้ง');img.replaceWith(host);host.append(img);
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;canvas.width=840;canvas.height=756;canvas.setAttribute('aria-hidden','true');host.append(canvas);
 let ready=false,visible=false,raf=0,last=0,elapsed=0,frames=0;const shards=[],clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=20+col*30,y=12+row*30;for(const points of [[[x,y],[x+30,y],[x,y+30]],[[x+30,y],[x+30,y+30],[x,y+30]]]){const cx=points.reduce((v,p)=>v+p[0],0)/3,cy=points.reduce((v,p)=>v+p[1],0)/3,n=shards.length;shards.push({points,cx,cy,a:Math.atan2(cy-72,cx-80),dist:32+(n%5)*3,spin:(n%2?1:-1)*(.9+(n%5)*.27),delay:(n%7)*.012});}}
 function ring(radius,alpha,angle=0){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#a8f4ff';ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(80,72,radius,radius*.72,angle,0,Math.PI*2);ctx.stroke();ctx.restore();}
 function shard(s,x,y,angle,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.translate(s.cx+x,s.cy+y);ctx.rotate(angle);ctx.translate(-s.cx,-s.cy);ctx.beginPath();s.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.clip();ctx.drawImage(img,20,12,120,120);ctx.restore();}
 function core(sx,sy){ctx.save();ctx.translate(80,72);ctx.scale(sx,sy);ctx.drawImage(img,-60,-60,120,120);ctx.restore();}
 function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,840,756);ctx.scale(3,3);ctx.translate(60,54);
  const t=reduced.matches?0:elapsed%9000;let phase='idle',p=0;
  if(t>=1800&&t<2750)phase='charge';else if(t>=2750&&t<3150)phase='burst';else if(t>=3150&&t<3750)phase='fragments';else if(t>=3750&&t<5100)phase='rebuild';else if(t>=5100&&t<5600)phase='settle';
  if(phase==='idle')core(1,1);
  if(phase==='charge'){const u=(t-1800)/950,q=smooth(u);core(1-.12*q,1+.08*q);ring(61-q*27,.2+q*.55,-.3);ring(53-q*23,.15+q*.3,.55);ctx.save();ctx.strokeStyle='#75e6ff';ctx.lineWidth=1.5;ctx.globalAlpha=q*.8;for(let i=0;i<8;i++){const a=i*Math.PI/4+u*.65,r=66-q*28;ctx.beginPath();ctx.moveTo(80+Math.cos(a)*r,72+Math.sin(a)*r*.8);ctx.lineTo(80+Math.cos(a)*(r-7),72+Math.sin(a)*(r-7)*.8);ctx.stroke();}ctx.restore();}
  if(['burst','fragments','rebuild'].includes(phase)){
   const attack=clamp((t-2750)/400),coast=clamp((t-3150)/600),recall=clamp((t-3750)/1350);
   p=phase==='burst'?1-Math.pow(1-attack,4):phase==='rebuild'?Math.pow(1-smooth(recall),1.4):1;
   const glow=ctx.createRadialGradient(80,72,2,80,72,42);glow.addColorStop(0,'#a8f4ff77');glow.addColorStop(1,'#75e6ff00');ctx.fillStyle=glow;ctx.fillRect(38,30,84,84);
   if(phase==='burst'){ring(9+attack*58,(1-attack)*.8,-.25);ring(8+attack*48,(1-attack)*.5,.45);}
   if(phase==='rebuild'){ring(58-recall*41,Math.sin(recall*Math.PI)*.55,-.3+recall*.55);}
   for(const s of shards){
    const out=1-Math.pow(1-clamp((attack-s.delay)/(1-s.delay)),4);
    const u=clamp((recall-s.delay)/(1-s.delay)),back=Math.pow(1-smooth(u),1.4);
    const r=phase==='burst'?out:phase==='rebuild'?back:1;
    const arc=phase==='burst'?.08*out:phase==='fragments'?.08+coast*.12:.20+Math.sin(u*Math.PI)*.4;
    const distance=s.dist*r,dx=Math.cos(s.a+arc)*distance,dy=Math.sin(s.a+arc)*distance*.78;
    const rotation=s.spin*r*(phase==='burst'?.65:phase==='fragments'?.65+coast*.35:1);
    if(phase==='burst'&&attack<.8)shard(s,dx*.75,dy*.75,rotation*.8,.15*(1-attack));
    if(phase==='rebuild'&&u>.08&&u<.88){ctx.save();ctx.globalAlpha=Math.sin(u*Math.PI)*.19;ctx.strokeStyle='#75e6ff';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(s.cx+dx,s.cy+dy);ctx.quadraticCurveTo(80-dy*.2,72+dx*.2,s.cx,s.cy);ctx.stroke();ctx.restore();}
    shard(s,dx,dy,rotation);
   }
  }
  if(phase==='settle'){const u=(t-5100)/500,k=.085*Math.exp(-6*u)*Math.sin(u*Math.PI*3);core(1+k,1-k*.6);ring(35+u*25,(1-u)*.55,-.2);}
  host.dataset.phase=phase;host.dataset.frame=String(++frames);host.dataset.progress=p.toFixed(3);
 }
 function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){raf=0;if(!allowed()){last=0;return;}elapsed+=last?Math.min(now-last,50):0;last=now;render();raf=requestAnimationFrame(tick);}
 function sync(){if(!allowed()){cancelAnimationFrame(raf);raf=0;last=0;if(reduced.matches){elapsed=0;render();}}else if(!raf){last=0;raf=requestAnimationFrame(tick);}}
 function init(){if(ready||!img.naturalWidth)return;ready=true;render();host.classList.add('core-ready');sync();}
 host.addEventListener('click',()=>{if(reduced.matches||root.classList.contains('motion-paused'))return;elapsed=1800;render();sync();});img.addEventListener('load',init);if(img.complete)init();
 new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.1}).observe(host);document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
