"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonios = [
  {
    nombre: "María García",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    opinion:
      "ROCA Studio capturó nuestra boda de una manera increíble. Cada foto transmite la emoción del momento. No pudimos haber elegido mejor.",
  },
  {
    nombre: "Carlos Mendoza",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    opinion:
      "Profesionalismo de principio a fin. Las fotos de mi evento corporativo superaron todas las expectativas. Altamente recomendados.",
  },
  {
    nombre: "Ana Rodríguez",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    opinion:
      "La sesión de maternidad fue una experiencia hermosa. Se tomaron el tiempo de hacer que me sintiera cómoda y los resultados fueron mágicos.",
  },
  {
    nombre: "Roberto Fernández",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    opinion:
      "Las fotografías de los XV años de mi hija quedaron espectaculares. La calidad y la edición son de otro nivel. Totalmente satisfechos.",
  },
  {
    nombre: "Laura Sánchez",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    opinion:
      "Contratamos a ROCA para las fotos newborn de nuestro bebé y quedamos fascinados. La delicadeza y creatividad son impresionantes.",
  },
];

export default function Testimonios() {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActual((prev) => (prev + 1) % testimonios.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonios" className="py-24 md:py-32 bg-black">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Opiniones
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Lo que dicen nuestros clientes
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="relative min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={actual}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-white/80 text-white/80"
                  />
                ))}
              </div>

              <p className="text-lg md:text-xl text-white/80 italic leading-relaxed mb-6 max-w-2xl mx-auto">
                &ldquo;{testimonios[actual].opinion}&rdquo;
              </p>

              <p className="text-sm text-white/50 tracking-wide">
                — {testimonios[actual].nombre}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonios.map((_, index) => (
            <button
              key={index}
              onClick={() => setActual(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === actual ? "bg-white w-6" : "bg-white/30"
              }`}
              aria-label={`Testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
