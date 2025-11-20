import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactCompiler: true,
  typedRoutes: true,
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
