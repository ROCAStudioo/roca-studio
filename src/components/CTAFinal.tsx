"use client";

import { motion } from "framer-motion";

export default function CTAFinal() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('/fotos/ROC05200-Editar.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white leading-tight mb-8">
          Tu historia merece ser contada con imágenes inolvidables
        </h2>
        <a
          href="#contacto"
          className="inline-block px-10 py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-300"
        >
          Solicitar Cotización
        </a>
      </motion.div>
    </section>
  );
}
