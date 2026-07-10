import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { leerClientes } from "@/lib/blob-storage";

export async function GET() {
  try {
    // Ver TODOS los blobs que existen
    const { blobs } = await list();
    
    // Intentar leer clientes
    const data = await leerClientes();

    return NextResponse.json({
      status: "OK",
      todosLosBlobs: blobs.map((b) => ({
        pathname: b.pathname,
        url: b.url,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
      clientesLeidos: data.clientes.length,
      clientes: data.clientes,
      tokenPresente: !!process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Desconocido",
    });
  }
}
