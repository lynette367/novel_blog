import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NovelDescription } from "@/components/novel-description";
import { getNovels, getNovelBySlug, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const dynamic = "force-static";

type NovelPageParams = {
  slug: string;
};

export async function generateStaticParams() {
  const novels = await getNovels();
  return novels.map((novel) => ({ slug: novel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NovelPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) {
    return {
      title: "Novel Not Found",
      description: "The requested novel could not be located.",
    };
  }

  const metaTitle =
    novel.seo?.metaTitle || `${novel.title} | Asian BL Novel in English - ${SITE_NAME}`;
  const metaDescription =
    novel.seo?.metaDescription ||
    `Complete ${novel.title} in English. Read all chapters of this captivating Asian BL novel and danmei story. Updated regularly with quality English version.`;

  const canonicalUrl = `https://www.crosstheline.press/novels/${novel.slug}`;
  const ogImageUrl = novel.seo?.ogImage || novel.coverImage || "/assets/images/0.jpg";
  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;

  const chapters = await getNovelChapters(novel.slug);

  const bookId = absoluteUrl(`/novels/${novel.slug}#book`);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": bookId,
    name: novel.title,
    author: {
      "@type": "Person",
      name: novel.author || "Anonymous",
    },
    genre: ["BL", "Danmei", "Romance", "LGBT+ Fiction"],
    inLanguage: "en",
    translator: "Cross The Line",
    numberOfPages: chapters.length,
    wordCount: novel.totalWordCount || undefined,
    description: novel.description ?? novel.excerpt,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      novel.title,
      "asian BL novel",
      "danmei translation",
      "yaoi fiction",
      "BL romance",
      "LGBT+ novel",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "book",
      title: novel.seo?.ogTitle || metaTitle,
      description: novel.seo?.ogDescription || metaDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<NovelPageParams>;
}) {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) {
    notFound();
  }

  const description = novel.description ?? novel.excerpt;
  const descriptionParagraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chapters = await getNovelChapters(novel.slug);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.crosstheline.press",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Novels",
        item: "https://www.crosstheline.press/novels",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: novel.title,
        item: `https://www.crosstheline.press/novels/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <SiteHeader activePath="novels" />

      <main className="page-shell py-8">
        {/* Novel header card */}
        <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#f7c6d9]/30">
          {/* Cover image — fixed aspect ratio, top-aligned */}
          <div className="self-start">
            <div
              className="w-full rounded-xl overflow-hidden shadow-lg aspect-[2/3] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${novel.coverImage}')` }}
              aria-label={`${novel.title} cover image`}
            >
              <img
                src={novel.coverImage}
                alt={novel.coverImageAlt || `${novel.title} novel cover`}
                className="absolute inset-0 opacity-0 w-full h-full pointer-events-none"
              />
            </div>
          </div>

          {/* Novel info */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#2b1f2d] font-normal leading-snug mb-3">
                {novel.title}
              </h1>
              <div className="flex gap-4 flex-wrap text-[#c87f9b] text-sm mb-4">
                <span>✍️ Author: {novel.author || "Anonymous"}</span>
                <span>🌐 Translator: Cross The Line</span>
                <span>📅 Status: Completed</span>
                {chapters.length > 0 ? (
                  <span>Total chapters: {chapters.length}</span>
                ) : null}
                {novel.totalWordCount ? (
                  <span>📝 {novel.totalWordCount.toLocaleString()} words</span>
                ) : null}
              </div>

              {/* Tags */}
              {novel.tags && novel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <span className="text-sm text-[#c87f9b]">Tags:</span>
                  {novel.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-0.5 bg-[#ffe3ef] text-[#e499b3] rounded-full text-sm font-semibold border border-[#f7c6d9]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description — collapsible client component */}
            <NovelDescription
              paragraphs={descriptionParagraphs}
              excerpt={novel.excerpt}
            />

            {/* Category badge */}
            {novel.tags && novel.tags.length > 0 && (
              <div className="inline-block">
                <span className="px-5 py-2 border-2 border-[#e499b3] rounded-full text-[#e499b3] font-semibold text-sm uppercase tracking-wide">
                  {novel.tags[0]}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Chapter list */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#f7c6d9]/30">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f7c6d9]">
            <div>
              <h2 className="font-serif text-2xl text-[#2b1f2d] font-normal tracking-wide">
                Table of Contents
              </h2>
              {chapters.length > 0 ? (
                <span className="text-[#c87f9b] text-sm">
                  {chapters.length} Chapters Available
                </span>
              ) : null}
            </div>
          </div>

          {chapters.length > 0 ? (
            <div className="flex flex-col gap-3" id="chapterList">
              {chapters.map((chapter) =>
                chapter.locked ? (
                  <div
                    key={chapter.number}
                    data-chapter={chapter.number}
                    className="opacity-55 cursor-not-allowed grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 items-center p-5 rounded-xl border-2 bg-[#f8fafc] border-[#cbd5e1]"
                  >
                    <div className="text-2xl font-semibold text-[#c87f9b] text-center sm:text-left">
                      Ch. {chapter.number}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-lg font-semibold text-[#2b1f2d]">{chapter.title}</div>
                      <div className="text-sm text-[#c87f9b]">🔒 Coming Soon</div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={chapter.number}
                    href={`/novels/${slug}/chapters/${chapter.number}`}
                    data-chapter={chapter.number}
                    className={`group relative overflow-hidden grid grid-cols-1 sm:grid-cols-[80px_1fr_auto] gap-4 items-center p-5 rounded-xl border transition-all hover:translate-x-2 hover:shadow-md no-underline text-inherit ${
                      chapter.isPolished
                        ? "bg-gradient-to-r from-[#fff8fb] to-white border-[#f7c6d9] [border-left:4px_solid_#ff69b4] shadow-sm"
                        : "bg-[#f8fafc] border-2 border-[#cbd5e1]"
                    }`}
                  >
                    {/* Corner tag */}
                    {chapter.isPolished ? (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff69b4] to-[#e499b3] text-white text-xs font-bold px-3 py-0.5 rounded-bl-xl shadow-sm z-10">
                        Human TL
                      </div>
                    ) : (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#94a3b8] to-[#64748b] text-white text-xs font-bold px-3 py-0.5 rounded-bl-xl shadow-sm z-10">
                        Raw TL
                      </div>
                    )}

                    <div className="text-xl font-semibold text-[#e499b3] text-center sm:text-left">
                      Ch. {chapter.number}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap text-lg font-semibold text-[#2b1f2d]">
                        <span>{chapter.title}</span>
                      </div>
                      {chapter.excerpt && (
                        <div className="text-sm text-[#c87f9b] mt-0.5 leading-snug italic">
                          {chapter.excerpt}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm text-[#c87f9b] font-medium mt-1">
                        <span>📖 Est. {chapter.readingMinutes} min</span>
                        <span>📝 {chapter.wordCount.toLocaleString()} words</span>
                      </div>
                    </div>

                    <span className="hidden sm:block text-2xl text-[#e499b3] transition-transform group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                )
              )}
            </div>
          ) : (
            <p className="text-[#c87f9b]">Chapters will be available soon.</p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}