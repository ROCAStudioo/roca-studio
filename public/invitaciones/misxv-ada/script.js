/**
 * =============================================
 * INVITACIÓN DIGITAL XV AÑOS
 * Experiencia inmersiva con efectos sincronizados
 * =============================================
 */

// ========== CONFIGURACIÓN DE EVENTOS SINCRONIZADOS ==========
// 
// Agrega o modifica eventos aquí. Cada evento se dispara en el segundo indicado.
// Acciones disponibles:
//   - "flash"        → Destello blanco de pantalla
//   - "resplandor"   → Resplandor radial de colores
//   - "zoom"         → Zoom pulsante del video
//   - "brillo"       → Cambio temporal de brillo (cian)
//   - "particulas"   → Explosión de partículas
//   - "vibracion"    → Vibración corta (Android) / sacudida visual (iPhone)
//   - "sacudida"     → Sacudida de pantalla
//   - "impacto"      → Combinación flash + vibración + sacudida
//
const eventos = [
    { tiempo: 3.0, accion: "resplandor" },
    { tiempo: 5.2, accion: "flash" },
    { tiempo: 5.2, accion: "vibracion" },
    { tiempo: 8.0, accion: "zoom" },
    { tiempo: 10.5, accion: "zoom" },
    { tiempo: 13.0, accion: "brillo" },
    { tiempo: 15.0, accion: "impacto" },
    { tiempo: 18.0, accion: "sacudida" },
    { tiempo: 20.0, accion: "flash" },
    { tiempo: 20.0, accion: "vibracion" },
    { tiempo: 23.0, accion: "brillo" },
    { tiempo: 25.0, accion: "resplandor" },
    { tiempo: 28.0, accion: "zoom" },
    { tiempo: 30.0, accion: "flash" },
    { tiempo: 30.0, accion: "vibracion" },
];

// ========== CONFIGURACIÓN DE VIBRACIÓN AL RITMO ==========
//
// SISTEMA POR BPM: El teléfono vibra en cada beat de la canción.
// Mucho más confiable que Web Audio API en móviles.
//
// bpm: Los beats por minuto de tu canción. 
//      Para encontrar el BPM de tu canción busca "BPM finder" en Google
//      o usa https://www.beatsperminuteonline.com/ tocando al ritmo.
//
// inicioBeats: Segundo exacto donde empieza el primer beat fuerte de la canción.
//              Escucha tu canción y pon el segundo donde cae el primer golpe de bombo.
//
// finBeats: Segundo donde quieres que dejen de vibrar (por si al final es más suave).
//           Pon un número mayor a la duración del video para que vibre siempre.
//
// intensidad: Duración en ms de cada vibración (40-100 recomendado).
//
// patron: "simple" = un pulso por beat, "doble" = dos pulsos rápidos por beat.
//
// activar: true/false para activar/desactivar la vibración al ritmo.
//
const configRitmo = {
    activar: true,
    bpm: 100,           // ← Dancing Queen de ABBA es ~100 BPM
    inicioBeats: 0.0,   // ← Segundo donde empieza el primer beat
    finBeats: 999,      // ← Segundo donde dejan de vibrar (999 = siempre)
    intensidad: 50,     // ← ms de cada vibración (Android)
    patron: "simple",   // ← "simple" o "doble"
    pulsoVisual: true,  // ← Micro-flash visual en cada beat (todos los dispositivos)
};

// ========== ELEMENTOS DEL DOM ==========
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaPrincipal = document.getElementById('pantalla-principal');
const pantallaFinal = document.getElementById('pantalla-final');
const btnPausa = document.getElementById('btn-pausa');
const iconoPausa = document.getElementById('icono-pausa');
const video = document.getElementById('video-principal');
const capaEfectos = document.getElementById('capa-efectos');
const canvasParticulas = document.getElementById('canvas-particulas');
const ctx = canvasParticulas.getContext('2d');

// ========== ESTADO ==========
let estaPausado = false;
let eventosEjecutados = new Set();
let animacionParticulasId = null;
let particulas = [];

// Estado del sistema de vibración al ritmo (BPM)
let intervaloRitmo = null;

// ========== INICIALIZACIÓN ==========
function init() {
    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    iniciarSlider();
    crearDestellosInicio();
    btnPausa.addEventListener('click', togglePausa);
    video.addEventListener('timeupdate', verificarEventos);
    video.addEventListener('ended', mostrarPantallaFinal);

    // iOS: Forzar reproducción del video de portada al primer toque
    // Si autoplay muted falla (Low Power Mode, configuración Safari, etc.)
    const videoPortada = document.getElementById('video-portada');
    if (videoPortada && videoPortada.paused) {
        const forzarPortada = () => {
            if (videoPortada.paused) {
                videoPortada.play().catch(() => {});
            }
            document.removeEventListener('touchstart', forzarPortada);
        };
        // Dar un momento para que el autoplay intente funcionar
        setTimeout(() => {
            if (videoPortada.paused) {
                document.addEventListener('touchstart', forzarPortada, { once: true });
            }
        }, 500);
    }
}

// ========== SLIDER DESLIZABLE ==========
function iniciarSlider() {
    const thumb = document.getElementById('slider-thumb');
    const track = document.querySelector('.slider-track');
    const container = document.getElementById('slider-abrir');
    
    if (!thumb || !track) return;

    let arrastrando = false;
    let startX = 0;
    let currentX = 0;
    const minLeft = 4;
    let videoDesbloqueado = false;
    
    function getMaxLeft() {
        return track.offsetWidth - thumb.offsetWidth - 4;
    }

    function iniciarArrastre(e) {
        arrastrando = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX) - currentX;
        thumb.style.transition = 'none';
        
        // iOS: Desbloquear el video en el PRIMER toque del usuario.
        // play() + pause() inmediato "registra" el video como permitido por el usuario.
        if (!videoDesbloqueado) {
            videoDesbloqueado = true;
            video.muted = true;
            video.play().then(() => {
                video.pause();
                video.currentTime = 0;
                video.muted = false;
            }).catch(() => {});
        }
    }

    function moverArrastre(e) {
        if (!arrastrando) return;
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let newX = clientX - startX;
        const maxLeft = getMaxLeft();
        
        // Limitar el movimiento
        newX = Math.max(0, Math.min(newX, maxLeft));
        currentX = newX;
        
        thumb.style.left = (minLeft + newX) + 'px';
    }

    function finArrastre() {
        if (!arrastrando) return;
        arrastrando = false;
        
        const maxLeft = getMaxLeft();
        const porcentaje = currentX / maxLeft;
        
        thumb.style.transition = 'left 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
        
        // Si llegó al 85% o más, completar el slide
        if (porcentaje >= 0.85) {
            thumb.style.left = (minLeft + maxLeft) + 'px';
            track.classList.add('completado');
            // Disparar la apertura inmediatamente (necesario para iOS)
            abrirInvitacion();
        } else {
            // Regresar al inicio
            thumb.style.left = minLeft + 'px';
            currentX = 0;
        }
    }

    // Touch events (móvil)
    thumb.addEventListener('touchstart', iniciarArrastre, { passive: true });
    document.addEventListener('touchmove', moverArrastre, { passive: false });
    document.addEventListener('touchend', finArrastre);

    // Mouse events (desktop)
    thumb.addEventListener('mousedown', iniciarArrastre);
    document.addEventListener('mousemove', moverArrastre);
    document.addEventListener('mouseup', finArrastre);
}

// ========== DESTELLOS DE LA PANTALLA DE INICIO ==========
function crearDestellosInicio() {
    const contenedor = document.getElementById('destellos-inicio');
    if (!contenedor) return;
    const colores = ['#d4a574', '#f4a4c0', '#c77dba', '#f0d5a8', '#ffb6c1'];
    
    for (let i = 0; i < 25; i++) {
        const destello = document.createElement('div');
        destello.classList.add('destello');
        destello.style.left = Math.random() * 100 + '%';
        destello.style.top = Math.random() * 100 + '%';
        destello.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        destello.style.animationDelay = Math.random() * 3 + 's';
        destello.style.animationDuration = (2 + Math.random() * 3) + 's';
        destello.style.width = (3 + Math.random() * 5) + 'px';
        destello.style.height = destello.style.width;
        contenedor.appendChild(destello);
    }
}

// ========== ABRIR INVITACIÓN ==========
function abrirInvitacion() {
    const loaderVideo = document.getElementById('loader-video');

    // Inicializar haptic iOS en el contexto de interacción del usuario
    iniciarHapticIOS();

    // El video ya fue "desbloqueado" en el touchstart del slider.
    // Ahora solo necesitamos hacer play.
    video.play().then(() => {
        loaderVideo.classList.add('oculto');
    }).catch(() => {
        // Si falla por falta de datos, esperar
        loaderVideo.classList.remove('oculto');
        video.addEventListener('canplay', function onReady() {
            video.removeEventListener('canplay', onReady);
            video.play().then(() => {
                loaderVideo.classList.add('oculto');
            }).catch(() => {
                // Último recurso
                loaderVideo.innerHTML = '<button class="btn-play-manual" onclick="forzarPlay()">▶ Toca para ver</button>';
            });
        });
    });

    // Transición visual
    pantallaInicio.style.transition = 'opacity 0.8s ease';
    pantallaInicio.style.opacity = '0';
    
    setTimeout(() => {
        pantallaInicio.classList.add('oculto');
        pantallaPrincipal.classList.add('visible');
    }, 800);
}

// Función de último recurso si iOS bloquea completamente
function forzarPlay() {
    const loaderVideo = document.getElementById('loader-video');
    video.play().then(() => {
        loaderVideo.classList.add('oculto');
    }).catch(() => {});
}

// Ocultar loader cuando el video realmente reproduce frames
video.addEventListener('playing', () => {
    const loaderVideo = document.getElementById('loader-video');
    if (loaderVideo) loaderVideo.classList.add('oculto');
});

// Mostrar loader si el video se congela (buffering)
video.addEventListener('waiting', () => {
    const loaderVideo = document.getElementById('loader-video');
    if (loaderVideo && !estaPausado) loaderVideo.classList.remove('oculto');
});

// ========== PAUSA / REPRODUCIR ==========
function togglePausa() {
    if (estaPausado) {
        video.play();
        iconoPausa.textContent = '❚❚';
        estaPausado = false;
        // El ritmo se reanuda automáticamente con el evento 'playing'
    } else {
        video.pause();
        iconoPausa.textContent = '▶';
        estaPausado = true;
        // Pausar vibración al ritmo
        detenerVibracionRitmo();
    }
}

// ========== SINCRONIZACIÓN DE EVENTOS ==========
function verificarEventos() {
    const tiempoActual = video.currentTime;
    
    eventos.forEach((evento, index) => {
        // Tolerancia de 0.3 segundos para la sincronización
        if (!eventosEjecutados.has(index) && 
            Math.abs(tiempoActual - evento.tiempo) < 0.3) {
            eventosEjecutados.add(index);
            ejecutarAccion(evento.accion);
        }
    });
}

// ========== EJECUTAR ACCIONES ==========
function ejecutarAccion(accion) {
    switch (accion) {
        case 'flash':
            efectoFlash();
            break;
        case 'resplandor':
            efectoResplandor();
            break;
        case 'zoom':
            efectoZoom();
            break;
        case 'brillo':
            efectoBrillo();
            break;
        case 'particulas':
            efectoParticulas();
            break;
        case 'vibracion':
            vibrarFuerte();
            efectoSacudida(); // Alternativa visual para iPhone
            break;
        case 'sacudida':
            efectoSacudida();
            vibrar(200);
            break;
        case 'impacto':
            efectoFlash();
            efectoSacudida();
            vibrarImpacto();
            break;
        default:
            console.log('Acción no reconocida:', accion);
    }
}

// ========== EFECTOS VISUALES ==========

/** Flash - Destello blanco */
function efectoFlash() {
    const flash = document.createElement('div');
    flash.classList.add('efecto-flash');
    capaEfectos.appendChild(flash);
    
    setTimeout(() => flash.remove(), 350);
}

/** Resplandor - Gradiente radial animado */
function efectoResplandor() {
    const resplandor = document.createElement('div');
    resplandor.classList.add('efecto-resplandor');
    capaEfectos.appendChild(resplandor);
    
    setTimeout(() => resplandor.remove(), 850);
}

/** Zoom - Pulsación de escala en el video */
function efectoZoom() {
    video.style.animation = 'zoomPulse 0.6s ease-out';
    setTimeout(() => {
        video.style.animation = '';
    }, 650);
}

/** Brillo - Cambio temporal de brillo */
function efectoBrillo() {
    const brillo = document.createElement('div');
    brillo.classList.add('efecto-brillo');
    capaEfectos.appendChild(brillo);
    
    setTimeout(() => brillo.remove(), 550);
}

/** Sacudida - Movimiento rápido de pantalla */
function efectoSacudida() {
    const container = document.getElementById('video-container');
    container.classList.add('efecto-sacudida');
    
    setTimeout(() => {
        container.classList.remove('efecto-sacudida');
    }, 500);
}

// ========== SISTEMA DE PARTÍCULAS (Canvas) ==========

function ajustarCanvas() {
    canvasParticulas.width = window.innerWidth;
    canvasParticulas.height = window.innerHeight;
}

function efectoParticulas() {
    const colores = ['#d4a574', '#f4a4c0', '#c77dba', '#f0d5a8', '#ffb6c1', '#ffffff'];
    const centroX = canvasParticulas.width / 2;
    const centroY = canvasParticulas.height / 2;
    
    // Crear partículas desde el centro
    for (let i = 0; i < 60; i++) {
        const angulo = (Math.PI * 2 / 60) * i + (Math.random() * 0.5);
        const velocidad = 3 + Math.random() * 6;
        
        particulas.push({
            x: centroX,
            y: centroY,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad,
            vida: 1,
            decay: 0.015 + Math.random() * 0.01,
            radio: 2 + Math.random() * 4,
            color: colores[Math.floor(Math.random() * colores.length)]
        });
    }
    
    if (!animacionParticulasId) {
        animarParticulas();
    }
}

function animarParticulas() {
    ctx.clearRect(0, 0, canvasParticulas.width, canvasParticulas.height);
    
    particulas.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravedad suave
        p.vida -= p.decay;
        
        if (p.vida <= 0) {
            particulas.splice(index, 1);
            return;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio * p.vida, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.vida;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
    
    if (particulas.length > 0) {
        animacionParticulasId = requestAnimationFrame(animarParticulas);
    } else {
        animacionParticulasId = null;
    }
}

// ========== VIBRACIÓN (Android + iOS) — SISTEMA MULTI-CAPA ==========
//
// PROBLEMA: iOS Safari NO soporta navigator.vibrate().
// El truco del <input type="checkbox" switch> (Safari 17.4+) solo funciona
// dentro del contexto de un click real del usuario (expira en ~1s en iOS 18.4+).
// 
// SOLUCIÓN MULTI-CAPA:
// 1. Haptic via checkbox switch (funciona en clicks directos del usuario)
// 2. Sub-bass AudioContext (20-40Hz) que hace vibrar FÍSICAMENTE el altavoz
//    del iPhone cuando el volumen está alto — esto funciona SIEMPRE sin
//    necesitar interacción porque el AudioContext ya se desbloqueó al tocar "Abrir"
// 3. navigator.vibrate() para Android
//
// La capa de sub-bass es la más confiable para iOS durante la reproducción del video,
// porque una vez que el AudioContext se desbloquea con un click, puede generar
// sonido (y vibración física del altavoz) indefinidamente.
//
// El usuario ya tiene el volumen alto (se le pide al inicio), así que el sub-bass
// a frecuencias de 20-40Hz es prácticamente inaudible pero genera una vibración 
// física real y perceptible en la mano.

// Detectar si es iOS
const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// ========== CAPA 1: HAPTIC VIA CHECKBOX SWITCH (iOS Safari 17.4+) ==========
/**
 * Dispara UN haptic tap. Crea un label > input[switch], click, destruye.
 * Solo funciona dentro de contexto de interacción del usuario (click).
 */
function hapticIOS() {
    try {
        const labelEl = document.createElement("label");
        labelEl.setAttribute("aria-hidden", "true");
        labelEl.style.display = "none";

        const inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.setAttribute("switch", "");
        labelEl.appendChild(inputEl);

        document.head.appendChild(labelEl);
        labelEl.click();
        document.head.removeChild(labelEl);
    } catch(e) {}
}

// ========== CAPA 2: SUB-BASS AUDIO (VIBRACIÓN FÍSICA DEL ALTAVOZ) ==========
/**
 * Genera un pulso de sub-bass ultracorto (20-40Hz) usando Web Audio API.
 * A estas frecuencias el sonido es casi inaudible pero produce una vibración
 * física real que se siente en la mano al sostener el teléfono.
 * 
 * Funciona porque:
 * - El AudioContext se desbloquea una sola vez con el click de "Abrir Invitación"
 * - Una vez desbloqueado, puede generar audio indefinidamente sin más interacción
 * - El video ya tiene audio reproduciéndose, así que el audio context está activo
 * - Frecuencias de 20-40Hz mueven el altavoz sin generar sonido audible notable
 */
let audioCtx = null;

function iniciarAudioHaptic() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Desbloquear inmediatamente con un buffer vacío
        const buffer = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
    } catch(e) {
        console.log('AudioContext no disponible:', e);
    }
}

/**
 * Genera un pulso sub-bass que vibra físicamente el altavoz.
 * @param {number} duracion - Duración en ms (30-150 recomendado)
 * @param {number} frecuencia - Hz (20-40 para máxima vibración física, mínimo sonido audible)
 * @param {number} volumen - 0 a 1 (0.8-1.0 para sentir la vibración)
 */
function pulsoSubBass(duracion = 60, frecuencia = 25, volumen = 0.9) {
    if (!audioCtx) return;
    
    try {
        // Reanudar si está suspendido
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscilador = audioCtx.createOscillator();
        const ganancia = audioCtx.createGain();
        
        oscilador.type = 'sine';
        oscilador.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
        
        // Envelope: ataque rápido, decay natural
        ganancia.gain.setValueAtTime(0, audioCtx.currentTime);
        ganancia.gain.linearRampToValueAtTime(volumen, audioCtx.currentTime + 0.005); // 5ms attack
        ganancia.gain.linearRampToValueAtTime(volumen * 0.7, audioCtx.currentTime + (duracion / 2000));
        ganancia.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (duracion / 1000)); // fade out
        
        oscilador.connect(ganancia);
        ganancia.connect(audioCtx.destination);
        
        oscilador.start(audioCtx.currentTime);
        oscilador.stop(audioCtx.currentTime + (duracion / 1000) + 0.01);
    } catch(e) {}
}

/**
 * Pulso de impacto fuerte — usa frecuencia más baja y más duración
 */
function pulsoSubBassImpacto() {
    pulsoSubBass(100, 20, 1.0);
    // Segundo golpe más suave
    setTimeout(() => pulsoSubBass(60, 30, 0.7), 120);
}

// ========== CAPA 3: ZONA TÁCTIL PARA RE-VALIDAR INTERACCIÓN (iOS) ==========
/**
 * Crea una zona invisible que captura toques del usuario.
 * Cada toque renueva el "contexto de interacción" de iOS, permitiendo
 * que el truco del checkbox switch funcione durante unos segundos más.
 * 
 * El usuario naturalmente toca la pantalla al ver el video (sostener el teléfono),
 * así que esto captura esos toques accidentales.
 */
let ultimoToqueUsuario = 0;

function crearZonaTactil() {
    // En vez de una capa bloqueante, usamos event listeners en el document
    // para detectar cualquier toque del usuario sin interferir con la UI.
    document.addEventListener('touchstart', () => {
        ultimoToqueUsuario = Date.now();
        hapticIOS();
    }, { passive: true });
    
    document.addEventListener('touchmove', () => {
        ultimoToqueUsuario = Date.now();
    }, { passive: true });
    
    document.addEventListener('pointerdown', () => {
        ultimoToqueUsuario = Date.now();
    }, { passive: true });
}

// ========== INICIALIZACIÓN DEL SISTEMA ==========
function iniciarHapticIOS() {
    // Inicializar AudioContext (se desbloquea con este click del usuario)
    iniciarAudioHaptic();
    
    // Crear zona táctil para mantener contexto de interacción
    if (esIOS) {
        crearZonaTactil();
    }
    
    // Disparar un haptic inicial para confirmar que funciona
    hapticIOS();
}

// ========== FUNCIONES PÚBLICAS DE VIBRACIÓN ==========

/**
 * Vibrar el dispositivo — funciona en Android Y iPhone.
 * - Android: usa navigator.vibrate()
 * - iPhone: usa sub-bass (siempre funciona) + haptic switch (si hay contexto de interacción)
 * @param {number} tiempo - Duración en milisegundos
 */
function vibrar(tiempo) {
    // Android
    if (navigator.vibrate) {
        try { navigator.vibrate(tiempo); } catch (e) {}
    }
    
    // iOS: sub-bass siempre + haptic switch si el toque fue reciente
    if (esIOS) {
        pulsoSubBass(Math.min(tiempo, 80), 25, 0.85);
        // Solo intentar haptic si hubo interacción reciente (< 1s)
        if (Date.now() - ultimoToqueUsuario < 1000) {
            hapticIOS();
        }
    }
}

/**
 * Vibración fuerte
 */
function vibrarFuerte() {
    if (navigator.vibrate) {
        try { navigator.vibrate([80, 30, 80, 30, 120]); } catch (e) {}
    }
    if (esIOS) {
        pulsoSubBass(80, 20, 1.0);
        setTimeout(() => pulsoSubBass(60, 28, 0.8), 110);
        setTimeout(() => pulsoSubBass(80, 22, 0.9), 220);
        if (Date.now() - ultimoToqueUsuario < 1000) {
            hapticIOS();
            setTimeout(() => hapticIOS(), 110);
        }
    }
}

/**
 * Vibración de impacto — la más intensa
 */
function vibrarImpacto() {
    if (navigator.vibrate) {
        try { navigator.vibrate([150, 40, 100, 40, 200]); } catch (e) {}
    }
    if (esIOS) {
        pulsoSubBassImpacto();
        setTimeout(() => pulsoSubBass(80, 22, 0.9), 240);
        if (Date.now() - ultimoToqueUsuario < 1000) {
            hapticIOS();
            setTimeout(() => hapticIOS(), 100);
            setTimeout(() => hapticIOS(), 200);
        }
    }
}

/**
 * Vibrar con un patrón personalizado.
 * @param {number[]} patron - Array de tiempos [vibrar, pausa, vibrar, pausa...]
 */
function vibrarPatron(patron) {
    if (navigator.vibrate) {
        try { navigator.vibrate(patron); } catch (e) {}
    }
    if (esIOS) {
        let delay = 0;
        for (let i = 0; i < patron.length; i += 2) {
            const d = delay;
            const dur = patron[i] || 50;
            setTimeout(() => pulsoSubBass(Math.min(dur, 100), 25, 0.85), d);
            delay += (patron[i] || 0) + (patron[i + 1] || 0);
        }
        if (Date.now() - ultimoToqueUsuario < 1000) {
            hapticIOS();
        }
    }
}

// ========== VIBRACIÓN AL RITMO (Sistema BPM) ==========
/**
 * Inicia un intervalo que vibra en cada beat según los BPM configurados.
 * - Android: usa navigator.vibrate()
 * - iPhone: usa un pulso visual + audio sub-bass que simula impacto
 */
function iniciarVibracionRitmo() {
    // Si ya hay un intervalo corriendo, no crear otro
    if (intervaloRitmo) return;

    // Calcular milisegundos por beat: 60000 / BPM
    const msPorBeat = 60000 / configRitmo.bpm;

    intervaloRitmo = setInterval(() => {
        // Solo vibrar si el video está dentro del rango configurado
        const tiempo = video.currentTime;
        if (tiempo >= configRitmo.inicioBeats && tiempo <= configRitmo.finBeats && !estaPausado) {
            if (configRitmo.patron === "doble") {
                vibrar(configRitmo.intensidad);
                setTimeout(() => vibrar(configRitmo.intensidad), configRitmo.intensidad + 30);
            } else {
                vibrar(configRitmo.intensidad);
            }

            // Efecto visual de pulso en cada beat
            if (configRitmo.pulsoVisual) {
                pulsoBeat();
            }
        }
    }, msPorBeat);
}

/**
 * Detiene la vibración al ritmo.
 */
function detenerVibracionRitmo() {
    if (intervaloRitmo) {
        clearInterval(intervaloRitmo);
        intervaloRitmo = null;
    }
    // Cancelar cualquier vibración en curso (Android)
    if ('vibrate' in navigator) {
        try { navigator.vibrate(0); } catch(e) {}
    }
}

// ========== PULSO VISUAL POR BEAT ==========
/**
 * Crea un micro-flash en cada beat para reforzar el ritmo visualmente.
 */
function pulsoBeat() {
    const pulso = document.createElement('div');
    pulso.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 0%, rgba(244, 164, 192, 0.1) 40%, transparent 70%);
        pointer-events: none;
        z-index: 650;
        animation: pulsoBeatAnim 0.25s ease-out forwards;
    `;
    capaEfectos.appendChild(pulso);
    setTimeout(() => pulso.remove(), 270);
}

// ========== PANTALLA FINAL ==========
function mostrarPantallaFinal() {
    // Detener vibración al ritmo
    detenerVibracionRitmo();
    
    // Mostrar pantalla final con animación
    pantallaFinal.classList.remove('oculto');
    
    // Vibración de celebración más intensa
    vibrarPatron([150, 50, 150, 50, 100, 50, 300]);

    // Reproducir canción favorita automáticamente
    const audioCancion = document.getElementById('audio-cancion');
    const btnCancion = document.getElementById('btn-cancion');
    audioCancion.play().then(() => {
        btnCancion.textContent = '❚❚';
        cancionReproduciendo = true;
    }).catch(() => {});
}

// ========== REPETIR INVITACIÓN ==========
function repetirInvitacion() {
    // Detener canción favorita si está reproduciéndose
    const audioCancion = document.getElementById('audio-cancion');
    const btnCancion = document.getElementById('btn-cancion');
    if (cancionReproduciendo) {
        audioCancion.pause();
        audioCancion.currentTime = 0;
        btnCancion.textContent = '▶';
        cancionReproduciendo = false;
    }

    // Ocultar pantalla final
    pantallaFinal.classList.add('oculto');
    
    // Reiniciar video
    video.currentTime = 0;
    video.play().catch(() => {});
    
    // Reiniciar eventos sincronizados
    eventosEjecutados.clear();
    
    // Reanudar vibración al ritmo
    estaPausado = false;
    iconoPausa.textContent = '❚❚';
    if (configRitmo.activar) {
        iniciarVibracionRitmo();
    }
}

// ========== EFECTO AL CONFIRMAR ASISTENCIA ==========
function efectoConfirmar(e) {
    e.preventDefault();
    
    // Vibración de celebración
    vibrarImpacto();
    
    // Flash/resplandor dorado
    const resplandor = document.createElement('div');
    resplandor.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: radial-gradient(circle at center, rgba(212, 165, 116, 0.5) 0%, rgba(244, 164, 192, 0.3) 40%, transparent 70%);
        pointer-events: none;
        z-index: 900;
        animation: resplandorAnim 0.8s ease-out forwards;
    `;
    document.body.appendChild(resplandor);
    setTimeout(() => resplandor.remove(), 850);
    
    // Abrir WhatsApp después del efecto
    const url = document.getElementById('btn-whatsapp').href;
    setTimeout(() => {
        window.open(url, '_blank');
    }, 600);
}

// ========== MODAL DE UBICACIÓN CON VIDEO ==========
/**
 * Configuración de ubicaciones.
 * Cambia los videos y enlaces de Maps aquí.
 */
const ubicaciones = {
    ceremonia: {
        video: "video_ceremonia_ligero.mp4",
        audio: "audio_ceremonia.mp3",
        maps: "https://maps.app.goo.gl/C9DGnAjW1Uki7DWZ7"
    },
    recepcion: {
        video: "video_recepcion_ligero.mp4",
        audio: null,
        maps: "https://maps.app.goo.gl/pQ1tcR1GEeYbvkZP8"
    }
};

let audioUbicacion = null;

function abrirModalUbicacion(tipo) {
    const modal = document.getElementById('modal-ubicacion');
    const videoEl = document.getElementById('video-ubicacion');
    const btnMaps = document.getElementById('btn-maps');
    
    const config = ubicaciones[tipo];
    if (!config) return;
    
    // Configurar video y enlace
    videoEl.src = config.video;
    btnMaps.href = config.maps;
    
    // Reproducir audio si existe
    if (config.audio) {
        audioUbicacion = new Audio(config.audio);
        audioUbicacion.loop = true;
        audioUbicacion.play().catch(() => {});
    }
    
    // Mostrar modal y reproducir video
    modal.classList.remove('oculto');
    videoEl.play().catch(() => {});
}

function cerrarModalUbicacion() {
    const modal = document.getElementById('modal-ubicacion');
    const videoEl = document.getElementById('video-ubicacion');
    
    // Pausar y limpiar video
    videoEl.pause();
    videoEl.src = '';
    
    // Detener audio
    if (audioUbicacion) {
        audioUbicacion.pause();
        audioUbicacion.currentTime = 0;
        audioUbicacion = null;
    }
    
    // Ocultar modal
    modal.classList.add('oculto');
}

// ========== ARRANQUE ==========
document.addEventListener('DOMContentLoaded', init);

// ========== CANCIÓN FAVORITA ==========
let cancionReproduciendo = false;

function toggleCancion() {
    const audio = document.getElementById('audio-cancion');
    const btn = document.getElementById('btn-cancion');
    
    if (cancionReproduciendo) {
        audio.pause();
        btn.textContent = '▶';
        cancionReproduciendo = false;
    } else {
        audio.play().catch(() => {});
        btn.textContent = '❚❚';
        cancionReproduciendo = true;
    }
}

// ========== CUENTA REGRESIVA ==========
function iniciarCuentaRegresiva() {
    const fechaEvento = new Date('2026-08-08T13:00:00').getTime();
    
    function actualizar() {
        const ahora = new Date().getTime();
        const diff = fechaEvento - ahora;
        
        if (diff <= 0) {
            document.getElementById('cuenta-dias').textContent = '0';
            document.getElementById('cuenta-horas').textContent = '0';
            document.getElementById('cuenta-minutos').textContent = '0';
            document.getElementById('cuenta-segundos').textContent = '0';
            return;
        }
        
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('cuenta-dias').textContent = dias;
        document.getElementById('cuenta-horas').textContent = horas;
        document.getElementById('cuenta-minutos').textContent = minutos;
        document.getElementById('cuenta-segundos').textContent = segundos;
    }
    
    actualizar();
    setInterval(actualizar, 1000);
}

// Iniciar cuenta regresiva cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciarCuentaRegresiva);

// ========== GALERÍA ==========
function verFoto(img) {
    const ampliada = document.getElementById('foto-ampliada');
    document.getElementById('foto-ampliada-img').src = img.src;
    ampliada.classList.remove('oculto');
}

function cerrarFoto() {
    document.getElementById('foto-ampliada').classList.add('oculto');
}

// ========== SINCRONIZACIÓN RITMO CON ESTADO REAL DEL VIDEO ==========
// Solo vibrar/pulsar cuando el video está REALMENTE reproduciéndose.
// Esto evita desfase si el video tarda en cargar o se congela por buffering.

video.addEventListener('playing', () => {
    // El video está reproduciéndose de verdad
    if (configRitmo.activar && !intervaloRitmo && !estaPausado) {
        iniciarVibracionRitmo();
    }
});

video.addEventListener('waiting', () => {
    // El video se congeló (buffering) — pausar el ritmo
    detenerVibracionRitmo();
});

video.addEventListener('stalled', () => {
    // El video no recibe datos — pausar el ritmo
    detenerVibracionRitmo();
});
