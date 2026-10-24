/* The original emblem is the texture for every shard; rebuilding restores it exactly. */
(() => {
 'use strict';
 const img=document.querySelector('.course-identity>img');if(!img)return;
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const host=document.createElement('button');host.type='button';host.className='core-motion';host.setAttribute('aria-label','เล่นอนิเมชันโลโก้ Star Up อีกครั้ง');
 img.replaceWith(host);host.append(img);
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 canvas.width=720;canvas.height=648;canvas.setAttribute('aria-hidden','true');host.append(canvas);
 let ready=false,visible=false,raf=0,last=0,elapsed=0,frames=0;
 const shards=[];const size=30;
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const x=20+col*size,y=12+row*size;
  for(const points of [[[x,y],[x+size,y],[x,y+size]],[[x+size,y],[x+size,y+size],[x,y+size]]]){
   const cx=points.reduce((v,p)=>v+p[0],0)/3,cy=points.reduce((v,p)=>v+p[1],0)/3;
   const n=shards.length,a=Math.atan2(cy-72,cx-80),dist=32+(n%4)*4;
   shards.push({points,cx,cy,dx:Math.cos(a)*dist,dy:Math.sin(a)*dist*.8,spin:(n%2?1:-1)*(.23+(n%5)*.12)});
  }
 }
 const ease=t=>1-Math.pow(1-t,3),smooth=t=>t*t*(3-2*t);
 function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,720,648);ctx.scale(3,3);ctx.translate(40,36);
  let p=0,phase='idle',scale=1;const t=elapsed%8400;
  if(t>=1800&&t<2700){phase='charge';scale=1+.045*smooth((t-1800)/900);}
  else if(t>=2700&&t<3250){phase='burst';p=ease((t-2700)/550);}
  else if(t>=3250&&t<4100){phase='fragments';p=1;}
  else if(t>=4100&&t<5400){phase='rebuild';p=1-smooth((t-4100)/1300);}
  else if(t>=5400&&t<5800){phase='settle';scale=1+.03*Math.sin((t-5400)/400*Math.PI);}
  if(reduced.matches){phase='idle';p=0;scale=1;}
  // Soft cyan charge: no full-screen flashes or layout movement.
  if(phase==='charge'){
   const q=(t-1800)/900;ctx.save();ctx.globalAlpha=q*.7;ctx.strokeStyle='#b4f6ff';ctx.lineWidth=1.2;
   ctx.beginPath();ctx.ellipse(80,76,48-q*13,42-q*11,-.3,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(p>0){
   ctx.save();const glow=ctx.createRadialGradient(80,72,2,80,72,36);glow.addColorStop(0,'#a8f4ff88');glow.addColorStop(1,'#75e6ff00');ctx.fillStyle=glow;ctx.globalAlpha=.65;ctx.fillRect(43,35,74,74);ctx.strokeStyle='#a8f4ff';ctx.lineWidth=1.4;ctx.globalAlpha=.55*(1-p*.6);ctx.beginPath();ctx.ellipse(80,72,10+p*43,9+p*35,-.2,0,Math.PI*2);ctx.stroke();ctx.restore();
   for(const s of shards){ctx.save();ctx.translate(s.cx+s.dx*p,s.cy+s.dy*p);ctx.rotate(s.spin*p);ctx.translate(-s.cx,-s.cy);ctx.beginPath();s.points.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.clip();ctx.drawImage(img,20,12,120,120);ctx.restore();}
   ctx.save();ctx.globalAlpha=Math.sin(p*Math.PI/2)*.65;ctx.strokeStyle='#75e6ff';ctx.lineWidth=1.4;
   for(let i=0;i<8;i++){const a=i*Math.PI/4+.2,r=35+p*18;ctx.beginPath();ctx.moveTo(80+Math.cos(a)*r,72+Math.sin(a)*r*.85);ctx.lineTo(80+Math.cos(a)*(r+6),72+Math.sin(a)*(r+6)*.85);ctx.stroke();}ctx.restore();
  }else{ctx.save();ctx.translate(80,72);ctx.scale(scale,scale);ctx.drawImage(img,-60,-60,120,120);ctx.restore();}
  host.dataset.phase=phase;host.dataset.frame=String(++frames);host.dataset.progress=p.toFixed(3);
 }
 function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
 function tick(now){raf=0;if(!allowed()){last=0;return;}elapsed+=last?Math.min(now-last,50):0;last=now;render();raf=requestAnimationFrame(tick);}
 function sync(){if(!allowed()){cancelAnimationFrame(raf);raf=0;last=0;if(reduced.matches){elapsed=0;render();}}else if(!raf){last=0;raf=requestAnimationFrame(tick);}}
 function init(){if(ready||!img.naturalWidth)return;ready=true;render();host.classList.add('core-ready');sync();}
 host.addEventListener('click',()=>{if(reduced.matches||root.classList.contains('motion-paused'))return;elapsed=1800;render();sync();});
 img.addEventListener('load',init);if(img.complete)init();
 new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.1}).observe(host);
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
