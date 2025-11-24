import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReadingProgress } from "./reading-progress";
import { getNovelBySlug, getChapterContent, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import type { Metadata } from "next";

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

  const pageTitle = `${chapterData.title} | ${novel.title} - ${SITE_NAME}`;
  const description = `Read ${chapterData.title} of ${novel.title} - High-quality Asian BL novel translation. Discover compelling danmei stories in English.`;
  const ogImage = absoluteUrl(novel.coverImage);
  const canonicalPath = `/novels/${slug}/chapters/${chapterNumber}`;

  return {
    title: pageTitle,
    description,
    keywords: [
      novel.title,
      chapterData.title,
      "asian BL novel",
      "danmei translation",
      "yaoi fiction",
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title: `${chapterData.title} | ${novel.title}`,
      description: `Read this chapter of ${novel.title} - Asian BL novel translation`,
      url: absoluteUrl(canonicalPath),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: novel.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${chapterData.title} | ${novel.title}`,
      description: "Asian BL novel translation",
      images: [ogImage],
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
      <SiteHeader activePath="novels" />
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
      <article className="chapter-content">
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
