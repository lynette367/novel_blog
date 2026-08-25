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
    title: "Read Chinese Danmei & BL Novels",
    description:
      "High-quality English version of popular Chinese Danmei & BL novels. Explore Xianxia, Wuxia, and modern BL stories. Read exclusive daily updates!",
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title: "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
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
      title: "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
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

      {/* SEO H1 */}
      <div className="page-shell pt-6 pb-2">
        <h1 className="text-center font-serif italic text-base font-normal text-[#c87f9b] tracking-wide leading-snug">
          {SITE_NAME} — High-Quality Chinese Danmei &amp; BL Novels in English
        </h1>
      </div>

      {/* Hero section */}
      <section className="page-shell pt-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <HeroReviewingBanner novel={reviewingNovel} />
          <HeroAnnouncementPanel />
        </div>
      </section>

      <main className="page-shell pt-4 pb-12">
        {/* Latest Refined Chapters */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
              Latest Refined Chapters
            </h2>
          </div>
          <LatestPolishedGrid chapters={latestPolishedChapters} />
        </section>

        {/* Explore Library */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
              Explore the Library
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNovels.map((novel, index) => (
              <NovelCard key={novel.slug} novel={novel} priority={index === 0} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/novels"
              className="inline-flex items-center gap-2 text-[#e499b3] font-semibold text-base px-8 py-3.5 border-2 border-[#e499b3] rounded-full hover:bg-[#e499b3] hover:text-white transition-all no-underline"
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
