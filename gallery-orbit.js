(() => {
 'use strict';
 const stage=document.querySelector('.gallery-stage');if(!stage)return;
 const items=[...stage.querySelectorAll('.gallery-item')],picks=[...document.querySelectorAll('[data-gallery-pick]')],status=document.querySelector('[data-gallery-status]'),auto=document.querySelector('[data-gallery-auto]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let phase=0,active=0,drag=null,visible=!('IntersectionObserver' in window),hover=false,enabled=true,frame=0,last=0,holdTimer=0,holdUntil=0,suppressUntil=0;
 const wrap=n=>(n%items.length+items.length)%items.length;
 function reserveSpace(){
  const height=Math.max(...items.map(item=>item.offsetHeight||0));
  if(height>0)stage.style.setProperty('--orbit-stage-height',Math.ceil(height*1.17+54)+'px');
 }
 function render(announce=false){
  const previousActive=active;
  const radius=Math.max(175,Math.min(480,stage.clientWidth*.35)),depth=stage.clientWidth<760?65:120;
  active=wrap(Math.round(-phase/120));
  items.forEach((item,i)=>{
   const angle=(phase+i*120)*Math.PI/180,sine=Math.sin(angle),cosine=Math.cos(angle),front=(cosine+1)/2;
   item.style.setProperty('--orbit-x',sine*radius+'px');item.style.setProperty('--orbit-z',cosine*depth+'px');item.style.setProperty('--orbit-yaw',-sine*32+'deg');item.style.setProperty('--orbit-roll',-sine*3+'deg');item.style.setProperty('--orbit-scale',.79+.21*front);item.style.setProperty('--orbit-opacity',.38+.62*front);item.style.setProperty('--orbit-light',.48+.52*front);item.style.zIndex=String(100+Math.round(cosine*50));item.dataset.active=String(i===active);
   item.querySelector('a').setAttribute('aria-label',(i===active?'ดูเทรลเลอร์ ':'เลือกผลงาน ')+item.dataset.name);
  });
  picks.forEach((pick,i)=>pick.setAttribute('aria-pressed',String(i===active)));
  if((previousActive!==active||!stage.dataset.activeProject)&&typeof CustomEvent==='function'){stage.dataset.activeProject=String(active);document.dispatchEvent(new CustomEvent('starways:project-change',{detail:{index:active}}));}
  if(announce)status.textContent=items[active].dataset.name+' · '+(active+1)+' จาก '+items.length;
 }
 function allowed(){return visible&&enabled&&!reduced.matches&&!document.hidden&&!document.documentElement.classList.contains('motion-paused')&&!drag&&!document.querySelector('dialog[open]')&&performance.now()>=holdUntil;}
 function tick(now){frame=0;if(!allowed()){last=0;stage.classList.remove('is-auto-spinning');return;}const dt=last?Math.min(now-last,70):0;last=now;phase=(phase+dt*.008)%360;stage.classList.add('is-auto-spinning');render();frame=requestAnimationFrame(tick);}
 function sync(){if(auto){auto.setAttribute('aria-pressed',String(enabled));auto.textContent=enabled?'Ⅱ หยุดหมุน':'▶ หมุนผลงาน';}if(allowed()&&!frame){last=0;frame=requestAnimationFrame(tick);}else if(!allowed()&&frame){cancelAnimationFrame(frame);frame=0;last=0;stage.classList.remove('is-auto-spinning');}}
 function hold(){holdUntil=performance.now()+4000;clearTimeout(holdTimer);holdTimer=setTimeout(sync,4050);sync();}
 function select(index){hold();stage.classList.remove('is-auto-spinning');const target=-wrap(index)*120;let delta=((target-phase)%360+540)%360-180;phase+=delta;render(true);}
 document.querySelector('[data-gallery-prev]').addEventListener('click',()=>select(active-1));document.querySelector('[data-gallery-next]').addEventListener('click',()=>select(active+1));
 picks.forEach((pick,i)=>pick.addEventListener('click',()=>select(i)));
 auto?.addEventListener('click',()=>{enabled=!enabled;holdUntil=0;sync();});
 stage.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync();}});stage.addEventListener('pointerleave',()=>{hover=false;sync();});
 stage.addEventListener('focusin',sync);stage.addEventListener('focusout',()=>setTimeout(sync,0));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));}if(e.key==='Home'){e.preventDefault();select(0);}if(e.key==='End'){e.preventDefault();select(items.length-1);}});
 stage.addEventListener('click',e=>{const item=e.target.closest('.gallery-item');if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();return;}if(item&&item!==items[active]&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();e.stopImmediatePropagation();select(items.indexOf(item));}},true);
 stage.addEventListener('dragstart',e=>e.preventDefault());
 stage.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;drag={x:e.clientX,y:e.clientY,id:e.pointerId,start:phase,locked:false};sync();});
 stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.locked&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){drag=null;sync();return;}if(Math.abs(dx)>12&&!drag.locked){drag.locked=true;stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');}if(drag.locked){phase=drag.start+dx/Math.max(340,stage.clientWidth)*200;render();}});
 function release(e,cancelled=false){if(!drag||e.pointerId!==drag.id)return;const locked=drag.locked,start=drag.start,dx=e.clientX-drag.x;drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);if(locked){suppressUntil=performance.now()+450;if(cancelled){phase=start;select(wrap(Math.round(-start/120)));}else if(Math.abs(dx)>40){select(wrap(Math.round(-start/120)+(dx<0?1:-1)));}else select(wrap(Math.round(-phase/120)));}else sync();}
 stage.addEventListener('pointerup',e=>release(e));stage.addEventListener('pointercancel',e=>release(e,true));
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.12});observer.observe(stage);}
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);document.addEventListener('toggle',sync,true);document.addEventListener('close',sync,true);reduced.addEventListener('change',sync);window.addEventListener('resize',()=>{reserveSpace();render();});
 if(typeof ResizeObserver==='function'){const sizes=new ResizeObserver(reserveSpace);items.forEach(item=>sizes.observe(item));}
 document.fonts?.ready.then(reserveSpace);
 reserveSpace();render();sync();
})();
