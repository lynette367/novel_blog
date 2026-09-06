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

  const firstNovel = novels[0];
  const ogImage = firstNovel?.coverImage || "";
  const ogImageAlt = firstNovel ? (firstNovel.coverImageAlt || firstNovel.title) : SITE_NAME;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/novels#collectionpage"),
    "name": "Browse Chinese BL & Danmei Web Fiction",
    "url": absoluteUrl("/novels"),
    "description": `Explore our curated library of ${totalNovels} Chinese Danmei and Asian BL novels with ${totalChapters}+ chapters. Read completed stories in English.`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl("/novels"),
    },
    "isPartOf": {
      "@id": absoluteUrl("/#website"),
    },
  };

  return {
    title: "Browse Chinese BL & Web Fiction",
    description: `Explore our curated library of ${totalNovels} Chinese Danmei and Asian BL novels with ${totalChapters}+ chapters. Read completed stories in English.`,
    keywords: ["danmei novels", "chinese danmei", "BL novels collection", "danmei library", "read danmei online", "asian BL"],
    alternates: {
      canonical: absoluteUrl("/novels"),
    },
    openGraph: {
      title: "Browse Chinese BL & Danmei Web Fiction",
      description: `Explore our complete collection of ${totalNovels} Chinese Danmei and Asian BL novels with ${totalChapters}+ chapters.`,
      url: absoluteUrl("/novels"),
      siteName: SITE_NAME,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogImageAlt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: "Browse Chinese BL & Danmei Web Fiction",
      description: `Explore our collection of ${totalNovels} Chinese Danmei and Asian BL novels with ${totalChapters}+ chapters.`,
      images: ogImage ? [ogImage] : [],
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
      <main className="page-shell py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
            Explore Chinese Danmei &amp; BL Library
          </h2>
        </div>
        <FilterableNovelGrid novels={novels} />
      </main>
      <SiteFooter />
    </>
  );
}
