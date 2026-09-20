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
      {
        source: "/weeklyquotes",
        destination: "/weekly-quotes",
        permanent: true,
      },
      {
        source: "/weeklyquotes/:slug*",
        destination: "/weekly-quotes/:slug*",
        permanent: true,
      },
      {
        source: "/quotes",
        destination: "/weekly-quotes",
        permanent: true,
      },
      {
        source: "/quotes/:slug*",
        destination: "/weekly-quotes/:slug*",
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