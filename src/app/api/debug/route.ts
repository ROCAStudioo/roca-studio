import { NextResponse } from "next/server";
import { list, getDownloadUrl } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "clientes.json" });
    
    if (blobs.length === 0) {
      return NextResponse.json({ 
        status: "No hay blobs",
        blobs: [] 
      });
    }

    const downloadUrl = await getDownloadUrl(blobs[0].url);
    const res = await fetch(downloadUrl);
    const text = await res.text();

    return NextResponse.json({
      status: "OK",
      blobUrl: blobs[0].url,
      blobSize: blobs[0].size,
      contenido: JSON.parse(text),
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Desconocido",
    });
  }
}
