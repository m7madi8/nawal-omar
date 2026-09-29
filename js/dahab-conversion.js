/**
 * Dahab conversion: countdown + testimonials carousel + scroll reveal
 */
(function () {
  var DEADLINE = new Date('2026-08-19T00:00:00');
  var PROOF_INTERVAL_MS = 4500;
  var proofTimer = null;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateCountdown() {
    var root = document.getElementById('dahab-countdown');
    if (!root) return;

    var now = new Date();
    var diff = DEADLINE.getTime() - now.getTime();

    var daysEl = document.getElementById('dahab-cd-days');
    var hoursEl = document.getElementById('dahab-cd-hours');
    var minsEl = document.getElementById('dahab-cd-mins');
    var secsEl = document.getElementById('dahab-cd-secs');

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '0';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    var days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    var hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    var mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    var secs = Math.floor(diff / 1000);

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
  }

  function initReveal() {
    var slider = document.querySelector('.dahab-cv-proof-slider');
    var targets = document.querySelectorAll('.dahab-cv-inc-card, .dahab-cv-final-card');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    if (slider) observer.observe(slider);
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initProofCarousel() {
    var slider = document.querySelector('.dahab-cv-proof-slider');
    var stage = document.getElementById('dahab-proof-stage');
    var dotsRoot = document.getElementById('dahab-proof-dots');
    if (!slider || !stage) return;

    var grid = stage.querySelector('.dahab-cv-proof-grid');
    var cards = stage.querySelectorAll('.dahab-cv-proof-card');
    if (!grid || cards.length < 2) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      grid.style.transform = 'none';
      stage.style.minHeight = '';
      return;
    }

    var index = 0;
    var holdActive = false;
    var keyboardHold = false;
    var dotCooldown = false;
    var activePointer = null;
    var dots = [];

    function autoplayPaused() {
      return holdActive || keyboardHold || dotCooldown;
    }

    function setHeld(on) {
      stage.classList.toggle('is-held', on);
    }

    function syncStageHeight() {
      var card = cards[index];
      if (!card) return;
      stage.style.minHeight = card.offsetHeight + 'px';
    }

    function slideTo(i, animate) {
      index = (i + cards.length) % cards.length;
      var card = cards[index];
      if (!card) return;

      var offset = card.offsetLeft - grid.offsetLeft;
      grid.style.transition = animate === false ? 'none' : '';
      grid.style.transform = 'translateX(-' + offset + 'px)';

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      stage.setAttribute('aria-label', 'Testimonial ' + (index + 1) + ' of ' + cards.length);
      syncStageHeight();
    }

    function nextSlide() {
      slideTo(index + 1, true);
    }

    function stopAutoplay() {
      if (proofTimer) {
        window.clearInterval(proofTimer);
        proofTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      proofTimer = window.setInterval(function () {
        if (autoplayPaused()) return;
        nextSlide();
      }, PROOF_INTERVAL_MS);
    }

    if (dotsRoot) {
      dotsRoot.innerHTML = '';
      cards.forEach(function (_card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dahab-cv-proof-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
        dot.addEventListener('click', function () {
          slideTo(i, true);
          dotCooldown = true;
          window.setTimeout(function () {
            dotCooldown = false;
          }, PROOF_INTERVAL_MS * 2);
        });
        dotsRoot.appendChild(dot);
        dots.push(dot);
      });
    }

    function startHold(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      activePointer = e.pointerId;
      holdActive = true;
      setHeld(true);
      if (stage.setPointerCapture) {
        stage.setPointerCapture(e.pointerId);
      }
    }

    function endHold(e) {
      if (activePointer === null || e.pointerId !== activePointer) return;
      if (stage.releasePointerCapture) {
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch (_err) {
          /* pointer already released */
        }
      }
      activePointer = null;
      holdActive = false;
      setHeld(keyboardHold);
    }

    stage.addEventListener('pointerdown', startHold);
    stage.addEventListener('pointerup', endHold);
    stage.addEventListener('pointercancel', endHold);
    stage.addEventListener('lostpointercapture', function () {
      activePointer = null;
      holdActive = false;
      setHeld(keyboardHold);
    });

    stage.addEventListener('keydown', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      if (e.repeat) return;
      e.preventDefault();
      keyboardHold = true;
      setHeld(true);
    });

    stage.addEventListener('keyup', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      keyboardHold = false;
      setHeld(holdActive);
    });

    stage.addEventListener('blur', function () {
      keyboardHold = false;
      setHeld(holdActive);
    });

    stage.setAttribute('tabindex', '0');

    window.addEventListener('resize', function () {
      slideTo(index, false);
    });

    window.addEventListener('nawal-lang-change', function () {
      window.requestAnimationFrame(function () {
        slideTo(index, false);
      });
    });

    slideTo(0, false);
    startAutoplay();

    if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              slideTo(index, false);
              startAutoplay();
            } else {
              stopAutoplay();
            }
          });
        },
        { threshold: 0.15 }
      );
      visibilityObserver.observe(slider);
    }
  }

  function init() {
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    initReveal();
    initProofCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
