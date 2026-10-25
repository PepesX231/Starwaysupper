(() => {
 const make=()=>{const el=document.createElement('div');el.className='superx-scene';el.setAttribute('aria-hidden','true');return el;};
 document.querySelectorAll('.bg-layer,.hero-backdrop,.tracks-section').forEach(el=>el.prepend(make()));
 // Deep links into the retained Game outline must also reveal its parent disclosure.
 const reveal=()=>{const id=decodeURIComponent(location.hash.slice(1)),target=document.getElementById(id);if(!target)return;let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;} };
 addEventListener('hashchange',reveal);reveal();
})();
