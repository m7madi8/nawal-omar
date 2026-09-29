/**
 * Scroll reveal: add .in-view when elements enter the viewport.
 * On .dahab-page, animations play once (better for long-form reading).
 */
(function () {
  var threshold = 0.12;
  var rootMargin = '0px 0px -7% 0px';
  var selector = '.animate-section, .animate-content, .dahab-stagger-text, .dahab-stagger-grid';

  function init() {
    var dahabRoot = document.querySelector('.dahab-page');
    var onceMode = !!dahabRoot;
    var targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          var once = onceMode || el.classList.contains('dahab-reveal-once');

          if (entry.isIntersecting) {
            el.classList.add('in-view');
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.classList.remove('in-view');
          }
        });
      },
      { threshold: threshold, rootMargin: rootMargin }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });

    if (dahabRoot) {
      requestAnimationFrame(function () {
        targets.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            el.classList.add('in-view');
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
