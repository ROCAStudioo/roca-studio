import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu Galería | ROCA Studio",
  description: "Accede a tu galería privada de fotografías profesionales. ROCA Studio - Capturamos momentos que vivirán para siempre.",
  openGraph: {
    title: "Tu Galería | ROCA Studio",
    description: "Accede a tu galería privada de fotografías profesionales.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ROCA Studio - Galería Privada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Galería | ROCA Studio",
    description: "Accede a tu galería privada de fotografías profesionales.",
    images: ["/logo.png"],
  },
};

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
