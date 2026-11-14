import Link from "next/link";
import { cache } from "react";
import type { Metadata, Route } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getHeroFeaturedNovel,
  getLatestPolishedChapters,
} from "@/lib/novels";
import { BL_RECS_PATH, clusterPath, clusters } from "@/lib/bl-recs";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import siteConfig from "@/site.config";

const getCachedHeroFeaturedNovel = cache(getHeroFeaturedNovel);

function formatUpdateDate(isoDate?: string): string | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatChapterLabel(chapterNumber: number, chapterTitle: string): string {
  const trimmed = chapterTitle.trim();
  if (!trimmed) return `Chapter ${chapterNumber}`;
  if (trimmed.toLowerCase().startsWith("chapter")) {
    return trimmed;
  }
  return `Chapter ${chapterNumber}: ${trimmed}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const heroNovel = await getCachedHeroFeaturedNovel();

  const heroImage = heroNovel?.coverImage || "";
  const heroImageAlt = heroNovel ? heroNovel.title : SITE_NAME;

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
  };
}

export default async function HomePage() {
  const [rawHeroNovel, recentChapters] = await Promise.all([
    getCachedHeroFeaturedNovel(),
    getLatestPolishedChapters(4),
  ]);

  const heroImage = rawHeroNovel?.coverImage || "/assets/images/primitive-regress.jpg";
  const heroNovelTitle = rawHeroNovel?.title || "Featured Chinese Danmei Novel";

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
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absoluteUrl("/novels/")}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader activePath="home" />

      <main className="page-shell">
        {/* Top H1 */}
        <div className="pt-6 pb-4 sm:pt-8 sm:pb-5">
          <h1 className="font-serif italic text-sm sm:text-base font-normal text-[#f4a7b9] tracking-wide">
            Explore Chinese Danmei Novels &amp; BL Recommendations
          </h1>
        </div>

        {/* Hero: 2/3 Left Banner + 1/3 Right Navigation List */}
        <section
          aria-label="Featured destinations"
          className="pb-10 sm:pb-12 border-b border-[#f7c6d9] grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch"
        >
          {/* Left 2/3: Large Clickable Banner -> Novel Library */}
          <Link
            href={"/novels/" as Route}
            className="group relative lg:col-span-2 block overflow-hidden rounded-2xl min-h-[340px] sm:min-h-[420px] bg-[#2b1f2d] no-underline shadow-sm"
          >
            <img
              src={heroImage}
              alt={`${heroNovelTitle} — Chinese danmei novel in the Cross The Line reading library`}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Dark + peach-tinted gradient overlay for text legibility */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#2b1f2d]/90 via-[#2b1f2d]/45 to-transparent"
              aria-hidden="true"
            />

            {/* Bottom-left overlay content */}
            <div className="relative z-10 flex h-full min-h-[340px] sm:min-h-[420px] flex-col justify-end p-6 sm:p-8 md:p-10">
              <span className="inline-flex w-fit items-center rounded-full bg-[#f4a7b9]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white mb-3">
                Novel Library
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white leading-snug tracking-tight">
                Stories Worth Crossing the Line For.
              </h2>
              <p className="mt-2 max-w-xl text-sm sm:text-base text-[#ffe3ef]/90 leading-relaxed">
                Find a story to get lost in — translated Chinese danmei novels and regular chapter updates.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#f7c6d9]">
                <span className="underline-offset-4 group-hover:underline">
                  Explore the Library
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Right 1/3: BL Recs & Guides Navigation List */}
          <div className="lg:col-span-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#f7c6d9] pt-6 lg:pt-0 lg:pl-8">
            <div>
              <div className="flex items-baseline justify-between gap-2 pb-3 border-b-2 border-[#f4a7b9]">
                <h2 className="font-serif text-lg sm:text-xl font-normal tracking-wide text-[#2b1f2d]">
                  BL Recs &amp; Guides
                </h2>
                <Link
                  href={`${BL_RECS_PATH}/` as Route}
                  className="text-xs font-semibold uppercase tracking-wider text-[#f4a7b9] hover:text-[#2b1f2d] transition-colors no-underline"
                >
                  View All
                </Link>
              </div>

              <ul className="divide-y divide-[#f7c6d9]/70 list-none p-0 m-0">
                {clusters.slice(0, 5).map((cluster) => (
                  <li key={cluster.slug}>
                    <Link
                      href={`${clusterPath(cluster.slug)}/` as Route}
                      className="group flex items-center justify-between gap-3 py-3.5 no-underline transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#f4a7b9]">
                          {cluster.tags[0]} · {cluster.count} {cluster.count === 1 ? "novel" : "novels"}
                        </span>
                        <span className="mt-0.5 block font-serif text-sm sm:text-base font-medium text-[#2b1f2d] leading-snug transition-colors group-hover:text-[#f4a7b9] line-clamp-2">
                          {cluster.title}
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-sm text-[#f4a7b9] transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 mt-2 border-t border-[#f7c6d9]/70">
              <Link
                href={`${BL_RECS_PATH}/` as Route}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#f4a7b9] hover:text-[#2b1f2d] transition-colors no-underline"
              >
                <span className="underline-offset-4 group-hover:underline">
                  Explore All Recommendations
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* C. Recently Updated */}
        {recentChapters.length > 0 && (
          <section
            aria-labelledby="recently-updated-heading"
            className="py-10 sm:py-12 border-b border-[#f7c6d9]"
          >
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#f4a7b9]">
                  Latest Releases
                </p>
                <h2
                  id="recently-updated-heading"
                  className="mt-1 font-serif text-xl sm:text-2xl font-normal text-[#2b1f2d]"
                >
                  Recently Updated
                </h2>
              </div>
              <Link
                href={"/novels/" as Route}
                className="text-xs sm:text-sm font-semibold text-[#f4a7b9] hover:text-[#2b1f2d] transition-colors no-underline"
              >
                All Novels →
              </Link>
            </div>

            <ul className="divide-y divide-[#f7c6d9]/60 list-none p-0 m-0">
              {recentChapters.slice(0, 4).map((ch) => {
                const formattedDate = formatUpdateDate(ch.updatedAt);
                const chapterHref = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}/` as Route;

                return (
                  <li key={ch._id} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      href={chapterHref}
                      className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 no-underline transition-colors"
                    >
                      <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <span className="font-serif font-semibold text-base text-[#2b1f2d] group-hover:text-[#f4a7b9] transition-colors">
                          {ch.novelTitle}
                        </span>
                        <span className="hidden sm:inline text-[#f4a7b9]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-sm text-[#5a4a42] truncate">
                          {formatChapterLabel(ch.chapterNumber, ch.chapterTitle)}
                        </span>
                      </div>

                      {formattedDate && (
                        <time
                          dateTime={ch.updatedAt}
                          className="text-xs text-[#8c7d75] shrink-0 tabular-nums"
                        >
                          {formattedDate}
                        </time>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* D. Explore More */}
        <section
          aria-labelledby="explore-more-heading"
          className="py-10 sm:py-12 border-b border-[#f7c6d9]"
        >
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#f4a7b9]">
            Beyond the Chapters
          </p>
          <h2
            id="explore-more-heading"
            className="mt-1 font-serif text-xl sm:text-2xl font-normal text-[#2b1f2d] mb-6"
          >
            Explore More
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#f7c6d9]/70">
            {/* 1. Literary & Cultural Guides */}
            <div className="pb-6 md:pb-0 md:pr-8 lg:pr-12 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#2b1f2d]">
                  <Link
                    href={"/lore/triad-ranks/" as Route}
                    className="no-underline text-inherit hover:text-[#f4a7b9] transition-colors"
                  >
                    Literary &amp; Cultural Guides
                  </Link>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#5a4a42] leading-relaxed">
                  Explore the history, culture and literary context behind Chinese danmei.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href={"/lore/triad-ranks/" as Route}
                  className="text-sm font-semibold text-[#f4a7b9] hover:text-[#2b1f2d] transition-colors no-underline"
                >
                  Read Guides →
                </Link>
              </div>
            </div>

            {/* 2. Weekly Quotes */}
            <div className="pt-6 md:pt-0 md:pl-8 lg:pl-12 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#2b1f2d]">
                  <Link
                    href={"/weekly-quotes/" as Route}
                    className="no-underline text-inherit hover:text-[#f4a7b9] transition-colors"
                  >
                    Weekly Quotes
                  </Link>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#5a4a42] leading-relaxed">
                  Memorable lines, character insights and literary moments.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href={"/weekly-quotes/" as Route}
                  className="text-sm font-semibold text-[#f4a7b9] hover:text-[#2b1f2d] transition-colors no-underline"
                >
                  Browse Quotes →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* E. About section */}
        <section
          aria-labelledby="about-heading"
          className="py-10 sm:py-12 max-w-2xl mx-auto text-center"
        >
          <h2
            id="about-heading"
            className="text-xs uppercase tracking-[0.18em] font-semibold text-[#f4a7b9] mb-2"
          >
            About
          </h2>
          <p className="font-serif text-base sm:text-lg text-[#2b1f2d] leading-relaxed">
            Cross The Line is an independent space for Chinese danmei fiction, translation and literary discovery.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
