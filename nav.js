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

  // ── Cookie consent banner ──────────────────────────────────────
  if (!localStorage.getItem('ikitaria_cookie_consent')) {
    var privacyLinks = { it: 'privacy.html', en: '../privacy.html', ja: '../privacy.html' };
    var privacyLink = document.querySelector('link[hreflang="' + lang + '"]')
      ? (lang === 'it' ? 'privacy.html' : '../privacy.html')
      : 'privacy.html';
    var cbTexts = {
      it: {
        text: 'Utilizziamo cookie per migliorare la tua esperienza di navigazione. Consulta la nostra <a href="' + privacyLink + '">Privacy Policy</a>.',
        accept: 'Accetto',
        decline: 'Solo essenziali'
      },
      en: {
        text: 'We use cookies to improve your browsing experience. See our <a href="' + privacyLink + '">Privacy Policy</a>.',
        accept: 'Accept',
        decline: 'Essential only'
      },
      ja: {
        text: 'より良い体験のためCookieを使用しています。詳しくは<a href="' + privacyLink + '">プライバシーポリシー</a>をご覧ください。',
        accept: '同意する',
        decline: '必須のみ'
      }
    };
    var t = cbTexts[lang] || cbTexts['en'];

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', t.accept);
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<p class="cookie-text">' + t.text + '</p>' +
        '<div class="cookie-actions">' +
          '<button class="cookie-btn-accept" id="cb-accept">' + t.accept + '</button>' +
          '<button class="cookie-btn-decline" id="cb-decline">' + t.decline + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cb-visible');
        document.body.style.paddingBottom = banner.offsetHeight + 'px';
      });
    });

    function dismissBanner(val) {
      localStorage.setItem('ikitaria_cookie_consent', val);
      banner.classList.remove('cb-visible');
      document.body.style.paddingBottom = '';
      banner.addEventListener('transitionend', function () { banner.remove(); }, { once: true });
    }

    document.getElementById('cb-accept').addEventListener('click', function () { dismissBanner('accepted'); });
    document.getElementById('cb-decline').addEventListener('click', function () { dismissBanner('declined'); });
  }

  // ── Footer copyright ───────────────────────────────────────────
  var year = new Date().getFullYear();
  var copyrightTexts = { it: '© ' + year + ' Ikitaria', en: '© ' + year + ' Ikitaria', ja: '© ' + year + ' Ikitaria' };
  var footerBrand = document.querySelector('.footer-grid > div:first-child');
  if (footerBrand) {
    var cr = document.createElement('p');
    cr.className = 'footer-copy';
    cr.style.marginTop = '1rem';
    cr.style.fontSize = '0.75rem';
    cr.style.color = 'rgba(248,246,242,0.2)';
    cr.textContent = copyrightTexts[lang] || '© ' + year + ' Ikitaria';
    footerBrand.appendChild(cr);
  }

  // ── Scroll reveal ──────────────────────────────────────────────
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rv-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

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
    var top = el.getBoundingClientRect().top;
    if (top >= viewH) {
      // 完全にビューポート外 → スクロール時にアニメーション
      el.classList.add('rv');
      io.observe(el);
    } else if (top > 0) {
      // ビューポート内 → 即座に表示（アニメーションなし）
      el.classList.add('rv');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add('rv-in'); });
      });
    }
    // top <= 0 はすでに画面上部 → 何もしない（常に表示）
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
