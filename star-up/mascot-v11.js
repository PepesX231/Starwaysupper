(() => {
 const image=document.querySelector('.course-identity>img');if(!image)return;
 const mark=document.createElement('button');mark.type='button';mark.className='logo-animated';mark.setAttribute('aria-label','เล่นโมชั่นโลโก้ Star Up อีกครั้ง');image.replaceWith(mark);mark.append(image);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 140 140');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path class="logo-trace" pathLength="100" d="M30 97 C5 100 14 75 37 77 C62 111 99 76 111 31"/>';mark.append(svg);
 mark.addEventListener('click',()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('motion-paused'))return;mark.classList.add('logo-reset');requestAnimationFrame(()=>requestAnimationFrame(()=>mark.classList.remove('logo-reset')));});
})();
