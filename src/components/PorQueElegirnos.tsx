"use client";

import {
  Award,
  Users,
  Sparkles,
  Heart,
  MapPin,
  Clock,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const razones = [
  {
    icono: Award,
    titulo: "Más de 10 años de experiencia",
    descripcion:
      "Trayectoria comprobada capturando los momentos más importantes.",
  },
  {
    icono: Users,
    titulo: "Equipo profesional",
    descripcion:
      "Fotógrafos y editores especializados en cada tipo de sesión.",
  },
  {
    icono: Sparkles,
    titulo: "Edición de alta calidad",
    descripcion:
      "Cada imagen es cuidadosamente retocada con estándares premium.",
  },
  {
    icono: Heart,
    titulo: "Atención personalizada",
    descripcion:
      "Nos adaptamos a tu visión para crear algo verdaderamente único.",
  },
  {
    icono: MapPin,
    titulo: "Cobertura en todo México",
    descripcion:
      "Viajamos a donde sea necesario para capturar tu historia.",
  },
  {
    icono: Clock,
    titulo: "Entrega puntual",
    descripcion:
      "Respetamos los tiempos de entrega comprometidos sin excepción.",
  },
];

export default function PorQueElegirnos() {
  return (
    <section id="nosotros" className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Nuestra diferencia
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            ¿Por qué elegirnos?
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {razones.map((razon, index) => {
            const Icon = razon.icono;
            return (
              <AnimatedSection key={razon.titulo} delay={index * 0.1}>
                <div className="p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group">
                  <Icon
                    size={28}
                    className="text-white/40 group-hover:text-white transition-colors duration-300 mb-6"
                  />
                  <h3 className="text-lg font-[var(--font-heading)] text-white mb-3">
                    {razon.titulo}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {razon.descripcion}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
