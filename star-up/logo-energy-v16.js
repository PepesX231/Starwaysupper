(() => {
 const mark=document.querySelector('.logo-animated');if(!mark)return;
 mark.setAttribute('aria-label','เล่นโมชั่นโลโก้ Star_ up อีกครั้ง');mark.querySelector('svg')?.remove();
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('star-energy');svg.setAttribute('viewBox','0 0 180 180');svg.setAttribute('aria-hidden','true');
 svg.innerHTML='<circle class="energy-orbit" cx="90" cy="90" r="64"/><path class="energy-rays" d="M90 20v-9M135 37l10-10M153 90h15M139 139l10 10M90 155v13M40 140l-10 10M25 90H11M39 39 28 28"/><path class="energy-shard" d="m90 11 4 9-4 8-4-8Zm63 23-3 11-9 3 3-10Zm15 64-11 3-8-5 11-3Zm-53 64-6-9 2-9 7 9Zm-75-9 1-12 8-4-2 12ZM12 66l12 1 4 8-12-2Z"/><path class="energy-recall" d="M90 14 94 52M153 34 121 64M166 98 128 94M115 162 104 125M40 153 66 120M12 66 53 77"/>';
 mark.append(svg);
})();
