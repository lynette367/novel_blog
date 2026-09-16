// Static weekly-quotes data layer — no Sanity dependency.
// Source of truth: lib/weekly-quotes.ts
// Add new quotes there (newest first); this file exposes the same
// function signatures the pages and components already use.

import { WEEKLY_QUOTES } from "@/lib/weekly-quotes";
import type { WeeklyQuoteData } from "../types";

// Re-export so existing consumers (`import { FALLBACK_WEEKLY_QUOTE }`) keep working.
export const FALLBACK_WEEKLY_QUOTE: WeeklyQuoteData = WEEKLY_QUOTES[0];

// Returns the most-recently published quote (first entry in the array).
export async function getLatestWeeklyQuote(): Promise<WeeklyQuoteData> {
  return WEEKLY_QUOTES[0];
}

// Returns the quote matching `slug`, or null if not found.
export async function getWeeklyQuoteBySlug(
  slug: string
): Promise<WeeklyQuoteData | null> {
  return WEEKLY_QUOTES.find((q) => q.slug === slug) ?? null;
}

// Returns all slugs — used by generateStaticParams in the [slug] page.
export async function getAllWeeklyQuoteSlugs(): Promise<string[]> {
  return WEEKLY_QUOTES.map((q) => q.slug);
}
