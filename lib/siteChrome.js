export const SITE_FONT_STYLES = [
  'https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Tajawal:wght@400;500;700&display=swap',
  'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap',
];

export const SITE_STYLES = ['/css/home.css', '/css/home-pages.css'];

const NAV = [
  { href: '/', en: 'Home', ar: 'الرئيسية', key: 'home', num: '01' },
  { href: '/events', en: 'Events', ar: 'فعاليات', key: 'experiences', num: '02' },
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
  <div class="container footer-top">
    <div class="footer-brand">
      ${renderBrandMark('footer', '/')}
      <p class="footer-tag" data-en="Yoga, journeys and experiences for the moments when you need to slow down, breathe deeper and feel again." data-ar="يوغا ورحلات وتجارب للحظات التي تحتاجين فيها أن تتباطئي، تتنفّسي بعمق، وتشعري من جديد.">Yoga, journeys and experiences for the moments when you need to slow down, breathe deeper and feel again.</p>
    </div>
    <div>
      <div class="footer-heading" data-en="Explore" data-ar="اكتشفي">Explore</div>
      <nav class="footer-links">
        <a href="/experiences" data-en="Experiences" data-ar="التجارب">Experiences</a>
        <a href="/yoga" data-en="Yoga" data-ar="اليوغا">Yoga</a>
        <a href="/private-sessions" data-en="Private Sessions" data-ar="جلسات خاصة">Private Sessions</a>
        <a href="/retreats" data-en="Retreats" data-ar="الرحلات">Retreats</a>
        <a href="/health-forms" data-en="Health" data-ar="العناية">Health</a>
      </nav>
    </div>
    <div>
      <div class="footer-heading" data-en="More" data-ar="المزيد">More</div>
      <nav class="footer-links">
        <a href="/journal" data-en="Journal" data-ar="المدوّنة">Journal</a>
        <a href="/#join" data-en="Join / Book" data-ar="انضمّي / احجزي">Join / Book</a>
      </nav>
    </div>
    <div>
      <div class="footer-heading" data-en="Connect" data-ar="تواصلي معنا">Connect</div>
      <nav class="footer-links">
        <a href="https://wa.me/972522496366" target="_blank" rel="noopener noreferrer" data-en="WhatsApp" data-ar="واتساب">WhatsApp</a>
        <a href="https://instagram.com/nawal_aom" target="_blank" rel="noopener noreferrer" data-en="Instagram" data-ar="إنستغرام">Instagram</a>
      </nav>
    </div>
  </div>
  <div class="container footer-bottom">
    <span><span data-en="©" data-ar="©">©</span> <span id="year"></span> <span data-en="Nawal Yoga. All rights reserved." data-ar="نوال يوغا. جميع الحقوق محفوظة.">Nawal Yoga. All rights reserved.</span></span>
    <div class="footer-legal">
      <a href="#" data-en="Privacy" data-ar="الخصوصية">Privacy</a>
      <a href="#" data-en="Terms" data-ar="الشروط">Terms</a>
    </div>
  </div>
</footer>`;
}

export function stripLegacyChrome(html) {
  let out = html;
  out = out.replace(/<header[\s\S]*?<\/header>/i, '');
  out = out.replace(/<div id="menu-panel"[\s\S]*?<\/div>\s*(?=<main|<section)/i, '');
  out = out.replace(/<nav class="mobile-nav"[\s\S]*?<\/nav>/i, '');
  out = out.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  return out.trim();
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
  if (pathname.startsWith('/events') || pathname.startsWith('/experiences')) return 'experiences';
  if (pathname.startsWith('/yoga') || pathname.startsWith('/workshops')) return 'yoga';
  if (pathname.startsWith('/health-forms') || pathname.startsWith('/register')) return 'health-forms';
  return '';
}
