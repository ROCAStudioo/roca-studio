import { NextResponse } from "next/server";
import { list, head } from "@vercel/blob";

export async function GET() {
  try {
    // Ver TODOS los blobs que existen
    const { blobs } = await list();

    if (blobs.length === 0) {
      return NextResponse.json({ status: "No blobs", blobs: [] });
    }

    // Intentar head para ver downloadUrl
    let headResult = null;
    let downloadContent = null;
    try {
      headResult = await head(blobs[0].url);
      // Intentar descargar con la downloadUrl
      const res = await fetch(headResult.downloadUrl);
      downloadContent = {
        status: res.status,
        ok: res.ok,
        body: res.ok ? await res.text() : await res.text(),
      };
    } catch (headError) {
      headResult = { error: headError instanceof Error ? headError.message : "Error" };
    }

    return NextResponse.json({
      status: "OK",
      blob: {
        pathname: blobs[0].pathname,
        url: blobs[0].url,
        size: blobs[0].size,
        downloadUrl: blobs[0].downloadUrl,
      },
      headResult: headResult ? {
        downloadUrl: "downloadUrl" in headResult ? headResult.downloadUrl : null,
        error: "error" in headResult ? headResult.error : null,
      } : null,
      downloadContent,
      envVars: {
        BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
        // Buscar cualquier variable que contenga "blob" o "token"
        allBlobVars: Object.keys(process.env).filter(
          (k) => k.toLowerCase().includes("blob")
        ),
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Desconocido",
    });
  }
}
