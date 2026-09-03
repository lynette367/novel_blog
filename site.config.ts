export const siteConfig = {
  // Site Metadata
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Cross The Line",
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "Read Chinese Danmei & BL Web Novels Online in English",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Discover popular Chinese Danmei and Asian BL web novels in English. Daily updates, completed series, and quality chapters.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.crosstheline.press",

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
