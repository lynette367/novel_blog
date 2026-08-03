export const siteConfig = {
  // Site Metadata
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Cross The Line",
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "Free Chinese Danmei Novels & BL Web Fiction in English",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "High-quality English translations of popular web novels. Discover stories, daily updates, and exclusive chapters.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.crosstheline.press",

  // Default Fallback Info
  defaultAuthor: "Anonymous",
  defaultTranslator: "Translation Team",

  // Support / Donation Links (Leave empty to hide buttons)
  supportLinks: {
    buyMeACoffee: process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE || "https://buymeacoffee.com/yqying95b",
    kofi: process.env.NEXT_PUBLIC_KOFI || "https://ko-fi.com/crosstheline46370",
    patreon: process.env.NEXT_PUBLIC_PATREON || "https://www.patreon.com/c/CrosstheLine911",
  },

  // Google Analytics ID
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

export default siteConfig;
