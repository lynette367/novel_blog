import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FilterableNovelGrid } from "@/components/filterable-novel-grid";
import { getNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

const ogImage = absoluteUrl("/assets/images/Being_a_strategist_in_the_Three_Kingdoms_era.png");

export async function generateMetadata(): Promise<Metadata> {
  const novels = await getNovels();
  const totalNovels = novels.length;
  const totalChapters = novels.reduce((sum, n) => sum + (n.totalChapters || 0), 0);

  return {
    title: "Browse Asian BL Novels | Danmei Collection - Cross The Line",
    description: `Explore our collection of ${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters. High-quality danmei translations updated regularly.`,
    keywords: ["BL novels collection", "danmei library", "Asian BL", "translated BL fiction"],
    alternates: {
      canonical: "/novels",
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
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Browse Asian BL Novels | Danmei Collection - Cross The Line",
      description: `${totalNovels} translated Asian BL novels with ${totalChapters}+ chapters`,
      images: [ogImage],
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
          <h2>All Novels</h2>
        </div>

        <FilterableNovelGrid novels={novels} />
      </main>
      <SiteFooter />
    </>
  );
}
