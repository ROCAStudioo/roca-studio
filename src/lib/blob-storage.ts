import { put, list, head } from "@vercel/blob";

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

    // Usar head para obtener la downloadUrl firmada del SDK
    const blobMeta = await head(blobs[0].url);
    
    // downloadUrl es una URL firmada que no requiere token adicional
    const res = await fetch(blobMeta.downloadUrl);

    if (!res.ok) {
      // Si downloadUrl no funciona, intentar con la URL del blob directamente
      // ya que el SDK debería estar autenticado
      console.error("Error con downloadUrl:", res.status);
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
