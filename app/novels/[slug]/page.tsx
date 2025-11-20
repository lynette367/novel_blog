import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getNovels, getNovelBySlug, getNovelChapterContent } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

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

  const description = novel.description ?? novel.excerpt;
  const ogImage = absoluteUrl(novel.coverImage);
  const canonicalPath = `/novels/${novel.slug}`;
  const pageTitle = `${novel.title} | ${SITE_NAME}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
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
      title: pageTitle,
      description,
      images: [ogImage],
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
  const chapterContent = await getNovelChapterContent(novel.slug);

  return (
    <>
      <SiteHeader activePath="novels" />
      <main className="main-content">
        <div className="content-header">
          <h2>{novel.title}</h2>
          {novel.totalChapters ? (
            <span style={{ color: "#7d6d5d" }}>{novel.totalChapters} chapters available</span>
          ) : null}
        </div>

        <section className="novel-header" style={{ marginBottom: "2rem" }}>
          <div
            className="novel-header-cover"
            style={{ backgroundImage: `url('${novel.coverImage}')` }}
          ></div>
          <div className="novel-header-info">
            <div>
              <h1>{novel.title}</h1>
              <div className="novel-meta">
                <span className="meta-item">Category: {novel.category}</span>
                {novel.totalChapters ? (
                  <span className="meta-item">Total chapters: {novel.totalChapters}</span>
                ) : null}
              </div>
            </div>

            <span className="novel-category-badge">{novel.category}</span>

            <div className="novel-description">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
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
              {novel.totalChapters ? (
                <span style={{ color: "#7d6d5d" }}>{novel.totalChapters} Chapters Available</span>
              ) : null}
            </div>
          </div>

          {chapterContent ? (
            <div
              className="legacy-chapter-section"
              dangerouslySetInnerHTML={{ __html: chapterContent }}
            />
          ) : (
            <p>Chapters will be available soon.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
