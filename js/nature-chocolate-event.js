/**
 * Nature & Chocolate day — GSAP / ScrollTrigger motion layer.
 * Warm, playful, sensory register. Direction-aware for EN/AR RTL.
 * Mirrors ice-bath-event.js init pattern.
 */
(function () {
  'use strict';

  var page = document.querySelector('.nc-page');
  if (!page) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isRtl() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  function enterX(px) {
    var n = typeof px === 'number' ? px : 24;
    return isRtl() ? -n : n;
  }

  /* ── 1. Hero ── */
  function initHero(gsap) {
    var badge = document.querySelector('.nc-hero__badge');
    var sold = document.querySelector('.nc-hero__sold');
    var title = document.querySelector('.nc-hero__title');
    var divider = document.querySelector('.nc-hero__divider');
    var meta = document.querySelector('.nc-hero__meta');
    var note = document.querySelector('.nc-hero .nc-sold-note');
    var cta = document.querySelector('.nc-hero__cta');
    var parts = [badge, sold, title, divider, meta, note, cta].filter(Boolean);
    var soldOut = document.body.classList.contains('nc-page--sold-out');

    if (!parts.length) return;

    gsap.set(parts, { autoAlpha: 0, y: 20 });

    gsap
      .timeline({
        defaults: { ease: 'power2.out' },
        onComplete: function () {
          if (cta && !soldOut) cta.classList.add('nc-cta--glow');
        }
      })
      .to(parts, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.11
      }, 0.18);
  }

  function initReduced() {
    var cta = document.querySelector('.nc-hero__cta');
    if (!window.gsap) return;

    var gsap = window.gsap;
    gsap.fromTo(
      '.nc-hero__labels, .nc-hero__title, .nc-hero__divider, .nc-hero__meta, .nc-hero .nc-sold-note, .nc-hero__cta',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4, ease: 'power1.out', stagger: 0.05 }
    );
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    page.classList.add('nc-page--motion');

    initHero(gsap);

    /* Later sections will plug in here */
  }

  function boot() {
    if (reduceMotion) {
      initReduced();
    } else {
      initMotion();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Expose helpers for later section passes */
  window.ncMotion = {
    isRtl: isRtl,
    enterX: enterX,
    reduceMotion: reduceMotion
  };
})();
