/* Portfolio behaviour: scroll reveals, image lightbox, nav state. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Scroll reveals ---------------------------------------------------- */

  function showAll(nodes) {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-in");
  }

  function initReveals() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      showAll(nodes);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var group = el.parentElement;
          if (group && group.hasAttribute("data-stagger")) {
            var peers = Array.prototype.filter.call(group.children, function (c) {
              return c.classList.contains("reveal");
            });
            el.style.setProperty("--delay", peers.indexOf(el) * 90 + "ms");
          }
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);

    // Failsafe: never leave content hidden if the observer never fires.
    window.setTimeout(function () {
      showAll(document.querySelectorAll(".reveal:not(.is-in)"));
    }, 2500);
  }

  /* --- Lightbox ---------------------------------------------------------- */

  function initLightbox() {
    var shots = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
    if (!shots.length || !window.HTMLDialogElement) return;

    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.innerHTML =
      '<div class="lightbox__inner">' +
      '<img alt="" />' +
      '<div class="lightbox__bar">' +
      '<p class="lightbox__caption"></p>' +
      '<button type="button" class="lightbox__close">Close</button>' +
      "</div></div>";
    document.body.appendChild(dialog);

    var img = dialog.querySelector("img");
    var cap = dialog.querySelector(".lightbox__caption");
    var index = 0;

    function render(i) {
      index = (i + shots.length) % shots.length;
      var shot = shots[index];
      var inner = shot.querySelector("img");
      img.src = shot.getAttribute("data-full");
      img.alt = inner ? inner.alt : "";
      cap.textContent =
        (shot.getAttribute("data-caption") || (inner ? inner.alt : "")) +
        "  (" + (index + 1) + " of " + shots.length + ")";
    }

    shots.forEach(function (shot, i) {
      shot.addEventListener("click", function () {
        render(i);
        dialog.showModal();
      });
    });

    dialog.querySelector(".lightbox__close").addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.classList.contains("lightbox__inner")) {
        dialog.close();
      }
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") { event.preventDefault(); render(index + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); render(index - 1); }
    });

    dialog.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  /* --- Section nav state ------------------------------------------------- */

  function initNavState() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav a[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "page");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) { io.observe(section); });
  }

  /* --- Portrait fallback -------------------------------------------------- */

  /* Only paint the portrait once the file is confirmed to exist, so a missing
     headshot degrades to the monogram instead of a broken image icon. */
  function initPortrait() {
    var frame = document.querySelector("[data-portrait]");
    if (!frame) return;
    var src = frame.getAttribute("data-portrait");
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "Abdelrahman Almazlom";
      img.width = probe.naturalWidth;
      img.height = probe.naturalHeight;
      frame.appendChild(img);
    };
    probe.src = src;
  }

  function boot() {
    initReveals();
    initLightbox();
    initNavState();
    initPortrait();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
