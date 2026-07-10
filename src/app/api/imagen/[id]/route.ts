import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

function getGoogleDriveClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const drive = getGoogleDriveClient();

    const res = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    const contentType = res.headers["content-type"] || "image/jpeg";

    // Convertir stream a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of res.data as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("Error sirviendo imagen:", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
