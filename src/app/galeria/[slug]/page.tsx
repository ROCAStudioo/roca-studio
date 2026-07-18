"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, X, ChevronLeft, ChevronRight, Download, FolderOpen } from "lucide-react";

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

export default function GaleriaCliente({ params }: { params: Promise<{ slug: string }> }) {
  const [autenticado, setAutenticado] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [clienteData, setClienteData] = useState<{
    nombre: string;
    evento: string;
    fecha: string;
    secciones: SeccionGaleria[];
  } | null>(null);
  const [lightbox, setLightbox] = useState<{ seccion: number; foto: number } | null>(null);
  const [seccionActiva, setSeccionActiva] = useState(0);

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

  // Pantalla de acceso con código
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          {/* Logo */}
          <div className="mb-10">
            <img src="/logo.png" alt="ROCA Studio" className="h-12 mx-auto" />
          </div>

          <div className="border border-white/10 p-8 md:p-10">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={24} className="text-white/60" />
            </div>

            <h1 className="text-xl font-[var(--font-heading)] text-white mb-2">
              Galería Privada
            </h1>
            <p className="text-sm text-white/50 mb-8">
              Ingresa tu código de acceso para ver tus fotografías.
            </p>

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

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {cargando ? "Verificando..." : "Acceder"}
              </button>
            </form>
          </div>

          <p className="text-xs text-white/30 mt-6">
            Si no tienes tu código, contacta a ROCA Studio.
          </p>
        </motion.div>
      </div>
    );
  }

  // Galería del cliente
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <img src="/logo.png" alt="ROCA Studio" className="h-8" />
          </div>
          <div className="text-right">
            <p className="text-white text-sm">{clienteData?.nombre}</p>
            <p className="text-white/40 text-xs">{clienteData?.evento} · {clienteData?.fecha}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] text-white mb-2">
            {clienteData?.evento}
          </h1>
          <p className="text-white/50 text-sm">
            {clienteData?.nombre} · {clienteData?.fecha}
          </p>
        </motion.div>

        {/* Tabs de secciones */}
        {clienteData && clienteData.secciones.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {clienteData.secciones.map((seccion, index) => (
              <button
                key={seccion.nombre}
                onClick={() => setSeccionActiva(index)}
                className={`px-5 py-2 text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  seccionActiva === index
                    ? "bg-white text-black"
                    : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
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
            transition={{ duration: 0.3 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            {clienteData.secciones[seccionActiva]?.fotos.map((foto, index) => (
              <div
                key={foto.id}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden"
                onClick={() => setLightbox({ seccion: seccionActiva, foto: index })}
              >
                <img
                  src={foto.thumbnail}
                  alt={foto.nombre}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Download
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Botón descargar todo */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            <Download size={16} />
            Descargar todas las fotos
          </a>
        </div>
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
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const fotos = clienteData.secciones[lightbox.seccion].fotos;
                setLightbox({
                  seccion: lightbox.seccion,
                  foto: (lightbox.foto - 1 + fotos.length) % fotos.length,
                });
              }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Anterior"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const fotos = clienteData.secciones[lightbox.seccion].fotos;
                setLightbox({
                  seccion: lightbox.seccion,
                  foto: (lightbox.foto + 1) % fotos.length,
                });
              }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10"
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

            {/* Download button in lightbox */}
            <a
              href={clienteData.secciones[lightbox.seccion].fotos[lightbox.foto].downloadUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 border border-white/30 text-white text-xs tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              <Download size={14} />
              Descargar
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
