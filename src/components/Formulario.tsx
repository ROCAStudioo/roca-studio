"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_iys6mhm";
const EMAILJS_TEMPLATE_ID_COTIZACION = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_COTIZACION || "template_0huw00i";
const EMAILJS_PUBLIC_KEY = "kcJABHUOM-iklLOPj";

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    tipoSesion: "",
    fecha: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_COTIZACION,
        {
          nombre: formData.nombre,
          telefono: formData.telefono,
          correo: formData.correo,
          tipo_sesion: formData.tipoSesion,
          fecha: formData.fecha || "Sin fecha definida",
          mensaje: formData.mensaje || "Sin mensaje adicional",
        },
        EMAILJS_PUBLIC_KEY
      );

      setEnviado(true);
      setFormData({ nombre: "", telefono: "", correo: "", tipoSesion: "", fecha: "", mensaje: "" });
    } catch (err) {
      console.error("Error enviando formulario:", err);
      setError("Hubo un error al enviar tu solicitud. Por favor contáctanos por WhatsApp.");
    } finally {
      setEnviando(false);
    }
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
            Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
          </p>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
        </AnimatedSection>

        {enviado ? (
          <AnimatedSection className="text-center py-16">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-[var(--font-heading)] text-white mb-2">¡Solicitud enviada!</h3>
            <p className="text-white/50 text-sm mb-6">
              Recibimos tu mensaje. Te contactaremos en menos de 24 horas.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors underline"
            >
              Enviar otra solicitud
            </button>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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
                  <label htmlFor="telefono" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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
                  <label htmlFor="correo" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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
                  <label htmlFor="tipoSesion" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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
                    <option value="Boda">Boda</option>
                    <option value="XV Años">XV Años</option>
                    <option value="Newborn">Newborn</option>
                    <option value="Maternidad">Maternidad</option>
                    <option value="Sesión familiar">Sesión familiar</option>
                    <option value="Retrato profesional">Retrato profesional</option>
                    <option value="Fotografía comercial">Fotografía comercial</option>
                    <option value="Evento">Evento</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fecha" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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
                <label htmlFor="mensaje" className="block text-xs text-white/50 tracking-wide mb-2 uppercase">
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

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <motion.button
                type="submit"
                disabled={enviando}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white/90 transition-colors duration-300 disabled:opacity-50"
              >
                <Send size={16} />
                {enviando ? "Enviando..." : "Enviar Solicitud"}
              </motion.button>
            </form>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
