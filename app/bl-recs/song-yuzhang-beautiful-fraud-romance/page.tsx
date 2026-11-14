import type { Metadata, Route } from "next";
import Link from "next/link";
import { FinderPanel } from "@/components/finder-panel";
import { BL_RECS_PATH, clusterPath } from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

export const dynamic = "force-static";

const SLUG = "song-yuzhang-beautiful-fraud-romance";
const PATH = clusterPath(SLUG);

const title = "Song Yuzhang (宋玉章): A Beautiful Fraud Worth Reading";
const description =
    "A danmei recommendation for Song Yuzhang—a Republic-era 万人迷 BL novel with a beautiful con man, razor-sharp romantic tension, and a choice that turns a great guilty pleasure into an unforgettable story.";

export const metadata: Metadata = {
    title,
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
                url: `${SITE_URL}/assets/images/song-yuzhang.jpeg`,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${SITE_URL}/assets/images/song-yuzhang.jpeg`],
    },
};

const book = {
    title: "Song Yuzhang (宋玉章)",
    author: "Dong Gan Chao Ren (冻感超人)",
    subtitle:
        "A beautiful con man, a hollowed-out inheritance, and the one choice that turns a guilty pleasure into something unforgettable.",
    tags: ["Republic Era", "万人迷", "Enemies to Lovers", "Con Artist", "Redeemed Antihero"],
    pairing: "Song Yuzhang × Meng Tingjing",
};

const reviewSections = [
    {
        id: "what-it-is",
        number: "01",
        heading: "What Song Yuzhang Is",
        paragraphs: (
            <>
                <p>
                    If you love a danmei where the chase is as sharp and addictive as the
                    emotional payoff, <em>Song Yuzhang</em> will ruin you in the best way.
                    This is a Republic-era, 万人迷 (everyone-falls-for-him) main-shou novel
                    with a beautiful, shameless scammer at its center—and a romantic
                    dynamic that is pure, drawn-out, teeth-bared tension.
                </p>

                <p>
                    Song Yuzhang himself is the kind of protagonist who should be
                    insufferable. He is a street-hardened con man who, after a shipwreck,
                    seizes the chance to impersonate the long-lost son of a wealthy
                    merchant and dives headfirst into a world of decadence and danger. He
                    is vain, slippery, and allergic to sincerity. And yet, the novel&apos;s
                    true magic is that it doesn&apos;t ask you to love him <em>despite</em>{" "}
                    all that. It makes you love him for what he chooses to do when being
                    that person is no longer enough.
                </p>
            </>
        ),
    },
    {
        id: "the-romance",
        number: "02",
        heading: "The Romance: Song Yuzhang × Meng Tingjing",
        paragraphs: (
            <>
                <p>
                    The main pairing, <strong>Song Yuzhang × Meng Tingjing</strong>, is
                    enemies-to-lovers at its most exquisite: two people who start out
                    genuinely adversarial, clawing at each other&apos;s weakest points,
                    before the narrative drags them—kicking and bleeding—toward something
                    that feels earned rather than inevitable.
                </p>

                <p>
                    If you want the delicious ache of a love story built on friction, read
                    it for Meng Tingjing and Song Yuzhang&apos;s relentless push-and-pull.
                    The tension is not a decorative slow burn; it is the engine of the
                    book. Every concession costs something, and every moment of softness
                    has to be paid for.
                </p>
            </>
        ),
    },
    {
        id: "the-choice",
        number: "03",
        heading: "The Choice That Changes Everything",
        paragraphs: (
            <>
                <p>
                    The turning point arrives with a cruelty that is almost surgical. The
                    &ldquo;father&rdquo; who welcomed Song Yuzhang was running a con of his
                    own. The inheritance he schemed for is a hollowed-out bank: a shell
                    holding three hundred million in debt, with a quiet back door already
                    prepared for him—flee to England, let the depositors lose everything,
                    and let the name &ldquo;Song Yuzhang&rdquo; absorb the blame. For a man
                    whose entire survival strategy has been to slip out the back, running
                    is not just an option. It is the <em>obvious</em> option.
                </p>

                <p>
                    And then he doesn&apos;t. He goes up to the roof, looks down at the city
                    lights, and sees the people whose entire savings are about to
                    evaporate—people who are not unlike the version of himself he left
                    behind in the gutters. He stays. He takes the three-hundred-million
                    debt onto his shoulders and decides, against every instinct and every
                    incentive, to keep the bank alive. The shift is not delivered as a
                    grand moral speech. It happens in the space between one plan and the
                    next, and it lands harder because of it.
                </p>
            </>
        ),
    },
    {
        id: "more-than-a-guilty-pleasure",
        number: "04",
        heading: "Why It&apos;s More Than a 万人迷 Novel",
        paragraphs: (
            <>
                <p>
                    That is what separates <em>Song Yuzhang</em> from a hundred other
                    gorgeous-face, everyone-wants-him stories. The beauty gets him through
                    the door. The choice to stay in a burning building for people who will
                    never know his name is what makes him impossible to forget. The novel
                    lets him be a fraud, a flirt, and a survivor—and then lets him become
                    something heavier, something chosen.
                </p>

                <p>
                    A man who is best at running chooses to stay. A man who has every
                    reason to save himself chooses to carry a debt that was never his. That
                    reversal is the heart of the book, and it is why Song Yuzhang lingers
                    long after the last page.
                </p>
            </>
        ),
    },
];

const lineup = reviewSections.map((section) => ({
    "@type": "ListItem",
    position: parseInt(section.number, 10),
    name: section.heading,
    description: section.heading,
}));

export default function SongYuzhangReviewPage() {
    const canonicalUrl = absoluteUrl(PATH);

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            name: title,
            description,
            url: canonicalUrl,
            isPartOf: {
                "@type": "WebSite",
                name: SITE_NAME,
                url: absoluteUrl("/"),
            },
            about: {
                "@type": "Book",
                name: book.title,
                author: {
                    "@type": "Person",
                    name: book.author,
                },
            },
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: reviewSections.length,
                itemListElement: lineup,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "BL Novel Recs", item: absoluteUrl(BL_RECS_PATH) },
                { "@type": "ListItem", position: 3, name: "Song Yuzhang Review", item: canonicalUrl },
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
                        <span>Song Yuzhang Review</span>
                    </nav>

                    {/* Hero Header */}
                    <header className="mt-8">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                            CROSS THE LINE · BL RECS
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl font-serif text-[#2b1f2d]">
                            <em>Song Yuzhang</em> (宋玉章): A Beautiful Fraud Worth Reading
                        </h1>

                        <p className="mt-5 text-lg leading-relaxed text-brand-ink/70">
                            A Republic-era 万人迷 BL novel about a beautiful con man, a
                            hollowed-out inheritance, and the one choice that turns a great
                            guilty pleasure into something unforgettable.
                        </p>

                        <div className="mt-6 rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)]">
                            <p className="text-sm leading-relaxed text-brand-ink/75">
                                This recommendation focuses on what makes{" "}
                                <strong>Song Yuzhang</strong> stand out beyond its surface
                                pleasures: razor-sharp romantic tension, a protagonist who is
                                easy to adore, and a moral turning point that gives the whole
                                novel its weight.
                            </p>
                        </div>
                    </header>

                    {/* Book Info Card */}
                    <section className="mt-10 rounded-2xl border border-card-border bg-card-bg p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#2b1f2d]">
                                    {book.title}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-brand-ink/55">
                                    By {book.author}
                                </p>
                                <p className="mt-2 text-sm text-brand-ink/70">
                                    Pairing: <strong>{book.pairing}</strong>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
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

                        <p className="mt-4 border-l-2 border-brand-pinkdeep bg-brand-blush/30 pl-4 py-2 text-sm font-medium leading-relaxed text-brand-ink/75 italic">
                            {book.subtitle}
                        </p>

                        <div className="blogBookAction">
                            <a href="#find-it" className="findLink">
                                Want to read this one? We&apos;ll help you find it →
                            </a>
                        </div>
                    </section>

                    {/* Table of Contents */}
                    <section className="mt-12" aria-labelledby="toc-heading">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                                    In This Review
                                </p>

                                <h2 id="toc-heading" className="mt-2 text-2xl font-bold">
                                    What This Recommendation Covers
                                </h2>
                            </div>

                            <span className="shrink-0 text-sm text-brand-ink/50">
                                {reviewSections.length} Sections
                            </span>
                        </div>

                        <div className="mt-5 overflow-hidden rounded-2xl border border-card-border bg-card-bg">
                            {reviewSections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#section-${section.id}`}
                                    className="flex items-center gap-4 border-b border-card-border px-4 py-3 text-base sm:text-lg transition last:border-b-0 hover:bg-brand-blush/50"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blush text-xs font-bold text-brand-ink">
                                        {section.number}
                                    </span>

                                    <span className="font-bold text-brand-ink">
                                        {section.heading}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Review Sections */}
                    <section
                        id="review"
                        className="mt-12"
                        aria-labelledby="review-heading"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                            WHY READ IT
                        </p>
                        <h2 id="review-heading" className="mt-2 text-2xl font-bold">
                            A Love Story Built on Friction and One Impossible Choice
                        </h2>

                        <ol className="mt-8 divide-y divide-[#f7c6d9]/40 space-y-12">
                            {reviewSections.map((section) => (
                                <li
                                    key={section.id}
                                    id={`section-${section.id}`}
                                    className="scroll-mt-24 pt-12 first:pt-0"
                                >
                                    <article>
                                        <header>
                                            <div className="flex items-start gap-4">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-bold text-brand-ink">
                                                    {section.number}
                                                </span>

                                                <h3 className="text-2xl font-bold text-[#2b1f2d]">
                                                    {section.heading}
                                                </h3>
                                            </div>
                                        </header>

                                        <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink/80">
                                            {section.paragraphs}
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* Contextual Finder Panel CTA */}
                    <div id="find-it" className="mt-14">
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