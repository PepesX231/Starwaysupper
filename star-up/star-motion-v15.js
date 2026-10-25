(() => {
 const section=document.querySelector('.roadmap');if(!section)return;
 const svg=section.querySelector('.learning-route'),root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(!svg)return;
 // Reuse the measured route geometry so the light always meets the milestone pins.
 function flow(){svg.querySelectorAll('.route-line').forEach((line,i)=>{if(line.nextElementSibling?.classList.contains('route-flow'))return;const beam=line.cloneNode(false);beam.removeAttribute('class');beam.classList.add('route-flow');beam.setAttribute('pathLength','100');beam.style.setProperty('--flow-delay',`${i*-1.6}s`);line.after(beam);});}
 new MutationObserver(flow).observe(svg,{childList:true});flow();
 let visible=false;
 function sync(){section.classList.toggle('roadmap-motion-live',visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused'));}
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.03}).observe(section);
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);sync();
})();
