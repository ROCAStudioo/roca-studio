/* Invitación de boda – Luz Elena & Isaac
   Sin dependencias. Constantes editables al inicio. */
(function () {
  'use strict';

  /* ===== EDITAR: constantes ===== */
  // Número de WhatsApp que recibirá las confirmaciones: código de país + número, solo dígitos.
  // Ejemplo México: "5217771234567". Mientras tenga "XXXX" el RSVP muestra "Confirmación aún no disponible".
  var WHATSAPP_NUMBER = "525526996522";
  // Fecha límite para confirmar (texto libre, p. ej. "1 de mayo de 2027"). Vacío = no se muestra.
  var CONFIRM_DEADLINE = "";
  // Boda: 17-jul-2027 14:30, hora de Ciudad de México (UTC-6 fijo, sin horario de verano).
  var WEDDING = { y: 2027, m: 7, d: 17, h: 14, min: 30 };
  var TZ_OFFSET_H = -6;
  var AUDIO_SRC = "assets/audio/siempre-te-busque.mp3";
  var COVER_SRC = "assets/photos/portada.jpg";
  /* ================================ */

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Apertura + música ---------- */
  var audio = null, audioListo = false;
  var pausaUsuario = false, pausadaPorVideo = false;
  var btnMusica = $('musica');

  function initAudio() {
    audio = new Audio();
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.6;
    audio.addEventListener('canplay', function () {
      audioListo = true;
      btnMusica.hidden = false;
    }, { once: true });
    audio.addEventListener('error', function () { audioListo = false; btnMusica.hidden = true; });
    audio.addEventListener('play', function () { setSonando(true); });
    audio.addEventListener('pause', function () { setSonando(false); });
    audio.src = AUDIO_SRC;
  }
  function setSonando(on) {
    btnMusica.classList.toggle('sonando', on);
    btnMusica.setAttribute('aria-pressed', on ? 'true' : 'false');
    btnMusica.setAttribute('aria-label', on ? 'Pausar música' : 'Reproducir música');
  }
  btnMusica.addEventListener('click', function () {
    if (!audio || !audioListo) return;
    pausadaPorVideo = false;
    if (audio.paused) { pausaUsuario = false; var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
    else { pausaUsuario = true; audio.pause(); }
  });
  initAudio();

  var apertura = $('apertura');
  function abrir() {
    apertura.classList.add('abierta');
    apertura.setAttribute('aria-hidden', 'true');
    apertura.setAttribute('inert', '');
    document.body.style.overflow = '';
    // El toque del usuario inicia la música (si el archivo existe)
    if (audio) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
    var h = $('portada'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  if (apertura) {
    document.body.style.overflow = 'hidden';
    $('abrir').addEventListener('click', abrir);
    $('abrir').focus();
  }

  /* ---------- Portada con foto opcional ---------- */
  (function () {
    var im = new Image();
    im.onload = function () {
      var h = $('portada');
      h.style.backgroundImage = 'url("' + COVER_SRC + '")';
      h.classList.add('con-foto');
    };
    im.src = COVER_SRC;
  })();

  /* ---------- Revelado al scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Cuenta regresiva ---------- */
  // Se trabaja con "hora de México" desplazando UTC por el offset fijo.
  function mexNow() { return Date.now() + TZ_OFFSET_H * 3600000; }
  var targetMx = Date.UTC(WEDDING.y, WEDDING.m - 1, WEDDING.d, WEDDING.h, WEDDING.min, 0);

  function diffCalendar(nowMx, tMx) {
    var a = new Date(nowMx), b = new Date(tMx);
    var months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
    var anchor = function (mm) {
      var y = a.getUTCFullYear(), m = a.getUTCMonth() + mm;
      var day = Math.min(a.getUTCDate(), new Date(Date.UTC(y, m + 1, 0)).getUTCDate());
      return Date.UTC(y + Math.floor(m / 12), ((m % 12) + 12) % 12, day,
        a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
    };
    if (anchor(months) > tMx) months--;
    var rest = tMx - anchor(months);
    var s = Math.floor(rest / 1000);
    return {
      meses: months,
      dias: Math.floor(s / 86400),
      horas: Math.floor(s % 86400 / 3600),
      min: Math.floor(s % 3600 / 60),
      seg: s % 60
    };
  }
  function tick() {
    var nowMx = mexNow();
    var cont = $('cuenta-regresiva'), fin = $('cuenta-fin');
    if (nowMx >= targetMx) {
      cont.hidden = true; fin.hidden = false;
      var mismoDia = new Date(nowMx).toISOString().slice(0, 10) === new Date(targetMx).toISOString().slice(0, 10);
      fin.textContent = mismoDia ? '¡Hoy es el gran día!' : '¡Gracias por acompañarnos!';
      return;
    }
    var d = diffCalendar(nowMx, targetMx);
    $('cd-meses').textContent = d.meses;
    $('cd-dias').textContent = d.dias;
    $('cd-horas').textContent = d.horas;
    $('cd-min').textContent = d.min;
    $('cd-seg').textContent = d.seg;
  }
  tick();
  setInterval(tick, 1000);
  window.__cuentaRegresiva = { diffCalendar: diffCalendar, target: targetMx };

  /* ---------- Video ---------- */
  (function () {
    var v = $('video-pedida'), marco = $('video-marco');
    if (!v) return;
    var ok = function () { marco.classList.add('tiene-video'); };
    // La música de fondo se pausa mientras suena el video y se reanuda después (solo si sonaba antes).
    v.addEventListener('play', function () {
      if (audio && !audio.paused) { pausadaPorVideo = true; audio.pause(); }
    });
    var reanudar = function () {
      if (pausadaPorVideo && !pausaUsuario && audio) { pausadaPorVideo = false; var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
    };
    v.addEventListener('pause', reanudar);
    v.addEventListener('ended', reanudar);
    v.addEventListener('loadedmetadata', ok);
    v.addEventListener('error', function () { marco.classList.remove('tiene-video'); });
    if (v.readyState >= 1) ok();
  })();

  /* ---------- Carrusel de fotos ---------- */
  // Las diapositivas se leen del HTML (#carrusel-pista > .slide); nada depende de un número fijo.
  var AUTOAVANCE_MS = 5000;
  var pista = $('carrusel-pista');
  var slides = Array.prototype.slice.call(pista.querySelectorAll('.slide'));
  var fotos = slides.map(function (s) { return s.querySelector('.foto'); });
  fotos.forEach(function (b) {
    var img = b.querySelector('img');
    var falla = function () { b.classList.add('falta'); };
    img.addEventListener('error', falla);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('loading') !== 'lazy') falla();
  });

  var carIdx = 0;
  var carrusel = $('carrusel'), carPrev = $('car-prev'), carNext = $('car-next');
  var carPie = $('car-pie'), carPuntos = $('car-puntos'), carContador = $('car-contador');
  var puntos = [];
  var pausas = { hover: false, foco: false, toque: false, visible: true, lightbox: false };
  var liveTimer = null;

  function carPosicion(i) {
    var s = slides[i];
    return s.offsetLeft - (pista.clientWidth - s.offsetWidth) / 2;
  }
  function carMarcar(i) {
    carIdx = i;
    slides.forEach(function (s, k) {
      var activa = k === i;
      s.classList.toggle('activa', activa);
      if (puntos[k]) { if (activa) puntos[k].setAttribute('aria-current', 'true'); else puntos[k].removeAttribute('aria-current'); }
    });
    carContador.textContent = (i + 1) + ' / ' + slides.length;
  }
  // delUsuario: anuncia el cambio a lectores de pantalla; en autoavance queda en "off".
  function carIr(i, delUsuario, instante) {
    var n = slides.length;
    var nuevo = (i + n) % n;
    var salto = Math.abs(nuevo - carIdx) > 1;
    pista.setAttribute('aria-live', delUsuario ? 'polite' : 'off');
    clearTimeout(liveTimer);
    if (delUsuario) liveTimer = setTimeout(function () { pista.setAttribute('aria-live', 'off'); }, 1500);
    carMarcar(nuevo);
    pista.scrollTo({ left: carPosicion(nuevo), behavior: (reduceMotion || instante || salto) ? 'auto' : 'smooth' });
  }
  function carDetectar() {
    var centro = pista.scrollLeft + pista.clientWidth / 2, mejor = 0, d = Infinity;
    slides.forEach(function (s, k) {
      var x = Math.abs(s.offsetLeft + s.offsetWidth / 2 - centro);
      if (x < d) { d = x; mejor = k; }
    });
    if (mejor !== carIdx) carMarcar(mejor);
  }

  var raf = 0;
  pista.addEventListener('scroll', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; carDetectar(); });
  }, { passive: true });

  slides.forEach(function (s, k) {
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'diapositiva');
    s.setAttribute('aria-label', (k + 1) + ' de ' + slides.length);
    fotos[k].setAttribute('aria-label', 'Ampliar foto ' + (k + 1) + ' de ' + slides.length);
    var p = document.createElement('button');
    p.type = 'button';
    p.className = 'car-punto';
    p.setAttribute('aria-label', 'Ir a la foto ' + (k + 1) + ' de ' + slides.length);
    p.addEventListener('click', function () { carIr(k, true); });
    carPuntos.appendChild(p);
    puntos.push(p);
  });
  var varias = slides.length > 1;
  carPrev.hidden = carNext.hidden = !varias;
  carPie.hidden = false;
  carPuntos.hidden = !varias;
  carMarcar(0);
  pista.scrollLeft = carPosicion(0);

  carPrev.addEventListener('click', function () { carIr(carIdx - 1, true); });
  carNext.addEventListener('click', function () { carIr(carIdx + 1, true); });
  carrusel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); carIr(carIdx - 1, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); carIr(carIdx + 1, true); }
  });
  window.addEventListener('resize', function () { pista.scrollLeft = carPosicion(carIdx); });

  // Autoavance: se pausa con mouse, foco, toque, lightbox abierto, carrusel fuera de pantalla o pestaña oculta.
  carrusel.addEventListener('mouseenter', function () { pausas.hover = true; });
  carrusel.addEventListener('mouseleave', function () { pausas.hover = false; });
  carrusel.addEventListener('focusin', function () { pausas.foco = true; });
  carrusel.addEventListener('focusout', function () { pausas.foco = false; });
  var toqueT = null;
  carrusel.addEventListener('touchstart', function () { clearTimeout(toqueT); pausas.toque = true; }, { passive: true });
  ['touchend', 'touchcancel'].forEach(function (ev) {
    carrusel.addEventListener(ev, function () { clearTimeout(toqueT); toqueT = setTimeout(function () { pausas.toque = false; }, AUTOAVANCE_MS); }, { passive: true });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { pausas.visible = en[0].isIntersecting; }, { threshold: 0.4 }).observe(carrusel);
  }
  if (varias && !reduceMotion) {
    setInterval(function () {
      if (document.hidden) return;
      for (var k in pausas) { if (k === 'visible' ? !pausas[k] : pausas[k]) return; }
      carIr(carIdx + 1, false);
    }, AUTOAVANCE_MS);
  }

  var lb = $('lightbox'), lbCont = $('lb-contenido'), lbCont2 = $('lb-contador');
  var lbIdx = 0, lbPrevFocus = null;
  function lbMostrar(i) {
    lbIdx = (i + fotos.length) % fotos.length;
    var b = fotos[lbIdx], img = b.querySelector('img');
    lbCont.textContent = '';
    if (b.classList.contains('falta')) {
      var ph = document.createElement('div');
      ph.className = 'lb-ph';
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', 'Foto ' + (lbIdx + 1) + ' pendiente de agregar');
      ph.innerHTML = b.querySelector('.ph').innerHTML;
      lbCont.appendChild(ph);
    } else {
      var im = document.createElement('img');
      im.src = img.currentSrc || img.src;
      im.alt = img.alt;
      lbCont.appendChild(im);
    }
    lbCont2.textContent = (lbIdx + 1) + ' / ' + fotos.length;
  }
  function lbAbrir(i) {
    lbPrevFocus = document.activeElement;
    lb.hidden = false;
    pausas.lightbox = true;
    document.body.style.overflow = 'hidden';
    lbMostrar(i);
    $('lb-cerrar').focus();
  }
  function lbCerrar() {
    lb.hidden = true;
    pausas.lightbox = false;
    document.body.style.overflow = '';
    carIr(lbIdx, false, true);
    // El foco vuelve a la foto en la que quedó el lightbox (que ahora es la activa del carrusel).
    if (lbPrevFocus) fotos[lbIdx].focus({ preventScroll: true });
  }
  // Clic en la foto activa abre el lightbox; en una vecina, la centra.
  fotos.forEach(function (b, i) { b.addEventListener('click', function () { if (i === carIdx) lbAbrir(i); else carIr(i, true); }); });
  $('lb-cerrar').addEventListener('click', lbCerrar);
  $('lb-prev').addEventListener('click', function () { lbMostrar(lbIdx - 1); });
  $('lb-next').addEventListener('click', function () { lbMostrar(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbCerrar(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); lbCerrar(); }
    else if (e.key === 'ArrowLeft') lbMostrar(lbIdx - 1);
    else if (e.key === 'ArrowRight') lbMostrar(lbIdx + 1);
    else if (e.key === 'Tab') {
      var f = [$('lb-cerrar'), $('lb-prev'), $('lb-next')];
      var i = f.indexOf(document.activeElement);
      e.preventDefault();
      if (e.shiftKey) f[(i <= 0 ? f.length : i) - 1].focus();
      else f[(i + 1) % f.length].focus();
    }
  });

  /* ---------- Copiar CLABE ---------- */
  (function () {
    var btn = $('copiar-clabe'), aviso = $('aviso-copia'), clabe = $('clabe');
    var t;
    function msg(s) { aviso.textContent = s; clearTimeout(t); t = setTimeout(function () { aviso.textContent = ''; }, 2500); }
    function fallback(txt) {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      return ok;
    }
    btn.addEventListener('click', function () {
      var txt = (clabe.textContent || '').trim();
      if (!txt || txt.charAt(0) === '[') { msg('La CLABE aún no está disponible'); return; }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt).then(function () { msg('Copiado'); },
          function () { msg(fallback(txt) ? 'Copiado' : 'No se pudo copiar'); });
      } else {
        msg(fallback(txt) ? 'Copiado' : 'No se pudo copiar');
      }
    });
  })();

  /* ---------- RSVP ---------- */
  (function () {
    var form = $('rsvp'), estado = $('rsvp-estado');
    if (CONFIRM_DEADLINE) {
      $('rsvp-limite').textContent = 'Por favor confirma antes del ' + CONFIRM_DEADLINE + '.';
    }
    var placeholder = /X/i.test(WHATSAPP_NUMBER) || !/^\d{10,15}$/.test(WHATSAPP_NUMBER);
    if (placeholder && window.console) {
      console.warn('[Invitación] WHATSAPP_NUMBER sigue siendo el valor de ejemplo. Edita js/main.js para activar el RSVP.');
    }
    function setErr(id, texto, campo) {
      $(id).textContent = texto || '';
      if (campo) { if (texto) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid'); }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      estado.textContent = ''; estado.className = 'estado';
      var nombre = form.nombre.value.trim();
      var asiste = form.asiste.value;
      var num = parseInt(form.num.value, 10);
      var ok = true;
      setErr('e-nombre', nombre.length < 3 ? 'Escribe tu nombre completo.' : '', form.nombre);
      if (nombre.length < 3) ok = false;
      setErr('e-asiste', asiste ? '' : 'Elige una opción.');
      if (!asiste) ok = false;
      var numMal = asiste === 'si' && (!(num >= 1) || num > 20);
      setErr('e-num', numMal ? 'Indica un número de asistentes entre 1 y 20.' : '', form.num);
      if (numMal) ok = false;
      if (!ok) { var p = form.querySelector('[aria-invalid="true"]') || form.asiste[0]; if (p && p.focus) p.focus(); return; }

      if (placeholder) {
        estado.textContent = 'Confirmación aún no disponible. Por favor, inténtalo más tarde.';
        estado.className = 'estado aviso';
        return;
      }
      var lineas = ['Hola, soy ' + nombre + '.',
        asiste === 'si' ? 'Confirmo mi asistencia a la boda de Luz Elena & Isaac (17 de julio de 2027).'
                        : 'Lamentablemente no podré asistir a la boda de Luz Elena & Isaac (17 de julio de 2027).'];
      if (asiste === 'si') lineas.push('Asistentes: ' + num);
      if (form.diet.value.trim()) lineas.push('Restricciones alimentarias: ' + form.diet.value.trim());
      if (form.msg.value.trim()) lineas.push('Mensaje: ' + form.msg.value.trim());
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lineas.join('\n'));
      window.__ultimaUrlWhatsApp = url;
      estado.textContent = 'Abriendo WhatsApp…';
      var w = window.open(url, '_blank', 'noopener');
      if (!w) window.location.href = url;
    });
  })();
})();
