import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elevate-lms.t3.storageapi.dev",
      },
    ],
    formats: ["image/avif", "image/webp"], // force modern formats
  },
  eslint: {
    // Warning ya error hone par build fail na ho
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
