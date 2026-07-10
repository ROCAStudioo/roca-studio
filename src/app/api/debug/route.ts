import { NextResponse } from "next/server";
import { leerClientes } from "@/lib/blob-storage";

export async function GET() {
  try {
    const data = await leerClientes();

    return NextResponse.json({
      status: "OK",
      totalClientes: data.clientes.length,
      clientes: data.clientes.map((c) => ({
        slug: c.slug,
        nombre: c.nombre,
        codigo: c.codigo,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Desconocido",
    });
  }
}
