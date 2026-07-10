import { NextRequest, NextResponse } from "next/server";
import { leerClientes, guardarClientes } from "@/lib/blob-storage";

// DELETE - Eliminar un cliente
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await leerClientes();

    data.clientes = data.clientes.filter((c) => c.slug !== slug);
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
