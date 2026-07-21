import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { leerClientes, Cliente } from "@/lib/blob-storage";

// Configuración de Google Drive API
function getGoogleDriveClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";
  
  // Si pegaron todo el JSON de credenciales, extraer solo la private_key
  if (privateKey.includes('"private_key"')) {
    try {
      const parsed = JSON.parse(privateKey);
      privateKey = parsed.private_key;
    } catch {
      // No es JSON válido, continuar con procesamiento normal
    }
  }
  
  // Quitar comillas envolventes si las tiene
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
  
  // Reemplazar \n literales por saltos de línea reales
  privateKey = privateKey.replace(/\\n/g, "\n");
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

// Buscar cliente por slug
async function obtenerCliente(slug: string): Promise<Cliente | null> {
  const data = await leerClientes();
  const cliente = data.clientes.find((c) => c.slug === slug);
  return cliente || null;
}

// Obtener fotos de una carpeta de Google Drive (con paginación)
async function obtenerFotosDeCarpeta(folderId: string) {
  const drive = getGoogleDriveClient();
  const allFiles: { id: string; name: string; thumbnailLink: string | null | undefined }[] = [];
  let pageToken: string | undefined = undefined;

  // Primera página
  const firstPage = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
    fields: "nextPageToken, files(id, name, thumbnailLink)",
    orderBy: "name",
    pageSize: 1000,
  });

  for (const file of firstPage.data.files || []) {
    allFiles.push({ id: file.id || "", name: file.name || "", thumbnailLink: file.thumbnailLink });
  }
  pageToken = firstPage.data.nextPageToken || undefined;

  // Páginas siguientes
  while (pageToken) {
    const nextPage = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
      fields: "nextPageToken, files(id, name, thumbnailLink)",
      orderBy: "name",
      pageSize: 1000,
      pageToken,
    });

    for (const file of nextPage.data.files || []) {
      allFiles.push({ id: file.id || "", name: file.name || "", thumbnailLink: file.thumbnailLink });
    }
    pageToken = nextPage.data.nextPageToken || undefined;
  }

  const fotos = allFiles.map((file) => ({
    id: file.id,
    nombre: file.name,
    url: file.thumbnailLink?.replace("=s220", "=s1600") || `/api/imagen/${file.id}`,
    thumbnail: file.thumbnailLink?.replace("=s220", "=s600") || `/api/imagen/${file.id}`,
    downloadUrl: `/api/imagen/${file.id}`,
  }));

  return fotos;
}

// Obtener subcarpetas (secciones) de la carpeta principal del cliente
async function obtenerSecciones(carpetaPrincipalId: string) {
  const drive = getGoogleDriveClient();

  const res = await drive.files.list({
    q: `'${carpetaPrincipalId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    orderBy: "name",
  });

  const carpetas = res.data.files || [];

  if (carpetas.length === 0) {
    const fotos = await obtenerFotosDeCarpeta(carpetaPrincipalId);
    return [{ nombre: "Todas las fotos", fotos }];
  }

  const secciones = await Promise.all(
    carpetas.map(async (carpeta) => {
      const fotos = await obtenerFotosDeCarpeta(carpeta.id || "");
      return {
        nombre: carpeta.name || "Sin nombre",
        fotos,
      };
    })
  );

  return secciones;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { codigo } = await request.json();

    // Buscar cliente por slug
    const cliente = await obtenerCliente(slug);

    if (!cliente) {
      return NextResponse.json(
        { error: "Galería no encontrada" },
        { status: 404 }
      );
    }

    // Verificar código (comparación sin espacios extra)
    if (cliente.codigo.trim() !== codigo.trim()) {
      return NextResponse.json(
        { error: `Código incorrecto` },
        { status: 401 }
      );
    }

    // Obtener fotos de Google Drive
    const secciones = await obtenerSecciones(cliente.carpetaDriveId);

    return NextResponse.json({
      nombre: cliente.nombre,
      evento: cliente.evento,
      fecha: cliente.fecha,
      secciones,
    });
  } catch (error) {
    console.error("Error en API galería:", error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error: ${mensaje}` },
      { status: 500 }
    );
  }
}
