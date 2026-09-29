(function () {
  var MOBILE_QUERY = '(max-width: 767px)';
  var INTERVAL_MS = 5500;
  var FADE_MS = 1350;

  var slideshow = document.querySelector('.hero-mobile-slideshow');
  if (!slideshow) return;

  var slides = Array.prototype.slice.call(slideshow.querySelectorAll('.hero-mobile-slide'));
  if (slides.length < 2) return;

  var mobileMq = window.matchMedia(MOBILE_QUERY);
  var current = 0;
  var timer = null;
  var running = false;
  var transitioning = false;

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function setBaseSlide(index) {
    slides.forEach(function (slide, i) {
      slide.classList.remove('is-active', 'is-crossfading');
      slide.style.zIndex = '';
      if (i === index) {
        slide.classList.add('is-active');
      }
    });
    current = index;
  }

  function nextSlide() {
    if (!mobileMq.matches || slides.length < 2 || transitioning) return;

    var next = (current + 1) % slides.length;
    var outgoing = slides[current];
    var incoming = slides[next];

    transitioning = true;
    incoming.classList.add('is-crossfading', 'is-active');

    window.setTimeout(function () {
      outgoing.classList.remove('is-active', 'is-crossfading');
      outgoing.style.zIndex = '';
      incoming.classList.remove('is-crossfading');
      incoming.style.zIndex = '';
      current = next;
      transitioning = false;
    }, FADE_MS);
  }

  function start() {
    if (running || !mobileMq.matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBaseSlide(0);
      return;
    }

    running = true;
    setBaseSlide(0);
    clearTimer();
    timer = window.setInterval(nextSlide, INTERVAL_MS);
  }

  function stop() {
    running = false;
    clearTimer();
  }

  function onViewportChange() {
    if (mobileMq.matches) {
      if (!running) start();
    } else {
      stop();
      setBaseSlide(0);
    }
  }

  function onHeroReveal() {
    if (!mobileMq.matches) return;
    window.setTimeout(start, 80);
  }

  if (typeof mobileMq.addEventListener === 'function') {
    mobileMq.addEventListener('change', onViewportChange);
  } else if (typeof mobileMq.addListener === 'function') {
    mobileMq.addListener(onViewportChange);
  }

  window.addEventListener('nawal-hero-reveal', onHeroReveal);

  if (!document.querySelector('.hero-luxury--await-loader')) {
    onHeroReveal();
  }
})();
