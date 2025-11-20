import type { MetadataRoute } from "next";
import novelsData from "@/data/novels.json";
import { SITE_URL } from "@/lib/siteMetadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;

const withOrigin = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const novels = novelsData.novels ?? [];
  const baseRoutes: MetadataRoute.Sitemap = [
    { url: withOrigin("/") },
    { url: withOrigin("/novels") },
  ];

  const novelRoutes = novels.map((novel) => ({
    url: withOrigin(`/novels/${novel.slug}`),
  }));

  return [...baseRoutes, ...novelRoutes];
}
