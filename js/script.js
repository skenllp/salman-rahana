/* ============================================================
   SALMAN & RAHANA — WEDDING INVITATION
   Vanilla JS — gate intro, countdown, scroll reveals
   ============================================================ */
(function () {
  "use strict";

  var gate = document.getElementById("gate");
  var gateButton = document.getElementById("gateButton");
  var invitation = document.getElementById("invitation");
  var scrollCue = document.getElementById("scrollCue");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Open the gate → reveal invitation ---------- */
  function openGate() {
    if (!gate) return;

    // Slide the gate panels apart + dissolve the blur layer
    gate.classList.add("is-open");

    // Reveal the invitation just before the gate fully fades out —
    // the hero (same background, no blur) shines through seamlessly
    var revealAt = prefersReducedMotion ? 100 : 800;

    window.setTimeout(function () {
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");

      // move focus into the invitation for accessibility
      var hero = document.getElementById("hero");
      if (hero) hero.setAttribute("tabindex", "-1");
      if (hero) hero.focus({ preventScroll: true });
    }, revealAt);
  }

  if (gateButton) {
    document.body.classList.add("locked");
    gateButton.addEventListener("click", openGate);
    gateButton.addEventListener("keyup", function (e) {
      if (e.key === "Enter" || e.key === " ") openGate();
    });
  }

  if (scrollCue) {
    scrollCue.addEventListener("click", function () {
      var ayah = document.getElementById("ayah");
      if (ayah) ayah.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Countdown timer ---------- */
  // Nikkah date: 12 September 2026 at 4:30 PM IST
  var WEDDING_DATE = new Date("2026-09-12T16:30:00+05:30");

  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    var now = new Date();
    var diff = WEDDING_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }

  if (elDays && elHours && elMins && elSecs) {
    tickCountdown();
    window.setInterval(tickCountdown, 1000);
  }

  /* ---------- Gentle parallax on hero glyph (respects reduced motion) ---------- */
  var topGlyph = document.querySelector(".glyph--top");

  if (!prefersReducedMotion && topGlyph) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        topGlyph.style.transform = "translateY(" + Math.min(y * 0.08, 30) + "px)";
      },
      { passive: true }
    );
  }
  /* ---------- Background music ---------- */
  var audio      = document.getElementById("bg-music");
  var muteBtn    = document.getElementById("mute-btn");
  var iconSound  = document.getElementById("icon-sound");
  var iconMuted  = document.getElementById("icon-muted");

  var musicStarted = false;

  function setMuteIcon(playing) {
    if (iconSound) iconSound.style.display = playing ? "" : "none";
    if (iconMuted) iconMuted.style.display = playing ? "none" : "";
  }

  function startMusic() {
    if (musicStarted || !audio) return;
    audio.volume = 0.45;
    audio.play().then(function () {
      musicStarted = true;
      setMuteIcon(true);
    }).catch(function () {
      // Browser blocked autoplay — muted icon stays, user can tap the button
    });
  }

  // Try immediate autoplay on load (works on some browsers / after reload)
  window.addEventListener("load", function () {
    startMusic();
  });

  // Fallback: start on first user interaction (gate button click counts)
  document.addEventListener("click",      startMusic, { once: true });
  document.addEventListener("touchstart", startMusic, { once: true });
  document.addEventListener("scroll",     startMusic, { once: true });

  // Mute / unmute toggle
  if (muteBtn && audio) {
    muteBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // don't double-trigger startMusic via document click
      if (!musicStarted) {
        startMusic();
        return;
      }
      if (audio.paused) {
        audio.play();
        setMuteIcon(true);
      } else {
        audio.pause();
        setMuteIcon(false);
      }
    });
  }

})();
