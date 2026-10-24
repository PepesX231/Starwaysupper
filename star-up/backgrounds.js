(() => {
 'use strict';
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const sections=[...document.querySelectorAll('.roadmap,.team-section,.arenas,.showcase,.questions,.enroll,.sub-hero,.curriculum-body,.parent-content,.credits')];
 sections.forEach((section,i)=>{
  const layer=document.createElement('div');layer.className='bg-layer';layer.setAttribute('aria-hidden','true');section.prepend(layer);
  if(!section.classList.contains('sub-hero')){
   const decor=document.createElement('div');decor.className='scene-decor';decor.setAttribute('aria-hidden','true');
   ['rocks-left.webp','rocks-right.webp'].forEach(file=>{const img=new Image();img.src='assets/'+file;img.alt='';img.loading='lazy';img.decoding='async';decor.append(img);});section.prepend(decor);
  }
  if(section.parentElement?.tagName==='MAIN'&&!section.classList.contains('sub-hero')){const seam=document.createElement('span');seam.className='section-seam';seam.setAttribute('aria-hidden','true');section.append(seam);}
 });
 let raf=0;const visible=new Set(sections);
 const watch=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target)),{rootMargin:'100px'});sections.forEach(s=>watch.observe(s));
 function update(){raf=0;if(document.hidden||reduced.matches||root.classList.contains('motion-paused'))return;visible.forEach(s=>{const r=s.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/(innerHeight+r.height)*2));s.style.setProperty('--section-drift',(p*18).toFixed(2)+'px');});}
 function request(){if(!raf)raf=requestAnimationFrame(update);}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});document.addEventListener('starways:motion-change',request);document.addEventListener('visibilitychange',request);
 const targets=[...document.querySelectorAll('.section-heading,.phase,.outputs article,.arena,.faq details,.curriculum-group,.parent-intro,.parent-facts')];
 const entries=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('entry-pending');e.target.classList.add('entry-visible');entries.unobserve(e.target);}}),{threshold:.03,rootMargin:'0px 0px 45px 0px'});
 if(!reduced.matches){root.classList.add('motion-ready');targets.forEach((n,i)=>{n.style.setProperty('--reveal-delay',((i%4)*65)+'ms');n.classList.add('entry-pending');entries.observe(n);});}
 reduced.addEventListener('change',()=>{root.classList.toggle('motion-ready',!reduced.matches);if(reduced.matches)sections.forEach(s=>s.style.setProperty('--section-drift','0px'));request();});request();
})();
