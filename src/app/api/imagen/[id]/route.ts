import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

function getGoogleDriveClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

  if (privateKey.includes('"private_key"')) {
    try {
      const parsed = JSON.parse(privateKey);
      privateKey = parsed.private_key;
    } catch {
      // No es JSON válido, continuar con procesamiento normal
    }
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
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

// Convierte un ReadableStream de Node a uno Web (para NextResponse)
function nodeStreamToWeb(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const drive = getGoogleDriveClient();

    // Obtener metadatos (tipo y tamaño) para decidir cómo servir el archivo
    const meta = await drive.files.get({
      fileId: id,
      fields: "mimeType, size, name",
    });

    const contentType = meta.data.mimeType || "application/octet-stream";
    const fileSize = meta.data.size ? parseInt(meta.data.size, 10) : 0;
    const esVideo = contentType.includes("video/");
    const rangeHeader = request.headers.get("range");

    // ---- Streaming con soporte de Range (para videos que se reproducen en el navegador) ----
    // El navegador pide rangos de bytes al reproducir un <video>; respondemos 206 con solo
    // ese tramo, sin cargar el archivo completo en memoria.
    if (esVideo && fileSize > 0) {
      let start = 0;
      let end = fileSize - 1;

      if (rangeHeader) {
        const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
        if (match) {
          start = parseInt(match[1], 10);
          if (match[2]) {
            end = parseInt(match[2], 10);
          }
        }
      }

      // Limitar el tamaño de cada tramo para no exceder límites de memoria/tiempo del servidor
      const MAX_CHUNK = 2 * 1024 * 1024; // 2 MB por respuesta
      if (end - start + 1 > MAX_CHUNK) {
        end = start + MAX_CHUNK - 1;
      }
      if (end > fileSize - 1) end = fileSize - 1;

      const driveRes = await drive.files.get(
        { fileId: id, alt: "media" },
        {
          responseType: "stream",
          headers: { Range: `bytes=${start}-${end}` },
        }
      );

      const webStream = nodeStreamToWeb(driveRes.data as unknown as Readable);
      const chunkSize = end - start + 1;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    // ---- Imágenes y otros archivos: servir completo (como antes) ----
    const res = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "arraybuffer" }
    );

    const buffer = Buffer.from(res.data as ArrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
        "Content-Length": buffer.length.toString(),
        "Accept-Ranges": esVideo ? "bytes" : "none",
      },
    });
  } catch (error) {
    console.error("Error sirviendo archivo:", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
