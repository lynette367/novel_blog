import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getWeeklyQuoteBySlug,
  getAllWeeklyQuoteSlugs,
  FALLBACK_WEEKLY_QUOTE,
} from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const dynamic = "force-static";

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

  // 1. Title 优化逻辑：优先使用 Sanity 手动定制的 seoTitle，若无则智能防爆压缩
  let seoTitle: string;
  if (quote.seoTitle && quote.seoTitle.trim()) {
    seoTitle = `${quote.seoTitle.trim()} | ${SITE_NAME}`;
  } else {
    // 净化章节标识（例如 Chapter 12 压缩为 Ch 12）
    const cleanChapter = quote.chapter
      ? quote.chapter.trim().replace(/^Chapter\s*/i, "Ch ")
      : "";

    // 小说名超过 25 个字符自动无情裁剪为前 22 个字符加省略号
    const rawNovelName = quote.novelTitle || "Danmei Novel";
    const safeNovelName =
      rawNovelName.length > 25
        ? `${rawNovelName.substring(0, 22)}...`
        : rawNovelName;

    // 标题文本裁剪（保留前 22 个字符），确保整句 Title 死死卡在 55-60 字符内
    const rawTitle = quote.title || quote.quoteText || "Weekly Quote";
    const truncatedTitle =
      rawTitle.length > 24 ? `${rawTitle.substring(0, 21)}...` : rawTitle;

    seoTitle = `${truncatedTitle} | ${safeNovelName} ${cleanChapter} Quote | ${SITE_NAME}`;
  }

  // 2. Description 优化逻辑：动态计算剩余空间，严格控制在 140-150 字符安全线
  const cleanChapterForDesc = quote.chapter
    ? quote.chapter.trim().replace(/^Chapter\s*/i, "Ch ")
    : "";
  const rawNovelNameForDesc = quote.novelTitle || "Danmei Novel";
  const safeNovelNameForDesc =
    rawNovelNameForDesc.length > 25
      ? `${rawNovelNameForDesc.substring(0, 22)}...`
      : rawNovelNameForDesc;

  const descPrefix = `English translation quote from ${safeNovelNameForDesc} ${cleanChapterForDesc}: "`;
  const descSuffix = `." Read more on ${SITE_NAME}.`;
  const targetDescMax = 145;
  const maxQuoteSnippetLen = Math.max(
    20,
    targetDescMax - descPrefix.length - descSuffix.length
  );

  const rawQuoteClean = (quote.quoteText || "")
    .trim()
    .replace(/\s+/g, " ");
  const quoteSnippet =
    rawQuoteClean.length > maxQuoteSnippetLen
      ? `${rawQuoteClean.substring(0, maxQuoteSnippetLen - 3)}...`
      : rawQuoteClean;

  const seoDescription = `${descPrefix}${quoteSnippet}${descSuffix}`;
  const canonicalUrl = absoluteUrl(`/weekly-quotes/${quote.slug}`);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      quote.novelTitle || "Danmei",
      "Danmei translation",
      "Chinese BL quotes",
      "translation insights",
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
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
  };
}

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
  const chapterUrl = (quote.targetChapterUrl || "/novels") as any;

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

  // JSON-LD Quotation
  const quotationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: quote.quoteText,
    creator: {
      "@type": "Book",
      name: quote.novelTitle,
    },
    url: canonicalUrl,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quotationJsonLd) }}
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
            <Link href="/weekly-quotes" className="text-[#f4a7b9] hover:underline no-underline">
              Weekly Quotes
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#f7c6d9]">/</li>
          <li className="text-[#4a3b32] font-medium truncate max-w-[200px] sm:max-w-md">
            {quote.novelTitle} {quote.chapter}
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
              <span className="text-4xl sm:text-6xl font-serif text-[#f4a7b9]/40 absolute -top-4 -left-2 select-none" aria-hidden="true">
                “
              </span>
              <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#2b1f2d] font-normal leading-relaxed text-center">
                {quote.quoteText}
              </blockquote>
              <span className="text-4xl sm:text-6xl font-serif text-[#f4a7b9]/40 absolute -bottom-8 -right-2 select-none" aria-hidden="true">
                ”
              </span>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center justify-center text-[#f4a7b9] text-base my-8 select-none" aria-hidden="true">
              ✦ ✦ ✦
            </div>

            {/* Novel & Chapter Attribution */}
            <cite className="block not-italic space-y-1 mb-8">
              <h2 className="font-serif text-lg sm:text-xl font-medium text-[#4a3b32]">
                《{quote.novelTitle}》
              </h2>
              <p className="text-xs sm:text-sm text-[#8c7d75] font-medium tracking-wide">
                {quote.chapter}
              </p>
            </cite>

            {/* CTA to Chapter */}
            <div className="pt-2">
              <a
                href={chapterUrl}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#f4a7b9] to-[#d66b85] text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
              >
                Read the chapter →
              </a>
            </div>
          </div>

          {/* Translator's Insight Note */}
          {quote.insight && (
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
                  href={chapterUrl}
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
