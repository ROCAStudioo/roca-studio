/* =========================================================
   Invitación · Mía Nicolette · Bajo el Mar
   Lógica base: bienvenida -> video intro -> invitación
   ========================================================= */

(function () {
  "use strict";

  const welcome    = document.getElementById("welcome");
  const intro      = document.getElementById("intro");
  const introVideo = document.getElementById("introVideo");
  const skipBtn    = document.getElementById("skipBtn");
  const invitation = document.getElementById("invitation");
  const startBtn   = document.getElementById("startBtn");
  const bgAudio    = document.getElementById("bgAudio");
  const musicBtn   = document.getElementById("musicBtn");
  const bgVideo    = document.getElementById("bgVideo");

  /* ---- 0. Arrancar el video de fondo de inmediato (mudo = permitido) ---- */
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.play().catch(function (err) {
      console.warn("Video de fondo no arrancó al cargar:", err);
    });
  }

  /* ---- 1. Botón de inicio: arranca música + video de intro ---- */
  startBtn.addEventListener("click", function () {
    welcome.classList.add("hidden");
    musicBtn.classList.remove("hidden");

    // Música de fondo (requiere interacción del usuario para autoplay)
    bgAudio.volume = 0.6;
    bgAudio.play().catch(function () {/* ignorar bloqueo de autoplay */});

    // Arrancar el video de fondo YA (mudo, oculto) aprovechando el gesto
    // del usuario, para que esté listo cuando termine la intro.
    if (bgVideo) {
      bgVideo.muted = true;
      bgVideo.play().catch(function (err) {
        console.warn("Video de fondo no pudo precargar:", err);
      });
    }

    startIntro();
  });

  /* ---- 2. Video de introducción ---- */
  function startIntro() {
    intro.classList.remove("hidden");

    // Pausar la canción para que se escuche el audio del video
    bgAudio.pause();

    introVideo.muted = false;
    introVideo.play().catch(function () {
      // Si el navegador bloquea audio del video, reproducir en silencio
      introVideo.muted = true;
      introVideo.play().catch(function (err) {
        // Si aún así no se puede reproducir, pasar directo a la invitación
        console.warn("No se pudo reproducir el video de intro:", err);
        showInvitation();
      });
    });
  }

  // Al terminar el video -> mostrar invitación
  introVideo.addEventListener("ended", showInvitation);

  // Si el video no carga (archivo faltante o formato no soportado) -> saltar
  introVideo.addEventListener("error", function () {
    console.warn("Error al cargar el video de intro. Mostrando invitación.");
    showInvitation();
  });

  // Botón saltar
  skipBtn.addEventListener("click", showInvitation);

  let invitationShown = false;
  function showInvitation() {
    if (invitationShown) return;   // evitar dobles llamadas
    invitationShown = true;

    introVideo.pause();
    intro.classList.add("hidden");
    invitation.classList.remove("hidden");
    window.scrollTo(0, 0);

    // Reanudar la canción de fondo después del video de intro
    bgAudio.volume = 0.6;
    bgAudio.play().catch(function () {/* ignorar bloqueo de autoplay */});
    musicBtn.textContent = "🔊";

    // Asegurar que el video de fondo esté reproduciéndose
    if (bgVideo) {
      bgVideo.muted = true;            // requerido para autoplay
      bgVideo.play().then(function () {
        console.log("Video de fondo reproduciéndose.");
      }).catch(function (err) {
        console.warn("No se pudo reproducir el video de fondo:", err);
      });
    }

    observeScenes();
  }

  /* ---- 3. Control de música ---- */
  musicBtn.addEventListener("click", function () {
    if (bgAudio.paused) {
      bgAudio.play().catch(function () {});
      musicBtn.textContent = "🔊";
    } else {
      bgAudio.pause();
      musicBtn.textContent = "🔇";
    }
  });

  /* ---- 4. Aparición de secciones al hacer scroll ---- */
  function observeScenes() {
    const contents = document.querySelectorAll(".scene-content, .photo");
    if (!("IntersectionObserver" in window)) {
      contents.forEach(function (c) { c.classList.add("visible"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    contents.forEach(function (c) { io.observe(c); });
  }

  /* ---- Cuenta regresiva al bautizo (28 Dic 2026, 1:00 PM) ---- */
  (function initCountdown() {
    const target = new Date(2026, 11, 28, 13, 0, 0).getTime(); // mes 11 = diciembre
    const elDays  = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins  = document.getElementById("cd-mins");
    const elSecs  = document.getElementById("cd-secs");
    if (!elDays) return;

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = "00";
        clearInterval(timer);
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);
      elDays.textContent  = pad(days);
      elHours.textContent = pad(hours);
      elMins.textContent  = pad(mins);
      elSecs.textContent  = pad(secs);
    }

    tick();
    const timer = setInterval(tick, 1000);
  })();

  /* ---- Carruseles deslizables: puntos indicadores ---- */
  function initCarousel(trackId, dotsId, slideSelector) {
    const track = document.getElementById(trackId);
    const dotsBox = document.getElementById(dotsId);
    if (!track || !dotsBox) return;

    const slides = track.querySelectorAll(slideSelector);
    slides.forEach(function (_, i) {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll(".dot");

    track.addEventListener("scroll", function () {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }, { passive: true });
  }

  initCarousel("gallery", "galleryDots", ".gallery-img");
  initCarousel("hotels", "hotelDots", ".hotel-slide");

  /* ---- 5. Burbujas decorativas ---- */
  (function createBubbles() {
    const layer = document.querySelector(".bubbles");
    if (!layer) return;
    const total = 14;
    for (let i = 0; i < total; i++) {
      const b = document.createElement("span");
      b.className = "bubble";
      const size = Math.random() * 26 + 8;        // 8–34 px
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "vw";
      b.style.animationDuration = (Math.random() * 10 + 8) + "s"; // 8–18 s
      b.style.animationDelay = (Math.random() * 8) + "s";
      layer.appendChild(b);
    }
  })();
})();
