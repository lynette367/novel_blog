import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NovelCard } from "@/components/novel-card";
import { HeroReviewingBanner } from "@/components/hero-reviewing-banner";
import { HeroAnnouncementPanel } from "@/components/hero-announcement-panel";
import { LatestPolishedGrid } from "@/components/latest-polished-grid";
import {
  getFeaturedNovels,
  getCurrentlyReviewingNovel,
  getLatestPolishedChapters,
} from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

import siteConfig from "@/site.config";

const getCachedFeaturedNovels = cache(getFeaturedNovels);
const getCachedCurrentlyReviewingNovel = cache(getCurrentlyReviewingNovel);
const getCachedLatestPolishedChapters = cache(getLatestPolishedChapters);

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
      name: `${SITE_NAME} in English`,
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
      "Read Chinese Danmei & BL Novels",
    description:
      "High-quality English version of popular Chinese Danmei & BL novels. Explore Xianxia, Wuxia, and modern BL stories. Read exclusive daily updates!",
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
  const [featuredNovels, reviewingNovel, latestPolishedChapters] = await Promise.all([
    getCachedFeaturedNovels(),
    getCachedCurrentlyReviewingNovel(),
    getCachedLatestPolishedChapters(6),
  ]);

  return (
    <>
      <SiteHeader activePath="home" />

      {/* 首页唯一 H1 标签：承载全站核心 SEO 关键词 */}
      <div className="hero-section-wrapper">
        <h1 className="homepage-main-heading mb-0">
          {SITE_NAME} — High-Quality Chinese Danmei & BL Novels in English
        </h1>
      </div>

      {/* 第一屏：Hero 区块（展示正在人工审核校对的小说） */}
      <section className="hero-section-wrapper" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="hero-split-grid">
          <HeroReviewingBanner novel={reviewingNovel} />
          <HeroAnnouncementPanel />
        </div>
      </section>

      <main className="main-content pt-4">
        {/* 第二屏：Latest Human TL区块（展示最近完成人工审核精修的章节卡片列表） */}
        <section className="mb-14">
          <div className="content-header">
            <h2>Latest Refined Chapters</h2>
          </div>

          <LatestPolishedGrid chapters={latestPolishedChapters} />
        </section>

        {/* 第三屏：Explore the Library 区块（展示全部/精选小说列表） */}
        <section className="mb-8">
          <div className="content-header">
            <h2>Explore the Library</h2>
          </div>

          <div className="novels-grid featured-grid">
            {featuredNovels.map((novel, index) => (
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
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
