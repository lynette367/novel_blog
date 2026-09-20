import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { FinderPanel } from "@/components/finder-panel";
import { BL_RECS_PATH, clusterPath, recommendations } from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

const SLUG = "healing-sci-fi-bl-novels";
const PATH = clusterPath(SLUG);

const clusterLinks = [
  { label: "Fluffy BL Novels", href: "#fluffy-bl" },
  { label: "Sci-Fi BL Novels", href: "#scifi-bl" },
  { label: "Found Family", href: "#found-family" },
  { label: "Non-Human Romance", href: "#non-human-romance" },
];

const title = "Healing Sci-Fi BL Novels: 5 Cozy Chinese Danmei Picks";
const description =
  "Five healing sci-fi BL novels by Yue Xia Sang: dinosaur-world romance, found family, alien courtship and robot parents. Cozy Chinese danmei, plus help finding any title.";

export const metadata: Metadata = {
  title: '5 Warm & Healing BL Novels Worth Adding to Your Reading List',
  description: 'Discover the ultimate cozy and heartwarming Chinese danmei novels. From sweet prehistoric dinosaur worlds to star-spanning found families by Yue Xia Sang, find your next favorite fluffy romance.',
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    url: absoluteUrl(PATH),
    siteName: SITE_NAME,
    title,
    description,
    images: [
      {
        url: `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`,
        width: 1408,
        height: 768,
        alt: "Destiny Encounter in the Jurassic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`],
  },
};

export default function HealingSciFiBLNovelsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Healing Sci-Fi BL Novels",
      description:
        "Five Chinese danmei and BL novels for readers who enjoy healing stories, science fiction, found family, and unusual worldbuilding.",
      numberOfItems: recommendations.length,
      itemListElement: recommendations.map((book, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: book.title,
        url: `${absoluteUrl(PATH)}#${book.number}`,
        ...(book.cover
          ? {
            image: {
              "@type": "ImageObject",
              url: `${SITE_URL}${book.cover.src}`,
              name: book.cover.title,
              caption: book.cover.caption,
              description: book.cover.alt,
              width: 1408,
              height: 768,
            },
          }
          : {}),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "BL Novel Recs", item: absoluteUrl(BL_RECS_PATH) },
        { "@type": "ListItem", position: 3, name: "Healing Sci-Fi BL Novels", item: absoluteUrl(PATH) },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="blRecsPage">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href={BL_RECS_PATH as Route}>BL Novel Recs</Link> / Healing Sci-Fi BL Novels
        </nav>

        <section className="recsHero">
          <div className="eyebrow">CROSS THE LINE · BL RECS</div>
          <h1>Healing Sci-Fi BL Novels</h1>
          <p className="heroLead">
            Five Chinese danmei novels for readers who want more than romance:
            strange worlds, non-human love interests, found family, comedy, and
            stories that leave you feeling a little warmer than when you began.
          </p>

          <nav className="topicNav" aria-label="BL recommendation topics">
            {clusterLinks.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </section>

        <section className="introPanel" aria-labelledby="why-read">
          <div className="sectionKicker">A READING LIST FOR CURIOUS BL READERS</div>
          <h2 id="why-read">
            Looking for healing BL novels with a sci-fi twist?
          </h2>
          <p>
            Chinese danmei has a remarkable range, and some of its most memorable
            stories are difficult to reduce to a single trope. This list focuses
            on five novels by Yue Xia Sang that connect romance with speculative
            worldbuilding. Across dinosaur societies, prehistoric communities,
            alien plant cultures, distant planets, and robot families, the common
            thread is a love of unusual settings and emotionally warm character
            relationships.
          </p>
          <p>
            The five books also offer very different reading experiences. Some are
            short, playful, and built around one wonderfully strange premise. Others
            are much larger stories where romance develops alongside family,
            friendship, adventure, and social worldbuilding. If you are new to
            danmei or simply searching for your next BL novel, use the tags below
            each recommendation to find the atmosphere that fits your mood.
          </p>
        </section>

        <section className="recommendations" aria-labelledby="top-picks">
          <div className="sectionHeading">
            <div>
              <div className="sectionKicker">THE LIST</div>
              <h2 id="top-picks">5 BL Novels Worth Adding to Your Reading List</h2>
            </div>
            <span className="count">05 picks</span>
          </div>

          <div className="blogBookList">
            {recommendations.map((book, index) => (
              <article
                key={book.number}
                id={book.number}
                className="blogBookEntry"
              >
                <header className="blogBookHeader">
                  <h3 className="blogBookTitle">
                    <span className="blogBookNum">{book.number}.</span>
                    {book.title}
                  </h3>
                  <div className="blogBookMeta">
                    <span className="metaAuthor">By {book.author}</span>
                    <span className="metaSep">·</span>
                    <span className="metaGenre">Chinese Danmei</span>
                    {book.tags.map((tag) => (
                      <span key={tag} className="metaItem">
                        <span className="metaSep">·</span>
                        <span className="metaTag">{tag}</span>
                      </span>
                    ))}
                  </div>
                </header>

                <p className="blogBookHook">{book.hook}</p>

                {book.cover ? (
                  <figure
                    className="blogBookFigure"
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  >
                    <meta itemProp="name" content={book.cover.title} />
                    <meta itemProp="description" content={book.cover.alt} />
                    <div className="blogBookImageFrame">
                      <Image
                        src={book.cover.src}
                        alt={book.cover.alt}
                        title={book.cover.title}
                        width={1408}
                        height={768}
                        sizes="(max-width: 768px) 100vw, 460px"
                        priority={index === 0}
                        className="blogBookImg"
                        itemProp="contentUrl"
                      />
                    </div>
                    <figcaption className="blogBookCaption" itemProp="caption">
                      {book.cover.caption}
                    </figcaption>
                  </figure>
                ) : null}

                <div className="blogBookBody">
                  {book.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="blogBookAction">
                  <a href="#find-it" className="findLink">
                    Want to read this one? We&apos;ll help you find it →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl my-12 pt-8 border-t border-[#f7c6d9]/40" aria-labelledby="series-guide">
          <div className="sectionKicker">A CONNECTED READING WORLD</div>
          <h2 id="series-guide" className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#2b1f2d]">
            Where should you start?
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-[#756c74]">
            <p>
              If you are especially interested in the dinosaur-world continuity,
              start with <strong>Migrating to the Jurassic</strong> and continue to
              <strong> Return to the Jurassic</strong>. <strong>The Budding Marshal</strong>
              expands the setting into a stranger interstellar direction, while
              <strong> Primitive Once Again</strong> explores an earlier point in the
              world&apos;s history. <strong>There Is No Afterlife</strong> carries related
              worldbuilding into a much larger science-fiction story.
            </p>
            <p>
              You do not have to read every connected title in order to enjoy each
              book. Think of this page as a starting map: choose the premise that
              sounds most appealing, then follow the connections if you find
              yourself wanting more of the world.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl my-12">
          <FinderPanel />
        </div>

        <section className="mx-auto max-w-3xl my-12 pt-8 border-t border-[#f7c6d9]/40">
          <div>
            <div className="sectionKicker">KEEP EXPLORING</div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#2b1f2d]">
              Still looking for your next BL novel?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-[#756c74]">
              See more lists on our BL novel recs hub, or browse the novels we
              translate on Cross The Line.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={BL_RECS_PATH as Route} className="primaryButton">
              More BL Novel Recs →
            </Link>
            <Link href={"/novels" as Route} className="secondaryButton">
              Browse Novels
            </Link>
            <Link href={"/weekly-quotes" as Route} className="secondaryButton">
              Read Weekly Quotes
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
