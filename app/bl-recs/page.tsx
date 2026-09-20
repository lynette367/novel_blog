import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  BL_RECS_PATH,
  FINDER,
  clusterPath,
  clusters,
} from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

const title = "BL Novel Recs & Chinese Danmei Translation Finder";
const description =
  "Discover Chinese danmei & BL novel recommendations by trope. Forgot a title or looking for an English version? We help track down where to read it!";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl(BL_RECS_PATH) },
  openGraph: {
    type: "website",
    url: absoluteUrl(BL_RECS_PATH),
    siteName: SITE_NAME,
    title,
    description,
    images: [{ url: `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`, width: 1200, height: 630 }],
  },
};

const primaryButton =
  "inline-flex items-center rounded-full bg-brand-pinkdeep px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-pink";
const secondaryButton =
  "inline-flex items-center rounded-full border border-brand-pinkdeep bg-white px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-blush";

export default function BLRecsPillarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BL Novel Recs",
    description,
    url: absoluteUrl(BL_RECS_PATH),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: clusters.length,
      itemListElement: clusters.map((cluster, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cluster.title,
        url: absoluteUrl(clusterPath(cluster.slug)),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              Cross The Line · BL Discovery
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
              Find Your Next BL Novel & Track Down Danmei Translations
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
              Chinese danmei and BL recommendations organized by trope, mood, and
              the kind of story you&apos;re looking for.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#lists" className={primaryButton}>
                Browse the Lists ↓
              </a>
              <a href="#find-it" className={secondaryButton}>
                Looking for a Specific Novel?
              </a>
            </div>
          </header>

          <section className="mt-16" aria-labelledby="lists">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              The Directory
            </p>
            <h2 id="lists" className="mt-2 text-2xl font-bold">
              BL Novel Recommendation Lists
            </h2>

            <div className="mt-5 divide-y divide-card-border border-y border-card-border">
              {clusters.map((cluster) => (
                <Link
                  key={cluster.slug}
                  href={clusterPath(cluster.slug) as Route}
                  className="group flex items-center justify-between gap-6 py-5 transition hover:bg-brand-blush/30"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-ink/45">
                      {cluster.count} novels
                    </p>
                    <h3 className="mt-1 text-lg font-bold group-hover:text-brand-pinkdeep">
                      {cluster.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-ink/65">
                      {cluster.summary}
                    </p>
                  </div>
                  <span className="shrink-0 text-lg text-brand-ink/40 transition group-hover:translate-x-1 group-hover:text-brand-pinkdeep">
                    →
                  </span>
                </Link>
              ))}
              <div className="py-5 text-sm text-brand-ink/45">
                More recommendation lists coming soon.
              </div>
            </div>
          </section>

          <section
            id="find-it"
            aria-labelledby="find-it-title"
            className="mt-20 scroll-mt-24 rounded-3xl border border-card-border bg-card-bg p-7 shadow-[var(--card-shadow)] sm:p-10"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                Looking for something specific?
              </p>
              <h2 id="find-it-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Can&apos;t Find the BL Novel You&apos;re Looking For?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-ink/75">
                Sometimes you know exactly what you want to read — you just can&apos;t
                find where to read it in English.
              </p>
              <p className="mt-3 text-base leading-relaxed text-brand-ink/75">
                If there&apos;s a Chinese danmei or BL novel you&apos;re trying to track
                down, send us whatever you remember: the title, author, a plot detail,
                a character name, or even a screenshot. We&apos;ll take a look and see
                what we can find.
              </p>
            </div>

            <div className="mt-8 border-t border-card-border pt-8">
              <h3 className="text-xl font-bold">
                Here&apos;s the kind of thing you can ask us to find
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-brand-blush/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-ink/45">
                    You remember the story
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">
                    “The protagonist was a botanist, the love interest was an alien
                    marshal, and there was something about flowers…”
                  </p>
                </div>
                <div className="rounded-xl border border-card-border bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-ink/45">
                    You give us the clues
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">
                    A Chinese or English title, author, character name, plot detail,
                    screenshot, or even a fragment of text can be enough to start.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-card-border pt-6">
                <p className="font-bold">Want us to look?</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-ink/70">
                  If the novel is already on our recommendation list, you can Donate $20 on Ko-fi and include the title in your message. 
                </p>
                <p className="mt-1 text-sm leading-relaxed text-brand-ink/70">
                  For other novels, please Email us the details first. We will review the clues and let you know if we can find it before you make a donation.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={FINDER.payUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primaryButton}
                  >
                    Donate $20 on Ko-fi →
                  </a>
                  <Link href="/contact" className={secondaryButton}>
                    Email us the details
                  </Link>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-brand-ink/50">
                  This is a reader-supported search. While we do our best, we cannot guarantee that every book will be found.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16 border-t border-card-border pt-10 text-center">
            <h2 className="text-xl font-bold">Want to Read Our Translations?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-ink/65">
              Explore the novels currently being translated and published on Cross
              The Line.
            </p>
            <Link
              href="/novels"
              className="mt-5 inline-flex font-bold underline underline-offset-4"
            >
              Browse Our Novels →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

