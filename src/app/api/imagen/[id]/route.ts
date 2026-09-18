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

    // Obtener metadatos (tipo y tamaño)
    const meta = await drive.files.get({
      fileId: id,
      fields: "mimeType, size, name",
    });

    const contentType = meta.data.mimeType || "application/octet-stream";
    const esVideo = contentType.includes("video/");
    const rangeHeader = request.headers.get("range");

    // ---- Videos: siempre por streaming, reenviando el Range a Google Drive ----
    // Reenviamos el header Range tal cual a Drive y usamos SU respuesta (content-range,
    // content-length). Así funciona aunque Drive todavía no reporte "size" en los
    // metadatos (típico en videos recién subidos). Si el navegador no manda Range,
    // pedimos el primer tramo para que el <video> pueda empezar a cargar y hacer seek.
    if (esVideo) {
      const MAX_CHUNK = 2 * 1024 * 1024; // 2 MB por respuesta
      let start = 0;
      let end = MAX_CHUNK - 1;

      if (rangeHeader) {
        const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
        if (match) {
          start = parseInt(match[1], 10);
          end = match[2] ? parseInt(match[2], 10) : start + MAX_CHUNK - 1;
        }
      }
      if (end - start + 1 > MAX_CHUNK) {
        end = start + MAX_CHUNK - 1;
      }

      const driveRes = await drive.files.get(
        { fileId: id, alt: "media" },
        {
          responseType: "stream",
          headers: { Range: `bytes=${start}-${end}` },
        }
      );

      // Tomar los encabezados que devuelve Drive para pasarlos al navegador
      const driveHeaders = driveRes.headers as Record<string, string>;
      const contentRange = driveHeaders["content-range"];
      const contentLength = driveHeaders["content-length"];

      const webStream = nodeStreamToWeb(driveRes.data as unknown as Readable);

      const responseHeaders: Record<string, string> = {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      };
      if (contentLength) responseHeaders["Content-Length"] = contentLength;
      if (contentRange) responseHeaders["Content-Range"] = contentRange;

      // 206 si Drive devolvió un rango parcial (lo normal); 200 si devolvió todo
      const status = contentRange ? 206 : 200;

      return new NextResponse(webStream, {
        status,
        headers: responseHeaders,
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
        "Accept-Ranges": "none",
      },
    });
  } catch (error) {
    console.error("Error sirviendo archivo:", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
