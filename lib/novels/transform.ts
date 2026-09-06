import type { Novel, CurrentlyReviewingNovel, SanityNovel, RawNovelResult } from "./types";
import { coverThumbUrl, ogImageUrl } from "./image-utils";

/**
 * Sanity 原始小说数据 → 前端 Novel 格式。
 * 标签完全由 Sanity 后台动态返回，不做任何硬编码注入。
 */
export function transformNovel(sanityNovel: SanityNovel): Novel {
  const slug = sanityNovel.slug?.current || "";

  return {
    _id: sanityNovel._id,
    title: sanityNovel.title,
    slug,
    excerpt: sanityNovel.seo?.metaDescription || sanityNovel.excerpt || "",
    coverImage: sanityNovel.coverImage ? coverThumbUrl(sanityNovel.coverImage) : "",
    coverImageAlt: sanityNovel.coverImage?.alt,
    path: `/novels/${slug}`,
    totalChapters: sanityNovel.totalChapters || 0,
    totalWordCount: sanityNovel.totalWordCount || 0,
    description:
      sanityNovel.description ||
      sanityNovel.seo?.metaDescription ||
      sanityNovel.excerpt ||
      "",
    tags: sanityNovel.tags || [],
    seo: sanityNovel.seo
      ? {
          metaTitle: sanityNovel.seo.metaTitle,
          metaDescription: sanityNovel.seo.metaDescription,
          ogTitle: sanityNovel.seo.ogTitle,
          ogDescription: sanityNovel.seo.ogDescription,
          ogImage: sanityNovel.seo.ogImage
            ? ogImageUrl(sanityNovel.seo.ogImage)
            : undefined,
        }
      : undefined,
  };
}

/**
 * Sanity GROQ 原始结果（slug 已解析为字符串）→ CurrentlyReviewingNovel 格式。
 * 合并了原来散落在三处的相同转换逻辑，标签完全由 Sanity 返回。
 */
export function transformReviewingNovel(result: RawNovelResult): CurrentlyReviewingNovel {
  const totalChapters =
    result.totalChapters || result.totalChapterCount || result.maxChapterNumber || 0;
  const reviewedUpTo =
    result.reviewedUpToChapter ?? result.latestPolishedChapterNumber ?? 1;

  return {
    _id: result._id,
    title: result.title,
    slug: result.slug || "",
    excerpt: result.excerpt || "",
    description: result.description || result.excerpt || "",
    coverImage: result.coverImage ? coverThumbUrl(result.coverImage) : "",
    tags: result.tags || [],
    reviewedUpToChapter: reviewedUpTo,
    totalChapters: Math.max(totalChapters, reviewedUpTo),
    latestPolishedChapterNumber: result.latestPolishedChapterNumber || reviewedUpTo,
  };
}
