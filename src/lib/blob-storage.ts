import { put, list, getDownloadUrl } from "@vercel/blob";

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

    // Obtener URL de descarga firmada para blob privado
    const downloadUrl = await getDownloadUrl(blobs[0].url);
    const res = await fetch(downloadUrl);
    if (!res.ok) {
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
  });
}
