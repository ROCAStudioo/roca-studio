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
  "Comercial",
];

const fotos = [
  { src: "/fotos/boda/foto1.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto2.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto3.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto4.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto5.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto6.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto7.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto8.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto9.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto10.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto11.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto12.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto13.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto14.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto15.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto16.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto17.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto18.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto19.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto20.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto21.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto22.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto23.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto24.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto25.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto26.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto27.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto28.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto29.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto30.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto31.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto32.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto33.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto34.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto35.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto36.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto37.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto38.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto39.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto40.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto41.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto42.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto43.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto44.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto45.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto46.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto47.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/boda/foto48.jpg", categoria: "Bodas", alt: "Fotografía de boda" },
  { src: "/fotos/xv/foto1.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto2.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto3.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto4.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto5.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto6.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto7.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto8.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto9.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto10.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto11.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto12.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto13.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto14.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto15.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto16.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto17.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto18.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto19.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto20.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto21.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto22.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto23.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto24.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto25.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto26.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto27.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto28.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto29.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto30.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto31.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto32.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto33.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto34.jpeg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/xv/foto35.jpg", categoria: "XV Años", alt: "Sesión XV años" },
  { src: "/fotos/newborn/foto1.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto2.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto3.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto4.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto5.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto6.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto7.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto8.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto9.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto10.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/newborn/foto11.jpg", categoria: "Newborn", alt: "Fotografía newborn" },
  { src: "/fotos/maternidad/foto1.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto2.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto3.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto4.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto5.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto6.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/maternidad/foto7.jpg", categoria: "Maternidad", alt: "Sesión maternidad" },
  { src: "/fotos/comercial/foto1.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto2.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto3.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto4.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto5.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto6.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto7.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto8.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto9.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto10.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto11.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
  { src: "/fotos/comercial/foto12.jpg", categoria: "Comercial", alt: "Fotografía comercial" },
];

export default function Portafolio() {
  const [filtro, setFiltro] = useState("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const fotosFiltradas =
    filtro === "Todos"
      ? // Mostrar solo 4 fotos de cada categoría en "Todos"
        categorias
          .filter((cat) => cat !== "Todos")
          .flatMap((cat) =>
            fotos.filter((f) => f.categoria === cat).slice(0, 4)
          )
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
