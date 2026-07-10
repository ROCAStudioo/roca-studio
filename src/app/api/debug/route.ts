import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { leerClientes } from "@/lib/blob-storage";

export async function GET() {
  try {
    const { blobs } = await list();

    if (blobs.length === 0) {
      return NextResponse.json({ status: "No blobs" });
    }

    // Probar lectura con token en header
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    let fetchConToken = null;
    try {
      const res = await fetch(blobs[0].url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchConToken = {
        status: res.status,
        ok: res.ok,
        body: res.ok ? await res.text() : await res.text(),
      };
    } catch (e) {
      fetchConToken = { error: e instanceof Error ? e.message : "Error" };
    }

    // Probar leerClientes
    const data = await leerClientes();

    return NextResponse.json({
      status: "OK",
      blobUrl: blobs[0].url,
      fetchConToken,
      clientesLeidos: data.clientes.length,
      clientes: data.clientes,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Desconocido",
    });
  }
}
