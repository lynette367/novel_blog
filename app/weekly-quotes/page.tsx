import Link from "next/link";
import type { Metadata, Route } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAllWeeklyQuotes } from "@/lib/novels";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

export const dynamic = "force-static";

const canonicalPath = "/weekly-quotes";
const pageTitle = "Weekly Danmei Quotes & Cultural Insights";
const pageDescription =
  "Explore memorable lines, cultural notes, and literary insights from Chinese Danmei and BL novels including Big Brother by Priest and Kowloon Walled City stories.";
const defaultOgImage = `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "Danmei quotes",
    "Chinese BL quotes",
    "Priest Big Brother quotes",
    "Danmei cultural analysis",
    "Chinese web novel insights",
  ],
  alternates: {
    canonical: absoluteUrl(canonicalPath),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl(canonicalPath),
    siteName: SITE_NAME,
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [defaultOgImage],
  },
};

export default async function WeeklyQuotesIndexPage() {
  const quotes = await getAllWeeklyQuotes();

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": absoluteUrl("/weekly-quotes#collectionpage"),
      name: pageTitle,
      url: absoluteUrl(canonicalPath),
      description: pageDescription,
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: quotes.map((q, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: q.title,
          url: absoluteUrl(`/weekly-quotes/${q.slug}`),
        })),
      },
    },
    {
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
          item: absoluteUrl(canonicalPath),
        },
      ],
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
      <SiteHeader activePath="quotes" />

      <main className="page-shell py-10 sm:py-14">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fde2e8] border border-[#f8bccb] rounded-full text-[11px] font-bold text-[#d66b85] uppercase tracking-widest mb-4">
              <span>✦</span>
              <span>Reading Notes &amp; Quotes</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#2b1f2d] tracking-wide mb-4">
              Weekly Danmei Quotes &amp; Cultural Insights
            </h1>
            <p className="text-sm sm:text-base text-[#7d6f67] max-w-2xl mx-auto leading-relaxed">
              Curated lines, translator notes, and cultural reflections from Chinese Danmei and BL web novels.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {quotes.map((quote, idx) => {
              const summary =
                quote.seoDescription ||
                quote.insight ||
                (quote.sections?.[0]?.blocks?.[0] &&
                typeof quote.sections[0].blocks[0] === "string"
                  ? quote.sections[0].blocks[0]
                  : "");

              return (
                <article
                  key={quote.slug}
                  className="rounded-2xl border border-[#f7c6d9]/60 bg-gradient-to-br from-[#fffdfa] via-[#fff9f6] to-[#fdf2f7] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#d66b85] font-semibold uppercase tracking-wider mb-3">
                    <span>
                      {quote.novelTitle}
                      {quote.chapter ? ` · ${quote.chapter}` : ""}
                    </span>
                    {idx === 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f4a7b9] text-white text-[11px]">
                        Featured Essay
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#2b1f2d] leading-snug mb-4">
                    <Link
                      href={`/weekly-quotes/${quote.slug}` as Route}
                      className="hover:text-[#d66b85] transition-colors no-underline text-inherit"
                    >
                      {quote.title}
                    </Link>
                  </h2>

                  <blockquote className="my-4 border-l-4 border-[#f4a7b9] bg-white/70 px-5 py-3 rounded-r-xl font-serif italic text-base sm:text-lg text-[#2b1f2d]">
                    &ldquo;{quote.quoteText}&rdquo;
                  </blockquote>

                  {summary && (
                    <p className="text-sm sm:text-base text-[#5a4a42] leading-relaxed mb-5">
                      {summary}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#f7c6d9]/40 text-sm">
                    <Link
                      href={`/weekly-quotes/${quote.slug}` as Route}
                      className="font-semibold text-[#d66b85] hover:underline no-underline"
                    >
                      Read Full Reflection →
                    </Link>
                    {(quote.targetUrl || quote.targetChapterUrl) && (
                      <Link
                        href={(quote.targetUrl || quote.targetChapterUrl || "/novels") as Route}
                        className="text-xs text-[#7d6f67] hover:text-[#2b1f2d] no-underline"
                      >
                        Go to {quote.novelTitle} ({quote.chapter}) →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
