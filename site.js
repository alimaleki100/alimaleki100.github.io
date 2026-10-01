const menuBtn=document.querySelector('[data-menu]');
const mobile=document.querySelector('.mobile-menu');
if(menuBtn&&mobile){menuBtn.addEventListener('click',()=>{mobile.classList.toggle('open');menuBtn.setAttribute('aria-expanded',mobile.classList.contains('open'));});}
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
