(() => {
 const hero=document.querySelector('.hero'),root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');if(!hero)return;
 const bg=document.createElement('div');bg.className='hero-backdrop';bg.setAttribute('aria-hidden','true');bg.innerHTML='<i class="ink-field"></i><i class="paper-a"></i><i class="paper-b"></i><i class="paper-c"></i><i class="print-grain"></i><i class="light-sweep"></i>';hero.prepend(bg);
 const sections=[...document.querySelectorAll('.team-section,.arenas')],inView=new Set();
 let visible=false;function sync(){const allowed=!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused'),running=visible&&allowed;hero.classList.toggle('hero-motion-live',running);bg.dataset.running=String(running);sections.forEach(s=>s.classList.toggle('section-motion-live',allowed&&inView.has(s)));}
 const sectionsObserver=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?inView.add(e.target):inView.delete(e.target));sync();},{threshold:.02});sections.forEach(s=>sectionsObserver.observe(s));
 new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.02}).observe(hero);document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);sync();
 document.querySelectorAll('[data-lesson-demo]').forEach(button=>button.addEventListener('click',()=>{const visual=button.closest('.lesson-visual'),active=visual.classList.toggle('demo-active');button.setAttribute('aria-pressed',String(active));button.textContent=active?'เริ่มใหม่ ↺':'ขยับตัวละคร →';}));
})();
