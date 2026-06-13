/**
 * Dahab conversion: countdown + scroll reveal for proof/includes/final cards
 */
(function () {
  var DEADLINE = new Date('2026-08-19T00:00:00');

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
    var targets = document.querySelectorAll('.dahab-cv-proof-card, .dahab-cv-inc-card, .dahab-cv-final-card');
    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
