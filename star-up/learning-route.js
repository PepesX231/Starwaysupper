(() => {
 const host=document.querySelector('.phases');if(!host)return;
 const steps=[...host.querySelectorAll('.phase')],ns='http://www.w3.org/2000/svg';
 const stops=steps.map(step=>{const dot=document.createElement('span');dot.className='route-stop';dot.setAttribute('aria-hidden','true');step.prepend(dot);return dot;});
 const svg=document.createElementNS(ns,'svg');svg.classList.add('learning-route');svg.setAttribute('aria-hidden','true');host.prepend(svg);
 let raf=0;
 function draw(){raf=0;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);svg.replaceChildren();
  const points=stops.map(s=>{const a=s.getBoundingClientRect();return{x:a.left+a.width/2-r.left,y:a.top+a.height/2-r.top};}),mobile=matchMedia('(max-width:760px)').matches;
  for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
   const d=mobile?`M ${a.x} ${a.y} C ${a.x+9} ${my} ${b.x-9} ${my} ${b.x} ${b.y}`:`M ${a.x} ${a.y} C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
   for(const name of['route-bed','route-line']){const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.classList.add(name);svg.append(path);}
   const line=svg.lastElementChild,len=line.getTotalLength(),p=line.getPointAtLength(len*.53),q=line.getPointAtLength(Math.min(len,len*.53+1)),angle=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;
   const arrow=document.createElementNS(ns,'path');arrow.setAttribute('d','M -6 -5 L 1 0 L -6 5');arrow.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`);arrow.classList.add('route-arrow');svg.append(arrow);
  }
  svg.dataset.connections=String(Math.max(0,points.length-1));
 }
 function request(){if(!raf)raf=requestAnimationFrame(draw);}
 const observer=new ResizeObserver(request);observer.observe(host);steps.forEach(s=>observer.observe(s));document.fonts.ready.then(request);addEventListener('resize',request,{passive:true});request();
})();
