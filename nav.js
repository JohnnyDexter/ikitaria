(function () {
  // ── Desktop nav: keep hamburger details open ───────────────────
  function syncNav() {
    var nav = document.querySelector('.nav-hamburger');
    if (!nav) return;
    if (window.innerWidth >= 704) nav.open = true;
  }
  syncNav();
  window.addEventListener('resize', syncNav);

  // ── Back-to-top button ─────────────────────────────────────────
  var lang = document.documentElement.lang || 'it';
  var btLabel = { it: 'Torna in cima', en: 'Back to top', ja: 'トップへ戻る' }[lang] || 'Back to top';
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', btLabel);
  btn.textContent = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Scroll reveal ──────────────────────────────────────────────
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rv-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  var viewH = window.innerHeight;
  var sel = [
    '.column',
    '.stat',
    '.section-intro',
    '.section h2',
    '.section h3',
    '.eyebrow',
    '.page-header h1',
    '.page-header .section-intro',
    '.faq-list details',
    '.why-item',
    '.pricing-table',
    '.free-consult-banner',
    '.service-image-hero',
  ].join(', ');

  document.querySelectorAll(sel).forEach(function (el) {
    if (el.getBoundingClientRect().top > viewH * 0.85) {
      el.classList.add('rv');
      io.observe(el);
    }
  });

  // Stagger delay for cards / stats / why-items in the same container
  ['.three-columns', '.two-columns', '.stats-grid', '.why-list'].forEach(function (gridSel) {
    document.querySelectorAll(gridSel).forEach(function (grid) {
      grid.querySelectorAll('.rv').forEach(function (item, i) {
        item.style.transitionDelay = (i * 0.1) + 's';
      });
    });
  });
})();
