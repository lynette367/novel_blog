import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { ReadingProgress } from "./reading-progress";
import { getNovelBySlug, getChapterContent, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import type { Metadata } from "next";

export const revalidate = 60;

type ChapterPageParams = {
  slug: string;
  chapter: string;
};

export async function generateStaticParams() {
  const { getNovels } = await import("@/lib/novels");
  const novels = await getNovels();
  const params: Array<{ slug: string; chapter: string }> = [];

  for (const novel of novels) {
    const chapters = await getNovelChapters(novel.slug);
    for (const chapter of chapters) {
      params.push({
        slug: novel.slug,
        chapter: chapter.number.toString(),
      });
    }
  }

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

  // Priority: seo.metaTitle > chapter title + novel title
  const metaTitle = novel.seo?.metaTitle || `${chapterData.title} | ${novel.title} - ${SITE_NAME}`;
  // Priority: seo.metaDescription > custom description
  const metaDescription = novel.seo?.metaDescription || `Read ${chapterData.title} of ${novel.title} - High-quality Asian BL novel translation. Discover compelling danmei stories in English.`;
  const canonicalUrl = `https://www.crosstheline.press/novels/${slug}/chapters/${chapterNumber}`;
  // Priority: seo.ogImage > coverImage > default
  const ogImageUrl = novel.seo?.ogImage || novel.coverImage || '/assets/images/0.jpg';
  // Priority: coverImageAlt > generated alt
  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;

  // Generate Schema.org structured data for Chapter
  const bookId = absoluteUrl(`/novels/${novel.slug}#book`);
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapterData.title,
    partOf: {
      "@id": bookId
    },
    position: chapterNumber,
    inLanguage: "en",
    description: metaDescription,
    isPartOf: {
      "@id": absoluteUrl("/#website")
    }
  };

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      novel.title,
      chapterData.title,
      "asian BL novel",
      "danmei translation",
      "yaoi fiction",
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
  const currentIndex = chapters.findIndex((c) => c.number === chapterNumber);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <>
      <ReadingProgress />

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <Link href={`/novels/${slug}`} className="back-btn">
            ← Back to Table of Contents
          </Link>
        </div>
      </nav>

      {/* Chapter Header */}
      <header className="chapter-header">
        <div className="chapter-number-badge">Chapter {chapterNumber}</div>
        <h1 className="chapter-title-page">{chapterData.title}</h1>
        <div
          className="chapter-meta"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            color: "#7d6d5d",
            fontSize: "0.9rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <span>📖 Est. 10 min read</span>
        </div>
      </header>

      {/* Chapter Content */}
      <article className="chapter-content prose max-w-none">
        <div
          className="chapter-text"
          dangerouslySetInnerHTML={{ __html: chapterData.content }}
        />
      </article>

      {/* Chapter Navigation */}
      <nav className="chapter-nav">
        {prevChapter ? (
          <Link
            href={`/novels/${slug}/chapters/${prevChapter.number}`}
            className="nav-btn"
          >
            ← Previous Chapter
          </Link>
        ) : (
          <span className="nav-btn disabled">← Previous Chapter</span>
        )}
        <Link href={`/novels/${slug}`} className="index-btn">
          📚 Table of Contents
        </Link>
        {nextChapter ? (
          <Link
            href={`/novels/${slug}/chapters/${nextChapter.number}`}
            className="nav-btn"
          >
            Next Chapter →
          </Link>
        ) : (
          <span className="nav-btn disabled">Next Chapter →</span>
        )}
      </nav>

      <SiteFooter />
    </>
  );
}
