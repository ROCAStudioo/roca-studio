import { NextRequest, NextResponse } from "next/server";
import { put, list, head } from "@vercel/blob";

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
    const blobUrl = blobs[0].url;
    const blobHead = await head(blobUrl);
    const res = await fetch(blobHead.downloadUrl);
    const data = await res.json();
    return data;
  } catch {
    return { clientes: [] };
  }
}

async function guardarClientes(data: { clientes: Cliente[] }) {
  await put(BLOB_NAME, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
  });
}

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
