import type { MetadataRoute } from "next";
import { getNovels, getNovelChapters } from "@/lib/novels";
import { SITE_URL } from "@/lib/siteMetadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;

const withOrigin = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const novels = await getNovels();
  
  const baseRoutes: MetadataRoute.Sitemap = [
    { url: withOrigin("/") },
    { url: withOrigin("/novels") },
  ];

  const novelRoutes: MetadataRoute.Sitemap = [];
  
  for (const novel of novels) {
    // 添加小说详情页
    novelRoutes.push({
      url: withOrigin(`/novels/${novel.slug}`),
    });
    
    // 添加章节页面
    const chapters = await getNovelChapters(novel.slug);
    for (const chapter of chapters) {
      novelRoutes.push({
        url: withOrigin(`/novels/${novel.slug}/chapters/${chapter.number}`),
      });
    }
  }

  return [...baseRoutes, ...novelRoutes];
}
