const root=document.documentElement,scene=document.querySelector('.scene'),journey=document.querySelector('#journey');
const chapters=[...document.querySelectorAll('[data-chapter]')],links=[...document.querySelectorAll('[data-chapter-link]')];
const button=document.querySelector('[data-motion]'),actor=document.querySelector('.actor'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const titles=['01 / ENTER THE CITY','02 / MAKE YOUR GAME','03 / BUILD TOGETHER','04 / SHOW YOUR WORK','05 / YOUR NEXT CHAPTER'];
const poses=['pose-0.webp','pose-1.webp','team.webp','pose-2.webp','closing.webp'];
let paused=reduced.matches,active=-1,current=0,target=0,raf=0,last=0;
poses.forEach(src=>{const img=new Image();img.src='./assets/'+src;});
function sync(){button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'▶ เปิดโมชั่น':'Ⅱ หยุดโมชั่น';root.classList.toggle('reduced-motion',paused);}
function chapter(){let i=0;for(let n=0;n<chapters.length;n++){if(chapters[n].getBoundingClientRect().top<innerHeight*.52)i=n;}
 if(i!==active){active=i;scene.dataset.chapter=String(i);actor.src='./assets/'+poses[i];links.forEach((a,n)=>n===i?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));document.querySelector('[data-chapter-title]').textContent=titles[i];}
 root.classList.toggle('course-visible',scrollY>journey.offsetHeight-innerHeight*.2);
 target=Math.max(0,Math.min(1,scrollY/Math.max(1,journey.offsetHeight-innerHeight)));
 document.querySelector('[data-progress]').style.width=target*100+'%';document.querySelector('[data-progress-label]').textContent=Math.round(target*100)+'%';
}
function tick(now){raf=0;const dt=last?Math.min(.06,(now-last)/1000):1/60;last=now;
 if(!paused){current+=(target-current)*(1-Math.exp(-dt*7));root.style.setProperty('--travel',current.toFixed(5));scene.dataset.progress=current.toFixed(5);}
 if(!paused&&Math.abs(current-target)>.00003)raf=requestAnimationFrame(tick);else last=0;
}
function request(){chapter();if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);}
button.addEventListener('click',()=>{paused=!paused;sync();request();});
reduced.addEventListener('change',()=>{paused=reduced.matches;sync();request();});
addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else request();});
document.querySelectorAll('.scene img').forEach(img=>img.addEventListener('error',()=>{document.querySelector('.load-status').textContent='ภาพบางส่วนโหลดไม่สำเร็จ · อ่านข้อมูลคอร์สได้ตามปกติ';root.classList.add('image-error');}));
sync();request();document.querySelector('.load-status').textContent='2D LAYERS / SCROLL TO EXPLORE';
