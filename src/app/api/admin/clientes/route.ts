import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CLIENTES_FILE = path.join(process.cwd(), "src/data/clientes.json");

async function leerClientes() {
  try {
    const data = await fs.readFile(CLIENTES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { clientes: [] };
  }
}

async function guardarClientes(data: { clientes: unknown[] }) {
  await fs.writeFile(CLIENTES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET - Obtener todos los clientes
export async function GET() {
  const data = await leerClientes();
  return NextResponse.json(data);
}

// POST - Agregar un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const nuevoCliente = await request.json();
    const data = await leerClientes();

    // Verificar que no exista ya
    const existe = data.clientes.find(
      (c: { slug: string }) => c.slug === nuevoCliente.slug
    );
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
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
