import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { ReadingProgress } from "./reading-progress";
import { getNovelBySlug, getChapterContent, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";
import type { Metadata } from "next";

export const dynamic = 'force-static';

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

  const canonicalUrl = absoluteUrl(`/novels/${slug}/chapters/${chapterNumber}`);

  // SEO 优先级：章节设置 > 小说设置 > 自动生成
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
    absoluteUrl('/assets/images/0.jpg');

  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;

  const noIndex = chapterData.seo?.noIndex ?? false;

  // Schema.org 结构化数据
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
          <span>📖 Est. {chapterData.readingMinutes} min read</span>
          <span>📝 {chapterData.wordCount.toLocaleString()} words</span>
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
