import { put, list } from "@vercel/blob";

const BLOB_NAME = "clientes.json";

export interface Cliente {
  slug: string;
  nombre: string;
  evento: string;
  fecha: string;
  codigo: string;
  carpetaDriveId: string;
}

export async function leerClientes(): Promise<{ clientes: Cliente[] }> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) {
      return { clientes: [] };
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    // Para blobs privados, descargar usando el token en el header
    const res = await fetch(blobs[0].url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Error descargando blob:", res.status, res.statusText);
      return { clientes: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error leyendo clientes:", error);
    return { clientes: [] };
  }
}

export async function guardarClientes(data: { clientes: Cliente[] }) {
  await put(BLOB_NAME, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
