import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const INVITACIONES_DIR = path.join(process.cwd(), "public", "invitaciones");

// Mapa de extensiones a content-types
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;

    // Si solo viene el nombre de la invitación, servir index.html
    let filePath: string;
    if (slug.length === 1) {
      filePath = path.join(INVITACIONES_DIR, slug[0], "index.html");
    } else {
      filePath = path.join(INVITACIONES_DIR, ...slug);
    }

    // Verificar que el archivo existe
    try {
      await fs.access(filePath);
    } catch {
      // Intentar buscar con case-insensitive (Windows vs Linux)
      try {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const files = await fs.readdir(dir);
        const match = files.find((f) => f.toLowerCase() === fileName.toLowerCase());
        if (match) {
          filePath = path.join(dir, match);
        } else {
          return new NextResponse("No encontrado", { status: 404 });
        }
      } catch {
        return new NextResponse("No encontrado", { status: 404 });
      }
    }

    // Leer el archivo
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("Error sirviendo invitación:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
