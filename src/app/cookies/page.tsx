import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | ROCA Studio",
  description: "Política de cookies de ROCA Studio. Conoce cómo usamos las cookies en nuestro sitio web.",
};

export default function Cookies() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors mb-12 block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] text-white mb-4">
          Política de Cookies
        </h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: Julio 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-lg text-white mb-3">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan
              en tu dispositivo cuando los visitas. Sirven para que el sitio funcione
              correctamente y para mejorar tu experiencia de navegación.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">Cookies que utilizamos</h2>
            <div className="space-y-4">
              <div className="border border-white/10 p-4">
                <p className="text-white text-sm font-medium mb-1">Cookies técnicas (necesarias)</p>
                <p className="text-sm">
                  Permiten el funcionamiento básico del sitio, como la navegación
                  y el acceso a áreas seguras. El sitio no puede funcionar correctamente
                  sin estas cookies.
                </p>
              </div>
              <div className="border border-white/10 p-4">
                <p className="text-white text-sm font-medium mb-1">Cookies de sesión</p>
                <p className="text-sm">
                  Almacenan temporalmente información de tu sesión para que no tengas
                  que volver a ingresar datos al navegar entre páginas.
                  Se eliminan al cerrar el navegador.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">Cookies de terceros</h2>
            <p>
              Este sitio puede utilizar servicios de terceros que instalan sus propias cookies:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-white/80">Google Maps</strong> — Para mostrar nuestra ubicación</li>
              <li><strong className="text-white/80">Google Analytics</strong> — Para análisis de visitas (si está activo)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">Cómo controlar las cookies</h2>
            <p>
              Puedes configurar tu navegador para rechazar o eliminar cookies en cualquier momento.
              Ten en cuenta que algunas funciones del sitio pueden dejar de funcionar si
              desactivas las cookies.
            </p>
            <p className="mt-2">
              Consulta la ayuda de tu navegador para saber cómo gestionar las cookies:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Chrome: Configuración → Privacidad → Cookies</li>
              <li>Firefox: Opciones → Privacidad → Cookies</li>
              <li>Safari: Preferencias → Privacidad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, contáctanos:
            </p>
            <p className="mt-2">
              <a href="mailto:rocastudiofotografico@gmail.com" className="text-white/80 underline">
                rocastudiofotografico@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
