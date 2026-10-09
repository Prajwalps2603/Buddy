(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Rotating word in the headline.
  const word = document.querySelector('.rotator .word');
  if (word && !reduce) {
    const words = ['money', 'budgets', 'documents', 'plans', 'reminders', 'savings', 'notes'];
    let i = 0;
    setInterval(() => {
      word.classList.add('out');
      setTimeout(() => { i = (i + 1) % words.length; word.textContent = words[i]; word.classList.remove('out'); }, 320);
    }, 2200);
  }
  // Reveal on scroll.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    items.forEach((el, n) => { el.style.transitionDelay = (n % 4) * 70 + 'ms'; io.observe(el); });
  } else items.forEach((el) => el.classList.add('in'));
  // Spotlight that follows the pointer on feature tiles.
  document.querySelectorAll('.tile').forEach((t) => t.addEventListener('pointermove', (e) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty('--x', e.clientX - r.left + 'px');
    t.style.setProperty('--y', e.clientY - r.top + 'px');
  }));
  // QR code for downloading on a phone.
  const canvas = document.getElementById('qr');
  if (canvas && window.QRious) {
    new QRious({ element: canvas, value: new URL('buddy.apk', location.href).href, size: 180, level: 'M', foreground: '#0b1b5c', background: '#ffffff' });
  } else if (canvas) canvas.closest('.qr-card').classList.add('no-qr');
  // Sticky download bar on phones, hidden while the hero button is visible.
  const bar = document.querySelector('.sticky-dl');
  const hero = document.querySelector('.hero .btn.primary');
  if (bar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting)).observe(hero);
  }
})();
