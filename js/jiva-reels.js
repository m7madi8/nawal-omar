/**
 * Jiva workshop reels: tap-to-play overlay, cover fill, tap video to pause.
 */
(function () {
  function syncState(wrap, video) {
    if (video.paused) wrap.classList.remove('is-playing');
    else wrap.classList.add('is-playing');
  }

  function initPlayer(wrap) {
    var video = wrap.querySelector('video');
    var btn = wrap.querySelector('.jiva-reel-playbtn');
    if (!video || !btn) return;

    syncState(wrap, video);

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      video.play().catch(function () {});
    });

    video.addEventListener('play', function () {
      syncState(wrap, video);
    });
    video.addEventListener('pause', function () {
      syncState(wrap, video);
    });

    video.addEventListener('click', function (e) {
      if (e.target !== video) return;
      if (!video.paused) video.pause();
    });
  }

  function init() {
    if (!document.querySelector('.jiva-reel-player')) return;
    document.querySelectorAll('.jiva-reel-player').forEach(initPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
