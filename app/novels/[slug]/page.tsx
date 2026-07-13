import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getNovels, getNovelBySlug, getNovelChapters } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export const dynamic = 'force-static';

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

  // Priority: seo.metaTitle > title
  const metaTitle = novel.seo?.metaTitle || `${novel.title} | Asian BL Novel Translation - ${SITE_NAME}`;
  // Priority: seo.metaDescription > custom description > excerpt
  const metaDescription = novel.seo?.metaDescription || `Complete ${novel.title} translation. Read all chapters of this captivating Asian BL novel and danmei story. Updated regularly with quality English translations.`;
  
  const canonicalUrl = `https://www.crosstheline.press/novels/${novel.slug}`;
  // Priority: seo.ogImage > coverImage > default
  const ogImageUrl = novel.seo?.ogImage || novel.coverImage || '/assets/images/0.jpg';
  // Priority: coverImageAlt > generated alt
  const ogImageAlt = novel.coverImageAlt || `${novel.title} - BL Danmei Novel Cover`;
  
  const chapters = await getNovelChapters(novel.slug);

  // Generate Schema.org structured data
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
    description: novel.description ?? novel.excerpt,
    isPartOf: {
      "@id": absoluteUrl("/#website")
    }
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
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.crosstheline.press",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Novels",
        "item": "https://www.crosstheline.press/novels",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": novel.title,
        "item": `https://www.crosstheline.press/novels/${slug}`,
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
      <main className="main-content">
        <section className="novel-header" style={{ marginBottom: "2rem" }}>
          <div
            className="novel-header-cover"
            style={{ backgroundImage: `url('${novel.coverImage}')`, position: 'relative' }}
            aria-label={`${novel.title} cover image`}
          >
            <img
              src={novel.coverImage}
              alt={novel.coverImageAlt || `${novel.title} novel cover`}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
          </div>
          <div className="novel-header-info">
            <div>
              <h1>{novel.title}</h1>
              <div className="novel-meta">
                <span className="meta-item">✍️ Author: {novel.author || "Anonymous"}</span>
                <span className="meta-item">🌐 Translator: Cross The Line</span>
                <span className="meta-item">📅 Status: Completed</span>
                <span className="meta-item">Category: {novel.category}</span>
                {chapters.length > 0 ? (
                  <span className="meta-item">Total chapters: {chapters.length}</span>
                ) : null}
              </div>

              {novel.tags && novel.tags.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', color: '#7d6d5d' }}>Tags:</span>
                  {novel.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '0.3rem 0.8rem',
                      backgroundColor: '#f5f0e8',
                      color: '#8b7355',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid #e8dcc8'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="novel-description">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`} style={{ marginBottom: "0.5rem" }}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>{novel.excerpt}</p>
              )}
            </div>
          </div>
        </section>

        <section className="chapter-section">
          <div className="section-header">
            <div>
              <h2>Table of Contents</h2>
              {chapters.length > 0 ? (
                <span style={{ color: "#7d6d5d", fontSize: "0.95rem" }}>
                  {chapters.length} Chapters Available
                </span>
              ) : null}
            </div>
          </div>

          {chapters.length > 0 ? (
            <div className="chapter-list" id="chapterList">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.number}
                  href={`/novels/${slug}/chapters/${chapter.number}`}
                  className="chapter-item"
                  data-chapter={chapter.number}
                >
                  <div className="chapter-number">Ch. {chapter.number}</div>
                  <div className="chapter-details">
                    <div className="chapter-title">{chapter.title}</div>
                    {chapter.excerpt && (
                      <div style={{
                        fontSize: '0.88rem',
                        color: '#7d6d5d',
                        marginTop: '0.3rem',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                      }}>
                        {chapter.excerpt}
                      </div>
                    )}
                    <div className="chapter-meta-info">
                      <span>📖 Est. 10 min</span>
                    </div>
                  </div>
                  <span className="chapter-arrow">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p>Chapters will be available soon.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
