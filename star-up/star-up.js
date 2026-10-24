(() => {
 'use strict';
 const root=document.documentElement,button=document.querySelector('[data-motion-toggle]');
 button?.addEventListener('click',()=>{
  const paused=root.classList.toggle('motion-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'▶ เปิดภาพเคลื่อนไหว':'Ⅱ หยุดภาพเคลื่อนไหว';document.dispatchEvent(new Event('starways:motion-change'));
 });
 let scheduled=false;
 function update(){
  scheduled=false;
  const max=root.scrollHeight-innerHeight;root.style.setProperty('--read-progress',max?Math.min(1,scrollY/max):0);
  if(root.classList.contains('motion-paused'))return;
  root.style.setProperty('--bg-shift',Math.min(60,scrollY*.035).toFixed(1)+'px');
  document.querySelectorAll('.edge-decor').forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.setProperty('--edge-motion',Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height))));});
 }
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});document.addEventListener('starways:motion-change',request);request();
 // Expand a month reached via a direct link without disrupting normal accordions.
 function openMonth(){const id=decodeURIComponent(location.hash.slice(1)),el=document.getElementById(id);if(el?.classList.contains('month'))el.open=true;}
 addEventListener('hashchange',openMonth);openMonth();
})();
