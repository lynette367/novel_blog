import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata, Route } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import {
  getAllWeeklyQuoteSlugs,
  getWeeklyQuoteBySlug,
  type WeeklyQuoteData,
  type QuoteBlock,
} from "@/lib/novels";

export const dynamic = "force-static";
export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function blockText(block: QuoteBlock): string {
  if (typeof block === "string") return block;
  return "em" in block ? block.em : block.quote;
}

function readingMinutes(quote: WeeklyQuoteData): number {
  if (!quote.sections || quote.sections.length === 0) return 1;
  const text = quote.sections
    .flatMap((s) => s.blocks.map(blockText))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function renderBlock(block: QuoteBlock, index: number) {
  if (typeof block === "string") {
    return (
      <p
        key={index}
        className="text-base sm:text-lg leading-8 text-[#4a3b32] mb-5"
      >
        {block}
      </p>
    );
  }

  if ("em" in block) {
    return (
      <p
        key={index}
        className="my-10 text-center font-serif italic text-xl sm:text-2xl leading-relaxed text-[#d66b85] whitespace-pre-line"
      >
        {block.em}
      </p>
    );
  }

  return (
    <blockquote
      key={index}
      className="my-8 rounded-r-2xl border-l-4 border-[#f4a7b9] bg-[#fdf2f7]/70 px-6 py-5 font-serif italic text-lg sm:text-xl leading-relaxed text-[#2b1f2d]"
    >
      {block.quote}
    </blockquote>
  );
}

/* ------------------------------------------------------------------ */
/* Routing / Metadata                                                  */
/* ------------------------------------------------------------------ */

type PageParams = {
  slug: string;
};

export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await getAllWeeklyQuoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quote = await getWeeklyQuoteBySlug(slug);

  if (!quote) {
    return {
      title: "Quote Not Found",
      description: "The requested weekly quote could not be located.",
    };
  }

  const seoTitle = `${quote.title} | ${SITE_NAME}`;
  const seoDescription =
    quote.seoDescription ||
    quote.insight ||
    `Weekly Danmei quote from ${quote.novelTitle}: "${quote.quoteText}"`;
  const canonicalUrl = absoluteUrl(`/weekly-quotes/${quote.slug}`);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      quote.novelTitle,
      "Danmei translation",
      "Chinese BL novel",
      "translation insights",
      "Weekly quotes",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: quote.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function WeeklyQuoteDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const quote = await getWeeklyQuoteBySlug(slug);

  if (!quote) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/weekly-quotes/${quote.slug}`);
  const targetUrl = (quote.targetUrl || quote.targetChapterUrl || "/novels") as Route;
  const minutes = readingMinutes(quote);
  const attribution = [quote.novelTitle, quote.chapter]
    .filter(Boolean)
    .join(" · ");

  // JSON-LD BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Weekly Quotes",
        item: absoluteUrl("/weekly-quotes"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: quote.title,
        item: canonicalUrl,
      },
    ],
  };

  // JSON-LD Article
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: quote.title,
    description: quote.seoDescription || quote.insight || quote.quoteText,
    datePublished: quote.publishedAt,
    mainEntityOfPage: canonicalUrl,
    about: {
      "@type": "Book",
      name: quote.novelTitle,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <>
      <SiteHeader activePath="quotes" />

      {/* JSON-LD Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="page-shell pt-6 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs text-[#7d6f67]">
          <li>
            <Link href="/" className="text-[#f4a7b9] hover:underline no-underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#f7c6d9]">/</li>
          <li>
            <Link
              href={"/weekly-quotes" as Route}
              className="text-[#f4a7b9] hover:underline no-underline"
            >
              Weekly Quotes
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#f7c6d9]">/</li>
          <li className="text-[#4a3b32] font-medium truncate max-w-[200px] sm:max-w-md">
            {attribution}
          </li>
        </ol>
      </nav>

      <main className="page-shell py-8 sm:py-12">
        <article className="max-w-3xl mx-auto">

          {/* Editorial Quote Card Showcase */}
          <div className="rounded-3xl border border-[#f7c6d9]/50 bg-gradient-to-br from-[#fffdfa] via-[#fff9f6] to-[#fdf2f7] p-8 sm:p-14 shadow-sm text-center relative overflow-hidden">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fde2e8] border border-[#f8bccb] rounded-full text-[11px] font-bold text-[#d66b85] uppercase tracking-widest mb-8">
              <span>✦</span>
              <span>Weekly Danmei Quote</span>
            </div>

            {/* Page H1 Title */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#2b1f2d] leading-snug tracking-wide mb-8 max-w-2xl mx-auto">
              {quote.title}
            </h1>

            {/* Quote Blockquote */}
            <div className="relative my-8 px-4 sm:px-8">
              <span
                className="text-4xl sm:text-6xl font-serif text-[#f4a7b9]/40 absolute -top-4 -left-2 select-none"
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#2b1f2d] font-normal leading-relaxed text-center">
                {quote.quoteText}
              </blockquote>
              <span
                className="text-4xl sm:text-6xl font-serif text-[#f4a7b9]/40 absolute -bottom-8 -right-2 select-none"
                aria-hidden="true"
              >
                ”
              </span>
            </div>

            {/* Decorative divider */}
            <div
              className="flex items-center justify-center text-[#f4a7b9] text-base my-8 select-none"
              aria-hidden="true"
            >
              ✦ ✦ ✦
            </div>

            {/* Novel & Chapter Attribution */}
            <cite className="block not-italic space-y-1 mb-8">
              <span className="block font-serif text-lg sm:text-xl font-medium text-[#4a3b32]">
                《{quote.novelTitle}》
              </span>
              {quote.chapter && (
                <span className="block text-xs sm:text-sm text-[#8c7d75] font-medium tracking-wide">
                  {quote.chapter}
                </span>
              )}
            </cite>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href={targetUrl}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#f4a7b9] to-[#d66b85] text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
              >
                Read {quote.novelTitle} →
              </Link>
            </div>
          </div>

          {/* A Note for Readers (Long-form Editorial) */}
          {quote.sections && quote.sections.length > 0 && (
            <section className="mt-12 sm:mt-16">
              <div className="flex items-center justify-between gap-3 pb-4 mb-8 border-b border-[#f7c6d9]/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl" aria-hidden="true">✨</span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2b1f2d]">
                    A Note for Readers
                  </h2>
                </div>
                <span className="text-xs text-[#7d6f67] whitespace-nowrap">
                  {minutes} min read
                </span>
              </div>

              {quote.sections.map((section, sIndex) => (
                <div key={sIndex} className={sIndex > 0 ? "mt-12" : undefined}>
                  {section.heading && (
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2b1f2d] leading-snug mb-6">
                      {section.heading}
                    </h3>
                  )}
                  {section.blocks.map((block, bIndex) => renderBlock(block, bIndex))}
                </div>
              ))}

              <div className="mt-12 pt-6 border-t border-[#f7c6d9]/40 flex items-center justify-between text-xs text-[#7d6f67]">
                <Link
                  href={targetUrl}
                  className="text-[#d66b85] font-semibold hover:underline no-underline"
                >
                  Read This Chapter →
                </Link>
              </div>
            </section>
          )}

          {/* Translator's Insight Note (Standard Quote Insight) */}
          {(!quote.sections || quote.sections.length === 0) && quote.insight && (
            <section className="mt-10 rounded-2xl border border-[#c9a96e]/40 bg-gradient-to-br from-[#fffdfa] to-[#fdf9f0] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3.5 mb-3 border-b border-[#c9a96e]/25">
                <span className="text-xl">✨</span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#6b5738]">
                  Translator&apos;s Soul &amp; Insight
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#6b5738] leading-relaxed italic">
                &ldquo;{quote.insight}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-[#c9a96e]/20 flex items-center justify-between text-xs text-[#9c8560]">
                <span>Human-translated &amp; polished with love</span>
                <Link
                  href={targetUrl}
                  className="text-[#8b6f3f] font-semibold hover:underline no-underline"
                >
                  Continue to Chapter →
                </Link>
              </div>
            </section>
          )}

          {/* Bottom Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/novels"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#f4a7b9] hover:text-[#d66b85] underline underline-offset-4 transition-colors no-underline"
            >
              ← Explore Full Danmei Library
            </Link>
          </div>

        </article>
      </main>

      <SiteFooter />
    </>
  );
}
