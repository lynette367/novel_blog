import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FilterableNovelGrid } from "@/components/filterable-novel-grid";
import { getNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

const pageDescription =
  "Browse every translated Asian pop novel available on Cross The Line and continue your reading journey.";
const ogImage = absoluteUrl("/assets/images/Being_a_strategist_in_the_Three_Kingdoms_era.png");

export const metadata: Metadata = {
  title: "All Novels | Cross The Line",
  description: pageDescription,
  alternates: {
    canonical: "/novels",
  },
  openGraph: {
    title: "All Novels | Cross The Line",
    description: pageDescription,
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
    title: "All Novels | Cross The Line",
    description: pageDescription,
    images: [ogImage],
  },
};

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
