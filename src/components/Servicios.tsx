"use client";

import AnimatedSection from "./AnimatedSection";

const servicios = [
  {
    nombre: "Bodas",
    descripcion:
      "Capturamos cada momento mágico de tu gran día con elegancia y emoción.",
    imagen: "/fotos/boda/foto2.jpg",
  },
  {
    nombre: "XV Años",
    descripcion:
      "Fotografía artística para celebrar esta etapa única e irrepetible.",
    imagen: "/fotos/xv/foto1.jpg",
  },
  {
    nombre: "Newborn",
    descripcion:
      "Retratos tiernos y delicados de los primeros días de vida de tu bebé.",
    imagen: "/fotos/newborn/foto1.jpg",
  },
  {
    nombre: "Maternidad",
    descripcion:
      "Sesiones que celebran la belleza y la espera de una nueva vida.",
    imagen: "/fotos/maternidad/foto1.jpg",
  },
  {
    nombre: "Fotografía comercial",
    descripcion:
      "Contenido visual profesional que potencia tu negocio y marca.",
    imagen: "/fotos/comercial/foto1.jpg",
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Lo que hacemos
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Nuestros Servicios
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicios.map((servicio, index) => (
            <AnimatedSection key={servicio.nombre} delay={index * 0.1}>
              <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${servicio.imagen}')` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-[var(--font-heading)] text-white mb-2">
                    {servicio.nombre}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {servicio.descripcion}
                  </p>
                  <span className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors duration-300 border-b border-white/20 pb-1 w-fit">
                    Más información
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
