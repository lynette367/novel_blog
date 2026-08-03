import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NovelCard } from "@/components/novel-card";
import { ProofreadBanner } from "@/components/proofread-banner";
import { getFeaturedNovels, getRecentlyProofreadChapter } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

import siteConfig from "@/site.config";

// React cache() deduplicates calls with the same arguments within one render pass.
// Both generateMetadata and the page component call this — only one network
// request is made to Sanity.
const getCachedFeaturedNovels = cache(getFeaturedNovels);

export async function generateMetadata(): Promise<Metadata> {
  const featuredNovels = await getCachedFeaturedNovels();

  const firstNovel = featuredNovels[0];
  const heroImage = firstNovel ? firstNovel.coverImage : "/assets/images/0.jpg";
  const heroImageAlt = firstNovel
    ? firstNovel.coverImageAlt || firstNovel.title
    : SITE_NAME;

  const sameAs = [
    siteConfig.supportLinks.buyMeACoffee,
    siteConfig.supportLinks.kofi,
    siteConfig.supportLinks.patreon,
  ].filter(Boolean);

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: SITE_NAME,
      url: absoluteUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: absoluteUrl("/novels"),
        "query-input": "required name=q",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: `${SITE_NAME} Translations`,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/images/0.jpg"),
        width: 600,
        height: 600,
      },
      description: siteConfig.description,
      sameAs,
    },
  ];

  return {
    title:
      "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
    description:
      "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories. Join our community for daily updates and exclusive chapters.",
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title:
        "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
      description:
        "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories. Join our community for daily updates and exclusive chapters.",
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
      description:
        "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories.",
      images: [heroImage],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function HomePage() {
  const featuredNovels = await getCachedFeaturedNovels();
  const recentProofread = await getRecentlyProofreadChapter();

  return (
    <>
      <SiteHeader activePath="home" />

      {/* 首页 Hero 区域：展示最新精修章节 Last Polished Chapter */}
      <ProofreadBanner chapter={recentProofread} />

      <main className="main-content">
        {/* 首页唯一 H1 标签：承载全站核心 SEO 关键词 */}
        <h1 className="homepage-main-heading">
          {SITE_NAME} — High-Quality Chinese Danmei & BL Novel Translations
        </h1>

        <div className="content-header">
          <h2>Latest Updates</h2>
        </div>

        <div className="novels-grid featured-grid">
          {featuredNovels.map((novel, index) => (
            // Pass priority to the first card so its image is preloaded
            <NovelCard key={novel.slug} novel={novel} priority={index === 0} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/novels"
            className="read-btn"
            style={{
              fontSize: "1.1rem",
              padding: "1rem 2rem",
              border: "2px solid #8b7355",
              borderRadius: "50px",
            }}
          >
            View All Novels →
          </Link>
        </div>
      </main>

      <section className="reader-support" id="support">
        <div className="support-container">
          <h2>Support Our Translations</h2>
          <p className="support-subtitle">
            Your support helps us bring more beautiful stories to life.
            <br />
            Every contribution makes a difference in keeping these translations
            free and accessible.
          </p>

          <div className="support-buttons">
            {siteConfig.supportLinks.buyMeACoffee && (
              <a
                href={siteConfig.supportLinks.buyMeACoffee}
                target="_blank"
                className="support-card"
                rel="noopener noreferrer"
              >
                <div className="support-icon">☕</div>
                <h3>Buy Me a Coffee</h3>
                <p>
                  Support with a one-time coffee donation. Every cup fuels the
                  next chapter!
                </p>
              </a>
            )}

            {siteConfig.supportLinks.kofi && (
              <a
                href={siteConfig.supportLinks.kofi}
                target="_blank"
                className="support-card"
                rel="noopener noreferrer"
              >
                <div className="support-icon">💝</div>
                <h3>Ko-fi</h3>
                <p>
                  Show your appreciation with a tip. Your generosity keeps the
                  translations flowing.
                </p>
              </a>
            )}

            {siteConfig.supportLinks.patreon && (
              <a
                href={siteConfig.supportLinks.patreon}
                target="_blank"
                className="support-card"
                rel="noopener noreferrer"
              >
                <div className="support-icon">🎨</div>
                <h3>Patreon</h3>
                <p>
                  Become a patron for exclusive content, early access, and
                  behind-the-scenes insights.
                </p>
              </a>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
