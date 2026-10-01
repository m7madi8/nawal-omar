(function () {
  function bindCarousel(track, prev, next, onNavigate) {
    if (!track || !prev || !next) return;

    function scrollByDir(dir) {
      var item = track.querySelector(".wr-carousel__item");
      var gap = 12;
      var amount = item ? item.offsetWidth + gap : track.clientWidth * 0.85;
      track.scrollBy({ left: dir * amount, behavior: "smooth" });
      if (onNavigate) onNavigate();
    }

    prev.addEventListener("click", function () {
      scrollByDir(-1);
    });
    next.addEventListener("click", function () {
      scrollByDir(1);
    });
  }

  bindCarousel(
    document.getElementById("wadi-carousel-track"),
    document.getElementById("wadi-prev"),
    document.getElementById("wadi-next")
  );

  function pauseAllReels() {
    document.querySelectorAll(".wr-reel-card video").forEach(function (video) {
      video.pause();
      video.muted = true;
      var card = video.closest(".wr-reel-card");
      var btn = card ? card.querySelector(".wr-reel-playbtn") : null;
      if (btn) btn.hidden = false;
    });
  }

  var reelsTrack = document.getElementById("wadi-reels-track");
  bindCarousel(
    reelsTrack,
    document.getElementById("wadi-reels-prev"),
    document.getElementById("wadi-reels-next"),
    pauseAllReels
  );

  if (reelsTrack) {
    reelsTrack.addEventListener("scroll", pauseAllReels, { passive: true });
  }

  function pauseOtherReels(activeVideo) {
    document.querySelectorAll(".wr-reel-card video").forEach(function (other) {
      if (other === activeVideo) return;
      other.pause();
      other.muted = true;
      var otherCard = other.closest(".wr-reel-card");
      var otherBtn = otherCard ? otherCard.querySelector(".wr-reel-playbtn") : null;
      if (otherBtn) otherBtn.hidden = false;
    });
  }

  function playReelWithSound(video, btn) {
    pauseOtherReels(video);
    video.muted = false;
    video.volume = 1;
    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt
        .then(function () {
          btn.hidden = true;
        })
        .catch(function () {
          video.muted = true;
          return video.play();
        })
        .then(function () {
          btn.hidden = true;
        })
        .catch(function () {
          btn.hidden = false;
        });
      return;
    }
    btn.hidden = true;
  }

  document.querySelectorAll(".wr-reel-card").forEach(function (card) {
    var video = card.querySelector("video");
    var btn = card.querySelector(".wr-reel-playbtn");
    if (!video || !btn) return;

    btn.addEventListener("click", function () {
      if (video.paused) {
        playReelWithSound(video, btn);
      } else {
        video.pause();
        video.muted = true;
        btn.hidden = false;
      }
    });

    video.addEventListener("click", function () {
      if (!video.paused) {
        video.pause();
        video.muted = true;
        btn.hidden = false;
      }
    });

    video.addEventListener("ended", function () {
      video.muted = true;
      btn.hidden = false;
    });
  });

  document.querySelectorAll("[data-stay-gallery]").forEach(function (gallery) {
    var track = gallery.querySelector("[data-stay-track]");
    var prev = gallery.querySelector("[data-stay-prev]");
    var next = gallery.querySelector("[data-stay-next]");
    if (!track) return;

    var slides = track.querySelectorAll(".wr-stay-gallery__slide");

    function currentIndex() {
      var trackLeft = track.getBoundingClientRect().left;
      var best = 0;
      var bestDist = Infinity;
      slides.forEach(function (slide, index) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      return best;
    }

    function updateNav() {
      var index = currentIndex();
      var last = slides.length - 1;
      if (prev) prev.hidden = index <= 0;
      if (next) next.hidden = index >= last;
    }

    function scrollByDir(dir) {
      var slide = slides[0];
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      var amount = slide ? slide.getBoundingClientRect().width + gap : track.clientWidth;
      track.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        scrollByDir(-1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        scrollByDir(1);
      });
    }

    track.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    updateNav();
  });

  function setItemOpen(item, open, source) {
    var trigger = item.querySelector(".wr-acc__trigger");
    var panel = item.querySelector(".wr-acc__panel");
    if (!trigger || !panel) return;
    var wasOpen = item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) panel.removeAttribute("inert");
    else panel.setAttribute("inert", "");
    if (open && !wasOpen && source) {
      document.dispatchEvent(new CustomEvent("wr:acc-open", {
        detail: { id: item.getAttribute("data-track-id") || item.id, source: source }
      }));
    }
  }

  function syncToggleAll(group) {
    var button = document.querySelector('[data-acc-toggle-all="' + group.id + '"]');
    if (!button) return;
    var items = group.querySelectorAll("[data-acc-item]");
    var allOpen = Array.prototype.every.call(items, function (item) {
      return item.classList.contains("is-open");
    });
    button.setAttribute("aria-expanded", allOpen ? "true" : "false");
    button.querySelector('[data-acc-label="expand"]').hidden = allOpen;
    button.querySelector('[data-acc-label="collapse"]').hidden = !allOpen;
  }

  document.querySelectorAll("[data-acc]").forEach(function (group) {
    group.classList.add("is-enhanced");
    group.querySelectorAll("[data-acc-item]").forEach(function (item) {
      setItemOpen(item, item.classList.contains("is-open"));
      var trigger = item.querySelector(".wr-acc__trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        setItemOpen(item, !item.classList.contains("is-open"), "click");
        syncToggleAll(group);
      });
    });
    syncToggleAll(group);
  });

  document.querySelectorAll("[data-acc-toggle-all]").forEach(function (button) {
    var group = document.getElementById(button.getAttribute("data-acc-toggle-all"));
    if (!group) return;
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") !== "true";
      group.querySelectorAll("[data-acc-item]").forEach(function (item) {
        setItemOpen(item, open, open ? "expand_all" : null);
      });
      syncToggleAll(group);
    });
  });

  function openFromHash(hash) {
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(hash.slice(1)));
    var item = target && target.closest("[data-acc-item]");
    if (!item) return;
    setItemOpen(item, true, "link");
    var group = item.closest("[data-acc]");
    if (group) syncToggleAll(group);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (link) openFromHash(link.getAttribute("href"));
  });
  openFromHash(window.location.hash);

  var sticky = document.querySelector("[data-wr-sticky]");
  var hero = document.querySelector(".wr-hero");
  var finalCta = document.querySelector(".wr-section--cta");
  if (sticky && hero && "IntersectionObserver" in window) {
    var heroVisible = true;
    var finalVisible = false;

    function updateSticky() {
      sticky.classList.toggle("is-visible", !heroVisible && !finalVisible);
    }

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      updateSticky();
    }, { rootMargin: "0px 0px -35% 0px" }).observe(hero);

    if (finalCta) {
      new IntersectionObserver(function (entries) {
        finalVisible = entries[0].isIntersecting;
        updateSticky();
      }, { threshold: 0.25 }).observe(finalCta);
    }
  } else if (sticky) {
    sticky.classList.add("is-visible");
  }
})();
