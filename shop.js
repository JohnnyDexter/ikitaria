(function () {
  var wrapper = document.getElementById("shop-h-wrapper");
  if (!wrapper) return;

  var slides = Array.from(wrapper.querySelectorAll(".h-slide"));
  var dots = Array.from(document.querySelectorAll(".h-dot"));
  var prevBtn = document.getElementById("h-prev");
  var nextBtn = document.getElementById("h-next");
  var counterEl = document.getElementById("h-counter");
  var total = slides.length;
  var current = 0;

  // ── Fit wrapper height to viewport minus header ────────────────
  function fitHeight() {
    var header = document.querySelector(".site-header");
    wrapper.style.height =
      window.innerHeight - (header ? header.offsetHeight : 64) + "px";
  }
  fitHeight();
  window.addEventListener("resize", fitHeight, { passive: true });

  // ── Helpers ────────────────────────────────────────────────────
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function setActive(idx) {
    current = idx;
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === idx);
    });
    if (counterEl) counterEl.textContent = pad(idx + 1) + " / " + pad(total);
    // Hide scroll hint after first slide
    var hint = wrapper.querySelector(".shop-scroll-hint");
    if (hint) hint.style.opacity = idx === 0 ? "1" : "0";
  }

  function goTo(idx) {
    idx = Math.max(0, Math.min(total - 1, idx));
    slides[idx].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  // ── IntersectionObserver tracks current visible slide ──────────
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActive(slides.indexOf(entry.target));
        }
      });
    },
    { root: wrapper, threshold: 0.5 },
  );
  slides.forEach(function (s) {
    io.observe(s);
  });

  // ── Dot clicks ─────────────────────────────────────────────────
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      goTo(i);
    });
  });

  // ── Arrow buttons ──────────────────────────────────────────────
  if (prevBtn)
    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
    });

  // ── Keyboard arrows ────────────────────────────────────────────
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goTo(current - 1);
    }
  });
})();
