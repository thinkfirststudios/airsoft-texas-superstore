/* Airsoft Texas Superstore — spec mockup. Plain JS, no build step.
   Motion character: flows (400–600ms). Everything collapses to instant under prefers-reduced-motion. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.querySelector(".site-header");
  var bgs = document.querySelectorAll("[data-parallax]");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-condensed", y > 40);
    if (reduce) return;
    bgs.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var travel = parseFloat(el.getAttribute("data-parallax")) || 0.1; // 8–12% travel
      el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - window.innerHeight / 2) * -travel).toFixed(1) + "px,0)";
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var btn = document.querySelector(".menu-btn");
  var panel = document.getElementById("mobile-nav");
  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { btn.click(); btn.focus(); }
    });
  }

  var hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("is-in"); });

  var targets = document.querySelectorAll(".rv, .rv-stagger");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("on"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Count-up — ONLY on verified published figures ($25, 9, 5, 10, age 10, 3 options) */
  function countUp(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || isNaN(end)) { el.textContent = String(end); return; }
    var start = performance.now(), dur = 600;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = String(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Superstore filter rail — filters placeholder cards by category only (layout demo) */
  var rail = document.querySelector("[data-filter-rail]");
  if (rail) {
    rail.addEventListener("change", function () {
      var on = Array.prototype.map.call(rail.querySelectorAll("input:checked"), function (i) { return i.value; });
      document.querySelectorAll("[data-cat]").forEach(function (card) {
        card.hidden = on.length > 0 && on.indexOf(card.getAttribute("data-cat")) === -1;
      });
    });
  }

  /* Purchase controls are disabled on purpose — phase 2, not in scope */
  document.querySelectorAll("[data-phase2]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); });
  });

  document.querySelectorAll("form[data-mock]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = f.querySelector(".form-note");
      if (n) { n.classList.add("is-shown"); n.focus(); }
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
