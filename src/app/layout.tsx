import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROCA Studio | Fotografía Profesional",
  description:
    "Estudio profesional de fotografía para bodas, XV años, eventos, retratos, newborn, maternidad y fotografía comercial. Capturamos momentos que vivirán para siempre.",
  keywords:
    "fotografía profesional, bodas, XV años, newborn, maternidad, eventos, retratos, fotografía comercial, ROCA Studio, México",
  openGraph: {
    title: "ROCA Studio | Fotografía Profesional",
    description:
      "Capturamos momentos que vivirán para siempre. Fotografía profesional para bodas, XV años, eventos, retratos y más.",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ROCA Studio - Fotografía Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROCA Studio | Fotografía Profesional",
    description:
      "Capturamos momentos que vivirán para siempre. Fotografía profesional para bodas, XV años, eventos, retratos y más.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
