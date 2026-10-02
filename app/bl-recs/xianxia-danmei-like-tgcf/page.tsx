import type { Metadata, Route } from "next";
import Link from "next/link";
import { FinderPanel } from "@/components/finder-panel";
import { BL_RECS_PATH, clusterPath } from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

export const dynamic = "force-static";

const SLUG = "xianxia-danmei-like-tgcf";
const PATH = clusterPath(SLUG);

const title = "3 Danmei Novels Like Heaven Official's Blessing (TGCF)";
const description =
  "Loved Heaven Official's Blessing (TGCF)? Discover 3 epic xianxia BL danmei novels featuring reincarnation, centuries of devotion, and fated love.";

export const metadata: Metadata = {
  title: {
    absolute: `${title} | ${SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: absoluteUrl(PATH),
  },
  openGraph: {
    type: "article",
    url: absoluteUrl(PATH),
    siteName: SITE_NAME,
    title,
    description,
    images: [
      {
        url: `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`,
        width: 1200,
        height: 630,
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

const recommendations = [
  {
    number: "01",
    title: "Yu She (遇蛇)",
    author: "Su Hen (溯痕)",
    subtitle: "For readers who love centuries of waiting and reincarnation",
    tags: ["Xianxia", "Reincarnation", "Fated Love", "Angst"],
    description: (
      <>
        <p>
          If the centuries-long devotion between Hua Cheng and Xie Lian in{" "}
          <strong>Heaven Official&apos;s Blessing</strong> stayed with you,
          <em> Yu She</em> is one danmei novel worth putting on your list.
        </p>

        <p>
          The story begins with a simple encounter between the snake demon{" "}
          <strong>Yi Mo</strong> and the mortal <strong>Shen Qingxuan</strong>.
          What follows is a love story that stretches across three lifetimes.
          In his first life, Shen Qingxuan loves Yi Mo with everything a mortal
          can give, only to die with their relationship still constrained by
          the boundary between human and demon.
        </p>

        <p>
          In his second life, Shen Qingxuan is reborn as the general Ji Jiu.
          Yi Mo forces his way back into his life, and their relationship
          becomes a painful mixture of resistance, attachment, and unfinished
          promises. In the third life, Shen Qingxuan becomes the seemingly
          foolish Liu Yan, while Yi Mo is finally willing to give up a
          millennium of cultivation to fulfill a promise that has lasted for
          centuries.
        </p>

        <p>
          The novel&apos;s greatest strength is its sense of time. Love is not
          treated as something that disappears when a lifetime ends. Instead,
          every separation becomes part of the relationship itself. Yi Mo&apos;s
          transformation from an apparently detached demon into someone capable
          of an almost obsessive devotion gives the story its emotional force.
        </p>

        <p>
          <strong>Why TGCF fans may enjoy it:</strong> reincarnation, impossible
          love, supernatural beings, and devotion that survives the passage of
          time. If what you loved most about Hua Cheng was his unwavering
          devotion to Xie Lian, <em>Yu She</em> explores a similarly intense
          idea through a much more tragic three-life romance.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "Qing Shan Kan Wo Ying Ru Shi (青山看我应如是)",
    author: "Jing Shui Bian (静水边)",
    subtitle: "For readers who prefer eternal devotion without relentless angst",
    tags: ["Xianxia", "Immortality", "Slow-Burn", "Healing"],
    description: (
      <>
        <p>
          Not every novel similar to <strong>Heaven Official&apos;s Blessing</strong>{" "}
          needs to be devastating. <em>Qing Shan Kan Wo Ying Ru Shi</em> takes
          the idea of love lasting across enormous stretches of time and turns
          it into something gentler and more comforting.
        </p>

        <p>
          The story follows the ancient emperor <strong>Ji Qingbai</strong> and
          the Buddhist sovereign <strong>Tan Zhang</strong>, whose connection
          survives countless eras and repeated encounters. Their relationship
          begins with conflict and misunderstanding, but gradually becomes a
          quiet certainty: after countless lifetimes and tribulations, they
          continue to find their way back to each other.
        </p>

        <p>
          The opening already establishes the novel&apos;s particular atmosphere.
          Ji Qingbai remains in the celestial realm, waiting for Tan Zhang to
          return from his mortal tribulation. Instead of relying entirely on
          dramatic suffering, the novel finds warmth in the everyday life of an
          enormous xianxia world.
        </p>

        <p>
          There is plenty of humor among the immortals as well. Celestial
          officials complain about the chaos of the Three Realms, while
          supernatural characters retain unexpectedly cute habits and
          personalities. The result is a world that feels vast without becoming
          cold.
        </p>

        <p>
          <strong>Why TGCF fans may enjoy it:</strong> ancient gods, Buddhist
          imagery, celestial bureaucracy, reincarnation, and a relationship
          measured in thousands or millions of years rather than ordinary human
          lifetimes. If you enjoyed the lighter moments of the heavenly realm
          in TGCF as much as the romance, this is a particularly natural
          direction to explore.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "The Whole Dao Sect Owes Me a Favor (全道门都欠我一个人情)",
    author: "Qi Jing Nan Qu (骑鲸南去)",
    subtitle: "For readers who love misunderstood heroes and mutual salvation",
    tags: ["Xianxia", "Cultivation", "Action", "Mutual Devotion"],
    description: (
      <>
        <p>
          One of the most appealing parts of{" "}
          <strong>Heaven Official&apos;s Blessing</strong> is the contrast
          between how the world treats Xie Lian and how deeply Hua Cheng
          believes in him. <em>The Whole Dao Sect Owes Me a Favor</em> plays
          with a similar idea: what happens when someone once regarded as a
          legendary hero becomes the person everyone else misunderstands?
        </p>

        <p>
          <strong>Feng Rugu</strong> is a legendary figure of the Daoist world.
          He creates his own sword manual at fourteen and once protects his
          disciples by standing alone against the demon realm for eighty-nine
          days. Yet years later, the same world that once admired him turns
          against him. At twenty-eight, he finds himself surrounded by broken
          promises, misunderstanding, and old debts that have never been
          properly settled.
        </p>

        <p>
          His path eventually crosses with <strong>You Hongchen</strong>, a
          Buddhist lay practitioner whose philosophy is far less conventional
          than his appearance might suggest. Their first encounters are marked
          by suspicion and conflict. As they uncover what actually happened in
          the past, however, hostility gradually gives way to trust.
        </p>

        <p>
          The novel combines cultivation-world adventure with a strong ensemble
          cast and a romance built around mutual protection. Rather than simply
          having one character rescue the other, the relationship gradually
          becomes one in which both characters are willing to stand between the
          other and the rest of the world.
        </p>

        <p>
          <strong>Why TGCF fans may enjoy it:</strong> a brilliant but
          misunderstood protagonist, cultivation politics, Buddhist and Daoist
          elements, supernatural conflict, and a romance centered on
          unwavering support. It is especially worth exploring if your favorite
          TGCF element is the combination of a larger-than-life hero and the
          person who refuses to abandon him.
        </p>
      </>
    ),
  },
];

const lineup = recommendations.map((book) => ({
  "@type": "ListItem",
  position: parseInt(book.number, 10),
  name: book.title,
  description: `${book.title} by ${book.author} - ${book.subtitle}`,
}));

export default function XianxiaDanmeiLikeTgcfPage() {
  const canonicalUrl = absoluteUrl(PATH);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: recommendations.length,
        itemListElement: lineup,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "BL Novel Recs", item: absoluteUrl(BL_RECS_PATH) },
        { "@type": "ListItem", position: 3, name: "Novels Like TGCF", item: canonicalUrl },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-brand-ink/50" aria-label="Breadcrumb">
            <Link
              href={BL_RECS_PATH as Route}
              className="transition hover:text-brand-ink"
            >
              BL Novel Recs
            </Link>
            <span className="mx-2">/</span>
            <span>Novels Like TGCF</span>
          </nav>

          {/* Hero Header */}
          <header className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              CROSS THE LINE · BL RECS
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl font-serif text-[#2b1f2d]">
              3 BL Danmei Novels Like{" "}
              <em>Heaven Official&apos;s Blessing</em> (TGCF)
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-brand-ink/70">
              Looking for your next danmei after <em>Heaven Official&apos;s Blessing</em>?
              These three xianxia BL novels explore reincarnation, immortality, fate,
              devotion, and the kind of love that survives impossible odds.
            </p>

            <div className="mt-6 rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)]">
              <p className="text-sm leading-relaxed text-brand-ink/75">
                These recommendations focus on some of the core elements that make{" "}
                <strong>Heaven Official&apos;s Blessing</strong> so memorable: centuries of
                devotion, supernatural worlds, reincarnation, misunderstood heroes, and
                relationships that refuse to disappear with time.
              </p>
            </div>
          </header>

          {/* Table of Contents / Lineup */}
          <section className="mt-12" aria-labelledby="toc-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                  Featured Lineup
                </p>

                <h2 id="toc-heading" className="mt-2 text-2xl font-bold">
                  Featured Novels in This Guide
                </h2>
              </div>

              <span className="shrink-0 text-sm text-brand-ink/50">
                {recommendations.length} Novels
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-card-border bg-card-bg">
              {recommendations.map((book) => (
                <a
                  key={book.number}
                  href={`#novel-${book.number}`}
                  className="flex items-center gap-4 border-b border-card-border px-4 py-3 text-base sm:text-lg transition last:border-b-0 hover:bg-brand-blush/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blush text-xs font-bold text-brand-ink">
                    {book.number}
                  </span>

                  <span className="font-bold text-brand-ink">{book.title}</span>

                  <span className="ml-auto hidden text-xs text-brand-ink/50 sm:block">
                    By {book.author}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Recommendations List */}
          <section
            id="recommendations"
            className="mt-12"
            aria-labelledby="recommendations-heading"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              IF YOU LOVED TGCF
            </p>
            <h2 id="recommendations-heading" className="mt-2 text-2xl font-bold">
              Danmei Novels with Fate, Devotion &amp; Xianxia Worlds
            </h2>

            <ol className="mt-8 divide-y divide-[#f7c6d9]/40 space-y-12">
              {recommendations.map((book) => (
                <li
                  key={book.number}
                  id={`novel-${book.number}`}
                  className="scroll-mt-24 pt-12 first:pt-0"
                >
                  <article>
                    <header>
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-bold text-brand-ink">
                          {book.number}
                        </span>

                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-[#2b1f2d]">
                            {book.title}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-brand-ink/55">
                            By {book.author}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {book.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-[#f1c5d2] bg-white px-2.5 py-0.5 text-xs text-[#9f6379]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="mt-5 border-l-2 border-brand-pinkdeep bg-brand-blush/30 pl-4 py-2 text-sm font-medium leading-relaxed text-brand-ink/75 italic">
                        {book.subtitle}
                      </p>
                    </header>

                    <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink/80">
                      {book.description}
                    </div>

                    {/* Want to read this one callout */}
                    <div className="blogBookAction">
                      <a href="#find-it" className="findLink">
                        Want to read this one? We&apos;ll help you find it →
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          {/* Contextual Finder Panel CTA */}
          <div className="mt-14">
            <FinderPanel />
          </div>

          {/* Keep Exploring */}
          <section className="mt-14 pt-8 border-t border-[#f7c6d9]/40">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                KEEP EXPLORING
              </p>
              <h2 className="mt-2 text-2xl font-bold font-serif text-[#2b1f2d]">
                Still Looking for Your Next BL Novel?
              </h2>
              <p className="mt-2 text-base leading-relaxed text-[#756c74]">
                There are thousands of Chinese BL and danmei novels, but finding
                one that matches a specific mood, trope, or relationship dynamic
                can be surprisingly difficult. Explore our curated recommendation
                lists or browse the novels we translate on Cross The Line.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={BL_RECS_PATH as Route}
                className="inline-flex items-center rounded-full bg-brand-pinkdeep px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-pink"
              >
                More BL Novel Recs →
              </Link>
              <Link
                href={"/novels" as Route}
                className="inline-flex items-center rounded-full border border-brand-pinkdeep bg-white px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-blush"
              >
                Browse Novels
              </Link>
              <Link
                href={"/weekly-quotes" as Route}
                className="inline-flex items-center rounded-full border border-brand-pinkdeep bg-white px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-blush"
              >
                Read Weekly Quotes
              </Link>
            </div>
          </section>

          {/* Back link */}
          <p className="mt-10 text-center">
            <Link
              href={BL_RECS_PATH as Route}
              className="font-bold underline underline-offset-4 text-brand-ink/80 hover:text-brand-ink transition"
            >
              ← Back to BL Novel Recs
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
