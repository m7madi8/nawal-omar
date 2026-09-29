/**
 * Video section: mute/unmute toggle + audio consent integration
 */
(function () {
  var AUDIO_CONSENT_KEY = 'audio-consent-v2';

  function getConsent() {
    try {
      return localStorage.getItem(AUDIO_CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function init() {
    var video = document.querySelector('.video-section video');
    var toggleBtn = document.querySelector('.video-section .audio-toggle');
    if (!video || !toggleBtn) return;

    // Always start muted; visitor chooses to turn sound on
    var isMuted = true;
    var labelSpan = toggleBtn.querySelector('.audio-toggle__label');
    var iconContainer = toggleBtn.querySelector('.audio-toggle__icon');

    function updateUI() {
      video.muted = isMuted;
      toggleBtn.setAttribute('aria-pressed', !isMuted);
      var lang = window.nawalI18n ? window.nawalI18n.getLang() : 'en';
      var t = window.nawalI18n ? function (k) { return window.nawalI18n.t(lang, k); } : function (k) { return k === 'video_muted' ? 'Muted' : k === 'video_unmute' ? 'Unmute video' : 'Live audio'; };
      toggleBtn.setAttribute('aria-label', isMuted ? t('video_unmute') : t('video_live'));
      if (labelSpan) labelSpan.textContent = isMuted ? t('video_muted') : t('video_live');
      if (iconContainer) {
        iconContainer.innerHTML = isMuted
          ? '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M22 9L16 15"/><path d="M16 9L22 15"/></svg>'
          : '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15 9a5 5 0 0 1 0 6"/><path d="M18 7a8 8 0 0 1 0 10"/></svg>';
      }
    }

    var isInViewport = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isInViewport = entry.isIntersecting;
          if (entry.isIntersecting) {
            // Always play muted when visible; visitor can enable sound manually
            video.muted = true;
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(video);

    window.addEventListener('audio-consent-unlock', function () {
      if (getConsent() !== 'accepted' || !isInViewport) return;
      isMuted = false;
      video.muted = false;
      updateUI();
      video.play().catch(function () {
        video.muted = true;
        isMuted = true;
        updateUI();
      });
    });

    toggleBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      if (!isMuted) {
        try {
          localStorage.setItem(AUDIO_CONSENT_KEY, 'accepted');
        } catch (e) {}
      }
      updateUI();
      video.play().catch(function () {
        video.muted = true;
        isMuted = true;
        updateUI();
      });
    });

    window.addEventListener('nawal-lang-change', function () { updateUI(); });

    video.defaultMuted = true;
    video.muted = true;
    video.load();
    video.play().catch(function () {});
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
