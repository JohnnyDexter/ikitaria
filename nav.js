// Open the nav-hamburger details on desktop so its content is always visible
(function () {
  function syncNav() {
    var nav = document.querySelector('.nav-hamburger');
    if (!nav) return;
    if (window.innerWidth >= 704) nav.open = true;
  }
  syncNav();
  window.addEventListener('resize', syncNav);
})();
