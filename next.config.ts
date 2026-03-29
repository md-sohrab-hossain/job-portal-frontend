import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.hrango.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;