import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  serverExternalPackages: ["googleapis"],
  async rewrites() {
    return [
      {
        // /invitacion/nombre -> sirve /invitaciones/nombre/index.html
        source: "/invitacion/:slug",
        destination: "/invitaciones/:slug/index.html",
      },
      {
        // /invitacion/nombre/archivo -> sirve /invitaciones/nombre/archivo
        source: "/invitacion/:slug/:path*",
        destination: "/invitaciones/:slug/:path*",
      },
    ];
  },
};

export default nextConfig;
