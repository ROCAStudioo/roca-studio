import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { list } from "@vercel/blob";

const BLOB_NAME = "clientes.json";

interface Cliente {
  slug: string;
  nombre: string;
  evento: string;
  fecha: string;
  codigo: string;
  carpetaDriveId: string;
}

// Configuración de Google Drive API
function getGoogleDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

// Leer clientes desde Vercel Blob
async function obtenerCliente(slug: string): Promise<Cliente | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) {
      return null;
    }
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    const cliente = data.clientes.find((c: Cliente) => c.slug === slug);
    return cliente || null;
  } catch {
    return null;
  }
}

// Obtener fotos de una carpeta de Google Drive
async function obtenerFotosDeCarpeta(folderId: string) {
  const drive = getGoogleDriveClient();

  const res = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
    fields: "files(id, name, mimeType, thumbnailLink, webContentLink)",
    orderBy: "name",
    pageSize: 1000,
  });

  const fotos = (res.data.files || []).map((file) => ({
    id: file.id || "",
    nombre: file.name || "",
    url: `https://drive.google.com/uc?export=view&id=${file.id}`,
    thumbnail: file.thumbnailLink?.replace("=s220", "=s600") || `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
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
    // Si no hay subcarpetas, las fotos están directo en la carpeta principal
    const fotos = await obtenerFotosDeCarpeta(carpetaPrincipalId);
    return [{ nombre: "Todas las fotos", fotos }];
  }

  // Obtener fotos de cada subcarpeta
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

    // Verificar código
    if (cliente.codigo !== codigo) {
      return NextResponse.json(
        { error: "Código incorrecto" },
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
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
