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
  // Reading progress on the legal pages.
  const progress = document.querySelector('.progress');
  if (progress) {
    const update = () => {
      const h = document.documentElement;
      progress.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`;
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }
  // Highlight the section being read in the side menu.
  const links = new Map([...document.querySelectorAll('.side .toc a')].map((a) => [a.getAttribute('href').slice(1), a]));
  if (links.size && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('on'));
      links.get(e.target.id)?.classList.add('on');
    }), { rootMargin: '-25% 0px -65% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
  // Copy the email address.
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = 'Copied ✓';
    } catch {
      b.textContent = b.dataset.copy;
    }
    setTimeout(() => { b.textContent = 'Copy'; }, 1800);
  }));
})();
