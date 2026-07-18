"use client";

import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="ROCA Studio" className="h-10" />
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Estudio profesional de fotografía y video. Capturamos momentos que
              vivirán para siempre.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/Rocaphotography.rc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/_roca_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://www.tiktok.com/@roca_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm text-white tracking-wide uppercase mb-6">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#servicios", label: "Servicios" },
                { href: "#portafolio", label: "Portafolio" },
                { href: "#testimonios", label: "Testimonios" },
                { href: "#faq", label: "Preguntas Frecuentes" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm text-white tracking-wide uppercase mb-6">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/40">
                  Puebla, México
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-white/40 flex-shrink-0" />
                <a
                  href="tel:+522225635334"
                  className="text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  222 563 5334
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white/40 flex-shrink-0" />
                <a
                  href="mailto:rocastudiofotografico@gmail.com"
                  className="text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  rocastudiofotografico@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="text-sm text-white tracking-wide uppercase mb-6">
              Ubicación
            </h4>
            <a
              href="https://maps.app.goo.gl/pQ3h4c6eYZryBzck8"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-[200px] aspect-square border border-white/10 bg-[#111] flex items-center justify-center group hover:border-white/30 transition-all duration-300"
            >
              <div className="text-center">
                <MapPin size={24} className="text-white/30 group-hover:text-white/60 transition-colors mx-auto mb-2" />
                <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors">Ver ubicación</span>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} ROCA Studio. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Aviso de privacidad
            </a>
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Política de cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
