"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    tipoSesion: "",
    fecha: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se integraría con un CRM o backend
    alert("¡Solicitud enviada! Nos pondremos en contacto contigo pronto.");
  };

  return (
    <section id="contacto" className="py-24 md:py-32 bg-black">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            Contáctanos
          </p>
          <h2 className="text-3xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
            Solicita tu Cotización
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Completa el formulario y nos pondremos en contacto contigo en menos
            de 24 horas.
          </p>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
        </AnimatedSection>

        <AnimatedSection>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="Tu teléfono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="correo"
                  className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="tipoSesion"
                  className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
                >
                  Tipo de sesión
                </label>
                <select
                  id="tipoSesion"
                  name="tipoSesion"
                  value={formData.tipoSesion}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="boda">Boda</option>
                  <option value="xv">XV Años</option>
                  <option value="newborn">Newborn</option>
                  <option value="maternidad">Maternidad</option>
                  <option value="familiar">Sesión familiar</option>
                  <option value="retrato">Retrato profesional</option>
                  <option value="comercial">Fotografía comercial</option>
                  <option value="evento">Evento</option>
                  <option value="video">Video profesional</option>
                  <option value="dron">Dron</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="fecha"
                className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
              >
                Fecha tentativa
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="mensaje"
                className="block text-xs text-white/50 tracking-wide mb-2 uppercase"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm focus:border-white/40 focus:outline-none transition-colors resize-none"
                placeholder="Cuéntanos sobre tu evento o sesión..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white/90 transition-colors duration-300"
            >
              <Send size={16} />
              Enviar Solicitud
            </motion.button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
