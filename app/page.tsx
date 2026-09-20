import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroReviewingBanner } from "@/components/hero-reviewing-banner";
import { HeroAnnouncementPanel } from "@/components/hero-announcement-panel";
import { WeeklyQuote } from "@/components/weekly-quote";
import { NovelSection } from "@/components/novel-section";
import {
  getHeroFeaturedNovel,
  getNovelHomepageChapters,
  getReviewingNovelsWithChapters,
  getLatestWeeklyQuote,
  transformReviewingNovel,
} from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

import siteConfig from "@/site.config";

const getCachedHeroFeaturedNovel = cache(getHeroFeaturedNovel);

export async function generateMetadata(): Promise<Metadata> {
  const heroNovel = await getCachedHeroFeaturedNovel();

  const heroImage = heroNovel?.coverImage || "";
  const heroImageAlt = heroNovel ? heroNovel.title : SITE_NAME;

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
      name: "Danmei Novels Online",
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
      name: "Danmei Novels Online",
      url: absoluteUrl("/"),
      ...(heroImage
        ? {
            logo: {
              "@type": "ImageObject",
              url: heroImage,
              width: 600,
              height: 600,
            },
          }
        : {}),
      description: siteConfig.description,
      sameAs,
    },
  ];

  return {
    title: {
      absolute: "Read Chinese Danmei & BL Web Novels Online in English",
    },
    description:
      "High-quality English versions of popular Chinese Danmei & BL web novels. Explore Xianxia, Wuxia, and modern BL stories. Read exclusive daily updates!",
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title: "Read Chinese Danmei & BL Web Novels Online in English",
      description:
        "Discover top-rated Chinese Danmei and Asian BL web novels in English. Explore Xianxia, Wuxia, and modern romances with daily chapters.",
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: heroImageAlt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: "Read Chinese Danmei & BL Web Novels Online in English",
      description:
        "Discover top-rated Chinese Danmei and Asian BL web novels in English. Explore Xianxia, Wuxia, and modern romances with daily chapters.",
      images: heroImage ? [heroImage] : [],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function HomePage() {
  const rawHeroNovel = await getCachedHeroFeaturedNovel();
  const heroSlug = rawHeroNovel?.slug ?? "";

  // Fetch all data concurrently: hero chapters + other reviewing novels + latest quote
  const [heroChapters, reviewingResult, latestQuote] = await Promise.all([
    heroSlug
      ? getNovelHomepageChapters(heroSlug)
      : Promise.resolve({ patreonChapters: [], polishedChapters: [] }),
    getReviewingNovelsWithChapters(heroSlug, 2),
    getLatestWeeklyQuote(),
  ]);

  const { sections: reviewingSections, overflow } = reviewingResult;

  const heroNovel = rawHeroNovel
    ? transformReviewingNovel(rawHeroNovel, heroChapters.patreonChapters)
    : null;

  return (
    <>
      <SiteHeader activePath="home" />

      {/* SEO H1 */}
      <div className="page-shell pt-6 pb-2">
        <h1 className="text-center font-serif italic text-base font-normal text-[#f4a7b9] tracking-wide leading-snug">
          Read Chinese Danmei &amp; Asian BL Novels Online in English
        </h1>
      </div>

      {/* Hero banner */}
      <section className="page-shell pt-4 pb-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#fff9f5] via-[#fff4f8] to-[#fdf0f6] border border-[#f7c6d9]/40 p-6 sm:p-8 shadow-sm">
          <HeroReviewingBanner novel={heroNovel} />
        </div>
      </section>

      <main className="page-shell pt-2 pb-12">

        {/* Hero novel — same NovelSection, no overview strip */}
        {heroNovel && (
          <NovelSection
            novel={heroNovel}
            patreonChapters={heroChapters.patreonChapters}
            polishedChapters={heroChapters.polishedChapters}
            showOverview={false}
          />
        )}

        {/* All other refining novels — same NovelSection, with overview strip */}
        {reviewingSections.map(({ novel, patreonChapters, polishedChapters }) => (
          <NovelSection
            key={novel._id}
            novel={novel}
            patreonChapters={patreonChapters}
            polishedChapters={polishedChapters}
            showOverview={true}
          />
        ))}

        {/* Overflow novels (text links) */}
        {overflow.length > 0 && (
          <p className="text-sm text-[#7d6f67] mb-10">
            Also being polished:{" "}
            {overflow.map((n, i) => (
              <span key={n.slug}>
                {i > 0 && " · "}
                <Link
                  href={`/novels/${n.slug}` as any}
                  className="text-[#f4a7b9] hover:text-[#f4a7b9] font-medium transition-colors"
                >
                  {n.title}
                </Link>
              </span>
            ))}
            {" "}→{" "}
            <Link href="/novels" className="text-[#f4a7b9] hover:text-[#f4a7b9] font-medium transition-colors">
              View all
            </Link>
          </p>
        )}

        {/* Weekly Quote — below all refining novels, above Reader's Note */}
        <div className="mb-14">
          <WeeklyQuote {...latestQuote} />
        </div>

        {/* Reader's Note */}
        <div className="mb-10">
          <HeroAnnouncementPanel />
        </div>

        {/* Library CTA */}
        <div className="text-center mt-4 mb-2">
          <Link
            href="/novels"
            className="inline-flex items-center gap-2 text-[#f4a7b9] font-semibold text-base px-8 py-3.5 border-2 border-[#f4a7b9] rounded-full hover:bg-[#f4a7b9] hover:text-white transition-all no-underline"
          >
            Explore the Full Library →
          </Link>
        </div>

      </main>

      <SiteFooter />
    </>
  );
}
