/* Only the front project plays. Every automatic and modal playback starts muted. */
(() => {
 'use strict';
 const gallery=document.querySelector('.work-gallery');if(!gallery)return;
 const items=[...gallery.querySelectorAll('.gallery-item')],reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,loaded=false,ready=false,active=-1,failed=false;
 const players=[];
 const canPlay=()=>visible&&!document.hidden&&!reduced.matches&&!document.documentElement.classList.contains('motion-paused')&&!document.querySelector('dialog[open]');
 function sync(){
  const index=items.findIndex(e=>e.dataset.active==='true');active=index;
  players.forEach((player,i)=>{if(!player?.getPlayerState)return;player.mute();if(canPlay()&&i===index)player.playVideo();else player.pauseVideo();});
 }
 function createPlayers(){
  if(ready||!window.YT?.Player)return;ready=true;
  items.forEach((item,i)=>{
   const link=item.querySelector('[data-video]'),mount=document.createElement('div');mount.className='inline-project-video';link.append(mount);
   players[i]=new YT.Player(mount,{
    host:'https://www.youtube.com',width:'100%',height:'100%',videoId:link.dataset.video,
    playerVars:{autoplay:0,mute:1,controls:0,playsinline:1,loop:1,playlist:link.dataset.video,rel:0,origin:location.origin},
    events:{
     onReady:e=>{e.target.mute();e.target.getIframe().setAttribute('tabindex','-1');e.target.getIframe().setAttribute('title',item.dataset.name+' — ตัวอย่างแบบปิดเสียง');sync();},
     onStateChange:e=>{item.dataset.playbackState=String(e.data);if(e.data===1){e.target.mute();item.classList.add('video-playing');item.classList.remove('video-blocked');}if(e.data===0&&canPlay()&&i===active){e.target.seekTo(0);e.target.playVideo();}},
     onAutoplayBlocked:()=>item.classList.add('video-blocked'),
     onError:()=>{item.classList.add('video-blocked');item.classList.remove('video-playing');}
    }
   });
  });
 }
 function load(){
  if(loaded)return;loaded=true;
  if(window.YT?.Player){createPlayers();return;}
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{previous?.();createPlayers();};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>{failed=true;gallery.classList.add('video-unavailable');};document.head.append(script);
 }
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible&&!reduced.matches)load();sync();},{threshold:.15}).observe(gallery);}
 else{visible=true;if(!reduced.matches)load();}
 document.addEventListener('starways:project-change',sync);document.addEventListener('starways:motion-change',sync);
 document.addEventListener('visibilitychange',sync);document.addEventListener('toggle',sync,true);document.addEventListener('close',sync,true);
 reduced.addEventListener('change',()=>{if(visible&&!reduced.matches)load();sync();});
})();
