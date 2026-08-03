import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | ROCA Studio",
  description: "Aviso de privacidad de ROCA Studio. Conoce cómo protegemos y usamos tu información personal.",
};

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors mb-12 block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] text-white mb-4">
          Aviso de Privacidad
        </h1>
        <p className="text-white/40 text-sm mb-12">Última actualización: Julio 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-lg text-white mb-3">1. Responsable del tratamiento de datos</h2>
            <p>
              ROCA Studio, con domicilio en Puebla, México, es responsable del tratamiento
              de los datos personales que nos proporciones a través de nuestro sitio web
              <strong className="text-white"> rocastudio.site</strong> y medios de contacto.
            </p>
            <p className="mt-2">Correo de contacto: <a href="mailto:rocastudiofotografico@gmail.com" className="text-white/80 underline">rocastudiofotografico@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales cuando nos contactas o solicitas nuestros servicios:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico</li>
              <li>Fecha del evento</li>
              <li>Tipo de servicio solicitado</li>
              <li>Cualquier información adicional que nos proporciones voluntariamente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos personales para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Responderte y enviarte cotizaciones de nuestros servicios fotográficos</li>
              <li>Coordinar sesiones y eventos</li>
              <li>Entregarte tu material fotográfico y de video</li>
              <li>Enviarte información sobre nuestros servicios cuando así lo autorices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">4. Transferencia de datos</h2>
            <p>
              No compartimos, vendemos ni transferimos tus datos personales a terceros,
              excepto cuando sea necesario para cumplir con una obligación legal o
              cuando cuentes con tu consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">5. Tus derechos (ARCO)</h2>
            <p>
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento
              de tus datos personales. Para ejercer estos derechos, contáctanos a:
            </p>
            <p className="mt-2">
              <a href="mailto:rocastudiofotografico@gmail.com" className="text-white/80 underline">
                rocastudiofotografico@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">6. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tus datos
              personales contra acceso no autorizado, pérdida o divulgación.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-3">7. Cambios al aviso</h2>
            <p>
              Podemos actualizar este aviso de privacidad en cualquier momento. Te
              notificaremos sobre cambios significativos publicando la nueva versión
              en esta misma página.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
