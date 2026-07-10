import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const BLOB_NAME = "clientes.json";

interface Cliente {
  slug: string;
  nombre: string;
  evento: string;
  fecha: string;
  codigo: string;
  carpetaDriveId: string;
}

async function leerClientes(): Promise<{ clientes: Cliente[] }> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) {
      return { clientes: [] };
    }
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    return data;
  } catch {
    return { clientes: [] };
  }
}

async function guardarClientes(data: { clientes: Cliente[] }) {
  await put(BLOB_NAME, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
  });
}

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
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
