(() => {
 const badge=document.createElement('div');badge.className='interaction-badge';badge.setAttribute('aria-hidden','true');badge.setAttribute('popover','manual');document.body.append(badge);
 const hasPopover=typeof badge.showPopover==='function';if(!hasPopover)badge.hidden=true;
 let current=null;
 function hide(){current=null;if(hasPopover){if(badge.matches(':popover-open'))badge.hidePopover();}else badge.hidden=true;}
 function label(n){if(n.matches('[data-close-course-modal],[data-close-video]'))return 'ปิดกรอบนี้ ×';if(n.matches('[data-detail]'))return 'เปิดรายละเอียด ↗';if(n.matches('[data-video]'))return 'เปิดวิดีโอ ↗';if(n.matches('summary'))return n.closest('details').open?'พับรายละเอียด −':'เปิดหัวข้อนี้ +';if(n.matches('a[href*="line.me"]'))return 'คุยเรื่องสมัครผ่าน LINE ↗';if(n.matches('a[href^="#"],a[href*="index.html#"]'))return 'ไปยังหัวข้อนี้ ↓';if(n.matches('[data-motion-toggle]'))return 'ควบคุมภาพเคลื่อนไหว';if(n.matches('.logo-frames'))return 'เล่นโลโก้อีกครั้ง ↻';if(n.matches('.menu-toggle'))return 'เปิด / ปิดเมนู';if(n.matches('a'))return 'เปิดดูหน้านี้ ↗';return 'กดเพื่อเลือก ↗';}
 function show(n){if(!matchMedia('(hover:hover)').matches||n.matches(':disabled,[aria-disabled="true"]'))return;current=n;n.classList.add('interactive-control');badge.textContent=label(n);if(hasPopover){if(!badge.matches(':popover-open'))badge.showPopover();}else badge.hidden=false;
  const r=n.getBoundingClientRect(),b=badge.getBoundingClientRect(),x=Math.max(12,Math.min(innerWidth-b.width-12,r.left+r.width/2-b.width/2));let y=r.top-b.height-14;if(y<10)y=r.bottom+13;y=Math.max(10,Math.min(innerHeight-b.height-12,y));badge.style.left=x+'px';badge.style.top=y+'px';
 }
 function target(e){return e.target instanceof Element?e.target.closest('a[href],button,summary'):null;}
 document.addEventListener('pointerover',e=>{const n=target(e);if(e.pointerType==='touch'||!n||n.contains(e.relatedTarget))return;show(n);});
 document.addEventListener('pointerout',e=>{if(current&&!current.contains(e.relatedTarget))hide();});
 document.addEventListener('focusin',e=>{const n=target(e);if(n&&n.matches(':focus-visible'))show(n);});
 document.addEventListener('focusout',hide);document.addEventListener('pointerdown',hide);document.addEventListener('click',hide);document.addEventListener('scroll',hide,true);addEventListener('resize',hide);document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
 document.querySelectorAll('a[href],button,summary').forEach(n=>n.classList.add('interactive-control'));
})();
