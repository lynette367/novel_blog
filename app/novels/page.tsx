import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FilterableNovelGrid } from "@/components/filterable-novel-grid";
import { getNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const novels = await getNovels();
  const totalNovels = novels.length;
  const totalChapters = novels.reduce((sum, n) => sum + (n.totalChapters || 0), 0);

  // 使用第一个小说的封面图片作为 OG 图片
  const firstNovel = novels[0];
  const ogImage = firstNovel ? firstNovel.coverImage : "/assets/images/0.jpg";
  const ogImageAlt = firstNovel ? (firstNovel.coverImageAlt || firstNovel.title) : SITE_NAME;

  // Generate Schema.org structured data for CollectionPage
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/novels#collectionpage"),
    "name": "Browse Asian BL Novels | Danmei Collection",
    "url": absoluteUrl("/novels"),
    "description": `Explore our collection of ${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters. High-quality danmei translations updated regularly.`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl("/novels")
    },
    "isPartOf": {
      "@id": absoluteUrl("/#website")
    }
  };

  return {
    title: "Browse Asian BL Novels | Danmei Collection - Cross The Line",
    description: `Explore our collection of ${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters. High-quality danmei translations updated regularly.`,
    keywords: ["BL novels collection", "danmei library", "Asian BL", "translated BL fiction"],
    alternates: {
      canonical: absoluteUrl("/novels"),
    },
    openGraph: {
      title: "Browse Asian BL Novels | Danmei Collection - Cross The Line",
      description: `Discover our complete collection of ${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters. Updated regularly.`,
      url: absoluteUrl("/novels"),
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
      title: "Browse Asian BL Novels | Danmei Collection - Cross The Line",
      description: `${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters`,
      images: [ogImage],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function NovelsPage() {
  const novels = await getNovels();

  return (
    <>
      <SiteHeader activePath="novels" />
      <main className="main-content">
        <div className="content-header">
          <h2>Explore Chinese Danmei & BL Library</h2>
        </div>

        <FilterableNovelGrid novels={novels} />
      </main>
      <SiteFooter />
    </>
  );
}
