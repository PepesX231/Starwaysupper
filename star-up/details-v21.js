(() => {
 const dialog=document.getElementById('course-detail-modal');if(!dialog?.showModal)return;
 const body=dialog.querySelector('.course-modal-body'),title=document.getElementById('course-modal-title'),kicker=document.getElementById('course-modal-kicker');let opener;
 document.querySelectorAll('[data-detail]').forEach(control=>{control.setAttribute('aria-haspopup','dialog');control.setAttribute('aria-controls',dialog.id);control.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const source=document.getElementById('detail-'+control.dataset.detail);if(!source)return;event.preventDefault();opener=control;title.textContent=source.dataset.title;kicker.textContent=source.dataset.kicker;body.replaceChildren(source.content.cloneNode(true));body.querySelector('.month')?.setAttribute('open','');dialog.showModal();document.body.classList.add('course-modal-open');body.scrollTop=0;});});
 dialog.querySelectorAll('[data-close-course-modal]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('course-modal-open');body.replaceChildren();opener?.focus({preventScroll:true});});
 body.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const target=body.querySelector('[id="'+CSS.escape(link.hash.slice(1))+'"]');if(target){event.preventDefault();target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}});
})();
