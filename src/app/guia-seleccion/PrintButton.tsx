"use client";

export default function PrintButton() {
  return (
    <div className="text-center mt-8 print:hidden">
      <button
        onClick={() => window.print()}
        className="bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-black/80 transition-colors"
      >
        Imprimir / Guardar como PDF
      </button>
    </div>
  );
}
