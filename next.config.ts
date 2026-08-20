import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactCompiler: true,
  typedRoutes: true,
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;