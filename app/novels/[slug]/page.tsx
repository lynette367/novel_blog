import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

function ChapterThumbnail({
  chapterNumber,
  chapterTitle,
  coverImage,
  dimmed = false,
}: {
  chapterNumber: number;
  chapterTitle: string;
  coverImage?: string;
  dimmed?: boolean;
}) {
  const dimClass = dimmed ? " opacity-60" : "";

  if (coverImage) {
    return (
      <div
        className={`relative w-12 h-16 sm:w-14 sm:h-20 shrink-0 rounded overflow-hidden bg-[#ffe3ef]${dimClass}`}
      >
        <Image
          src={coverImage}
          alt={`Chapter ${chapterNumber}: ${chapterTitle}`}
          fill
          sizes="(max-width: 640px) 48px, 56px"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`w-12 h-16 sm:w-14 sm:h-20 shrink-0 rounded border border-[#f7c6d9]/60 bg-[#ffe3ef]/60 flex items-center justify-center${dimClass}`}
    >
      <span className="font-serif text-xl sm:text-2xl font-semibold text-[#f4a7b9] tabular-nums leading-none">
        {String(chapterNumber).padStart(2, "0")}
      </span>
    </div>
  );
}

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
    novel.seo?.metaTitle || `${novel.title} | Chinese Danmei & BL Novel in English`;
  const metaDescription =
    novel.seo?.metaDescription ||
    novel.excerpt ||
    `Read ${novel.title} online in English. Complete Chinese Danmei & Asian BL web novel chapters updated regularly.`;

  const canonicalUrl = absoluteUrl(`/novels/${novel.slug}`);
  const ogImageUrl = novel.seo?.ogImage || novel.coverImage;
  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;

  return {
    title: {
      absolute: metaTitle,
    },
    description: metaDescription,
    keywords: [
      novel.title,
      "danmei novels",
      "chinese danmei",
      "asian BL novel",
      "yaoi fiction",
      "BL romance",
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
      images: ogImageUrl
        ? [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogImageAlt,
          },
        ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
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

  const bookId = absoluteUrl(`/novels/${novel.slug}#book`);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": bookId,
    name: novel.title,
    genre: ["BL", "Danmei", "Romance", "LGBT+ Fiction"],
    inLanguage: "en",
    numberOfPages: chapters.length,
    wordCount: novel.totalWordCount || undefined,
    description: novel.description ?? novel.excerpt,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };

  const breadcrumbData = {
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
        name: "Novels",
        item: absoluteUrl("/novels"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: novel.title,
        item: absoluteUrl(`/novels/${slug}`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader activePath="novels" />

      <main className="page-shell py-8">
        {/* Novel header */}
        <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-6">
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
              <div className="flex gap-4 flex-wrap text-[#f4a7b9] text-sm mb-4">
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
                  <span className="text-sm text-[#f4a7b9]">Tags:</span>
                  {novel.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-0.5 bg-[#ffe3ef] text-[#f4a7b9] rounded-full text-sm font-semibold border border-[#f7c6d9]"
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
          </div>
        </section>

        {/* Chapter list — no outer container, section flows directly on the page */}
        <section>
          <div className="mb-2">
            <h2 className="font-serif text-2xl text-[#f4a7b9] font-normal tracking-wide">
              Table of Contents
            </h2>
          </div>

          {/* Human TL donation callout */}
          <p className="text-sm text-[#7d6d5d] mb-6">
            Tired of Raw MTL chapters?{" "}
            <Link
              href="https://ko-fi.com/crosstheline46370"
              className="text-[#8b7355] font-semibold underline underline-offset-2 hover:text-[#6d5d4b]"
            >
              Donate $20 on Ko-fi
            </Link>{" "}
            and include the title in your message, and we&apos;ll get <em>{novel.title}</em> human refined.
          </p>

          {chapters.length > 0 ? (
            <div className="divide-y divide-[#f7c6d9]/50" id="chapterList">
              {chapters.map((chapter) => {
                const displayTitle =
                  chapter.title.toLowerCase() === `chapter ${chapter.number}`
                    ? chapter.title
                    : chapter.title.toLowerCase().startsWith(`chapter ${chapter.number}:`)
                    ? chapter.title
                    : `Ch. ${chapter.number}: ${chapter.title}`;

                if (chapter.locked) {
                  return (
                    <div
                      key={chapter.number}
                      data-chapter={chapter.number}
                      className="opacity-55 cursor-not-allowed flex items-center gap-4 sm:gap-5 py-4"
                    >
                      <ChapterThumbnail
                        chapterNumber={chapter.number}
                        chapterTitle={chapter.title}
                        coverImage={chapter.coverImage}
                        dimmed
                      />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="text-base sm:text-lg font-semibold text-[#2b1f2d]">
                          {displayTitle}
                        </div>
                        <div className="text-sm text-[#f4a7b9]">🔒 Coming Soon</div>
                      </div>
                    </div>
                  );
                }

                const isHumanTl = chapter.isPolished;
                const isCurrentChapterOnPatreon = !isHumanTl && chapter.patreonPublished === true;

                return (
                  <Link
                    key={chapter.number}
                    href={`/novels/${slug}/chapters/${chapter.number}`}
                    data-chapter={chapter.number}
                    className="group flex items-center gap-4 sm:gap-5 py-4 transition-colors no-underline text-inherit"
                  >
                    <ChapterThumbnail
                      chapterNumber={chapter.number}
                      chapterTitle={chapter.title}
                      coverImage={chapter.coverImage}
                    />

                    {/* Chapter info */}
                    <div className="flex flex-col flex-1 min-w-0 justify-center gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-semibold text-base sm:text-lg text-[#2b1f2d] leading-snug group-hover:text-[#f4a7b9] transition-colors">
                          {displayTitle}
                        </h3>
                        {isHumanTl ? (
                          <span className="bg-[#f4a7b9] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Human TL
                          </span>
                        ) : isCurrentChapterOnPatreon ? (
                          <span className="bg-[#f4a7b9] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            Patreon
                          </span>
                        ) : (
                          <span className="text-[#94a3b8] text-[11px] font-semibold">
                            Raw MTL
                          </span>
                        )}
                      </div>

                      {chapter.excerpt && (
                        <div className="text-xs sm:text-sm text-[#7d6f67] mt-0.5 leading-relaxed italic line-clamp-2">
                          &ldquo;{chapter.excerpt}&rdquo;
                        </div>
                      )}

                      <div className="flex gap-4 text-xs text-[#9c8560] font-medium mt-0.5">
                        <span>📖 Est. {chapter.readingMinutes} min</span>
                        <span>📝 {chapter.wordCount.toLocaleString()} words</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <span className="hidden sm:block text-xl text-[#f4a7b9] transition-transform group-hover:translate-x-1 shrink-0">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-[#f4a7b9]">Chapters will be available soon.</p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
