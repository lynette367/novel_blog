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
  category: string;
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
  seo?: ChapterSeo;
};

// Sanity 返回的原始小说类型
type SanityNovel = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
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
};

// Sanity 返回的原始章节类型（完整，包含 SEO）
type SanityChapterFull = SanityChapter & {
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
    category: sanityNovel.category || "OTHER",
    excerpt: sanityNovel.excerpt || "",
    coverImage: sanityNovel.coverImage
      ? coverThumbUrl(sanityNovel.coverImage)
      : "/assets/images/0.jpg",
    coverImageAlt: sanityNovel.coverImage?.alt,
    path: `/novels/${slug}`,
    totalChapters: sanityNovel.totalChapters || 0,
    totalWordCount: sanityNovel.totalWordCount || 0,
    description: sanityNovel.description || sanityNovel.excerpt || "",
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
    category,
    excerpt,
    description,
    coverImage,
    totalChapters,
    author,
    tags
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
export const getFeaturedNovels = cache(async (limit = 3): Promise<Novel[]> => {
  const query = `*[_type == "novel"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    category,
    excerpt,
    description,
    coverImage,
    totalChapters,
    author,
    tags
  }`;

  try {
    const novels = await client.fetch<SanityNovel[]>(query);
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch featured novels from Sanity:", error);
    return [];
  }
});

// 根据 slug 获取单个小说（含 SEO 字段 + 全书总字数）
export const getNovelBySlug = cache(async (slug: string): Promise<Novel | undefined> => {
  const query = `*[_type == "novel" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    description,
    coverImage,
    totalChapters,
    author,
    tags,
    "totalWordCount": math::sum(
      *[_type == "chapter" && references(^._id)]{
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

// 获取小说的所有章节列表（含每章字数 / 预估阅读时长）
export const getNovelChapters = cache(async (slug: string): Promise<ChapterInfo[]> => {
  const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
    _id,
    number,
    title,
    excerpt,
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
  const query = `*[_type == "chapter" && novel->slug.current == $slug && number == $chapterNumber][0] {
    title,
    content,
    number,
    "wordCount": count(string::split(content, " ")),
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
