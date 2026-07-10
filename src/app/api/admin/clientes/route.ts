import { NextRequest, NextResponse } from "next/server";
import { leerClientes, guardarClientes, Cliente } from "@/lib/blob-storage";

// GET - Obtener todos los clientes
export async function GET() {
  const data = await leerClientes();
  return NextResponse.json(data);
}

// POST - Agregar un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const nuevoCliente: Cliente = await request.json();
    const data = await leerClientes();

    // Verificar que no exista ya
    const existe = data.clientes.find((c) => c.slug === nuevoCliente.slug);
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un cliente con ese slug" },
        { status: 400 }
      );
    }

    data.clientes.push(nuevoCliente);
    await guardarClientes(data);

    return NextResponse.json({ success: true, cliente: nuevoCliente });
  } catch (error) {
    console.error("Error agregando cliente:", error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error interno: ${mensaje}` },
      { status: 500 }
    );
  }
}
