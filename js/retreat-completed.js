/**
 * Shared retreat scheduling: last calendar day of retreat (YYYY-MM-DD).
 * Completed when local "today" is strictly after that day.
 */
(function () {
  function parseLastDay(iso) {
    var p = String(iso || '').trim().split('-');
    if (p.length !== 3) return null;
    var y = parseInt(p[0], 10);
    var m = parseInt(p[1], 10) - 1;
    var d = parseInt(p[2], 10);
    if (!y || m < 0 || m > 11 || d < 1 || d > 31) return null;
    return new Date(y, m, d);
  }

  function isRetreatCompleted(lastDayIso) {
    var end = parseLastDay(lastDayIso);
    if (!end) return false;
    var n = new Date();
    var today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return today > end;
  }

  function refreshI18nVisible(el) {
    var i18n = window.nawalI18n;
    if (!i18n || !i18n.setLang || !i18n.getLang) return;
    i18n.setLang(i18n.getLang());
  }

  function initRetreatsListing() {
    var upcomingGrid = document.getElementById('retreats-upcoming-grid');
    var pastGrid = document.getElementById('retreats-past-grid');
    var pastSection = document.getElementById('retreats-past-section');
    if (!upcomingGrid || !pastGrid || !pastSection) return;

    var toMove = [];
    upcomingGrid.querySelectorAll('[data-retreat-last-day]').forEach(function (article) {
      var iso = article.getAttribute('data-retreat-last-day');
      if (isRetreatCompleted(iso)) toMove.push(article);
    });

    toMove.forEach(function (article) {
      pastGrid.appendChild(article);
      article.classList.add('retreat-card--past');
      var badge = article.querySelector('.retreat-list-badge');
      if (badge) badge.hidden = false;
    });

    pastSection.hidden = pastGrid.children.length === 0;
  }

  function disableFormTree(root) {
    if (!root) return;
    root.querySelectorAll('input, textarea, select, button').forEach(function (el) {
      if (el.type === 'hidden') return;
      el.disabled = true;
    });
  }

  function initDahabCompleted() {
    var lastDay = document.documentElement.getAttribute('data-retreat-last-day');
    if (!lastDay || !isRetreatCompleted(lastDay)) return;

    window.__nawalDahabRetreatCompleted = true;
    document.documentElement.classList.add('retreat-page--completed');

    var badgeHero = document.getElementById('dahab-retreat-status-badge');
    if (badgeHero) badgeHero.hidden = false;

    var badgeGoal = document.getElementById('dahab-retreat-status-badge-goal');
    if (badgeGoal) badgeGoal.hidden = false;

    var openBtn = document.getElementById('dahab-book-btn');
    var label = document.getElementById('dahab-book-btn-label');
    if (label) {
      label.setAttribute('data-i18n', 'retreat_cta_completed');
      refreshI18nVisible(label);
    }
    if (openBtn) {
      openBtn.disabled = true;
      openBtn.setAttribute('aria-disabled', 'true');
      openBtn.classList.add('dahab-includes-cta--disabled');
    }

    var wrap = document.getElementById('dahab-registration-completed-wrap');
    var slot = document.getElementById('dahab-registration-form-slot');
    var modal = document.getElementById('dahab-book-modal');
    var form = document.getElementById('dahab-book-form');
    if (wrap) wrap.hidden = false;
    if (form && slot) {
      form.classList.add('dahab-book-form--readonly');
      slot.appendChild(form);
      disableFormTree(form);
      form.addEventListener(
        'submit',
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
        },
        true
      );
    }
    if (modal) {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    }

    refreshI18nVisible(document.body);
  }

  function run() {
    initRetreatsListing();
    initDahabCompleted();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.nawalRetreatCompleted = {
    isRetreatCompleted: isRetreatCompleted
  };
})();
