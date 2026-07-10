import { NextResponse } from "next/server";

export async function GET() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const email = process.env.GOOGLE_CLIENT_EMAIL || "";

  return NextResponse.json({
    emailPresente: !!email,
    emailPrimeros20: email.substring(0, 20) + "...",
    keyPresente: !!rawKey,
    keyLongitud: rawKey.length,
    keyPrimeros50: rawKey.substring(0, 50),
    keyUltimos30: rawKey.substring(rawKey.length - 30),
    contieneBegin: rawKey.includes("BEGIN PRIVATE KEY"),
    contieneEnd: rawKey.includes("END PRIVATE KEY"),
    contieneBackslashN: rawKey.includes("\\n"),
    contieneNewline: rawKey.includes("\n"),
    empiezaConComilla: rawKey.startsWith('"'),
  });
}
