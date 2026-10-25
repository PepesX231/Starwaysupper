(() => {
 const image=document.querySelector('.course-identity>img');if(!image)return;
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const mark=document.createElement('button');mark.type='button';mark.className='logo-animated logo-frames';mark.setAttribute('aria-label','เล่นภาพเคลื่อนไหวโลโก้ Star_ up อีกครั้ง');image.replaceWith(mark);mark.append(image);
 const sequence=[0,1,2,3,4,5,6,7],holds=[2800,140,130,150,160,160,180,1100];
 let frames=[],ready=false,visible=false,index=0,timer=0;
 const allowed=()=>ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');
 const draw=()=>{image.src=frames[sequence[index]].src;mark.dataset.frame=String(sequence[index]);};
 function step(){timer=0;if(!allowed())return;index=(index+1)%sequence.length;draw();timer=setTimeout(step,holds[index]);}
 function sync(){clearTimeout(timer);timer=0;if(ready&&reduced.matches){index=0;draw();}if(allowed())timer=setTimeout(step,holds[index]);mark.dataset.running=String(allowed());}
 Promise.all(sequence.map(i=>new Promise((resolve,reject)=>{const frame=new Image();frame.onload=()=>resolve(frame);frame.onerror=reject;frame.src=`assets/star-frames-v17/pose-${i}.svg`;}))).then(loaded=>{frames=loaded;ready=true;draw();sync();}).catch(()=>{mark.dataset.running='false';});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(mark);
 mark.addEventListener('click',()=>{if(!allowed())return;clearTimeout(timer);index=1;draw();timer=setTimeout(step,holds[index]);});
 document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);
})();
