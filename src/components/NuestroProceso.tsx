"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const pasos = [
  {
    numero: "01",
    titulo: "Solicita información",
    descripcion:
      "Contáctanos para conocer nuestros paquetes y servicios disponibles.",
  },
  {
    numero: "02",
    titulo: "Agenda tu sesión",
    descripcion:
      "Elige la fecha y el tipo de sesión que mejor se adapte a tus necesidades.",
  },
  {
    numero: "03",
    titulo: "Planeamos cada detalle",
    descripcion:
      "Definimos juntos la locación, vestuario y estilo de tu sesión.",
  },
  {
    numero: "04",
    titulo: "Realizamos la cobertura",
    descripcion:
      "Nuestro equipo profesional captura cada momento con dedicación.",
  },
  {
    numero: "05",
    titulo: "Editamos cuidadosamente",
    descripcion:
      "Cada fotografía pasa por un proceso de edición profesional y detallado.",
  },
  {
    numero: "06",
    titulo: "Entregamos tus recuerdos",
    descripcion:
      "Recibes tus fotografías en alta resolución listas para atesorar.",
  },
];

export default function NuestroProceso() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Cómo trabajamos
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Nuestro Proceso
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px" />

          {pasos.map((paso, index) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative flex items-center mb-12 last:mb-0 ${
                index % 2 === 0
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1.5 md:-translate-x-1.5 z-10" />

              {/* Content */}
              <div
                className={`ml-16 md:ml-0 md:w-1/2 ${
                  index % 2 === 0
                    ? "md:pr-16 md:text-right"
                    : "md:pl-16 md:text-left"
                }`}
              >
                <span className="text-xs text-white/30 tracking-widest">
                  PASO {paso.numero}
                </span>
                <h3 className="text-xl font-[var(--font-heading)] text-white mt-1 mb-2">
                  {paso.titulo}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {paso.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
