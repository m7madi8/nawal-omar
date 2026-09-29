/**
 * Moments gallery: spotlight slider (fixed layout)
 */
(function () {
  function init() {
    var carousel = document.querySelector('.moments-carousel');
    if (!carousel) return;

    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll('.moments-carousel-slide')
    );
    var total = slides.length;
    if (!total) return;

    var prevBtn = carousel.querySelector('.stack-btn--prev');
    var nextBtn = carousel.querySelector('.stack-btn--next');
    var dotsWrap = carousel.querySelector('.moments-carousel-dots');
    var currentIndex = 0;
    var autoTimer = null;
    var startX = 0;
    var endX = 0;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, idx) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'moments-carousel-dot' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to image ' + (idx + 1));
        dot.addEventListener('click', function () {
          goTo(idx);
          restartAuto();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function paint() {
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === currentIndex);
      });
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.moments-carousel-dot').forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }

    function goTo(idx) {
      currentIndex = (idx + total) % total;
      paint();
    }

    function next() {
      goTo(currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex - 1);
    }

    function stopAuto() {
      if (!autoTimer) return;
      clearInterval(autoTimer);
      autoTimer = null;
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 4300);
    }

    function restartAuto() {
      startAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAuto(); });

    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      endX = startX;
      stopAuto();
    }, { passive: true });
    carousel.addEventListener('touchmove', function (e) {
      endX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function () {
      var diff = startX - endX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) next();
        else prev();
      }
      startAuto();
    });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    renderDots();
    paint();
    startAuto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
