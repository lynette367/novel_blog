import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NovelCard } from "@/components/novel-card";
import { getFeaturedNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

const pageDescription =
  "Where stories transcend boundaries. Discover beautifully translated Asian novels and curated reading lists.";

const heroImage = absoluteUrl("/assets/images/Wife_are_paramount.png");

export const metadata: Metadata = {
  title: "Cross The Line | Asian BL Novel Translation",
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cross The Line | Asian BL Novel Translation",
    description: pageDescription,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross The Line | Asian BL Novel Translation",
    description: pageDescription,
    images: [heroImage],
  },
};

export default async function HomePage() {
  const featuredNovels = await getFeaturedNovels();

  return (
    <>
      <SiteHeader activePath="home" />

      <section className="hero">
        <div className="hero-content">
          <h1>Cross The Line</h1>
          <p className="tagline">
            Where stories transcend boundaries and hearts find their truth.
            <br />
            Discover novels that touch the soul.
          </p>
        </div>
      </section>

      <main className="main-content">
        <div className="content-header">
          <h2>Latest Updates</h2>
        </div>

        <div className="novels-grid">
          {featuredNovels.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/novels"
            className="read-btn"
            style={{
              fontSize: "1.1rem",
              padding: "1rem 2rem",
              border: "2px solid #8b7355",
              borderRadius: "50px",
            }}
          >
            View All Novels →
          </Link>
        </div>
      </main>

      <section className="reader-support" id="support">
        <div className="support-container">
          <h2>Support Our Translations</h2>
          <p className="support-subtitle">
            Your support helps us bring more beautiful stories to life.
            <br />
            Every contribution makes a difference in keeping these translations free and accessible.
          </p>

          <div className="support-buttons">
            <a
              href="https://buymeacoffee.com/yqying95b"
              target="_blank"
              className="support-card"
              rel="noopener noreferrer"
            >
              <div className="support-icon">☕</div>
              <h3>Buy Me a Coffee</h3>
              <p>Support with a one-time coffee donation. Every cup fuels the next chapter!</p>
            </a>

            <a
              href="https://ko-fi.com/crosstheline46370"
              target="_blank"
              className="support-card"
              rel="noopener noreferrer"
            >
              <div className="support-icon">💝</div>
              <h3>Ko-fi</h3>
              <p>Show your appreciation with a tip. Your generosity keeps the translations flowing.</p>
            </a>

            <a
              href="https://www.patreon.com/c/CrosstheLine911"
              target="_blank"
              className="support-card"
              rel="noopener noreferrer"
            >
              <div className="support-icon">🎨</div>
              <h3>Patreon</h3>
              <p>Become a patron for exclusive content, early access, and behind-the-scenes insights.</p>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
