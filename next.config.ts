import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactCompiler: true,
  typedRoutes: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;