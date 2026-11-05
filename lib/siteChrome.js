export const SITE_FONT_STYLES = [
  // El Messiri, Instrument Serif and Tajawal are self-hosted (SIL OFL 1.1): see docs/FONTS.md.
  '/css/fonts.css',
  // General Sans is still loaded from Fontshare: its licence terms for self-hosting could not be
  // verified from an official source yet (docs/FONTS.md). Until then it remains a third-party request.
  'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap',
];

export const SITE_STYLES = [
  '/css/home.css',
  '/css/home-pages.css',
  '/legacy/css/register-modal-shell.css',
];

const NAV = [
  { href: '/', en: 'Home', ar: 'الرئيسية', key: 'home', num: '01' },
  {
    href: '/local-retreats',
    en: 'Local Retreats',
    ar: 'خلوات محلية',
    key: 'local-retreats',
    num: '02',
  },
  { href: '/yoga', en: 'Yoga', ar: 'اليوغا', key: 'yoga', num: '03' },
  {
    href: '/private-sessions',
    en: 'Private',
    ar: 'جلسات خاصة',
    menuEn: 'Private Sessions',
    menuAr: 'جلسات خاصة',
    key: 'private-sessions',
    num: '04',
  },
  { href: '/retreats', en: 'Retreats', ar: 'الرحلات', key: 'retreats', num: '05' },
  { href: '/health-forms', en: 'Wellbeing', ar: 'العناية', key: 'health-forms', num: '06' },
];

function navLink(item, currentNav, attrs = '') {
  const current = item.key === currentNav ? ' aria-current="page" class="is-current"' : '';
  return `<a href="${item.href}"${current} data-en="${item.en}" data-ar="${item.ar}"${attrs}>${item.en}</a>`;
}

function mobileNavLink(item, currentNav) {
  const currentAttr = item.key === currentNav ? ' aria-current="page"' : '';
  const currentClass = item.key === currentNav ? ' is-current' : '';
  const en = item.menuEn || item.en;
  const ar = item.menuAr || item.ar;
  return `<a href="${item.href}" class="mobile-nav__link${currentClass}"${currentAttr} data-nav-close><span class="mobile-nav__num" aria-hidden="true">${item.num}</span><span class="mobile-nav__label" data-en="${en}" data-ar="${ar}">${en}</span><span class="mobile-nav__arrow" aria-hidden="true" data-en="→" data-ar="←">→</span></a>`;
}

const LOGO = {
  header: '/media/brand/logo.png',
  footer: '/media/brand/logo-on-dark.png',
  mobile: '/media/brand/logo-on-dark.png',
};

export function renderBrandMark(variant = 'header', href = '/') {
  const loading = variant === 'header' ? 'eager' : 'lazy';
  const src = LOGO[variant] || LOGO.header;
  const sizes = {
    header: 'width="160" height="160"',
    footer: 'width="240" height="240"',
    mobile: 'width="200" height="200"',
  };
  return `<a href="${href}" class="brand-mark brand-mark--${variant}" aria-label="Nawal Yoga" data-transit-en="Home" data-transit-ar="الرئيسية">
  <img src="${src}" alt="" class="brand-mark__img" ${sizes[variant] || sizes.header} decoding="async" loading="${loading}">
</a>`;
}

export function renderMobileNav(currentNav = '') {
  const items = NAV.map((item) => `    <li>${mobileNavLink(item, currentNav)}</li>`).join('\n');

  return `<nav class="mobile-nav" id="mobileNav" aria-label="Mobile" aria-hidden="true">
  <div class="mobile-nav__backdrop" data-nav-close aria-hidden="true"></div>
  <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-labelledby="mobileNavTitle">
    <div class="mobile-nav__handle" aria-hidden="true"><span></span></div>
    <div class="mobile-nav__head">
      <div class="mobile-nav__head-copy">
        ${renderBrandMark('mobile', '/')}
        <p class="mobile-nav__eyebrow" id="mobileNavTitle" data-en="Explore Nawal Yoga" data-ar="اكتشفي عالم نوال يوغا">Explore Nawal Yoga</p>
      </div>
      <button class="mobile-nav__close" type="button" data-nav-close data-en-label="Close menu" data-ar-label="إغلاق القائمة" aria-label="Close menu">
        <span class="mobile-nav__close-label" data-en="Close" data-ar="إغلاق">Close</span>
        <span class="mobile-nav__close-icon" aria-hidden="true"></span>
      </button>
    </div>
    <ul class="mobile-nav__list">
${items}
    </ul>
    <div class="mobile-nav__foot">
      <button class="lang-toggle lang-toggle--mobile" id="langToggleMobile" type="button" aria-label="Switch to English">EN</button>
    </div>
  </div>
</nav>`;
}

export function renderSiteHeader(currentNav = '') {
  const links = NAV.map((item) => navLink(item, currentNav)).join('\n      ');

  return `<header class="site-header" id="siteHeader">
  <div class="container">
    ${renderBrandMark('header', '/')}
    <nav class="site-nav" aria-label="Primary">
      ${links}
    </nav>
    <div class="header-actions">
      <button class="lang-toggle" id="langToggle" type="button" aria-label="Switch to English">EN</button>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

${renderMobileNav(currentNav)}`;
}

export function renderSiteFooter() {
  return `<footer class="site-footer">
  <div class="container footer-close">
    ${renderBrandMark('footer', '/')}
    <p class="footer-sign"><span class="footer-sign__line" data-en="Slow down. Breathe deeper." data-ar="تباطئي. تنفّسي بعمق.">Slow down. Breathe deeper.</span><span class="footer-sign__line" data-en="Feel again." data-ar="اشعري من جديد.">Feel again.</span></p>
    <div class="footer-social" role="group" data-en-label="Connect" data-ar-label="تواصلي" aria-label="Connect">
      <a class="footer-social__link" href="https://instagram.com/nawal_aom" target="_blank" rel="noopener noreferrer" data-en-label="Instagram" data-ar-label="إنستغرام" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M7.2 3h9.6A4.2 4.2 0 0 1 21 7.2v9.6a4.2 4.2 0 0 1-4.2 4.2H7.2A4.2 4.2 0 0 1 3 16.8V7.2A4.2 4.2 0 0 1 7.2 3zm0 1.6A2.6 2.6 0 0 0 4.6 7.2v9.6a2.6 2.6 0 0 0 2.6 2.6h9.6a2.6 2.6 0 0 0 2.6-2.6V7.2a2.6 2.6 0 0 0-2.6-2.6H7.2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 1.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8zM17.15 6.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z"/></svg></a>
      <a class="footer-social__link" href="https://wa.me/972522496366" target="_blank" rel="noopener noreferrer" data-en-label="WhatsApp" data-ar-label="واتساب" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.89c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.61-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.49.24.57.82 1.98.89 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/></svg></a>
    </div>
  </div>
  <div class="container footer-meta">
    <p class="footer-copy"><span data-en="©" data-ar="©">©</span> <span id="year"></span> <span data-en="Nawal Yoga" data-ar="نوال يوغا">Nawal Yoga</span></p>
    <nav class="footer-legal" data-en-label="Legal" data-ar-label="قانوني" aria-label="Legal">
      <a href="/privacy" data-en="Privacy" data-ar="الخصوصية">Privacy</a>
      <a href="/privacy#cookies" data-ny-cookie-settings aria-haspopup="dialog" data-en="Cookie settings" data-ar="إعدادات الكوكيز">Cookie settings</a>
    </nav>
  </div>
</footer>`;
}

function stripChromeTags(html) {
  let out = html;
  out = out.replace(/<header[\s\S]*?<\/header>/i, '');
  out = out.replace(/<div id="menu-panel"[\s\S]*?<\/div>\s*(?=<main|<section|$)/i, '');
  out = out.replace(/<nav class="mobile-nav"[\s\S]*?<\/nav>/i, '');
  out = out.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  return out;
}

/** Page content may use its own <header>/<footer>; only strip chrome outside <main>. */
export function stripLegacyChrome(html) {
  const mainMatch = html.match(/<main[\s\S]*<\/main>/i);
  if (!mainMatch) return stripChromeTags(html).trim();

  const start = mainMatch.index;
  const end = start + mainMatch[0].length;
  return (
    stripChromeTags(html.slice(0, start)) +
    mainMatch[0] +
    stripChromeTags(html.slice(end))
  ).trim();
}

export function hasNewSiteHeader(html) {
  return html.includes('id="siteHeader"') && !html.includes('site-header-bar');
}

/** Next.js serves `public/` at `/`, so `public/media/...` must become `/media/...`. */
export function normalizeMediaUrls(html) {
  if (!html) return html;
  return html
    .replace(/((?:src|poster|href|data-src)=["'])(?:(?:\.\.\/)+)?\/?public\/media\//g, '$1/media/')
    .replace(/url\((['"]?)(?:(?:\.\.\/)+)?\/?public\/media\//g, 'url($1/media/');
}

export function replaceMobileNav(html, currentNav = '') {
  if (!html || !/id=["']mobileNav["']/.test(html)) return html;
  return html.replace(/<nav class="mobile-nav"[\s\S]*?<\/nav>/i, renderMobileNav(currentNav));
}

export function wrapWithSiteShell(html, currentNav = '') {
  const body = stripLegacyChrome(html);
  const mainMatch = body.match(/<main[\s\S]*<\/main>/i);
  let inner;
  if (mainMatch) {
    inner = mainMatch[0].replace(/<main(\s[^>]*)?>/i, (match, attrs = '') => {
      if (/class="/i.test(attrs)) {
        return match.replace(/class="([^"]*)"/, (_, classes) => {
          const next = classes.includes('ny-inner') ? classes : `${classes} ny-inner`.trim();
          return `class="${next}"`;
        });
      }
      return '<main class="ny-inner">';
    });
  } else {
    inner = `<main class="ny-inner">${body}</main>`;
  }
  return `${renderSiteHeader(currentNav)}\n${inner}\n${renderSiteFooter()}`;
}

export const SITE_BOOT_SCRIPT = `(function(){
  "use strict";
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  var docEl = document.documentElement;
  var langToggles = document.querySelectorAll(".lang-toggle");
  function applyLang(lang){
    docEl.setAttribute("lang", lang);
    docEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.querySelectorAll("[data-en]").forEach(function(el){
      var value = lang === "ar" ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if (value !== null) el.textContent = value;
    });
    document.querySelectorAll("[data-en-alt]").forEach(function(el){
      var value = lang === "ar" ? el.getAttribute("data-ar-alt") : el.getAttribute("data-en-alt");
      if (value !== null) el.setAttribute("alt", value);
    });
    document.querySelectorAll("[data-en-label]").forEach(function(el){
      var value = lang === "ar" ? el.getAttribute("data-ar-label") : el.getAttribute("data-en-label");
      if (value !== null) el.setAttribute("aria-label", value);
    });
    langToggles.forEach(function(btn){
      btn.textContent = lang === "ar" ? "EN" : "عربي";
      btn.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    });
    try { localStorage.setItem("nawal-lang", lang); } catch (e) {}
  }
  function prepareLang(lang){
    document.dispatchEvent(new CustomEvent("nawal:langwillchange", { detail: { lang: lang } }));
    applyLang(lang);
    document.dispatchEvent(new CustomEvent("nawal:langchange", { detail: { lang: lang } }));
    try {
      window.dispatchEvent(new CustomEvent("nawal-lang-change", { detail: { lang: lang } }));
    } catch (e) {}
  }
  var savedLang = "ar";
  try { savedLang = localStorage.getItem("nawal-lang") || "ar"; } catch (e) {}
  applyLang(savedLang);
  function syncLegacyI18n(){
    if (window.nawalI18n && typeof window.nawalI18n.setLang === "function") {
      window.nawalI18n.setLang(docEl.getAttribute("lang"));
    }
  }
  langToggles.forEach(function(btn){
    btn.addEventListener("click", function(){
      prepareLang(docEl.getAttribute("lang") === "ar" ? "en" : "ar");
      syncLegacyI18n();
    });
  });
  syncLegacyI18n();
  document.querySelectorAll(".site-nav a[aria-current='page'], .mobile-nav__link[aria-current='page']").forEach(function(link){
    link.addEventListener("click", function(e){
      e.preventDefault();
    });
  });
  var header = document.getElementById("siteHeader");
  if (header) {
    var lastY = -1;
    function onScroll(){
      var y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      header.classList.toggle("is-solid", y > 40);
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    var closeTimer = 0;
    var CLOSE_MS = 520;
    function prefersReducedMotion(){
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    function finishClosed(){
      mobileNav.classList.remove("is-closing");
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = 0;
      }
    }
    function setNavOpen(isOpen){
      var closeBtn = mobileNav.querySelector(".mobile-nav__close");
      var panel = mobileNav.querySelector(".mobile-nav__panel");
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = 0;
      }
      if (isOpen) {
        finishClosed();
        mobileNav.classList.add("is-open");
        mobileNav.setAttribute("aria-hidden", "false");
        navToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
        if (closeBtn) closeBtn.focus();
        return;
      }
      if (!mobileNav.classList.contains("is-open") && !mobileNav.classList.contains("is-closing")) return;
      mobileNav.classList.add("is-closing");
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      navToggle.focus();
      if (prefersReducedMotion()) {
        finishClosed();
        return;
      }
      function onPanelEnd(e){
        if (e.target !== panel) return;
        if (e.propertyName !== "transform") return;
        if (panel) panel.removeEventListener("transitionend", onPanelEnd);
        finishClosed();
      }
      if (panel) panel.addEventListener("transitionend", onPanelEnd);
      closeTimer = setTimeout(function(){
        if (panel) panel.removeEventListener("transitionend", onPanelEnd);
        finishClosed();
      }, CLOSE_MS);
    }
    function closeNav(){
      setNavOpen(false);
    }
    navToggle.addEventListener("click", function(){
      setNavOpen(!mobileNav.classList.contains("is-open"));
    });
    mobileNav.querySelectorAll("[data-nav-close]").forEach(function(el){
      el.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && (mobileNav.classList.contains("is-open") || mobileNav.classList.contains("is-closing"))) closeNav();
    });
  }
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }
  document.documentElement.setAttribute("data-ny-boot", "1");
  document.dispatchEvent(new CustomEvent("nawal:boot"));
})();`;

export function navKeyFromPath(pathname) {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/shop')) return 'shop';
  if (pathname.startsWith('/private-sessions')) return 'private-sessions';
  if (pathname.startsWith('/retreats') || pathname.startsWith('/retreat')) return 'retreats';
  if (
    pathname.startsWith('/local-retreats') ||
    pathname.startsWith('/inner-retreats') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/experiences')
  ) {
    return 'local-retreats';
  }
  if (pathname.startsWith('/yoga') || pathname.startsWith('/workshops')) return 'yoga';
  if (pathname.startsWith('/health-forms') || pathname.startsWith('/register')) return 'health-forms';
  return '';
}
