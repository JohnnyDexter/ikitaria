(function () {
  // ── Sidebar TOC: set header height CSS var + active section detection ──
  var headerEl = document.querySelector(".site-header");
  if (headerEl) {
    document.documentElement.style.setProperty(
      "--header-h",
      headerEl.offsetHeight + "px",
    );
  }

  var sidebarItems = Array.from(
    document.querySelectorAll(".shop-sidebar-item[data-section]"),
  );
  if (sidebarItems.length) {
    var sectionIds = ["produzione", "brand", "btob"];
    var anchors = sectionIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    function updateSidebar() {
      var scrollMid = window.scrollY + window.innerHeight * 0.45;
      var active = anchors[0];
      anchors.forEach(function (el) {
        if (el.getBoundingClientRect().top + window.scrollY <= scrollMid) {
          active = el;
        }
      });
      sidebarItems.forEach(function (item) {
        item.classList.toggle("active", item.dataset.section === active.id);
      });
    }

    window.addEventListener("scroll", updateSidebar, { passive: true });
    updateSidebar();
  }
  // ──────────────────────────────────────────────────────────────────────

  if (!document.querySelector(".h-section")) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);

  var instances = [];

  function buildSections() {
    // Kill existing instances
    instances.forEach(function (i) {
      i.kill();
    });
    instances = [];

    var isMobile = window.innerWidth < 900;
    var headerH =
      (document.querySelector(".site-header") || {}).offsetHeight || 64;
    var slideH = window.innerHeight - headerH;

    document.querySelectorAll(".h-section").forEach(function (section) {
      var track = section.querySelector(".h-track");
      var slides = Array.from(section.querySelectorAll(".h-slide"));
      var progress = section.querySelector(".h-progress");
      var dots = progress
        ? Array.from(progress.querySelectorAll(".h-dot"))
        : [];
      var n = slides.length;

      if (isMobile) {
        // Mobile: reset any GSAP transforms, make visible
        gsap.set(track, { clearProps: "x" });
        if (progress) progress.classList.add("visible");
        return;
      }

      // Set heights
      section.style.height = slideH + "px";
      slides.forEach(function (s) {
        s.style.height = slideH + "px";
      });

      if (n < 2) {
        if (progress) progress.classList.add("visible");
        return;
      }

      // Wait for layout to settle before measuring
      requestAnimationFrame(function () {
        var scrollDist = track.scrollWidth - window.innerWidth;
        if (scrollDist <= 0) return;

        var anim = gsap.to(track, {
          x: -scrollDist,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            snap: {
              snapTo: 1 / (n - 1),
              duration: { min: 0.2, max: 0.5 },
              ease: "power2.inOut",
            },
            end: "+=" + scrollDist,
            onEnter: function () {
              if (progress) progress.classList.add("visible");
            },
            onLeave: function () {
              if (progress) progress.classList.remove("visible");
            },
            onEnterBack: function () {
              if (progress) progress.classList.add("visible");
            },
            onLeaveBack: function () {
              if (progress) progress.classList.remove("visible");
            },
            onUpdate: function (self) {
              var idx = Math.round(self.progress * (n - 1));
              dots.forEach(function (d, i) {
                d.classList.toggle("active", i === idx);
              });
            },
          },
        });

        instances.push(anim.scrollTrigger);

        // Dot clicks — scroll to the correct position in the pinned range
        dots.forEach(function (dot, i) {
          dot.addEventListener("click", function () {
            var st = anim.scrollTrigger;
            var target = st.start + (st.end - st.start) * (i / (n - 1));
            window.scrollTo({ top: target, behavior: "smooth" });
          });
        });
      });
    });
  }

  buildSections();

  // Rebuild on resize (debounced)
  var resizeTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        ScrollTrigger.getAll().forEach(function (st) {
          st.kill();
        });
        instances = [];
        buildSections();
      }, 250);
    },
    { passive: true },
  );
})();
