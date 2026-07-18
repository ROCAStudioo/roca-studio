import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ROCA Studio - Galería Privada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "0.1em",
            marginBottom: 16,
          }}
        >
          ROCA STUDIO
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: "rgba(255,255,255,0.3)",
            marginBottom: 24,
          }}
        />
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.2em",
          }}
        >
          GALERÍA PRIVADA
        </div>
      </div>
    ),
    { ...size }
  );
}
