(() => {
  'use strict';
  const dialog=document.getElementById('course-dialog');
  if(!dialog||typeof dialog.showModal!=='function')return;
  const title=document.getElementById('course-detail-title'),position=document.getElementById('course-detail-position'),body=document.getElementById('course-detail-body'),full=document.getElementById('course-detail-link');
  const sequence=['build','develop','launch'];
  const previous=dialog.querySelector('[data-prev-course]'),next=dialog.querySelector('[data-next-course]');
  let opener,current;
  function show(key){
    const template=document.getElementById('detail-'+key);
    if(!template)return;
    current=key;title.textContent=template.dataset.detailTitle;position.textContent=template.dataset.detailPosition;body.replaceChildren(template.content.cloneNode(true));full.href='curriculum.html#'+key;
    const index=sequence.indexOf(key);previous.hidden=index<1;next.hidden=index<0||index===sequence.length-1;
    if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
    dialog.scrollTop=0;
  }
  document.querySelectorAll('[data-course-detail]').forEach(link=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=link;show(link.dataset.courseDetail);}));
  dialog.querySelector('[data-close-course]').addEventListener('click',()=>dialog.close());
  previous.addEventListener('click',()=>{const i=sequence.indexOf(current);if(i>0){show(sequence[i-1]);title.tabIndex=-1;title.focus();}});
  next.addEventListener('click',()=>{const i=sequence.indexOf(current);if(i>=0&&i<sequence.length-1){show(sequence[i+1]);title.tabIndex=-1;title.focus();}});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
})();
