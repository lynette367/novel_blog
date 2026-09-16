// Static weekly quotes data — no CMS dependency.
// Add new entries at the TOP of the array (newest first).
// The first entry is treated as the "latest" quote on the homepage and index redirect.

import type { WeeklyQuoteData } from "@/lib/novels/types";

export const WEEKLY_QUOTES: WeeklyQuoteData[] = [
  {
    title:
      "He Had Always Thought That Losing Someone Was The Same As Being Left Behind",
    slug: "losing-someone-vs-being-left-behind",
    quoteText:
      "He had always thought that losing someone was the same as being left behind.",
    novelTitle: "Big Brother",
    chapter: "Chapter 12",
    insight:
      "In Chinese danmei, the subtle grief of separation often carries a quiet permanence. This line captures the loneliness of growing up without a safety net.",
    targetChapterUrl: "/novels/big_brother/chapters/12",
    publishedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    title: "The Debt That Cannot Be Repaid With Money",
    slug: "debt-that-cannot-be-repaid",
    quoteText:
      "Some debts are not measured in coin. They are measured in years, in breath, in the weight of a name you dare not say aloud.",
    novelTitle: "Transmigrated into the Villain's Sickly Childhood Friend",
    chapter: "Chapter 3",
    insight:
      "The Kowloon Walled City runs on obligation. Chan Ka Nam carries a debt that no triad ledger could ever settle — one that was written the moment he chose to stay.",
    targetChapterUrl: "/novels/transmigrated-villain-childhood-friend/chapters/3",
    publishedAt: "2025-01-08T00:00:00.000Z",
  },
  {
    title: "The Cost of Pretending You Do Not Care",
    slug: "cost-of-pretending",
    quoteText:
      "The hardest performance is the one you give to yourself — the smile in the mirror that almost convinces you.",
    novelTitle: "Transmigrated into the Villain's Sickly Childhood Friend",
    chapter: "Chapter 7",
    insight:
      "Kiu Man's illness is not merely physical. Every chapter layers another mask onto a protagonist who has been pretending so long he has almost forgotten what is real.",
    targetChapterUrl: "/novels/transmigrated-villain-childhood-friend/chapters/7",
    publishedAt: "2025-01-15T00:00:00.000Z",
  },
];
