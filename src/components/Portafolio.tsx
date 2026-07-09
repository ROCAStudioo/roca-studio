"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const categorias = [
  "Todos",
  "Bodas",
  "XV Años",
  "Newborn",
  "Maternidad",
  "Retratos",
  "Comercial",
];

const fotos = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    categoria: "Bodas",
    alt: "Fotografía de boda",
  },
  {
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    categoria: "Bodas",
    alt: "Ceremonia de boda",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    categoria: "XV Años",
    alt: "Sesión XV años",
  },
  {
    src: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&q=80",
    categoria: "Newborn",
    alt: "Fotografía newborn",
  },
  {
    src: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
    categoria: "Maternidad",
    alt: "Sesión maternidad",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    categoria: "Retratos",
    alt: "Retrato profesional",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    categoria: "Comercial",
    alt: "Fotografía comercial",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    categoria: "Bodas",
    alt: "Detalles de boda",
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    categoria: "Retratos",
    alt: "Retrato artístico",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    categoria: "Comercial",
    alt: "Evento corporativo",
  },
  {
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    categoria: "XV Años",
    alt: "Sesión XV años elegante",
  },
  {
    src: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
    categoria: "Newborn",
    alt: "Bebé recién nacido",
  },
];

export default function Portafolio() {
  const [filtro, setFiltro] = useState("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const fotosFiltradas =
    filtro === "Todos"
      ? fotos
      : fotos.filter((f) => f.categoria === filtro);

  const abrirLightbox = (index: number) => setLightbox(index);
  const cerrarLightbox = () => setLightbox(null);

  const siguiente = () => {
    if (lightbox !== null) {
      setLightbox((lightbox + 1) % fotosFiltradas.length);
    }
  };

  const anterior = () => {
    if (lightbox !== null) {
      setLightbox(
        (lightbox - 1 + fotosFiltradas.length) % fotosFiltradas.length
      );
    }
  };

  return (
    <section id="portafolio" className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Nuestro trabajo
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Portafolio
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-12">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-5 py-2 text-sm tracking-wide transition-all duration-300 ${
                filtro === cat
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          <AnimatePresence>
            {fotosFiltradas.map((foto, index) => (
              <motion.div
                key={foto.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden"
                onClick={() => abrirLightbox(index)}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm tracking-widest uppercase">
                    Ver
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={cerrarLightbox}
          >
            <button
              onClick={cerrarLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Anterior"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                siguiente();
              }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Siguiente"
            >
              <ChevronRight size={40} />
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={fotosFiltradas[lightbox].src}
              alt={fotosFiltradas[lightbox].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
