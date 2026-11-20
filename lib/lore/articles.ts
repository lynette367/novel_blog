export const LORE_PATH = "/lore";

export type LoreArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  /** Optional Sanity editorialImage.key for reusing a shared asset across Lore, homepage, and recs. */
  imageKey?: string;
};

export const loreArticles: LoreArticle[] = [
  {
    slug: "heaven-officials-blessing-merit-and-godhood",
    title:
      "Merit, Godhood, and Xie Lian: The Chinese Belief Behind Heaven Official's Blessing",
    shortTitle: "Merit, Godhood, and Xie Lian (TGCF)",
    category: "Chinese Mythology · Heaven Official's Blessing",
    summary:
      "How traditional Chinese beliefs make gods through merit, how the heavenly court corrupts that ideal, and how Xie Lian redefines compassion.",
  },
  {
    slug: "triad-ranks",
    title: "Hong Kong Triad Ranks Explained: History vs. the Novel",
    shortTitle: "Hong Kong Triad Ranks Explained",
    category: "1970s Hong Kong · Hung Mun History",
    summary:
      "What triad numbers 489, 426, 415, 432, and 49 meant in Hung Mun tradition and 1970s Hong Kong, and how fiction adapts them.",
  },
];

export const loreArticlePath = (slug: string) => `${LORE_PATH}/${slug}`;
