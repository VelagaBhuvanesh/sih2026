(function () {
  "use strict";

  /* ===== Mobile menu ===== */

  var burger = document.getElementById("burgerBtn");
  var overlay = document.getElementById("mobileOverlay");
  var body = document.body;

  function openMenu() {
    overlay.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    body.classList.add("menu-open");
  }

  function closeMenu() {
    overlay.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (overlay.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  if (burger && overlay) {
    burger.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeMenu();
    });

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 720 && !overlay.hidden) closeMenu();
    });
  }

  /* ===== Stat count-up ===== */

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(el, index) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
    var duration = 1500 + index * 80;
    var startOffset = 480 + index * 90;

    setTimeout(function () {
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutCubic(progress);
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    }, startOffset);
  }

  var statEls = document.querySelectorAll(".stat-value[data-target]");

  if (statEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var els = document.querySelectorAll(".stat-value[data-target]");
              els.forEach(function (el, i) {
                animateStat(el, i);
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(document.querySelector(".stats"));
    } else {
      statEls.forEach(function (el, i) {
        animateStat(el, i);
      });
    }
  }
})();
