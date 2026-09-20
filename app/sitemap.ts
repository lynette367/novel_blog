import type { MetadataRoute } from "next";
import { getNovels, getNovelChapters, getAllWeeklyQuoteSlugs } from "@/lib/novels";
import { SITE_URL } from "@/lib/siteMetadata";
import { clusters, BL_RECS_PATH, clusterPath } from "@/lib/bl-recs";

// 无论来源是环境变量还是 SITE_URL 兜底值，统一去掉末尾斜杠，
// 避免和下面 withOrigin 里补的前导斜杠拼接成双斜杠（//）。
function cleanTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const siteUrl = cleanTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL);

const withOrigin = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const novels = await getNovels();
  const quoteSlugs = await getAllWeeklyQuoteSlugs();

  const baseRoutes: MetadataRoute.Sitemap = [
    { url: withOrigin("/") },
    { url: withOrigin("/novels") },
    { url: withOrigin("/contact") },
    { url: withOrigin("/lore/triad-ranks") },
    { url: withOrigin(BL_RECS_PATH) },
    { url: withOrigin("/weekly-quotes") },
  ];

  // BL Recs cluster pages
  const recsRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
    url: withOrigin(clusterPath(cluster.slug)),
  }));

  // Weekly Quotes detail pages
  const quoteRoutes: MetadataRoute.Sitemap = quoteSlugs.map((slug) => ({
    url: withOrigin(`/weekly-quotes/${slug}`),
  }));

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

  return [...baseRoutes, ...recsRoutes, ...quoteRoutes, ...novelRoutes];
}
