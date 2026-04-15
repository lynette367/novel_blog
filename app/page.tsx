import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NovelCard } from "@/components/novel-card";
import { getFeaturedNovels } from "@/lib/novels";
import { absoluteUrl, SITE_NAME } from "@/lib/siteMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { getFeaturedNovels } = await import("@/lib/novels");
  const featuredNovels = await getFeaturedNovels();
  
  // 使用第一个特色小说的封面图片作为 OG 图片
  const firstNovel = featuredNovels[0];
  const heroImage = firstNovel ? firstNovel.coverImage : "/assets/images/0.jpg";
  const heroImageAlt = firstNovel ? firstNovel.title : SITE_NAME;

  // Generate Schema.org structured data
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      "name": SITE_NAME,
      "url": absoluteUrl("/"),
      "potentialAction": {
        "@type": "SearchAction",
        "target": absoluteUrl("/novels"),
        "query-input": "required name=q"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      "name": "Cross The Line Translations",
      "url": absoluteUrl("/"),
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl("/assets/images/0.jpg"),
        "width": 600,
        "height": 600
      },
      "description": "High-quality English translations of popular Chinese Danmei novels",
      "sameAs": [
        "https://buymeacoffee.com/yqying95b",
        "https://ko-fi.com/crosstheline46370",
        "https://www.patreon.com/c/CrosstheLine911"
      ]
    }
  ];

  return {
    title: "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
    description: "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories. Join our community for daily updates and exclusive chapters.",
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      title: "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
      description: "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories. Join our community for daily updates and exclusive chapters.",
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CrossTheLine - Read Chinese Danmei & BL Novels English Translation",
      description: "High-quality English translations of popular Chinese Danmei novels. Explore Xianxia, Wuxia, and Modern BL stories.",
      images: [heroImage],
    },
    other: {
      "script:application/ld+json": JSON.stringify(schemaData),
    },
  };
}

export default async function HomePage() {
  const featuredNovels = await getFeaturedNovels();

  return (
    <>
      <SiteHeader activePath="home" />

      <section className="hero">
        <div className="hero-content">
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', 
            letterSpacing: '2px',
            textAlign: 'center'
          }}>
            The Best Chinese Danmei Novels in English
          </h1>
          <p className="tagline">
            Your premier destination for high-quality BL and danmei translations
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
