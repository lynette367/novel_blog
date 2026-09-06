// ── Types ───────────────────────────────────────────────────────────────────
export type {
  Novel,
  ChapterInfo,
  CurrentlyReviewingNovel,
  ReviewingNovelWithChapters,
  LatestPolishedChapter,
  RecentProofread,
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
  getRecentlyProofreadChapter,
} from "./queries/homepage";

// ── Reviews query ───────────────────────────────────────────────────────────
export { getReviewingNovelsWithChapters } from "./queries/reviews";

// ── Chapter queries ─────────────────────────────────────────────────────────
export { getNovelChapters, getChapterContent } from "./queries/chapters";
