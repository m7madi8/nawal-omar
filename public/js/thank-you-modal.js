/**
 * Shared thank-you dialog after any successful public request.
 */
(function (global) {
  if (global.nawalThankYou) return;

  var ROOT_ID = "ny-thanks";
  var SHOW_DELAY = 160;
  var DEDUPE_MS = 1800;
  var COPY = {
    en: {
      eyebrow: "Request received",
      title: "Thank you",
      titleNamed: "Thank you, {name}",
      body: "Your request was sent successfully. We will contact you soon to complete the details with care.",
      close: "Close",
      closeAria: "Close thank you message"
    },
    ar: {
      eyebrow: "وصل طلبكِ",
      title: "شكرًا لكِ",
      titleNamed: "شكرًا لكِ، {name}",
      body: "تم إرسال طلبكِ بنجاح. سنتواصل معكِ قريبًا لنكمل التفاصيل بهدوء.",
      close: "حسنًا",
      closeAria: "إغلاق رسالة الشكر"
    }
  };

  var root = null;
  var titleEl = null;
  var bodyEl = null;
  var closeBtn = null;
  var lastFocused = null;
  var prevOverflow = "";
  var openTimer = 0;
  var lastShownAt = 0;
  var isOpen = false;

  function currentLang() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "ar";
  }

  function firstName(value) {
    var name = String(value || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!name) return "";
    var token = name.split(" ")[0];
    return token.length > 1 && token.length < 24 ? token : "";
  }

  function fillCopy(options) {
    var lang = currentLang();
    var copy = COPY[lang] || COPY.ar;
    var name = firstName(options && options.name);
    var title = name ? copy.titleNamed.replace("{name}", name) : copy.title;
    var eyebrow = root.querySelector(".ny-thanks__eyebrow");
    var closeLabel = root.querySelector(".ny-thanks__close-label");
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (titleEl) titleEl.textContent = (options && options.title) || title;
    if (bodyEl) bodyEl.textContent = (options && options.body) || copy.body;
    if (closeLabel) closeLabel.textContent = copy.close;
    if (closeBtn) closeBtn.setAttribute("aria-label", copy.closeAria);
  }

  function ensureRoot() {
    if (root && document.body.contains(root)) return root;
    root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.className = "ny-thanks";
      root.hidden = true;
      root.innerHTML =
        '<div class="ny-thanks__backdrop" data-ny-thanks-dismiss></div>' +
        '<div class="ny-thanks__dialog" role="dialog" aria-modal="true" aria-labelledby="ny-thanks-title" aria-describedby="ny-thanks-body" tabindex="-1">' +
        '<p class="ny-thanks__eyebrow"></p>' +
        '<div class="ny-thanks__mark" aria-hidden="true">' +
        '<svg viewBox="0 0 72 72" fill="none">' +
        '<circle class="ny-thanks__ring" cx="36" cy="36" r="30"></circle>' +
        '<path class="ny-thanks__check" d="M23 37.2l8.6 8.6 18.2-20"></path>' +
        "</svg>" +
        "</div>" +
        '<h2 class="ny-thanks__title" id="ny-thanks-title"></h2>' +
        '<p class="ny-thanks__body" id="ny-thanks-body"></p>' +
        '<button type="button" class="ny-thanks__close" data-ny-thanks-dismiss>' +
        '<span class="ny-thanks__close-label"></span>' +
        "</button>" +
        "</div>";
      document.body.appendChild(root);
    }
    titleEl = root.querySelector("#ny-thanks-title");
    bodyEl = root.querySelector("#ny-thanks-body");
    closeBtn = root.querySelector(".ny-thanks__close");
    bindOnce();
    return root;
  }

  var bound = false;
  function bindOnce() {
    if (bound || !root) return;
    bound = true;
    root.addEventListener("click", function (event) {
      if (event.target && event.target.closest("[data-ny-thanks-dismiss]")) {
        hide();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        hide();
        return;
      }
      if (event.key !== "Tab" || !closeBtn) return;
      event.preventDefault();
      closeBtn.focus();
    });
    document.addEventListener("nawal:langchange", function () {
      if (isOpen) fillCopy(root.__nyThanksOptions || {});
    });
  }

  function open(options) {
    ensureRoot();
    fillCopy(options || {});
    root.__nyThanksOptions = options || {};
    lastFocused = document.activeElement;
    prevOverflow = document.body.style.overflow;
    root.hidden = false;
    root.classList.remove("is-open");
    isOpen = true;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(function () {
      root.classList.add("is-open");
      if (closeBtn) closeBtn.focus();
    });
  }

  function hide() {
    if (!isOpen || !root) return;
    isOpen = false;
    root.classList.remove("is-open");
    document.body.style.overflow = prevOverflow;
    window.setTimeout(function () {
      if (!isOpen && root) root.hidden = true;
    }, 280);
    if (lastFocused && typeof lastFocused.focus === "function") {
      try {
        lastFocused.focus();
      } catch (_err) {}
    }
  }

  function show(options) {
    var now = Date.now();
    if (now - lastShownAt < DEDUPE_MS) return;
    lastShownAt = now;
    if (openTimer) window.clearTimeout(openTimer);
    openTimer = window.setTimeout(function () {
      openTimer = 0;
      open(options || {});
    }, SHOW_DELAY);
  }

  function requestUrl(input) {
    if (typeof input === "string") return input;
    if (input && typeof input.url === "string") return input.url;
    return "";
  }

  function requestMethod(input, init) {
    if (init && init.method) return String(init.method).toUpperCase();
    if (input && input.method) return String(input.method).toUpperCase();
    return "GET";
  }

  function isTrackedSubmit(input, init) {
    var method = requestMethod(input, init);
    if (method !== "POST") return false;
    var url = requestUrl(input);
    return (
      /\/api\/retreat-request(?:\?|$)/.test(url) ||
      /\/rest\/v1\/retreat_requests(?:\?|$)/.test(url) ||
      /\/api\/shop\/order(?:\?|$)/.test(url) ||
      /\/api\/commerce\/checkout(?:\?|$)/.test(url)
    );
  }

  function readName(input, init) {
    try {
      var body = (init && init.body) || (input && typeof input === "object" && input.body) || "";
      if (typeof body !== "string") return "";
      var data = JSON.parse(body);
      var row = Array.isArray(data) ? data[0] : data;
      return (row && (row.fullName || row.name)) || "";
    } catch (_err) {
      return "";
    }
  }

  function shouldSkipShopRedirect(res) {
    return res
      .clone()
      .json()
      .then(function (data) {
        return Boolean(data && data.via === "stripe" && data.url);
      })
      .catch(function () {
        return false;
      });
  }

  function hookFetch() {
    if (!global.fetch || global.fetch.__nyThankYou) return;
    var nativeFetch = global.fetch.bind(global);
    function wrappedFetch(input, init) {
      var tracked = isTrackedSubmit(input, init);
      var name = tracked ? readName(input, init) : "";
      return nativeFetch(input, init).then(function (res) {
        if (!tracked || !res.ok) return res;
        var url = requestUrl(input);
        if (/\/api\/shop\/order/.test(url) || /\/api\/commerce\/checkout/.test(url)) {
          return shouldSkipShopRedirect(res).then(function (skip) {
            if (!skip) show({ name: name });
            return res;
          });
        }
        show({ name: name });
        return res;
      });
    }
    wrappedFetch.__nyThankYou = true;
    global.fetch = wrappedFetch;
  }

  hookFetch();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureRoot);
  } else {
    ensureRoot();
  }

  global.nawalThankYou = {
    show: show,
    hide: hide
  };
})(window);
