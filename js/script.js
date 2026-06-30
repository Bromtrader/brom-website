// Refined JS: accessible interactions, debounced scroll, light-weight animations
(function(){
  'use strict';

  // Elements
  const cursor = document.querySelector('.cursor-glow');
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const nav = document.querySelector('.nav');

  // Cursor glow: uses rAF for smoothness
  if(cursor){
    let x = 0, y = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e)=>{ x = e.clientX; y = e.clientY; });
    function update(){ tx += (x - tx) * 0.18; ty += (y - ty) * 0.18; cursor.style.left = tx + 'px'; cursor.style.top = ty + 'px'; requestAnimationFrame(update); }
    requestAnimationFrame(update);
  }

  // Nav toggle for small screens
  if(navToggle && navList){
    navToggle.addEventListener('click', ()=>{
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navList.style.display = open ? '' : 'flex';
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });
  }

  // Debounced scroll to toggle nav backdrop
  let ticking = false;
  window.addEventListener('scroll', ()=>{
    if(!ticking){ window.requestAnimationFrame(()=>{
      if(window.scrollY > 40){ nav.style.background = 'rgba(10,10,20,.75)'; nav.style.backdropFilter = 'blur(20px)'; }
      else{ nav.style.background = ''; nav.style.backdropFilter = ''; }
      ticking = false;
    }); }
    ticking = true;
  });

  // Reveal sections with IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('revealed'); });
  },{threshold:0.12});

  document.querySelectorAll('section, header').forEach(el=>{ el.classList.add('hidden'); observer.observe(el); });

  // Floating window tilt (mouse) with low footprint
  document.querySelectorAll('.window').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / (r.width/2);
      const y = (e.clientY - r.top - r.height/2) / (r.height/2);
      card.style.transform = `perspective(800px) rotateX(${y * 6}deg) rotateY(${x * -6}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });

})();
