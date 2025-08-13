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
};

export default nextConfig;
