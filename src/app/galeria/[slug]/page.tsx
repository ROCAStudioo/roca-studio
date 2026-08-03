"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, EyeOff, X, ChevronLeft, ChevronRight,
  Download, FolderOpen, CheckCircle, Square, Frame, Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

// Inicializar EmailJS
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_5h2gclg";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_sh5fy6o";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "kcJABHUOM-iklLOPj";

interface FotoCliente {
  id: string;
  nombre: string;
  url: string;
  thumbnail: string;
  downloadUrl: string;
}

interface SeccionGaleria {
  nombre: string;
  fotos: FotoCliente[];
}

interface ClienteData {
  nombre: string;
  evento: string;
  fecha: string;
  limiteEdicion: number;
  limiteCuadro: number;
  secciones: SeccionGaleria[];
}

export default function GaleriaCliente({ params }: { params: Promise<{ slug: string }> }) {
  const [autenticado, setAutenticado] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [lightbox, setLightbox] = useState<{ seccion: number; foto: number } | null>(null);
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionEdicion, setSeleccionEdicion] = useState<Set<string>>(new Set());
  const [seleccionCuadro, setSeleccionCuadro] = useState<Set<string>>(new Set());
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const verificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const slug = (await params).slug;
      const res = await fetch(`/api/galeria/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();

      if (res.ok) {
        setClienteData(data);
        setAutenticado(true);
      } else {
        setError(data.error || "Código incorrecto. Verifica e intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Obtener todas las fotos de la sección activa
  const fotosSeccion = clienteData?.secciones[seccionActiva]?.fotos || [];

  const toggleEdicion = (fotoId: string, fotoNombre: string) => {
    const nueva = new Set(seleccionEdicion);
    if (nueva.has(fotoId)) {
      nueva.delete(fotoId);
    } else {
      if (nueva.size >= (clienteData?.limiteEdicion || 150)) return;
      nueva.add(fotoId);
    }
    setSeleccionEdicion(nueva);
    void fotoNombre;
  };

  const toggleCuadro = (fotoId: string, fotoNombre: string) => {
    const nueva = new Set(seleccionCuadro);
    if (nueva.has(fotoId)) {
      nueva.delete(fotoId);
    } else {
      if (nueva.size >= (clienteData?.limiteCuadro || 1)) return;
      nueva.add(fotoId);
    }
    setSeleccionCuadro(nueva);
    void fotoNombre;
  };

  // Obtener nombre de foto por ID
  const getNombreFoto = (id: string) => {
    for (const seccion of clienteData?.secciones || []) {
      const foto = seccion.fotos.find((f) => f.id === id);
      if (foto) return foto.nombre;
    }
    return id;
  };

  const enviarSeleccion = async () => {
    if (!clienteData) return;

    const limiteEdicion = clienteData.limiteEdicion || 150;
    const limiteCuadro = clienteData.limiteCuadro || 1;

    if (seleccionEdicion.size === 0) {
      setErrorEnvio("Debes seleccionar al menos una foto para edición.");
      return;
    }
    if (seleccionEdicion.size > limiteEdicion) {
      setErrorEnvio(`Has seleccionado ${seleccionEdicion.size} fotos para edición. El máximo es ${limiteEdicion}. Por favor reduce tu selección.`);
      return;
    }
    if (seleccionCuadro.size > limiteCuadro) {
      setErrorEnvio(`Has seleccionado ${seleccionCuadro.size} fotos para cuadro. El máximo es ${limiteCuadro}.`);
      return;
    }

    setErrorEnvio("");
    setEnviando(true);

    const fotosEdicionNombres = Array.from(seleccionEdicion).map(getNombreFoto).join(", ");
    const fotosCuadroNombres = Array.from(seleccionCuadro).map(getNombreFoto).join(", ") || "Ninguna";

    try {
      // Enviar correo con EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          cliente_nombre: clienteData.nombre,
          evento: `${clienteData.evento} · ${clienteData.fecha}`,
          total_edicion: `${seleccionEdicion.size}/${limiteEdicion}`,
          fotos_edicion: fotosEdicionNombres,
          total_cuadro: `${seleccionCuadro.size}/${limiteCuadro}`,
          fotos_cuadro: fotosCuadroNombres,
        },
        EMAILJS_PUBLIC_KEY
      );

      setEnviado(true);

      // También abrir WhatsApp con mensaje corto de confirmación
      const msg = encodeURIComponent(
        `Hola ROCA Studio 👋 Soy ${clienteData.nombre} (${clienteData.evento}). Ya envié mi selección de ${seleccionEdicion.size} fotos por correo. ✅`
      );
      setTimeout(() => {
        window.open(`https://wa.me/522225635334?text=${msg}`, "_blank");
      }, 1000);

    } catch (err) {
      console.error("EmailJS error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setErrorEnvio(`Error al enviar: ${errorMsg}. Intenta de nuevo o contáctanos por WhatsApp.`);
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de acceso
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-10">
            <img src="/logo.png" alt="ROCA Studio" className="h-12 mx-auto" />
          </div>

          <div className="border border-white/10 p-8 md:p-10">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={24} className="text-white/60" />
            </div>
            <h1 className="text-xl font-[var(--font-heading)] text-white mb-2">Galería Privada</h1>
            <p className="text-sm text-white/50 mb-8">Ingresa tu código de acceso para ver tus fotografías.</p>

            <form onSubmit={verificarCodigo} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Código de acceso"
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-center text-lg tracking-[0.5em] focus:border-white/40 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? "Ocultar código" : "Mostrar código"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {cargando ? "Verificando..." : "Acceder"}
              </button>
            </form>
          </div>
          <p className="text-xs text-white/30 mt-6">Si no tienes tu código, contacta a ROCA Studio.</p>
        </motion.div>
      </div>
    );
  }

  // Pantalla de selección enviada
  if (enviado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl font-[var(--font-heading)] text-white mb-4">¡Selección enviada!</h2>
          <p className="text-white/60 text-sm mb-2">
            Tu selección de <strong className="text-white">{seleccionEdicion.size} fotos</strong> para edición
            {seleccionCuadro.size > 0 && ` y ${seleccionCuadro.size} para cuadro`} fue enviada correctamente.
          </p>
          <p className="text-white/40 text-xs mt-4">También se abrirá WhatsApp para que nos confirmes.</p>
          <button
            onClick={() => setEnviado(false)}
            className="mt-8 px-6 py-2.5 border border-white/20 text-white/60 text-sm hover:text-white hover:border-white/40 transition-all"
          >
            Volver a la galería
          </button>
        </motion.div>
      </div>
    );
  }

  // Galería
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 py-6 px-6 sticky top-0 bg-black/95 backdrop-blur z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <img src="/logo.png" alt="ROCA Studio" className="h-8" />
          </div>
          <div className="flex items-center gap-4">
            {modoSeleccion && (
              <span className="text-xs text-white/50">
                ✏️ {seleccionEdicion.size}/{clienteData?.limiteEdicion || 150}
                {(clienteData?.limiteCuadro || 1) > 0 && ` · 🖼️ ${seleccionCuadro.size}/${clienteData?.limiteCuadro || 1}`}
              </span>
            )}
            <button
              onClick={() => setModoSeleccion(!modoSeleccion)}
              className={`px-4 py-2 text-xs tracking-wide transition-all ${
                modoSeleccion ? "bg-white text-black" : "border border-white/20 text-white/60 hover:text-white"
              }`}
            >
              {modoSeleccion ? "Cancelar selección" : "Hacer selección"}
            </button>
            {modoSeleccion && seleccionEdicion.size > 0 && (
              <button
                onClick={enviarSeleccion}
                disabled={enviando}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                <Send size={12} />
                {enviando ? "Enviando..." : "Enviar selección"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] text-white mb-2">{clienteData?.evento}</h1>
          <p className="text-white/50 text-sm">{clienteData?.nombre} · {clienteData?.fecha}</p>

          {modoSeleccion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 border border-white/10 bg-white/5 max-w-lg mx-auto"
            >
              <p className="text-white/70 text-sm mb-2">
                <strong className="text-white">Modo selección activo</strong>
              </p>
              <p className="text-white/50 text-xs">
                ✏️ Toca una foto para seleccionarla para <strong>edición</strong> (máx. {clienteData?.limiteEdicion || 150}).
                Toca el icono 🖼️ para seleccionarla para <strong>cuadro</strong> (máx. {clienteData?.limiteCuadro || 1}).
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Error de envío */}
        {errorEnvio && (
          <div className="max-w-2xl mx-auto mb-8 p-4 border border-red-500/30 bg-red-500/10">
            <p className="text-red-400 text-sm">{errorEnvio}</p>
          </div>
        )}

        {/* Tabs */}
        {clienteData && clienteData.secciones.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {clienteData.secciones.map((seccion, index) => (
              <button
                key={seccion.nombre}
                onClick={() => setSeccionActiva(index)}
                className={`px-5 py-2 text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  seccionActiva === index ? "bg-white text-black" : "border border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <FolderOpen size={14} />
                {seccion.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Grid de fotos */}
        {clienteData && (
          <motion.div
            key={seccionActiva}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            {fotosSeccion.map((foto, index) => {
              const enEdicion = seleccionEdicion.has(foto.id);
              const enCuadro = seleccionCuadro.has(foto.id);
              return (
                <div
                  key={foto.id}
                  className="break-inside-avoid group relative overflow-hidden"
                >
                  <div
                    className={`relative cursor-pointer ${enEdicion ? "ring-2 ring-white" : ""}`}
                    onClick={() => {
                      if (modoSeleccion) {
                        toggleEdicion(foto.id, foto.nombre);
                      } else {
                        setLightbox({ seccion: seccionActiva, foto: index });
                      }
                    }}
                  >
                    <img
                      src={foto.thumbnail}
                      alt={foto.nombre}
                      className={`w-full object-cover transition-all duration-300 ${
                        modoSeleccion ? "group-hover:opacity-80" : "group-hover:scale-105"
                      } ${enEdicion ? "opacity-70" : ""}`}
                      loading="lazy"
                    />

                    {/* Overlay selección edición */}
                    {modoSeleccion && (
                      <div className="absolute top-2 left-2">
                        {enEdicion ? (
                          <CheckCircle size={20} className="text-white drop-shadow-lg" />
                        ) : (
                          <Square size={20} className="text-white/50" />
                        )}
                      </div>
                    )}

                    {/* Botón cuadro */}
                    {modoSeleccion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCuadro(foto.id, foto.nombre);
                        }}
                        className={`absolute top-2 right-2 p-1 rounded transition-all ${
                          enCuadro ? "text-yellow-400" : "text-white/40 hover:text-white/70"
                        }`}
                        title="Seleccionar para cuadro"
                      >
                        <Frame size={18} />
                      </button>
                    )}

                    {/* Etiquetas */}
                    {enEdicion && <div className="absolute bottom-8 left-2 text-xs bg-white text-black px-1.5 py-0.5">EDICIÓN</div>}
                    {enCuadro && <div className="absolute bottom-8 right-2 text-xs bg-yellow-400 text-black px-1.5 py-0.5">CUADRO</div>}

                    {!modoSeleccion && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Download size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                  <div className="bg-black/80 px-2 py-1.5">
                    <p className="text-xs text-white/60 truncate">{foto.nombre}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Botón descargar todo */}
        {!modoSeleccion && (
          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              <Download size={16} />
              Descargar todas las fotos
            </a>
          </div>
        )}

        {/* Panel de selección flotante */}
        {modoSeleccion && (seleccionEdicion.size > 0 || seleccionCuadro.size > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black border border-white/20 px-6 py-4 flex items-center gap-6 shadow-2xl"
          >
            <div className="text-sm text-white">
              <span className="text-white/50">Seleccionadas: </span>
              <span>✏️ {seleccionEdicion.size}/{clienteData?.limiteEdicion || 150}</span>
              <span className="mx-2 text-white/30">·</span>
              <span>🖼️ {seleccionCuadro.size}/{clienteData?.limiteCuadro || 1}</span>
            </div>
            <button
              onClick={enviarSeleccion}
              disabled={enviando || seleccionEdicion.size === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              <Send size={14} />
              {enviando ? "Enviando..." : "Enviar selección"}
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && clienteData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white/70 hover:text-white z-10" aria-label="Cerrar">
              <X size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); const fotos = clienteData.secciones[lightbox.seccion].fotos; setLightbox({ seccion: lightbox.seccion, foto: (lightbox.foto - 1 + fotos.length) % fotos.length }); }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white z-10"
              aria-label="Anterior"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); const fotos = clienteData.secciones[lightbox.seccion].fotos; setLightbox({ seccion: lightbox.seccion, foto: (lightbox.foto + 1) % fotos.length }); }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white z-10"
              aria-label="Siguiente"
            >
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={`${lightbox.seccion}-${lightbox.foto}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={clienteData.secciones[lightbox.seccion].fotos[lightbox.foto].url}
              alt={clienteData.secciones[lightbox.seccion].fotos[lightbox.foto].nombre}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <p className="text-white/70 text-sm">{clienteData.secciones[lightbox.seccion].fotos[lightbox.foto].nombre}</p>
              <a
                href={clienteData.secciones[lightbox.seccion].fotos[lightbox.foto].downloadUrl}
                download
                className="flex items-center gap-2 px-4 py-2 border border-white/30 text-white text-xs tracking-wide hover:bg-white hover:text-black transition-all"
              >
                <Download size={14} />
                Descargar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
