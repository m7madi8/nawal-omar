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
})();
