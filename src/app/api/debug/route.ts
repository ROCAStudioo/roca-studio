import { NextResponse } from "next/server";
import { leerClientes } from "@/lib/blob-storage";

export async function GET() {
  const data = await leerClientes();
  return NextResponse.json({
    total: data.clientes.length,
    clientes: data.clientes.map((c) => ({
      slug: c.slug,
      nombre: c.nombre,
      codigo: c.codigo,
    })),
  });
}
