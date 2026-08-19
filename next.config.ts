import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  distDir:
    process.env.NEXT_DIST_DIR ??
    (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  images: {
    qualities: [85, 90],
    minimumCacheTTL: 2_678_400,
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }
    ]
  }
};

export default nextConfig;
