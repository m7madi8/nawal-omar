/**
 * App global: audio consent, keyboard nav, custom cursor
 */
(function () {
  var AUDIO_CONSENT_KEY = 'audio-consent-v2';

  function initAudioConsent() {
    var promptEl = document.getElementById('audio-consent-prompt');
    if (!promptEl) return;

    var saved = null;
    try {
      saved = localStorage.getItem(AUDIO_CONSENT_KEY);
    } catch (e) {}

    if (saved === 'accepted' || saved === 'declined') {
      promptEl.hidden = true;
      return;
    }

    promptEl.hidden = false;

    var acceptBtn = promptEl.querySelector('[data-audio-accept]');
    var declineBtn = promptEl.querySelector('[data-audio-decline]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(AUDIO_CONSENT_KEY, 'accepted');
        } catch (e) {}
        promptEl.hidden = true;
        window.dispatchEvent(new CustomEvent('audio-consent-unlock'));
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(AUDIO_CONSENT_KEY, 'declined');
        } catch (e) {}
        promptEl.hidden = true;
      });
    }
  }

  function initCursor() {
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    var cursorEl = document.getElementById('custom-cursor');
    if (!cursorEl) return;

    cursorEl.style.display = 'block';
    var x = 0;
    var y = 0;
    var scale = 1;

    function updateStyle() {
      cursorEl.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
    }

    window.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      scale = 1.1;
      updateStyle();
    });
    window.addEventListener('mouseleave', function () {
      scale = 0.8;
      updateStyle();
    });
    window.addEventListener('mouseenter', function () {
      scale = 1;
      updateStyle();
    });
  }

  function initMenu() {
    var toggle = document.getElementById('menu-toggle');
    var panel = document.getElementById('menu-panel');
    if (!toggle || !panel) return;

    var sheet = panel.querySelector('div');
    var closeBtn = panel.querySelector('[data-menu-close]');

    function openMenu() {
      panel.style.display = 'block';
      panel.classList.remove('opacity-0');
      panel.classList.add('opacity-100');
      if (sheet) sheet.style.transform = 'translateX(0)';
      document.body.dataset.menuOpen = 'true';
    }

    function closeMenu() {
      panel.classList.add('opacity-0');
      panel.classList.remove('opacity-100');
      if (sheet) sheet.style.transform = '';
      document.body.dataset.menuOpen = 'false';
      window.setTimeout(function () {
        if (document.body.dataset.menuOpen !== 'true') {
          panel.style.display = 'none';
        }
      }, 300);
    }

    toggle.addEventListener('click', function () {
      var isOpen = document.body.dataset.menuOpen === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    panel.addEventListener('click', function (e) {
      if (e.target === panel) closeMenu();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function init() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    initAudioConsent();
    initCursor();
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
