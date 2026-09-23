import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FilterableNovelGrid } from "@/components/filterable-novel-grid";
import { getNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { tag } = await searchParams;
  const novels = await getNovels();
  const totalNovels = novels.length;
  const totalChapters = novels.reduce((sum, n) => sum + (n.totalChapters || 0), 0);

  const firstNovel = novels[0];
  const ogImage = firstNovel?.coverImage || "";
  const ogImageAlt = firstNovel ? (firstNovel.coverImageAlt || firstNovel.title) : SITE_NAME;

  const canonicalPath = tag ? `/novels?tag=${encodeURIComponent(tag)}` : "/novels";
  const title = tag
    ? `${tag} Chinese BL & Danmei Novels`
    : "Browse Chinese BL & Web Fiction";
  const description = tag
    ? `Browse our ${tag} Chinese Danmei and Asian BL novels, translated to English.`
    : `Explore our curated library of ${totalNovels} Chinese Danmei and Asian BL novels with ${totalChapters}+ chapters. Read completed stories in English.`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/novels#collectionpage"),
    "name": tag ? `${tag} Chinese BL & Danmei Web Fiction` : "Browse Chinese BL & Danmei Web Fiction",
    "url": absoluteUrl(canonicalPath),
    "description": description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl(canonicalPath),
    },
    "isPartOf": {
      "@id": absoluteUrl("/#website"),
    },
  };

  return {
    title,
    description,
    keywords: ["danmei novels", "chinese danmei", "BL novels collection", "danmei library", "read danmei online", "asian BL"],
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
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
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function NovelsPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const novels = await getNovels();
  const activeTag = tag && tag.trim() ? tag : "ALL";

  return (
    <>
      <SiteHeader activePath="novels" />
      <main className="page-shell py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
            Explore Chinese Danmei &amp; BL Library
          </h2>
        </div>
        <FilterableNovelGrid novels={novels} activeTag={activeTag} />
      </main>
      <SiteFooter />
    </>
  );
}
