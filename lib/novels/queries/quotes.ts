import { cache } from "react";
import { client } from "@/src/sanity/client";
import type { WeeklyQuoteData } from "../types";

export const FALLBACK_WEEKLY_QUOTE: WeeklyQuoteData = {
  title: "He Had Always Thought That Losing Someone Was The Same As Being Left Behind",
  slug: "losing-someone-vs-being-left-behind",
  quoteText: "He had always thought that losing someone was the same as being left behind.",
  novelTitle: "Big Brother",
  chapter: "Chapter 12",
  insight: "In Chinese danmei, the subtle grief of separation often carries a quiet permanence. This line captures the loneliness of growing up without a safety net.",
  targetChapterUrl: "/novels/big_brother/chapters/12",
  publishedAt: new Date().toISOString(),
};

const WEEKLY_QUOTE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  quoteText,
  novelTitle,
  chapter,
  insight,
  targetChapterUrl,
  publishedAt
}`;

// 获取最新发布的一条每周金句（优先 Sanity，fallback 兜底）
export const getLatestWeeklyQuote = cache(async (): Promise<WeeklyQuoteData> => {
  const query = `*[_type == "weeklyQuote" && defined(slug.current)] | order(publishedAt desc)[0] ${WEEKLY_QUOTE_PROJECTION}`;
  try {
    const result = await client.fetch<WeeklyQuoteData | null>(query);
    if (result && result.slug && result.quoteText) {
      return result;
    }
    return FALLBACK_WEEKLY_QUOTE;
  } catch (error) {
    console.error("Failed to fetch latest weekly quote from Sanity:", error);
    return FALLBACK_WEEKLY_QUOTE;
  }
});

// 根据 slug 获取单条每周金句
export const getWeeklyQuoteBySlug = cache(
  async (slug: string): Promise<WeeklyQuoteData | null> => {
    const query = `*[_type == "weeklyQuote" && slug.current == $slug][0] ${WEEKLY_QUOTE_PROJECTION}`;
    try {
      const result = await client.fetch<WeeklyQuoteData | null>(query, { slug });
      if (result && result.slug) {
        return result;
      }
      // 如果查询的是默认 fallback 的 slug，返回 fallback 数据
      if (slug === FALLBACK_WEEKLY_QUOTE.slug) {
        return FALLBACK_WEEKLY_QUOTE;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch weekly quote by slug "${slug}":`, error);
      if (slug === FALLBACK_WEEKLY_QUOTE.slug) {
        return FALLBACK_WEEKLY_QUOTE;
      }
      return null;
    }
  }
);

// 获取所有已发布的 weeklyQuote slugs（用于 SSG generateStaticParams）
export const getAllWeeklyQuoteSlugs = cache(async (): Promise<string[]> => {
  const query = `*[_type == "weeklyQuote" && defined(slug.current)][].slug.current`;
  try {
    const slugs = await client.fetch<string[]>(query);
    const result = slugs || [];
    if (!result.includes(FALLBACK_WEEKLY_QUOTE.slug)) {
      result.push(FALLBACK_WEEKLY_QUOTE.slug);
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch all weekly quote slugs from Sanity:", error);
    return [FALLBACK_WEEKLY_QUOTE.slug];
  }
});
