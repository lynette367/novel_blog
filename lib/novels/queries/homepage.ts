import { cache } from "react";
import { client } from "@/src/sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type {
  CurrentlyReviewingNovel,
  LatestPolishedChapter,
  RecentProofread,
  RawNovelResult,
} from "../types";
import { transformReviewingNovel } from "../transform";
import { coverThumbUrl, minutesFromWordCount } from "../image-utils";

// 共享的 GROQ projection，返回所有 reviewing/hero 小说所需字段
const REVIEWING_NOVEL_PROJECTION = `{
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

// 章节数据 GROQ projection（共享）
const POLISHED_CHAPTER_PROJECTION = `{
  _id,
  "chapterNumber": number,
  "chapterTitle": title,
  "excerpt": coalesce(seo.metaDescription, excerpt),
  "_updatedAt": _updatedAt,
  "novelTitle": novel->title,
  "novelSlug": novel->slug.current,
  "coverImage": coalesce(seo.ogImage, novel->coverImage),
  "wordCount": count(string::split(content, " ")),
  isPolished,
  patreonPublished,
  patreonUrl
}`;

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
  isPolished?: boolean;
  patreonPublished?: boolean;
  patreonUrl?: string;
};

function mapChapter(ch: RawChapter): LatestPolishedChapter {
  const wc = ch.wordCount || 0;
  // Patreon 独占：Patreon 已有精修，但网站上仍为 MTL
  const isPatreonOnly = ch.patreonPublished === true && ch.isPolished !== true;
  return {
    _id: ch._id,
    chapterNumber: ch.chapterNumber,
    chapterTitle: ch.chapterTitle,
    excerpt: ch.excerpt || undefined,
    updatedAt: ch._updatedAt || undefined,
    novelTitle: ch.novelTitle,
    novelSlug: ch.novelSlug,
    novelCoverImage: ch.coverImage ? coverThumbUrl(ch.coverImage) : undefined,
    wordCount: wc,
    readingMinutes: minutesFromWordCount(wc),
    isPatreonOnly,
    patreonUrl: ch.patreonUrl || undefined,
  };
}

// 获取当前正在人工校对的小说（优先 currentlyReviewing == true，回退到最新发布）
export const getCurrentlyReviewingNovel = cache(
  async (): Promise<CurrentlyReviewingNovel | null> => {
    const queries = [
      `*[_type == "novel" && currentlyReviewing == true][0] ${REVIEWING_NOVEL_PROJECTION}`,
      `*[_type == "novel"] | order(publishedAt desc)[0] ${REVIEWING_NOVEL_PROJECTION}`,
    ];
    try {
      for (const query of queries) {
        const result = await client.fetch<RawNovelResult | null>(query);
        if (result) return transformReviewingNovel(result);
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch currently reviewing novel from Sanity:", error);
      return null;
    }
  }
);

// 获取 heroFeatured == true 的小说（fallback 链：heroFeatured → currentlyReviewing → 最新发布）
export const getHeroFeaturedNovel = cache(
  async (): Promise<CurrentlyReviewingNovel | null> => {
    const queries = [
      `*[_type == "novel" && heroFeatured == true][0] ${REVIEWING_NOVEL_PROJECTION}`,
      `*[_type == "novel" && currentlyReviewing == true][0] ${REVIEWING_NOVEL_PROJECTION}`,
      `*[_type == "novel"] | order(publishedAt desc)[0] ${REVIEWING_NOVEL_PROJECTION}`,
    ];
    try {
      for (const query of queries) {
        const result = await client.fetch<RawNovelResult | null>(query);
        if (result) return transformReviewingNovel(result);
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch hero featured novel from Sanity:", error);
      return null;
    }
  }
);

// 获取最新章节列表：同时包含网站精修（isPolished）和 Patreon 独占（patreonPublished && !isPolished）
export const getLatestPolishedChapters = cache(
  async (limit = 6): Promise<LatestPolishedChapter[]> => {
    try {
      let chapters = await client.fetch<RawChapter[]>(
        `*[_type == "chapter" && defined(novel) && (isPolished == true || patreonPublished == true)] | order(_updatedAt desc)[0...${limit}] ${POLISHED_CHAPTER_PROJECTION}`
      );
      if (!chapters || chapters.length === 0) {
        chapters = await client.fetch<RawChapter[]>(
          `*[_type == "chapter" && defined(novel)] | order(_updatedAt desc)[0...${limit}] ${POLISHED_CHAPTER_PROJECTION}`
        );
      }
      return (chapters || []).map(mapChapter);
    } catch (error) {
      console.error("Failed to fetch latest polished chapters from Sanity:", error);
      return [];
    }
  }
);

// 获取指定小说的最新精修/Patreon 章节（供首页各书独立板块 + reviews.ts 复用）
export const getLatestPolishedChaptersForNovel = cache(
  async (novelSlug: string, limit = 6): Promise<LatestPolishedChapter[]> => {
    const query = `*[_type == "chapter" && novel->slug.current == $novelSlug && (isPolished == true || patreonPublished == true)] | order(_updatedAt desc)[0...${limit}] ${POLISHED_CHAPTER_PROJECTION}`;
    try {
      const chapters = await client.fetch<RawChapter[]>(query, { novelSlug });
      return (chapters || []).map(mapChapter);
    } catch (error) {
      console.error(`Failed to fetch polished chapters for novel ${novelSlug}:`, error);
      return [];
    }
  }
);

// 获取最近精修的章节（优先 isPolished，fallback 最新更新）
export const getRecentlyProofreadChapter = cache(
  async (): Promise<RecentProofread | null> => {
    type RawResult = {
      number: number;
      title: string;
      excerpt?: string;
      novelTitle: string;
      novelSlug: string;
      coverImage?: SanityImageSource;
      wordCount?: number;
    };

    const projection = `{
      number,
      title,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      "novelTitle": novel->title,
      "novelSlug": novel->slug.current,
      "coverImage": coalesce(seo.ogImage, novel->coverImage),
      "wordCount": count(string::split(content, " "))
    }`;

    try {
      let chapter = await client.fetch<RawResult | null>(
        `*[_type == "chapter" && defined(novel) && isPolished == true] | order(_updatedAt desc)[0] ${projection}`
      );
      if (!chapter) {
        chapter = await client.fetch<RawResult | null>(
          `*[_type == "chapter" && defined(novel)] | order(_updatedAt desc)[0] ${projection}`
        );
      }
      if (!chapter) return null;

      const wordCount = chapter.wordCount || 0;
      return {
        novelTitle: chapter.novelTitle,
        novelSlug: chapter.novelSlug,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        excerpt: chapter.excerpt || undefined,
        coverImage: chapter.coverImage ? coverThumbUrl(chapter.coverImage) : undefined,
        wordCount,
        readingMinutes: minutesFromWordCount(wordCount),
      };
    } catch (error) {
      console.error("Failed to fetch recently proofread chapter from Sanity:", error);
      return null;
    }
  }
);
