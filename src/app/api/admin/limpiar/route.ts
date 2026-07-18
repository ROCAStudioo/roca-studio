import { NextRequest, NextResponse } from "next/server";
import { leerClientes, guardarClientes } from "@/lib/blob-storage";

// POST - Eliminar galerías específicas por slug
export async function POST(request: NextRequest) {
  try {
    const { slugsAEliminar } = await request.json();
    const data = await leerClientes();

    const antes = data.clientes.length;
    data.clientes = data.clientes.filter(
      (c) => !slugsAEliminar.includes(c.slug)
    );
    const despues = data.clientes.length;

    await guardarClientes(data);

    return NextResponse.json({
      success: true,
      eliminados: antes - despues,
      restantes: data.clientes.map((c) => c.slug),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
