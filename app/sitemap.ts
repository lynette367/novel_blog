import type { MetadataRoute } from "next";
import { getNovels, getNovelChapters } from "@/lib/novels";
import { SITE_URL } from "@/lib/siteMetadata";

// 无论来源是环境变量还是 SITE_URL 兜底值，统一去掉末尾斜杠，
// 避免和下面 withOrigin 里补的前导斜杠拼接成双斜杠（//）。
// 这就是线上 sitemap.xml 出现 https://xxx.press//novels 的原因：
// NEXT_PUBLIC_SITE_URL 这个环境变量本身末尾带了 "/"，且从未被清洗过。
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
  
  const baseRoutes: MetadataRoute.Sitemap = [
    { url: withOrigin("/") },
    { url: withOrigin("/novels") },
    { url: withOrigin("/contact") },
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
