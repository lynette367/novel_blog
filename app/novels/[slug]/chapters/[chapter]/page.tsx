import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { ReadingProgress } from "./reading-progress";
import { getNovelBySlug, getChapterContent, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import type { Metadata } from "next";

export const dynamic = "force-static";

type ChapterPageParams = {
  slug: string;
  chapter: string;
};

export async function generateStaticParams() {
  const { getNovels, getNovelChapterNumbers } = await import("@/lib/novels");
  const novels = await getNovels();

  const chaptersByNovel = await Promise.all(
    novels.map((novel) => getNovelChapterNumbers(novel.slug))
  );

  const params: Array<{ slug: string; chapter: string }> = [];
  novels.forEach((novel, i) => {
    for (const chapter of chaptersByNovel[i]) {
      if (chapter.locked) continue;
      params.push({
        slug: novel.slug,
        chapter: chapter.number.toString(),
      });
    }
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ChapterPageParams>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const chapterNumber = parseInt(chapter, 10);
  const novel = await getNovelBySlug(slug);

  if (!novel || isNaN(chapterNumber)) {
    return {
      title: "Chapter Not Found",
      description: "The requested chapter could not be located.",
    };
  }

  const chapterData = await getChapterContent(slug, chapterNumber);
  if (!chapterData) {
    return {
      title: "Chapter Not Found",
      description: "The requested chapter could not be located.",
    };
  }

  const canonicalUrl = absoluteUrl(`/novels/${slug}/chapters/${chapterNumber}`);

  const metaTitle =
    chapterData.seo?.metaTitle ||
    `${chapterData.title} | ${novel.title} - ${SITE_NAME}`;

  const metaDescription =
    chapterData.seo?.metaDescription ||
    novel.seo?.metaDescription ||
    `Read ${chapterData.title} of ${novel.title} - High-quality Asian BL novel translation. Discover compelling danmei stories in English.`;

  const ogImage =
    chapterData.seo?.ogImage ||
    novel.seo?.ogImage ||
    novel.coverImage ||
    absoluteUrl("/assets/images/0.jpg");

  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;

  const noIndex = chapterData.seo?.noIndex ?? false;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapterData.title,
    partOf: {
      "@type": "Book",
      "@id": absoluteUrl(`/novels/${novel.slug}#book`),
      name: novel.title,
      wordCount: novel.totalWordCount || undefined,
      author: {
        "@type": "Person",
        name: novel.author || "Anonymous",
      },
    },
    position: chapterNumber,
    inLanguage: "en",
    wordCount: chapterData.wordCount,
    description: metaDescription,
    url: canonicalUrl,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [novel.title, chapterData.title, "asian BL novel", "danmei translation", "yaoi fiction"],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: true,
    },
    openGraph: {
      type: "book",
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<ChapterPageParams>;
}) {
  const { slug, chapter } = await params;
  const chapterNumber = parseInt(chapter, 10);

  if (isNaN(chapterNumber)) {
    notFound();
  }

  const novel = await getNovelBySlug(slug);
  if (!novel) {
    notFound();
  }

  const chapterData = await getChapterContent(slug, chapterNumber);
  if (!chapterData) {
    notFound();
  }

  const chapters = await getNovelChapters(slug);
  const readableChapters = chapters.filter((c) => !c.locked);
  const currentIndex = readableChapters.findIndex((c) => c.number === chapterNumber);
  const prevChapter = currentIndex > 0 ? readableChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < readableChapters.length - 1 ? readableChapters[currentIndex + 1] : null;

  // Build content HTML with optional mid-chapter illustration
  const paragraphs = chapterData.content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  let fullContentHtml = chapterData.content;

  if (chapterData.ogImageUrl && paragraphs.length > 0) {
    const midIndex = Math.floor(paragraphs.length / 2);

    const optimizedImageUrl = chapterData.ogImageUrl.includes("?")
      ? `${chapterData.ogImageUrl}&w=600&auto=format&q=80`
      : `${chapterData.ogImageUrl}?w=600&auto=format&q=80`;

    const chapterNumberAndTitle = chapterData.title.toLowerCase().startsWith("chapter")
      ? chapterData.title
      : `Chapter ${chapterData.chapterNumber} - ${chapterData.title}`;

    const altText = `Illustration for ${novel.title} - ${chapterNumberAndTitle}`;

    const imageHtml = `<div class="chapter-illustration-container" style="text-align: center; margin-top: 2.5rem; margin-bottom: 2.5rem;"><img src="${optimizedImageUrl}" alt="${altText}" loading="lazy" decoding="async" style="max-width: 50%; min-width: 280px; width: 100%; height: auto; border-radius: 8px; margin: 0 auto; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" /></div>`;

    const firstHalf = paragraphs.slice(0, midIndex);
    const secondHalf = paragraphs.slice(midIndex);
    fullContentHtml = [...firstHalf, imageHtml, ...secondHalf].join("\n");
  }

  return (
    <>
      <ReadingProgress />

      {/* Top navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f7c6d9]/50 shadow-sm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link
            href={`/novels/${slug}`}
            className="flex items-center gap-2 text-[#e499b3] no-underline font-semibold text-sm hover:text-[#c87f9b] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#fff9f2]"
          >
            ← Back to Table of Contents
          </Link>
        </div>
      </nav>

      {/* Chapter header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <div className="text-sm text-[#e499b3] uppercase tracking-[0.15em] font-semibold mb-3">
          Chapter {chapterNumber}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#2b1f2d] font-normal leading-snug mb-6">
          {chapterData.title}
        </h1>
        <div className="flex justify-center gap-8 text-[#c87f9b] text-sm mb-8 flex-wrap">
          <span>📖 Est. {chapterData.readingMinutes} min read</span>
          <span>📝 {chapterData.wordCount.toLocaleString()} words</span>
        </div>
      </header>

      {/* Chapter content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 mb-12 bg-white rounded-2xl border border-[#f7c6d9]/20 p-6 sm:p-10 shadow-sm">
        <div
          className="prose prose-stone max-w-none"
          dangerouslySetInnerHTML={{ __html: fullContentHtml }}
        />
      </article>

      {/* Chapter navigation */}
      <nav className="max-w-3xl mx-auto mb-16 px-4 sm:px-6 flex flex-col sm:flex-row gap-4">
        {prevChapter ? (
          <Link
            href={`/novels/${slug}/chapters/${prevChapter.number}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-[#f7c6d9] rounded-xl text-[#2b1f2d] font-semibold text-center transition-all hover:bg-[#e499b3] hover:text-white hover:border-[#e499b3] hover:-translate-y-0.5 no-underline"
          >
            ← Previous Chapter
          </Link>
        ) : (
          <span className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-[#f7c6d9] rounded-xl text-[#2b1f2d] font-semibold text-center opacity-40 cursor-not-allowed">
            ← Previous Chapter
          </span>
        )}

        <Link
          href={`/novels/${slug}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-[#ff69b4] to-[#e499b3] text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg hover:-translate-y-0.5 no-underline"
        >
          📚 Table of Contents
        </Link>

        {nextChapter ? (
          <Link
            href={`/novels/${slug}/chapters/${nextChapter.number}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-[#f7c6d9] rounded-xl text-[#2b1f2d] font-semibold text-center transition-all hover:bg-[#e499b3] hover:text-white hover:border-[#e499b3] hover:-translate-y-0.5 no-underline"
          >
            Next Chapter →
          </Link>
        ) : (
          <span className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-[#f7c6d9] rounded-xl text-[#2b1f2d] font-semibold text-center opacity-40 cursor-not-allowed">
            Next Chapter →
          </span>
        )}
      </nav>

      <SiteFooter />
    </>
  );
}
