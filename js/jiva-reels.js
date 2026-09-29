/**
 * Reels: tap-to-play with sound, tap video to pause.
 * Cover frame is taken from the video itself before play.
 */
(function () {
  function syncState(wrap, video) {
    if (video.paused) wrap.classList.remove('is-playing');
    else wrap.classList.add('is-playing');
  }

  function pauseOthers(current) {
    document.querySelectorAll('.jiva-reel-player video').forEach(function (video) {
      if (video !== current && !video.paused) video.pause();
    });
  }

  function captureCover(video) {
    if (video.dataset.coverReady === '1') return;
    if (!video.videoWidth || !video.videoHeight) return;

    try {
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.setAttribute('poster', canvas.toDataURL('image/jpeg', 0.86));
      video.dataset.coverReady = '1';
    } catch (err) {
      /* canvas may fail on tainted media; first frame still shows via currentTime */
    }
  }

  function prepareCover(video) {
    function seekAndCapture() {
      if (video.dataset.coverReady === '1') return;
      var onSeeked = function () {
        video.removeEventListener('seeked', onSeeked);
        captureCover(video);
        if (video.paused) {
          try {
            video.currentTime = 0;
          } catch (e) {}
        }
      };
      video.addEventListener('seeked', onSeeked);
      try {
        var t = video.duration && isFinite(video.duration) ? Math.min(0.12, video.duration * 0.02) : 0.12;
        if (Math.abs(video.currentTime - t) < 0.01) {
          captureCover(video);
          return;
        }
        video.currentTime = t;
      } catch (e) {
        video.removeEventListener('seeked', onSeeked);
        captureCover(video);
      }
    }

    if (video.readyState >= 2) {
      seekAndCapture();
      return;
    }

    video.addEventListener('loadeddata', seekAndCapture, { once: true });
  }

  function initPlayer(wrap) {
    var video = wrap.querySelector('video');
    var btn = wrap.querySelector('.jiva-reel-playbtn');
    if (!video || !btn) return;

    video.muted = false;
    video.removeAttribute('muted');
    video.removeAttribute('poster');
    prepareCover(video);
    syncState(wrap, video);

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      pauseOthers(video);
      video.muted = false;
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
