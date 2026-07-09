"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const preguntas = [
  {
    pregunta: "¿Cuánto cuesta una sesión?",
    respuesta:
      "Nuestros precios varían según el tipo de sesión, duración y requerimientos específicos. Contáctanos para recibir una cotización personalizada sin compromiso.",
  },
  {
    pregunta: "¿Cuánto tarda la entrega?",
    respuesta:
      "El tiempo de entrega varía según el tipo de servicio. Sesiones individuales se entregan en 2-3 semanas. Bodas y eventos en 4-6 semanas. Siempre respetamos los plazos acordados.",
  },
  {
    pregunta: "¿Entregan fotografías editadas?",
    respuesta:
      "Sí, todas nuestras fotografías pasan por un proceso de edición profesional que incluye corrección de color, retoque y ajuste fino para garantizar la máxima calidad.",
  },
  {
    pregunta: "¿Viajan a otros estados?",
    respuesta:
      "Absolutamente. Realizamos coberturas en todo México y también en el extranjero. Los costos de viaje se cotizan por separado según la ubicación.",
  },
  {
    pregunta: "¿Realizan video?",
    respuesta:
      "Sí, ofrecemos servicios de video profesional y cinematográfico. Podemos cubrir tu evento con fotografía y video de manera integral.",
  },
  {
    pregunta: "¿Cómo reservo una sesión?",
    respuesta:
      "Puedes reservar tu sesión a través de nuestro formulario de contacto, por WhatsApp o llamándonos directamente. Necesitamos un anticipo para apartar tu fecha.",
  },
  {
    pregunta: "¿Qué incluyen los paquetes?",
    respuesta:
      "Cada paquete incluye la sesión fotográfica, edición profesional y entrega digital en alta resolución. Algunos paquetes incluyen álbum impreso, prints y más. Consulta los detalles de cada servicio.",
  },
];

export default function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Resolvemos tus dudas
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Preguntas Frecuentes
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="space-y-4">
          {preguntas.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <div className="border border-white/10 hover:border-white/20 transition-colors duration-300">
                <button
                  onClick={() =>
                    setAbierta(abierta === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={abierta === index}
                >
                  <span className="text-white text-sm md:text-base pr-4">
                    {item.pregunta}
                  </span>
                  {abierta === index ? (
                    <Minus size={18} className="text-white/50 flex-shrink-0" />
                  ) : (
                    <Plus size={18} className="text-white/50 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {abierta === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm text-white/50 leading-relaxed">
                        {item.respuesta}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
