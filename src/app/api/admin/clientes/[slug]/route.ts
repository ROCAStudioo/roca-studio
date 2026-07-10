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

// DELETE - Eliminar un cliente
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await leerClientes();

    data.clientes = data.clientes.filter(
      (c: { slug: string }) => c.slug !== slug
    );

    await guardarClientes(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
