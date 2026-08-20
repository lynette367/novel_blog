import { client } from "@/src/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { cache } from "react";

// Sanity 图片 URL 构建器
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// 封面缩略图：用于卡片列表，600px 宽，WebP，质量 80
export function coverThumbUrl(source: SanityImageSource): string {
  return builder.image(source).width(600).format("webp").quality(80).url();
}

// OG 图片：用于 Open Graph，1200px 宽
export function ogImageUrl(source: SanityImageSource): string {
  return builder.image(source).width(1200).format("webp").quality(85).url();
}

// 文章插图：用于章节正文，最大宽度 900px
export function illustrationUrl(source: SanityImageSource): string {
  return builder.image(source).width(900).format("webp").quality(85).url();
}

// 阅读速度：英文译文按 220 词/分钟估算，可根据实际读者数据（如 GA 平均停留时长）调整
const WORDS_PER_MINUTE = 220;

function minutesFromWordCount(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export type Novel = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  path: string;
  totalChapters?: number;
  totalWordCount?: number;
  description?: string;
  author?: string;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
};

export type ChapterInfo = {
  _id: string;
  number: number;
  title: string;
  slug: string;
  excerpt?: string;
  wordCount: number;
  readingMinutes: number;
  locked: boolean;
  isPolished: boolean; // ✨ 新增：人工精修状态
};

// 首页 第一屏 "正在校对中的小说" Hero 数据结构
export type CurrentlyReviewingNovel = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  tags: string[];
  reviewedUpToChapter: number;
  totalChapters: number;
  latestPolishedChapterNumber?: number;
};

// 首页 第二屏 "最近精修章节" 数据结构
export type LatestPolishedChapter = {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  excerpt?: string;
  updatedAt?: string;
  novelTitle: string;
  novelSlug: string;
  novelCoverImage?: string;
  wordCount: number;
  readingMinutes: number;
};

// 首页"最近精修章节"Hero使用的章节数据结构
export type RecentProofread = {
  novelTitle: string;
  novelSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  excerpt?: string;
  coverImage?: string;
  readingMinutes?: number;
  wordCount?: number;
};

export type ChapterSeo = {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  ogImage?: string;
};

export type ChapterContent = {
  title: string;
  content: string;
  chapterNumber: number;
  wordCount: number;
  readingMinutes: number;
  ogImageUrl?: string;
  seo?: ChapterSeo;
};

// Sanity 返回的原始小说类型
type SanityNovel = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  description?: string;
  coverImage?: SanityImageSource & { alt?: string };
  totalChapters?: number;
  totalWordCount?: number;
  author?: string;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SanityImageSource;
  };
};

// Sanity 返回的原始章节类型（基础，用于列表）
type SanityChapter = {
  _id: string;
  number: number;
  title: string;
  content: string;
  excerpt?: string;
  wordCount: number;
  locked?: boolean;
  isPolished?: boolean; // ✨ 新增：对应 Sanity 后端字段
};

// Sanity 返回的原始章节类型（完整，包含 SEO）
type SanityChapterFull = SanityChapter & {
  ogImageUrl?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
    ogImage?: SanityImageSource;
  };
};

// 将 Sanity 小说数据转换为前端格式
function transformNovel(sanityNovel: SanityNovel): Novel {
  const slug = sanityNovel.slug?.current || "";

  let tags = sanityNovel.tags || [];
  // Hardcode tag injection for 'big_brother'
  if (slug.includes("big_brother")) {
    if (!tags.includes("Pseudo-Brothers")) {
      tags = ["Pseudo-Brothers", ...tags];
    }
  }

  return {
    _id: sanityNovel._id,
    title: sanityNovel.title,
    slug,
    excerpt: sanityNovel.seo?.metaDescription || sanityNovel.excerpt || "",
    coverImage: sanityNovel.coverImage
      ? coverThumbUrl(sanityNovel.coverImage)
      : "/assets/images/0.jpg",
    coverImageAlt: sanityNovel.coverImage?.alt,
    path: `/novels/${slug}`,
    totalChapters: sanityNovel.totalChapters || 0,
    totalWordCount: sanityNovel.totalWordCount || 0,
    description: sanityNovel.description || sanityNovel.seo?.metaDescription || sanityNovel.excerpt || "",
    author: sanityNovel.author || "Anonymous",
    tags,
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

// 获取所有小说
export const getNovels = cache(async (): Promise<Novel[]> => {
  const query = `*[_type == "novel"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    description,
    coverImage,
    totalChapters,
    author,
    tags,
    seo {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage
    }
  }`;

  try {
    const novels = await client.fetch<SanityNovel[]>(query);
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch novels from Sanity:", error);
    return [];
  }
});

// 获取特色小说（首页展示）
export const getFeaturedNovels = cache(async (limit = 6): Promise<Novel[]> => {
  const query = `*[_type == "novel"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    description,
    coverImage,
    totalChapters,
    author,
    tags,
    seo {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage
    }
  }`;

  try {
    const novels = await client.fetch<SanityNovel[]>(query);
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch featured novels from Sanity:", error);
    return [];
  }
});

// 获取当前正在人工校对审核的小说（优先 fetch currentlyReviewing == true 的小说，若没有则回退到 big_brother 或最新更新的小说）
export const getCurrentlyReviewingNovel = cache(
  async (): Promise<CurrentlyReviewingNovel | null> => {
    const mainQuery = `*[_type == "novel" && currentlyReviewing == true][0] {
      _id,
      title,
      "slug": slug.current,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      description,
      coverImage,
      tags,
      reviewedUpToChapter,
      totalChapters,
      "latestPolishedChapterNumber": *[_type == "chapter" && references(^._id) && isPolished == true] | order(number desc)[0].number,
      "maxChapterNumber": *[_type == "chapter" && references(^._id)] | order(number desc)[0].number,
      "totalChapterCount": count(*[_type == "chapter" && references(^._id)])
    }`;

    const fallbackQuery = `*[_type == "novel" && (slug.current match "*big_brother*" || slug.current match "*big-brother*")][0] {
      _id,
      title,
      "slug": slug.current,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      description,
      coverImage,
      tags,
      reviewedUpToChapter,
      totalChapters,
      "latestPolishedChapterNumber": *[_type == "chapter" && references(^._id) && isPolished == true] | order(number desc)[0].number,
      "maxChapterNumber": *[_type == "chapter" && references(^._id)] | order(number desc)[0].number,
      "totalChapterCount": count(*[_type == "chapter" && references(^._id)])
    }`;

    const defaultQuery = `*[_type == "novel"] | order(publishedAt desc)[0] {
      _id,
      title,
      "slug": slug.current,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      description,
      coverImage,
      tags,
      reviewedUpToChapter,
      totalChapters,
      "latestPolishedChapterNumber": *[_type == "chapter" && references(^._id) && isPolished == true] | order(number desc)[0].number,
      "maxChapterNumber": *[_type == "chapter" && references(^._id)] | order(number desc)[0].number,
      "totalChapterCount": count(*[_type == "chapter" && references(^._id)])
    }`;

    try {
      type RawNovelResult = {
        _id: string;
        title: string;
        slug: string;
        excerpt?: string;
        description?: string;
        coverImage?: SanityImageSource;
        tags?: string[];
        reviewedUpToChapter?: number;
        totalChapters?: number;
        latestPolishedChapterNumber?: number;
        maxChapterNumber?: number;
        totalChapterCount?: number;
      };

      let result = await client.fetch<RawNovelResult | null>(mainQuery);
      if (!result) {
        result = await client.fetch<RawNovelResult | null>(fallbackQuery);
      }
      if (!result) {
        result = await client.fetch<RawNovelResult | null>(defaultQuery);
      }

      if (!result) {
        return null;
      }

      const slug = result.slug || "";
      let tags = result.tags || [];
      if (slug.includes("big_brother") && !tags.includes("Pseudo-Brothers")) {
        tags = ["Pseudo-Brothers", ...tags];
      }

      const totalChapters = result.totalChapters || result.totalChapterCount || result.maxChapterNumber || 0;
      const reviewedUpTo = result.reviewedUpToChapter ?? result.latestPolishedChapterNumber ?? 1;

      return {
        _id: result._id,
        title: result.title,
        slug,
        excerpt: result.excerpt || "",
        description: result.description || result.excerpt || "",
        coverImage: result.coverImage ? coverThumbUrl(result.coverImage) : "/assets/images/0.jpg",
        tags,
        reviewedUpToChapter: reviewedUpTo,
        totalChapters: Math.max(totalChapters, reviewedUpTo),
        latestPolishedChapterNumber: result.latestPolishedChapterNumber || reviewedUpTo,
      };
    } catch (error) {
      console.error("Failed to fetch currently reviewing novel from Sanity:", error);
      return {
        _id: "big_brother_default",
        title: "Big Brother",
        slug: "big_brother",
        excerpt: "An intriguing story of pseudo-brothers navigating secrets, growth, and emotions.",
        description: "An intriguing story of pseudo-brothers navigating secrets, growth, and emotions.",
        coverImage: "/assets/images/Wife_are_paramount.png",
        tags: ["Pseudo-Brothers", "Modern", "BL"],
        reviewedUpToChapter: 5,
        totalChapters: 50,
        latestPolishedChapterNumber: 5,
      };
    }
  }
);

// 获取最新完成人工精修的章节列表（倒序排列，取 3~6 条）
export const getLatestPolishedChapters = cache(
  async (limit = 6): Promise<LatestPolishedChapter[]> => {
    const query = `*[_type == "chapter" && defined(novel) && isPolished == true] | order(number desc)[0...${limit}] {
      _id,
      "chapterNumber": number,
      "chapterTitle": title,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      "_updatedAt": _updatedAt,
      "novelTitle": novel->title,
      "novelSlug": novel->slug.current,
      "coverImage": coalesce(seo.ogImage, novel->coverImage),
      "wordCount": count(string::split(content, " "))
    }`;

    const fallbackQuery = `*[_type == "chapter" && defined(novel)] | order(number desc)[0...${limit}] {
      _id,
      "chapterNumber": number,
      "chapterTitle": title,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      "_updatedAt": _updatedAt,
      "novelTitle": novel->title,
      "novelSlug": novel->slug.current,
      "coverImage": coalesce(seo.ogImage, novel->coverImage),
      "wordCount": count(string::split(content, " "))
    }`;

    try {
      type RawChapter = {
        _id: string;
        chapterNumber: number;
        chapterTitle: string;
        excerpt?: string;
        _updatedAt?: string;
        novelTitle: string;
        novelSlug: string;
        coverImage?: SanityImageSource;
        wordCount?: number;
      };

      let chapters = await client.fetch<RawChapter[]>(query);
      if (!chapters || chapters.length === 0) {
        chapters = await client.fetch<RawChapter[]>(fallbackQuery);
      }

      return (chapters || []).map((ch) => {
        const wc = ch.wordCount || 0;
        return {
          _id: ch._id,
          chapterNumber: ch.chapterNumber,
          chapterTitle: ch.chapterTitle,
          excerpt: ch.excerpt || undefined,
          updatedAt: ch._updatedAt || undefined,
          novelTitle: ch.novelTitle,
          novelSlug: ch.novelSlug,
          novelCoverImage: ch.coverImage ? coverThumbUrl(ch.coverImage) : "/assets/images/0.jpg",
          wordCount: wc,
          readingMinutes: minutesFromWordCount(wc),
        };
      });
    } catch (error) {
      console.error("Failed to fetch Latest Human TLchapters from Sanity:", error);
      return [];
    }
  }
);

// 获取最近精修的章节（优先获取 isPolished == true 的章节，若没有则回退到最新更新章节）
export const getRecentlyProofreadChapter = cache(
  async (): Promise<RecentProofread | null> => {
    const polishedQuery = `*[_type == "chapter" && defined(novel) && isPolished == true] | order(_updatedAt desc)[0] {
      number,
      title,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      "novelTitle": novel->title,
      "novelSlug": novel->slug.current,
      "coverImage": coalesce(seo.ogImage, novel->coverImage),
      "wordCount": count(string::split(content, " "))
    }`;

    const fallbackQuery = `*[_type == "chapter" && defined(novel)] | order(_updatedAt desc)[0] {
      number,
      title,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      "novelTitle": novel->title,
      "novelSlug": novel->slug.current,
      "coverImage": coalesce(seo.ogImage, novel->coverImage),
      "wordCount": count(string::split(content, " "))
    }`;

    try {
      type RawResult = {
        number: number;
        title: string;
        excerpt?: string;
        novelTitle: string;
        novelSlug: string;
        coverImage?: SanityImageSource;
        wordCount?: number;
      };

      let chapter = await client.fetch<RawResult | null>(polishedQuery);
      if (!chapter) {
        chapter = await client.fetch<RawResult | null>(fallbackQuery);
      }

      if (!chapter) {
        return null;
      }

      const wordCount = chapter.wordCount || 0;
      const readingMinutes = minutesFromWordCount(wordCount);

      return {
        novelTitle: chapter.novelTitle,
        novelSlug: chapter.novelSlug,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        excerpt: chapter.excerpt || undefined,
        coverImage: chapter.coverImage ? coverThumbUrl(chapter.coverImage) : "/assets/images/0.jpg",
        wordCount,
        readingMinutes,
      };
    } catch (error) {
      console.error("Failed to fetch recently proofread chapter from Sanity:", error);
      return null;
    }
  }
);

// 根据 slug 获取单个小说（含 SEO 字段 + 全书总字数）
export const getNovelBySlug = cache(async (slug: string): Promise<Novel | undefined> => {
  const query = `*[_type == "novel" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    description,
    coverImage,
    totalChapters,
    author,
    tags,
    "totalWordCount": math::sum(
      *[_type == "chapter" && references(^._id) && locked != true]{
        "wordCount": count(string::split(content, " "))
      }.wordCount
    ),
    seo {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage
    }
  }`;

  try {
    const novel = await client.fetch<SanityNovel | null>(query, { slug });
    return novel ? transformNovel(novel) : undefined;
  } catch (error) {
    console.error(`Failed to fetch novel ${slug} from Sanity:`, error);
    return undefined;
  }
});

// 仅用于生成静态路由参数 (generateStaticParams)，不包含 wordCount / content 文本拆分等重型开销
export const getNovelChapterNumbers = cache(
  async (slug: string): Promise<{ number: number; locked: boolean }[]> => {
    const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
      number,
      "locked": coalesce(locked, false)
    }`;
    try {
      return await client.fetch(query, { slug });
    } catch (error) {
      console.error(`Failed to fetch chapter numbers for ${slug}:`, error);
      return [];
    }
  }
);

// 获取小说的所有章节列表（含每章字数 / 预估阅读时长 / 人工精修状态）
export const getNovelChapters = cache(async (slug: string): Promise<ChapterInfo[]> => {
  const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
    _id,
    number,
    title,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    locked,
    isPolished,
    "wordCount": count(string::split(content, " "))
  }`;

  try {
    const chapters = await client.fetch<SanityChapter[]>(query, { slug });
    return chapters.map((ch) => ({
      _id: ch._id,
      number: ch.number,
      title: ch.title,
      slug: ch.number.toString(),
      excerpt: ch.excerpt || undefined,
      wordCount: ch.wordCount,
      readingMinutes: minutesFromWordCount(ch.wordCount),
      locked: ch.locked || false,
      isPolished: ch.isPolished || false, // ✨ 映射传递给前端
    }));
  } catch (error) {
    console.error(`Failed to fetch chapters for ${slug} from Sanity:`, error);
    return [];
  }
});

// 获取章节内容（含 SEO 字段 + 字数 / 预估阅读时长）
export const getChapterContent = cache(async (
  slug: string,
  chapterNumber: number
): Promise<ChapterContent | null> => {
  const query = `*[_type == "chapter" && novel->slug.current == $slug && number == $chapterNumber && locked != true][0] {
    title,
    content,
    number,
    "wordCount": count(string::split(content, " ")),
    "ogImageUrl": seo.ogImage.asset->url,
    seo {
      metaTitle,
      metaDescription,
      noIndex,
      ogImage
    }
  }`;

  try {
    const chapter = await client.fetch<SanityChapterFull | null>(query, {
      slug,
      chapterNumber,
    });

    if (!chapter) {
      return null;
    }

    const paragraphs = chapter.content
      .split("\n")
      .map((para: string) => para.trim())
      .filter((para: string) => para)
      .map((para: string) => `<p>${para}</p>`)
      .join("\n");

    return {
      title: chapter.title,
      content: paragraphs,
      chapterNumber: chapter.number,
      wordCount: chapter.wordCount,
      readingMinutes: minutesFromWordCount(chapter.wordCount),
      ogImageUrl: chapter.ogImageUrl || undefined,
      seo: chapter.seo
        ? {
          metaTitle: chapter.seo.metaTitle,
          metaDescription: chapter.seo.metaDescription,
          noIndex: chapter.seo.noIndex,
          ogImage: chapter.seo.ogImage
            ? ogImageUrl(chapter.seo.ogImage)
            : undefined,
        }
        : undefined,
    };
  } catch (error) {
    console.error(
      `Failed to fetch chapter ${chapterNumber} for ${slug} from Sanity:`,
      error
    );
    return null;
  }
});