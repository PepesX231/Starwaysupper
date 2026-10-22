(() => {
  'use strict';
  const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('navigation');
  const closeMenu=()=>{if(!toggle||!nav)return;toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');};
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
  matchMedia('(min-width:761px)').addEventListener('change',closeMenu);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  if('IntersectionObserver' in window&&!reduced.matches){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}});},{threshold:.06});document.querySelectorAll('.reveal').forEach(n=>observer.observe(n));reduced.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('js');observer.disconnect();}});}
  const dialog=document.getElementById('video-dialog');if(!dialog||typeof dialog.showModal!=='function')return;
  const player=document.getElementById('video-player'),title=document.getElementById('video-title'),fallback=document.getElementById('video-fallback');let opener;
  document.querySelectorAll('[data-video]').forEach(link=>link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const id=link.dataset.video;if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return;e.preventDefault();opener=link;title.textContent=link.dataset.title;fallback.href=link.href;const iframe=document.createElement('iframe');iframe.title=link.dataset.title+' — ตัวอย่างเกม';iframe.src='https://www.youtube.com/embed/'+id+'?autoplay=1&mute=1&playsinline=1&rel=0';iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';player.replaceChildren(iframe);dialog.showModal();document.body.classList.add('modal-open');}));
  document.querySelector('[data-close-video]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{player.replaceChildren();document.body.classList.remove('modal-open');opener?.focus();});
})();
