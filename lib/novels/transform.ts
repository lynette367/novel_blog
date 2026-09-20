import type {
  Novel,
  CurrentlyReviewingNovel,
  SanityNovel,
  RawNovelResult,
  LatestPolishedChapter,
} from "./types";
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
 * Patreon 更新到第几章（latestPatreonChapterNumber），就代表小说的真实精修进度（reviewedUpToChapter）到了第几章。
 * 若无 Patreon 进度，则健壮降级为普通人工翻译（Human TL）的当前最新精修章节号。
 */
export function transformReviewingNovel(
  result: RawNovelResult,
  patreonChapters?: LatestPolishedChapter[]
): CurrentlyReviewingNovel {
  const totalChapters =
    result.totalChapters || result.totalChapterCount || result.maxChapterNumber || 0;

  // 普通人工翻译（Human TL）最新精修章节号
  const humanTlLatest =
    result.latestPolishedChapterNumber ?? result.reviewedUpToChapter ?? 1;

  // Patreon 最新章节号：优先从传入的 patreonChapters 取最大值，否则从 result 读取
  const patreonFromChapters =
    patreonChapters && patreonChapters.length > 0
      ? Math.max(...patreonChapters.map((c) => c.chapterNumber).filter(Boolean))
      : undefined;
  const patreonLatest = patreonFromChapters ?? result.latestPatreonChapterNumber;

  // Patreon 更新到第几章，小说的真实精修进度就到第几章；若无则降级为 Human TL
  const reviewedUpTo =
    typeof patreonLatest === "number" && patreonLatest > 0
      ? patreonLatest
      : humanTlLatest;

  return {
    _id: result._id,
    title: result.title,
    slug: result.slug || "",
    excerpt: result.excerpt || "",
    description: result.description || result.excerpt || "",
    coverImage:
      typeof result.coverImage === "string"
        ? result.coverImage
        : result.coverImage
        ? coverThumbUrl(result.coverImage)
        : "",
    tags: result.tags || [],
    reviewedUpToChapter: reviewedUpTo,
    totalChapters: Math.max(totalChapters, reviewedUpTo),
    latestPolishedChapterNumber: result.latestPolishedChapterNumber || humanTlLatest,
    latestPatreonChapterNumber: patreonLatest,
  };
}
