import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ── Public front-end types ──────────────────────────────────────────────────

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
  isPolished: boolean;
  patreonPublished: boolean;
  patreonUrl?: string;
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

// 首页每本小说展示的章节数据（Patreon提前看 + 精修章节）
export type NovelHomepageChapters = {
  patreonChapters: LatestPolishedChapter[];
  polishedChapters: LatestPolishedChapter[];
};

// 首页每本 currentlyReviewing 书的板块数据（书 + 章节列表）
export type ReviewingNovelWithChapters = {
  novel: CurrentlyReviewingNovel;
  chapters: LatestPolishedChapter[];
  patreonChapters?: LatestPolishedChapter[];
  polishedChapters?: LatestPolishedChapter[];
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
  /** true = Patreon 独占章节（网站仍为 MTL，Patreon 已有精修）*/
  isPatreonOnly?: boolean;
  /** Patreon 独占章节的直链 URL */
  patreonUrl?: string;
};

// 首页"最近精修章节"Hero 使用的章节数据结构
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

export type WeeklyQuoteData = {
  _id?: string;
  title: string;
  slug: string;
  seoTitle?: string;
  quoteText: string;
  novelTitle: string;
  chapter: string;
  insight?: string;
  targetChapterUrl: string;
  publishedAt?: string;
};

export type ReviewingNovelsResult = {
  sections: ReviewingNovelWithChapters[];
  overflow: { title: string; slug: string }[];
};

// ── Internal Sanity raw types ───────────────────────────────────────────────

export type SanityNovel = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  description?: string;
  coverImage?: SanityImageSource & { alt?: string };
  totalChapters?: number;
  totalWordCount?: number;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: SanityImageSource;
  };
};

export type SanityChapter = {
  _id: string;
  number: number;
  title: string;
  content: string;
  excerpt?: string;
  wordCount: number;
  locked?: boolean;
  isPolished?: boolean;
  patreonPublished?: boolean;
  patreonUrl?: string;
};

export type SanityChapterFull = SanityChapter & {
  ogImageUrl?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
    ogImage?: SanityImageSource;
  };
};

// Sanity GROQ 返回的原始小说结果（slug 已解析为 string）
// 供 transformReviewingNovel、getCurrentlyReviewingNovel、
// getHeroFeaturedNovel、getReviewingNovelsWithChapters 共用
export type RawNovelResult = {
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
