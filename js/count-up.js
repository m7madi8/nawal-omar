/**
 * Count-up: animate stat numbers when #about-stats (or container) enters viewport.
 * Uses data-to and optional data-suffix on .stat-number.
 */
(function () {
  var duration = 1500;
  var easing = function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };

  function animateValue(el) {
    var to = parseInt(el.getAttribute('data-to'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(to)) return;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easing(progress);
      var current = Math.round(start + (to - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = to + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function init() {
    var container = document.getElementById('about-stats');
    if (!container) return;
    var numbers = container.querySelectorAll('.stat-number[data-to]');
    if (!numbers.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          numbers.forEach(animateValue);
        });
      },
      { threshold: 0.2, rootMargin: '0px' }
    );

    observer.observe(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
