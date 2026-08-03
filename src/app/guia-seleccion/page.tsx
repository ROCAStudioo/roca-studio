import type { Metadata } from "next";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Guía de Selección de Fotos | ROCA Studio",
  description: "Aprende cómo hacer tu selección de fotografías con ROCA Studio.",
};

export default function GuiaSeleccion() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-8 py-12 print:py-6">

        {/* Header */}
        <div className="text-center mb-10 border-b border-black/10 pb-8">
          <div className="bg-black inline-block px-8 py-4 mb-4">
            <span className="text-white text-2xl font-bold tracking-widest">ROCA</span>
            <span className="text-white/70 text-sm ml-2 tracking-widest uppercase">Studio</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 mb-2">Cómo hacer tu selección de fotos</h1>
          <p className="text-black/50 text-sm">Sigue estos pasos para enviarnos tus fotos favoritas</p>
        </div>

        {/* Paso 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <h2 className="text-lg font-bold">Accede a tu galería</h2>
          </div>
          <div className="ml-11 space-y-2">
            <p className="text-sm text-black/70">Abre el link que te enviamos y escribe tu código de acceso personal.</p>
            <div className="bg-black/5 border border-black/10 p-3 rounded text-sm">
              <p className="font-medium">Ejemplo:</p>
              <p className="text-black/60 font-mono">rocastudio.site/galeria/tu-nombre</p>
              <p className="text-black/60 font-mono">Código: ROCA2A3B4C</p>
            </div>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <h2 className="text-lg font-bold">Activa el modo de selección</h2>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-sm text-black/70">En la parte superior de la galería encontrarás este botón:</p>
            <div className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 text-sm font-medium rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Hacer selección
            </div>
            <p className="text-sm text-black/70">Al activarlo, la galería entra en modo de selección.</p>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <h2 className="text-lg font-bold">Selecciona tus fotos</h2>
          </div>
          <div className="ml-11 space-y-4">
            <p className="text-sm text-black/70">Cada foto tiene dos funciones. Aquí te explicamos cada icono:</p>

            {/* Icono edición */}
            <div className="border border-black/15 p-4 rounded">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-black/5 border border-black/20 rounded flex items-center justify-center relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">✓ Para edición</p>
                  <p className="text-sm text-black/60">Toca la foto directamente para marcarla para <strong>edición profesional</strong>. Aparecerá la etiqueta <span className="bg-black text-white text-xs px-1">EDICIÓN</span> en la foto.</p>
                  <p className="text-sm text-black/50 mt-1">Puedes seleccionar hasta <strong>{"{límite de tu paquete}"}</strong> fotos.</p>
                </div>
              </div>
            </div>

            {/* Icono cuadro */}
            <div className="border border-black/15 p-4 rounded">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-black/5 border border-black/20 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="10" height="10" rx="1" ry="1"/></svg>
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">🖼️ Para cuadro</p>
                  <p className="text-sm text-black/60">Toca el icono de <strong>marco</strong> en la esquina superior derecha de la foto para marcarla para <strong>impresión en cuadro</strong>. Aparecerá la etiqueta <span className="bg-yellow-400 text-black text-xs px-1">CUADRO</span>.</p>
                  <p className="text-sm text-black/50 mt-1">Solo puedes elegir <strong>1 foto</strong> para cuadro (salvo indicación diferente).</p>
                </div>
              </div>
            </div>

            {/* Ejemplo visual */}
            <div className="bg-black/5 p-4 rounded">
              <p className="text-xs font-bold text-black/50 uppercase tracking-wide mb-3">Así se ve una foto seleccionada:</p>
              <div className="flex gap-3">
                <div className="relative w-24 h-24 bg-black/20 rounded overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-black/30 text-xs">foto</div>
                  <div className="absolute top-1.5 left-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="10" height="10" rx="1" ry="1"/></svg>
                  </div>
                  <div className="absolute bottom-5 left-1 bg-black px-1">
                    <span className="text-white text-[8px]">EDICIÓN</span>
                  </div>
                  <div className="absolute bottom-5 right-1 bg-yellow-400 px-1">
                    <span className="text-black text-[8px]">CUADRO</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 px-1">
                    <span className="text-white/70 text-[8px]">DSC00123.jpg</span>
                  </div>
                </div>
                <div className="text-xs text-black/60 space-y-1 flex flex-col justify-center">
                  <p>☑ El <strong>✓ verde</strong> indica foto para edición</p>
                  <p>☑ El <strong>🖼️ dorado</strong> indica foto para cuadro</p>
                  <p>☑ El <strong>nombre del archivo</strong> aparece abajo</p>
                  <p className="text-black/40 mt-2 italic">Usa el nombre del archivo para<br/>identificar la foto si tienes dudas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paso 4 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
            <h2 className="text-lg font-bold">Revisa tu selección</h2>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-sm text-black/70">En la parte inferior de la pantalla aparecerá un panel con el conteo de tus fotos seleccionadas:</p>
            <div className="bg-black text-white px-5 py-3 rounded inline-flex items-center gap-6 text-sm">
              <span className="text-white/50">Seleccionadas:</span>
              <span>✏️ 45/150</span>
              <span className="text-white/30">·</span>
              <span>🖼️ 1/1</span>
              <div className="bg-white text-black px-4 py-1.5 text-xs font-medium rounded">
                Enviar selección
              </div>
            </div>
            <p className="text-sm text-black/50">Verifica que el número de fotos esté dentro del límite antes de enviar.</p>
          </div>
        </div>

        {/* Paso 5 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
            <h2 className="text-lg font-bold">Envía tu selección</h2>
          </div>
          <div className="ml-11 space-y-3">
            <p className="text-sm text-black/70">Cuando estés listo, presiona el botón <strong>"Enviar selección"</strong>.</p>
            <ul className="text-sm text-black/60 space-y-1 list-disc list-inside">
              <li>Te llegará una pantalla de confirmación.</li>
              <li>Se abrirá WhatsApp para que nos confirmes el envío.</li>
              <li>Nosotros recibiremos tu lista de fotos automáticamente.</li>
            </ul>
            <div className="bg-green-50 border border-green-200 p-3 rounded text-sm text-green-800">
              ✅ Una vez enviada tu selección, nuestro equipo comenzará la edición profesional de tus fotografías.
            </div>
          </div>
        </div>

        {/* Advertencias */}
        <div className="border border-black/15 p-5 rounded mb-10 space-y-2">
          <p className="font-bold text-sm mb-3">⚠️ Recuerda:</p>
          <div className="space-y-2 text-sm text-black/70">
            <p>• Si seleccionas más fotos de las permitidas, el sistema te avisará y no podrás enviar hasta reducir la selección.</p>
            <p>• Puedes deseleccionar una foto tocándola de nuevo.</p>
            <p>• Puedes navegar entre secciones (si las hay) sin perder tu selección.</p>
            <p>• El nombre del archivo de cada foto aparece debajo para ayudarte a identificarla.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-black/10 pt-8 space-y-1">
          <p className="text-sm font-medium">¿Tienes dudas? Contáctanos</p>
          <p className="text-sm text-black/50">WhatsApp: 222 563 5334</p>
          <p className="text-sm text-black/50">rocastudiofotografico@gmail.com</p>
          <p className="text-xs text-black/30 mt-4">rocastudio.site</p>
        </div>

        {/* Botón imprimir */}
        <PrintButton />

      </div>
    </div>
  );
}
