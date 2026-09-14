// ── Types ───────────────────────────────────────────────────────────────────
export type {
  Novel,
  ChapterInfo,
  CurrentlyReviewingNovel,
  ReviewingNovelWithChapters,
  NovelHomepageChapters,
  LatestPolishedChapter,
  RecentProofread,
  WeeklyQuoteData,
  ChapterSeo,
  ChapterContent,
  ReviewingNovelsResult,
} from "./types";

// ── Image utilities ─────────────────────────────────────────────────────────
export {
  urlFor,
  coverThumbUrl,
  ogImageUrl,
  illustrationUrl,
  minutesFromWordCount,
} from "./image-utils";

// ── Novel queries ───────────────────────────────────────────────────────────
export {
  getNovels,
  getFeaturedNovels,
  getNovelBySlug,
  getNovelChapterNumbers,
} from "./queries/novels";

// ── Homepage queries ────────────────────────────────────────────────────────
export {
  getCurrentlyReviewingNovel,
  getHeroFeaturedNovel,
  getLatestPolishedChapters,
  getLatestPolishedChaptersForNovel,
  getNovelHomepageChapters,
  getRecentlyProofreadChapter,
} from "./queries/homepage";

// ── Weekly Quotes queries ───────────────────────────────────────────────────
export {
  getLatestWeeklyQuote,
  getWeeklyQuoteBySlug,
  getAllWeeklyQuoteSlugs,
  FALLBACK_WEEKLY_QUOTE,
} from "./queries/quotes";

// ── Reviews query ───────────────────────────────────────────────────────────
export { getReviewingNovelsWithChapters } from "./queries/reviews";

// ── Chapter queries ─────────────────────────────────────────────────────────
export { getNovelChapters, getChapterContent } from "./queries/chapters";
