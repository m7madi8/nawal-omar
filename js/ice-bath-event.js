/**
 * Ice Bath day retreat — GSAP / ScrollTrigger motion layer.
 * Mirrors the zanzibar init pattern: register plugin, respect reduced-motion,
 * direction-aware transforms for LTR/RTL.
 */
(function () {
  'use strict';

  var page = document.querySelector('.ib-page');
  if (!page) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isRtl() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  /** Inline-start → outward offset for entrance (positive LTR, negative RTL). */
  function enterX(px) {
    var n = typeof px === 'number' ? px : 28;
    return isRtl() ? -n : n;
  }

  function ensureMist(host, className) {
    if (!host || host.querySelector('.' + className)) return;
    var mist = document.createElement('div');
    mist.className = className;
    mist.setAttribute('aria-hidden', 'true');
    var media =
      host.querySelector('.ib-hero__media') || host.querySelector('.ib-cta__media');
    if (media && media.nextSibling) {
      host.insertBefore(mist, media.nextSibling);
    } else if (media) {
      host.appendChild(mist);
    } else {
      host.insertBefore(mist, host.firstChild);
    }
  }

  function splitTitleWords(titleEl) {
    if (!titleEl) return [];
    var text = (titleEl.textContent || '').trim();
    if (!text) return [];
    titleEl.setAttribute('aria-label', text);
    titleEl.textContent = '';
    var parts = text.split(/(\s+)/);
    var words = [];
    parts.forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        titleEl.appendChild(document.createTextNode(part));
        return;
      }
      var span = document.createElement('span');
      span.className = 'ib-hero__word';
      span.textContent = part;
      titleEl.appendChild(span);
      words.push(span);
    });
    return words;
  }

  function tagTimelineStops() {
    var stops = document.querySelectorAll('.ib-timeline .ib-stop');
    var roles = ['arrival', 'breath', 'ice', 'sauna', 'lunch', 'flower'];
    stops.forEach(function (stop, i) {
      if (roles[i]) stop.classList.add('ib-stop--' + roles[i]);
    });
    return stops;
  }

  function ensureTimelineProgress(timeline) {
    if (!timeline) return null;
    var existing = timeline.querySelector('.ib-timeline__progress');
    if (existing) return existing;
    var bar = document.createElement('span');
    bar.className = 'ib-timeline__progress';
    bar.setAttribute('aria-hidden', 'true');
    timeline.insertBefore(bar, timeline.firstChild);
    return bar;
  }

  /* ── Reduced motion: light fade-ins only ── */
  function initReduced() {
    ensureMist(document.querySelector('.ib-hero'), 'ib-hero__mist');
    ensureMist(document.querySelector('.ib-cta'), 'ib-cta__mist');
    tagTimelineStops();

    document.querySelectorAll('.ib-includes__item').forEach(function (item) {
      item.classList.add('is-drawn');
    });
    document.querySelectorAll('.ib-stop__media').forEach(function (media) {
      media.classList.add('is-revealed');
    });

    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.utils.toArray('.ib-section, .ib-cta, .ib-hero__inner').forEach(function (el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    });
  }

  /* ── Full motion ── */
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    page.classList.add('ib-page--motion');

    var hero = document.querySelector('.ib-hero');
    var cta = document.querySelector('.ib-cta');
    ensureMist(hero, 'ib-hero__mist');
    ensureMist(cta, 'ib-cta__mist');

    var stops = tagTimelineStops();
    var timeline = document.querySelector('.ib-timeline');
    var progress = ensureTimelineProgress(timeline);

    /* 1 ── Hero entrance ── */
    var titleEl = document.getElementById('ib-hero-title');
    var brand = document.querySelector('.ib-hero__brand');
    var divider = document.querySelector('.ib-hero__divider');
    var meta = document.querySelector('.ib-hero__meta');
    var heroCta = document.querySelector('.ib-hero__cta');

    function playHeroReveal() {
      var words = splitTitleWords(titleEl);
      var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (brand) {
        tl.fromTo(
          brand,
          { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.95 },
          0.15
        );
      }

      if (words.length) {
        tl.fromTo(
          words,
          { autoAlpha: 0, y: 22, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.95,
            stagger: 0.07
          },
          0.28
        );
      }

      if (divider) {
        tl.fromTo(
          divider,
          { autoAlpha: 0, scaleX: 0.4 },
          { autoAlpha: 1, scaleX: 1, duration: 0.7 },
          '-=0.45'
        );
      }

      if (meta) {
        tl.fromTo(
          meta,
          { autoAlpha: 0, y: 16, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85 },
          '-=0.4'
        );
      }

      if (heroCta) {
        tl.fromTo(
          heroCta,
          { autoAlpha: 0, y: 18, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            onComplete: function () {
              heroCta.classList.add('ib-cta--breathe');
            }
          },
          '-=0.35'
        );
      }
    }

    playHeroReveal();

    window.addEventListener('nawal-lang-change', function () {
      if (heroCta) heroCta.classList.remove('ib-cta--breathe');
      gsap.set([brand, divider, meta, heroCta].filter(Boolean), { clearProps: 'all' });
      requestAnimationFrame(function () {
        playHeroReveal();
      });
    });

    /* Refresh direction-aware offsets for unplayed stops on EN↔AR */
    window.addEventListener('nawal-lang-change', function () {
      stops.forEach(function (stop) {
        if (stop.classList.contains('is-active')) return;
        var ice = stop.classList.contains('ib-stop--ice');
        gsap.set(stop, { x: enterX(ice ? 20 : 28) });
      });
      ScrollTrigger.refresh();
    });

    /* 2 ── Timeline progress + stop reveals ── */
    if (timeline && progress) {
      gsap.set(progress, { height: 0 });

      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 70%',
        end: 'bottom 35%',
        scrub: 0.65,
        onUpdate: function (self) {
          var track = timeline.offsetHeight - 24;
          gsap.set(progress, { height: Math.max(0, track * self.progress) });
        }
      });
    }

    stops.forEach(function (stop) {
      var isIce = stop.classList.contains('ib-stop--ice');
      var isSauna = stop.classList.contains('ib-stop--sauna');
      var parts = stop.querySelectorAll(
        '.ib-stop__time, .ib-stop__title, .ib-stop__body, .ib-stop__list > li'
      );
      var media = stop.querySelector('.ib-stop__media:not(.ib-stop__media--placeholder)');
      var duration = isIce ? 1.15 : isSauna ? 0.7 : 0.9;
      var stagger = isIce ? 0.12 : isSauna ? 0.05 : 0.08;
      var y = isIce ? 28 : isSauna ? 14 : 20;
      var scale = isIce ? 0.96 : 0.98;

      gsap.set(stop, { autoAlpha: 0, y: y, x: enterX(isIce ? 20 : 28), scale: scale });
      if (parts.length) gsap.set(parts, { autoAlpha: 0, y: 12 });
      if (media) {
        gsap.set(media, { scale: 1.04 });
      }

      ScrollTrigger.create({
        trigger: stop,
        start: 'top 82%',
        once: true,
        onEnter: function () {
          stop.classList.add('is-active');
          if (media) media.classList.add('is-revealed');
          var tl = gsap.timeline({ defaults: { ease: isIce ? 'power3.out' : 'power2.out' } });
          tl.to(stop, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: duration
          });
          if (media) {
            tl.to(
              media,
              {
                scale: 1,
                duration: isIce ? 1.2 : 0.95,
                ease: 'power2.out'
              },
              '-=0.85'
            );
          }
          if (parts.length) {
            tl.to(
              parts,
              {
                autoAlpha: 1,
                y: 0,
                duration: duration * 0.75,
                stagger: stagger
              },
              isIce ? '-=0.55' : '-=0.65'
            );
          }
        }
      });
    });

    /* 3 ── Temperature storytelling via --bg-temp ── */
    var temps = {
      hero: '#e4eef1',
      program: '#f3f8f9',
      ice: '#dceef5',
      sauna: '#f3e6d4',
      lunch: '#f6ebe6',
      cta: '#d8e8ec'
    };

    gsap.set(page, { '--bg-temp': temps.hero });

    function scrubTemp(trigger, color, start, end) {
      if (!trigger) return;
      gsap.to(page, {
        '--bg-temp': color,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: start || 'top 70%',
          end: end || 'center center',
          scrub: 1.2
        }
      });
    }

    scrubTemp(document.querySelector('.ib-program'), temps.program, 'top 80%', 'top 30%');
    scrubTemp(document.querySelector('.ib-stop--ice'), temps.ice, 'top 75%', 'center 45%');
    scrubTemp(document.querySelector('.ib-stop--sauna'), temps.sauna, 'top 75%', 'center 45%');
    scrubTemp(document.querySelector('.ib-stop--lunch') || document.querySelector('.ib-stop--flower'), temps.lunch, 'top 75%', 'center 40%');
    scrubTemp(document.querySelector('.ib-includes'), temps.program, 'top 80%', 'top 40%');
    scrubTemp(document.querySelector('.ib-why'), temps.lunch, 'top 80%', 'center 50%');
    scrubTemp(cta, temps.cta, 'top 85%', 'top 40%');

    /* Intro / dress / pricing soft fades */
    gsap.utils.toArray('.ib-intro__inner, .ib-program__head, .ib-dress .animate-content, .ib-pricing__head, .ib-pricing__note').forEach(function (el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        }
      );
    });

    /* 4 ── Includes checkmark draw ── */
    var includeItems = gsap.utils.toArray('.ib-includes__item');
    if (includeItems.length) {
      var includesList = document.querySelector('.ib-includes__list');
      if (includesList) gsap.set(includesList, { autoAlpha: 1 });

      includeItems.forEach(function (item) {
        var path = item.querySelector('.ib-includes__check path');
        if (path) gsap.set(path, { strokeDasharray: 28, strokeDashoffset: 28 });
        gsap.set(item, { autoAlpha: 0, y: 14 });
      });

      ScrollTrigger.create({
        trigger: '.ib-includes__list',
        start: 'top 80%',
        once: true,
        onEnter: function () {
          var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
          includeItems.forEach(function (item, i) {
            var path = item.querySelector('.ib-includes__check path');
            tl.to(item, { autoAlpha: 1, y: 0, duration: 0.45 }, i * 0.1);
            if (path) {
              tl.to(
                path,
                {
                  strokeDashoffset: 0,
                  duration: 0.5,
                  onStart: function () {
                    item.classList.add('is-drawn');
                  }
                },
                i * 0.1 + 0.08
              );
            }
          });
        }
      });
    }

    /* 5 ── Pricing weight reveal ── */
    var pricingGrid = document.querySelector('.ib-pricing__grid');
    if (pricingGrid) gsap.set(pricingGrid, { autoAlpha: 1 });

    gsap.utils.toArray('.ib-price').forEach(function (card, i) {
      var amount = card.querySelector('.ib-price__amount');
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay: i * 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.ib-pricing__grid', start: 'top 82%', once: true }
        }
      );
      if (amount) {
        gsap.fromTo(
          amount,
          { autoAlpha: 0, scale: 0.9, y: 8 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1,
            delay: 0.15 + i * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.ib-pricing__grid', start: 'top 82%', once: true }
          }
        );
      }
    });

    /* 6 ── Audience: for-block soft; caution nearly static ── */
    var forBlock = document.querySelector('.ib-audience__block:not(.ib-audience--caution)');
    var caution = document.querySelector('.ib-audience--caution');

    if (forBlock) {
      gsap.fromTo(
        forBlock,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: forBlock, start: 'top 85%', once: true }
        }
      );
    }

    if (caution) {
      gsap.fromTo(
        caution,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power1.out',
          scrollTrigger: { trigger: caution, start: 'top 88%', once: true }
        }
      );
    }

    /* 7 ── Why list — slow persuasive stagger ── */
    var whyHead = document.querySelector('.ib-why__head');
    var whyList = document.querySelector('.ib-why__list');
    if (whyList) gsap.set(whyList, { autoAlpha: 1 });

    if (whyHead) {
      gsap.fromTo(
        whyHead,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: whyHead, start: 'top 85%', once: true }
        }
      );
    }

    gsap.utils.toArray('.ib-why__item').forEach(function (item) {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    /* 8 ── Final CTA ── */
    if (cta) {
      var ctaInner = cta.querySelector('.ib-cta__inner');
      if (ctaInner) {
        gsap.set(ctaInner, { autoAlpha: 1 });
        gsap.fromTo(
          ctaInner.children,
          { autoAlpha: 0, y: 20, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.95,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: cta, start: 'top 75%', once: true }
          }
        );
      }
    }

    /* Soft section heads that still use animate-* */
    gsap.utils.toArray('.ib-includes__head').forEach(function (el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    gsap.utils.toArray('.footer-isla .animate-content, .footer-isla.animate-section').forEach(function (el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        }
      );
    });
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
})();
