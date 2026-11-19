/* =========================================================
   Portafolio de Javier Aguirre: interactividad
   - Menú móvil, navbar que cambia con el scroll (window.onscroll)
   - Animación al hacer scroll (IntersectionObserver)
   - Filtro de proyectos
   - Validación del formulario sin alert() + envío por Formspree
   - Fondo animado (video silenciado) y música de fondo
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(kind, key, value) {
    try {
      var s = kind === "session" ? window.sessionStorage : window.localStorage;
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Pantalla de bienvenida: activar música y fondo ---------- */
  var gateNeeded = store("session", "ja-gate") !== "1";
  var gateChoice = { music: true, video: !reduceMotion };
  function buildGate() {
    var gate = document.createElement("div");
    gate.className = "gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "gate-title");
    gate.innerHTML =
      '<div class="gate-card px">' +
        '<p class="card-label" style="color:var(--quiet);margin:0">Ludica45</p>' +
        '<h2 id="gate-title">Bienvenido al portafolio de Javier</h2>' +
        '<p>Para la mejor experiencia te recomiendo activar la música y el fondo animado. Podés cambiarlo cuando quieras con los botones de abajo a la derecha.</p>' +
        '<div class="gate-options">' +
          '<button type="button" class="gate-opt" data-opt="music" aria-pressed="true">' +
            '<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 3h2l2-2v6L3 5H1zM6 2h1v4H6z"/></svg>Música<small></small></button>' +
          '<button type="button" class="gate-opt" data-opt="video" aria-pressed="' + gateChoice.video + '">' +
            '<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 1h6v5H1zM3 7h2v1H3z"/></svg>Fondo animado<small></small></button>' +
        '</div>' +
        '<button type="button" class="button button-primary gate-enter"><span>Entrar al portafolio</span><span aria-hidden="true">→</span></button>' +
      '</div>';
    document.body.appendChild(gate);
    document.body.classList.add("menu-open");
    $all(".gate-opt", gate).forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on));
        gateChoice[b.dataset.opt] = on;
      });
    });
    var enter = $(".gate-enter", gate);
    enter.addEventListener("click", function () {
      store("session", "ja-gate", "1");
      store("local", "ja-video", gateChoice.video ? "on" : "off");
      store("session", "ja-music", gateChoice.music ? "on" : "off");
      if (window.__jaApplyChoices) window.__jaApplyChoices(gateChoice); // dentro del clic: el navegador permite el sonido
      gate.classList.add("is-leaving");
      document.body.classList.remove("menu-open");
      setTimeout(function () { gate.remove(); }, 500);
    });
    enter.focus();
  }
  if (gateNeeded) buildGate();

  /* ---------- Año del pie ---------- */
  var year = $("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Menú móvil ---------- */
  var menuButton = $(".menu-toggle");
  var siteNav = $("#site-nav");
  function closeMenu() {
    if (!menuButton || !siteNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
      siteNav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    $all("a", siteNav).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  /* ---------- Navbar sticky que cambia al hacer scroll ---------- */
  var header = $("#site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.onscroll = onScrollHeader;
  onScrollHeader();

  /* ---------- Animación al hacer scroll + enlace activo ---------- */
  var revealEls = $all(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (siteNav && "IntersectionObserver" in window) {
    var links = {};
    $all('a[href^="#"]', siteNav).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && links[entry.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
          links[entry.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- Filtro de proyectos ---------- */
  var filterButtons = $all(".filter-button");
  var projectCards = $all(".project-card");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      filterButtons.forEach(function (b) {
        var active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(function (card) {
        var visible = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !visible);
        if (visible) card.classList.add("is-visible");
      });
    });
  });

  /* ---------- Formulario: validación + Formspree ---------- */
  var form = $("#contact-form");
  if (form) {
    var nameInput = $("#contact-name", form);
    var emailInput = $("#contact-email-input", form);
    var messageInput = $("#contact-message", form);
    var status = $("#form-status", form);
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var fields = [nameInput, emailInput, messageInput];
    var MAIL_FALLBACK = "dulcedebatata09@gmail.com";

    function say(text, isError) {
      status.textContent = text;
      status.classList.toggle("is-error", !!isError);
    }

    form.addEventListener("input", function (e) {
      say("", false);
      if (e.target && e.target.removeAttribute) e.target.removeAttribute("aria-invalid");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var errors = [];
      fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });

      if (!nameInput.value.trim()) { errors.push("Ingresá tu nombre."); nameInput.setAttribute("aria-invalid", "true"); }
      if (!emailPattern.test(emailInput.value.trim())) { errors.push("Ingresá un email válido."); emailInput.setAttribute("aria-invalid", "true"); }
      if (messageInput.value.trim().length < 10) { errors.push("El mensaje debe tener al menos 10 caracteres."); messageInput.setAttribute("aria-invalid", "true"); }

      if (errors.length) {
        say(errors.join(" "), true);
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      // Aún sin ID de Formspree: abre el correo del visitante con el mensaje ya escrito.
      if (form.action.indexOf("REEMPLAZAR_CON_TU_ID") !== -1) {
        var subject = encodeURIComponent("Mensaje desde tu portafolio");
        var body = encodeURIComponent("Nombre: " + nameInput.value.trim() + "\nEmail: " + emailInput.value.trim() + "\n\n" + messageInput.value.trim());
        window.location.href = "mailto:" + MAIL_FALLBACK + "?subject=" + subject + "&body=" + body;
        say("Formulario válido. Se abrió tu programa de correo para enviar el mensaje.", false);
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      say("Enviando...", false);
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) { form.reset(); say("¡Mensaje enviado! Te respondo a la brevedad.", false); }
          else { say("No se pudo enviar el mensaje. Probá de nuevo o escribime por email.", true); }
        })
        .catch(function () { say("Error de conexión. Probá de nuevo en unos minutos.", true); })
        .then(function () { button.disabled = false; });
    });
  }

  /* ---------- Fondo animado ---------- */
  var bg = $("#bg-video");
  var video = bg ? $("video", bg) : null;
  var videoBtn = $("#video-toggle");
  function setVideo(play) {
    if (!video) return;
    if (play) {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      video.pause();
    }
    bg.classList.toggle("is-paused", !play);
    if (videoBtn) {
      videoBtn.setAttribute("aria-pressed", String(play));
      videoBtn.setAttribute("aria-label", play ? "Pausar fondo animado" : "Reanudar fondo animado");
    }
  }
  if (video) {
    video.muted = true;       // el fondo nunca emite sonido
    video.defaultMuted = true;
    video.volume = 0;
    var videoOff = reduceMotion || store("local", "ja-video") === "off" || (gateNeeded && !gateChoice.video);
    setVideo(!videoOff);
    if (videoBtn) videoBtn.addEventListener("click", function () {
      var willPlay = videoBtn.getAttribute("aria-pressed") !== "true";
      store("local", "ja-video", willPlay ? "on" : "off");
      setVideo(willPlay);
    });
  } else if (videoBtn) {
    videoBtn.hidden = true;
  }

  /* ---------- Música de fondo (autoplay con respaldo por interacción) ---------- */
  var music = $("#bg-music");
  var musicBtn = $("#music-toggle");
  var hint = $("#music-hint");
  if (music) {
    music.volume = 0.4;
    var wantsMusic = store("session", "ja-music") !== "off"; // el visitante puede silenciarla
    var armed = false;
    var hintTimer = null;

    function reflect(playing) {
      if (musicBtn) {
        musicBtn.setAttribute("aria-pressed", String(playing));
        musicBtn.setAttribute("aria-label", playing ? "Silenciar música" : "Activar música");
        musicBtn.classList.toggle("is-playing", playing);
      }
    }
    function showHint(show) {
      if (!hint) return;
      hint.classList.toggle("is-visible", show);
      clearTimeout(hintTimer);
      if (show) hintTimer = setTimeout(function () { hint.classList.remove("is-visible"); }, 9000);
    }
    function disarm() {
      armed = false;
      ["pointerup", "click", "keydown", "touchend"].forEach(function (t) { document.removeEventListener(t, unlock, true); });
    }
    function unlock(e) {
      if (e && musicBtn && musicBtn.contains(e.target)) return; // el botón de música maneja su propio clic
      if (!wantsMusic) { disarm(); return; }
      var p = music.play();
      if (p && p.then) p.then(function () { reflect(true); showHint(false); disarm(); }).catch(function () {});
    }
    function arm() {
      if (armed) return;
      armed = true;
      ["pointerup", "click", "keydown", "touchend"].forEach(function (t) { document.addEventListener(t, unlock, true); });
    }
    function tryAutoplay() {
      if (!wantsMusic) { reflect(false); return; }
      var p = music.play();
      if (p && p.then) {
        p.then(function () { reflect(true); })
         .catch(function () { reflect(false); showHint(true); arm(); }); // el navegador bloqueó el autoplay con sonido
      }
    }

    // continuar donde se quedó al cambiar de página
    var savedTime = parseFloat(store("session", "ja-music-time"));
    function seek() { if (savedTime > 0 && isFinite(music.duration) && savedTime < music.duration - 1) music.currentTime = savedTime; }
    if (music.readyState >= 1) seek(); else music.addEventListener("loadedmetadata", seek, { once: true });
    function saveTime() { store("session", "ja-music-time", String(music.currentTime || 0)); }
    window.addEventListener("pagehide", saveTime);
    music.addEventListener("timeupdate", function () { if (Math.floor(music.currentTime) % 3 === 0) saveTime(); });

    if (musicBtn) musicBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!music.paused) {
        music.pause();
        wantsMusic = false;
        store("session", "ja-music", "off");
        reflect(false);
      } else {
        wantsMusic = true;
        store("session", "ja-music", "on");
        music.play().then(function () { reflect(true); showHint(false); disarm(); }).catch(function () { reflect(false); });
      }
    });

    music.addEventListener("play", function () { reflect(true); });
    music.addEventListener("pause", function () { reflect(false); });
    // la pantalla de bienvenida aplica la elección con un clic real; sin ella se intenta el autoplay
    window.__jaApplyChoices = function (choice) {
      if (video) setVideo(!!choice.video);
      wantsMusic = !!choice.music;
      if (wantsMusic) { music.play().then(function () { reflect(true); }).catch(function () { reflect(false); }); }
      else { music.pause(); reflect(false); }
    };
    if (gateNeeded) { reflect(false); } else { tryAutoplay(); }
  }
})();
