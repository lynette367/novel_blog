import type {
  Novel,
  CurrentlyReviewingNovel,
  SanityNovel,
  RawNovelResult,
  LatestPolishedChapter,
} from "./types";
import { coverThumbUrl, ogImageUrl } from "./image-utils";

const GENERIC_PLACEHOLDER_DESC =
  "A compelling story that explores themes of family, love, and personal growth. Follow the journey of complex characters as they navigate life's challenges.";

export function cleanDescriptionText(text?: string | null): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim();
  if (!trimmed || /^[.\s…-]+$/.test(trimmed)) return undefined;
  if (trimmed === GENERIC_PLACEHOLDER_DESC) return undefined;
  return trimmed;
}

export function normalizeChapterTitle(rawTitle: string, chapterNumber: number): string {
  const trimmed = (rawTitle || "").trim();
  if (!trimmed) return `Chapter ${chapterNumber}`;
  // Strip redundant patterns like "Chapter 1: 1" or "Chapter 1: Chapter 1"
  if (/^Chapter\s+\d+\s*:\s*(?:Chapter\s+)?\d+$/i.test(trimmed)) {
    return `Chapter ${chapterNumber}`;
  }
  return trimmed;
}

const NOVEL_FALLBACK_METADATA: Record<
  string,
  { metaDescription: string; description: string }
> = {
  "Turn-Bad-Ending-into-Happily-Ever-After": {
    metaDescription:
      "After waking up reborn in a fragile body on the brink of ruin, Rosemary vows to rewrite her tragic past marriage and turn a bad ending into a happily ever after.",
    description:
      "Waking up reborn in a fragile body after a tragic betrayal, Rosemary returns to her youth before everything fell apart. Carrying the memories of her past life and the loss of her family, she vows to rewrite her fate and turn a bad ending into a happily ever after.",
  },
  being_a_strategist_in_the_three_kingdoms_era: {
    metaDescription:
      "Transmigrated into the chaotic Three Kingdoms era after the coalition against Dong Zhuo collapses, a modern strategist rises from humble guard to shape the empire.",
    description:
      "Transmigrated into the third year of Chuping during the chaotic Three Kingdoms era, just after the alliance against Dong Zhuo falls apart, an ordinary guard uses modern foresight and strategic brilliance to survive warlords and reshape history.",
  },
  i_rule_the_world_with_my_beauty: {
    metaDescription:
      "Set in the imperial palace, follow a stunningly beautiful emperor and his devoted inner court in this historical Chinese Danmei & BL web novel in English.",
    description:
      "In the cold spring of the imperial capital, a breathtakingly beautiful emperor awakens in the dragon bed. Behind the silk curtains of the palace, power struggles, devotion, and romance unfold across the empire.",
  },
  i_spent_two_lifetimes_living_off_others: {
    metaDescription:
      "Reborn into his teenage body after a brutal death, Du Zhen gets a second chance at life, love, and redemption in this Chinese Danmei rebirth novel.",
    description:
      "After suffering a brutal demise, Du Zhen awakens in shock to find himself reborn back in his teenage bedroom with his body whole again. Given a second lifetime, he sets out to change his tragic fate and lean on those who truly cherish him.",
  },
  the_tyrants_male_consort: {
    metaDescription:
      "After a plane crash, Xue Yao transmigrates into an ancient world where he becomes entangled with a ruthless ruler as the tyrant's male consort.",
    description:
      "When the roar of a plane crash fades, Xue Yao wakes up in the body of a young boy in an ancient era. Navigating a treacherous imperial court, he becomes the indispensable male consort to a feared tyrant.",
  },
  travel_back_in_time_to_build_up_the_empire: {
    metaDescription:
      "Mechanical engineering graduate Zheng Yuming travels back in time, using modern technology and infrastructure to build a thriving empire from the ground up.",
    description:
      "Twenty-eight-year-old mechanical design graduate Zheng Yuming unexpectedly travels back in time. Armed with modern engineering knowledge and practical business sense, he sets out to develop agriculture, industry, and infrastructure to build up an empire.",
  },
  wife_are_paramount: {
    metaDescription:
      "Reborn on a freezing winter night, Prince Jing Shao vows to protect and cherish his loyal strategist wife Mu Hanzhang in the classic historical Danmei Wife is First.",
    description:
      "In the freezing winter of the twenty-fourth year of Hongzheng, Prince Jing Shao is given a second chance at life. Remembering how his neglected male wife Mu Hanzhang stayed loyal until death, Jing Shao vows to put his wife above all else in this beloved historical Danmei romance.",
  },
  yet_you_love_a_jerk: {
    metaDescription:
      "Read Yet You Love A Jerk (In Love with an Idiot) by Shui Qian Cheng in English. The iconic 188 Boy Group Danmei novel starring Jian Suiying and Li Yu.",
    description:
      "Yet You Love A Jerk by Shui Qian Cheng — I love you deeply, yet you love a jerk. That jerk doesn't love you back, and you're even more of a jerk than he is. An iconic 188 Boy Group urban Danmei novel starring domineering boss Jian Suiying and Li Yu.",
  },
  he_came_from_the_fire: {
    metaDescription:
      "Rescued from a raging house fire at sixteen by firefighter Lin Luchu, actress Nanchu reunites with him five years later on the front lines of life and death.",
    description:
      "When sixteen-year-old Nanchu's home catches fire, she is rescued from the flames by a man in uniform. Five years later, famous actress Nanchu reunites with firefighter Lin Luchu as they face life, death, and enduring love on the front lines.",
  },
};

/**
 * Sanity 原始小说数据 → 前端 Novel 格式。
 * 标签完全由 Sanity 后台动态返回，不做任何硬编码注入。
 */
export function transformNovel(sanityNovel: SanityNovel): Novel {
  const slug = sanityNovel.slug?.current || "";
  const fallback = NOVEL_FALLBACK_METADATA[slug];

  const cleanedMetaDesc =
    cleanDescriptionText(sanityNovel.seo?.metaDescription) ||
    fallback?.metaDescription ||
    cleanDescriptionText(sanityNovel.excerpt);

  const cleanedDescription =
    cleanDescriptionText(sanityNovel.description) ||
    fallback?.description ||
    cleanedMetaDesc ||
    `Read ${sanityNovel.title} online in English. Complete Chinese Danmei & Asian BL web novel chapters.`;

  const cleanedExcerpt =
    cleanedMetaDesc ||
    cleanDescriptionText(sanityNovel.excerpt) ||
    cleanedDescription.slice(0, 160);

  return {
    _id: sanityNovel._id,
    title: sanityNovel.title,
    slug,
    excerpt: cleanedExcerpt,
    coverImage: sanityNovel.coverImage ? coverThumbUrl(sanityNovel.coverImage) : "",
    coverImageAlt: sanityNovel.coverImage?.alt,
    path: `/novels/${slug}`,
    totalChapters: sanityNovel.totalChapters || 0,
    totalWordCount: sanityNovel.totalWordCount || 0,
    description: cleanedDescription,
    tags: sanityNovel.tags || [],
    seo: {
      metaTitle: sanityNovel.seo?.metaTitle,
      metaDescription: cleanedMetaDesc || cleanedExcerpt,
      ogTitle: sanityNovel.seo?.ogTitle,
      ogDescription:
        cleanDescriptionText(sanityNovel.seo?.ogDescription) ||
        cleanedMetaDesc ||
        cleanedExcerpt,
      ogImage: sanityNovel.seo?.ogImage
        ? ogImageUrl(sanityNovel.seo.ogImage)
        : undefined,
    },
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

  const slug = result.slug || "";
  const fallback = NOVEL_FALLBACK_METADATA[slug];
  const cleanedExcerpt =
    cleanDescriptionText(result.excerpt) ||
    fallback?.metaDescription ||
    "";
  const cleanedDescription =
    cleanDescriptionText(result.description) ||
    fallback?.description ||
    cleanedExcerpt;

  return {
    _id: result._id,
    title: result.title,
    slug,
    excerpt: cleanedExcerpt,
    description: cleanedDescription,
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
