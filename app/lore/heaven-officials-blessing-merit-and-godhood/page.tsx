import type { Metadata, Route } from "next";
import Link from "next/link";
import {
    LoreFigure,
    LoreHero,
    LorePageLayout,
    LoreReaderNote,
    LoreSectionHeading,
    LoreToc,
    type LoreTocItem,
} from "@/components/lore/lore-article-components";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/siteMetadata";

export const dynamic = "force-static";

const SLUG = "heaven-officials-blessing-merit-and-godhood";
const PATH = `/lore/${SLUG}/`;
const defaultOgImage = `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`;

const H1_TITLE =
    "Merit, Godhood, and Xie Lian: The Chinese Belief Behind Heaven Official's Blessing";
const PAGE_TITLE =
    "The Meaning of Merit and Godhood in Heaven Official's Blessing";
const PAGE_DESCRIPTION =
    "Explore the Chinese belief behind Heaven Official's Blessing: how gods are made through merit, how the heavenly court corrupts this ideal, and how Xie Lian redefines compassion.";

export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    keywords: [
        "Heaven Official's Blessing",
        "TGCF",
        "Xie Lian",
        "merit and godhood",
        "Chinese mythology",
        "Chinese folk religion",
        "Daoist folklore",
        "danmei cultural analysis",
        "Hua Cheng",
    ],
    alternates: {
        canonical: absoluteUrl(PATH),
    },
    openGraph: {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: absoluteUrl(PATH),
        siteName: SITE_NAME,
        type: "article",
        images: [
            {
                url: defaultOgImage,
                width: 1200,
                height: 630,
                alt: PAGE_TITLE,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        images: [defaultOgImage],
    },
};

const TOC_ITEMS: LoreTocItem[] = [
    {
        number: "01",
        href: "#gods-not-born-gods",
        label: "In Chinese Belief, Gods Are Not Born Gods",
    },
    {
        number: "02",
        href: "#merit-as-currency",
        label: "The Heavenly Court: When Merit Becomes a Currency",
    },
    {
        number: "03",
        href: "#first-ascension",
        label: "Xie Lian's First Ascension: Merit Given by the System",
    },
    {
        number: "04",
        href: "#second-ascension",
        label: "His Second Ascension: Doing Good Without Seeking Recognition",
    },
    {
        number: "05",
        href: "#scrap-collecting-god",
        label: "Eight Hundred Years as a Scrap-Collecting God",
    },
    {
        number: "06",
        href: "#meaning-of-xie-lian",
        label: "What Does the Character Xie Lian Really Mean?",
    },
    {
        number: "07",
        href: "#merit-is-a-choice",
        label: "Merit Is Not a Score. It Is What You Choose to Do.",
    },
];

function ThreeAscensionsDiagram() {
    return (
        <svg
            viewBox="0 0 720 220"
            role="img"
            aria-label="Diagram of Xie Lian's three ascensions: First ascension as merit given by the system, second ascension questioning divine power, and third ascension doing good without seeking reward"
            className="w-full h-auto block max-w-full"
        >
            <rect width="720" height="220" rx="12" fill="#fff9f2" />

            {/* Connecting arrows */}
            <line
                x1="224"
                y1="110"
                x2="250"
                y2="110"
                stroke="#f4a7b9"
                strokeWidth="2"
            />
            <polygon points="248,105 256,110 248,115" fill="#f4a7b9" />
            <line
                x1="464"
                y1="110"
                x2="490"
                y2="110"
                stroke="#f4a7b9"
                strokeWidth="2"
            />
            <polygon points="488,105 496,110 488,115" fill="#f4a7b9" />

            {/* Stage 1 */}
            <g>
                <rect
                    x="20"
                    y="22"
                    width="202"
                    height="176"
                    rx="12"
                    fill="#ffffff"
                    stroke="#f7c6d9"
                    strokeWidth="1.5"
                />
                <rect x="20" y="22" width="202" height="30" rx="12" fill="#ffe3ef" />
                <rect x="20" y="38" width="202" height="14" fill="#ffe3ef" />
                <text
                    x="121"
                    y="42"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    fill="#9c3f5d"
                >
                    01 · FIRST ASCENSION
                </text>
                <text
                    x="121"
                    y="80"
                    textAnchor="middle"
                    fontSize="15"
                    fontFamily="Georgia, serif"
                    fill="#2b1f2d"
                >
                    The Idealistic Prince
                </text>
                <text
                    x="121"
                    y="108"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#7d6f67"
                >
                    Age 17 · Martial God
                </text>
                <text
                    x="121"
                    y="138"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    Merit granted by talent,
                </text>
                <text
                    x="121"
                    y="156"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    status, and the heavenly
                </text>
                <text
                    x="121"
                    y="174"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    system itself.
                </text>
            </g>

            {/* Stage 2 */}
            <g>
                <rect
                    x="259"
                    y="22"
                    width="202"
                    height="176"
                    rx="12"
                    fill="#ffffff"
                    stroke="#f7c6d9"
                    strokeWidth="1.5"
                />
                <rect x="259" y="22" width="202" height="30" rx="12" fill="#ffe3ef" />
                <rect x="259" y="38" width="202" height="14" fill="#ffe3ef" />
                <text
                    x="360"
                    y="42"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    fill="#9c3f5d"
                >
                    02 · SECOND ASCENSION
                </text>
                <text
                    x="360"
                    y="80"
                    textAnchor="middle"
                    fontSize="15"
                    fontFamily="Georgia, serif"
                    fill="#2b1f2d"
                >
                    Questioning Heaven
                </text>
                <text
                    x="360"
                    y="108"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#7d6f67"
                >
                    Choosing to Leave
                </text>
                <text
                    x="360"
                    y="138"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    Sees how little divine
                </text>
                <text
                    x="360"
                    y="156"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    rank means beside real
                </text>
                <text
                    x="360"
                    y="174"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2b1f2d"
                >
                    human suffering.
                </text>
            </g>

            {/* Stage 3 */}
            <g>
                <rect
                    x="498"
                    y="22"
                    width="202"
                    height="176"
                    rx="12"
                    fill="#2b1f2d"
                    stroke="#f4a7b9"
                    strokeWidth="1.5"
                />
                <rect x="498" y="22" width="202" height="30" rx="12" fill="#3a2030" />
                <rect x="498" y="38" width="202" height="14" fill="#3a2030" />
                <text
                    x="599"
                    y="42"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    fill="#f4a7b9"
                >
                    03 · THIRD ASCENSION
                </text>
                <text
                    x="599"
                    y="80"
                    textAnchor="middle"
                    fontSize="15"
                    fontFamily="Georgia, serif"
                    fill="#f7c6d9"
                >
                    The Scrap Collector
                </text>
                <text
                    x="599"
                    y="108"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#f4a7b9"
                >
                    800 Years in the World
                </text>
                <text
                    x="599"
                    y="138"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#ffe3ef"
                >
                    Helps others with no
                </text>
                <text
                    x="599"
                    y="156"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#ffe3ef"
                >
                    temples, no followers, and
                </text>
                <text
                    x="599"
                    y="174"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#ffe3ef"
                >
                    no expectation of reward.
                </text>
            </g>
        </svg>
    );
}

export default function HeavenOfficialsBlessingMeritPage() {
    const canonicalUrl = absoluteUrl(PATH);

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: H1_TITLE,
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            url: canonicalUrl,
            mainEntityOfPage: canonicalUrl,
            inLanguage: "en",
            about: {
                "@type": "Book",
                name: "Heaven Official's Blessing (天官赐福)",
                author: {
                    "@type": "Person",
                    name: "Mo Xiang Tong Xiu (墨香铜臭)",
                },
            },
            author: {
                "@type": "Organization",
                name: SITE_NAME,
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: absoluteUrl("/"),
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Merit, Godhood, and Xie Lian",
                    item: canonicalUrl,
                },
            ],
        },
    ];

    const proseClass =
        "space-y-4 text-[15px] sm:text-base leading-[1.85] text-[#2b1f2d]/90";

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <LorePageLayout
                currentSlug={SLUG}
                breadcrumbLabel="Merit, Godhood, and Xie Lian"
                relatedLinks={[
                    {
                        href: "/bl-recs/xianxia-danmei-like-tgcf/" as Route,
                        title: "3 BL Danmei Novels Like Heaven Official's Blessing (TGCF)",
                        subtitle: "Centuries of devotion, reincarnation & xianxia worlds",
                    },
                ]}
                hero={
                    <LoreHero
                        kicker="Lore & Cultural Analysis · Chinese Mythology · Heaven Official's Blessing"
                        title={H1_TITLE}
                        description="How traditional Chinese beliefs imagine humans becoming gods through merit, how the heavenly court turns worship into power, and why Xie Lian's three ascensions redefine compassion."
                        cta={{ href: "#article-intro", label: "Start reading ↓" }}
                    />
                }
            >
                <article className="space-y-12">
                    <LoreToc items={TOC_ITEMS} variant="list" />

                    <LoreReaderNote title="Reader Note">
                        This guide looks at the traditional Chinese beliefs behind Mo Xiang
                        Tong Xiu&apos;s{" "}
                        <em>Heaven Official&apos;s Blessing</em> (天官赐福 /{" "}
                        <em>Tian Guan Ci Fu</em>). It discusses Xie Lian&apos;s three
                        ascensions and two banishments in broad terms so general readers can
                        follow the ideas easily.
                    </LoreReaderNote>

                    {/* Opening introduction */}
                    <section
                        id="article-intro"
                        className="scroll-mt-24 pb-8 border-b border-[#f7c6d9]/40"
                        aria-label="Introduction"
                    >
                        <div className={proseClass}>
                            <p>
                                In <em>Heaven Official&apos;s Blessing</em> (天官赐福), becoming
                                a god is not simply a matter of being born special. Gods rise
                                from the human world through their deeds, their dedication, and
                                the good they bring to others.
                            </p>
                            <p>
                                This idea is deeply connected to traditional Chinese beliefs
                                about gods and immortals. In many Chinese religious traditions
                                and folk beliefs, a person can become divine through
                                cultivation, extraordinary deeds, or lasting contributions to
                                the people. A god is not necessarily someone who was born
                                divine. A god may be someone who once lived as a human.
                            </p>
                            <p>
                                But <em>Heaven Official&apos;s Blessing</em> takes this belief
                                one step further.
                            </p>
                            <p>
                                Its heavenly world still claims to reward merit. Yet, in
                                practice, divine power often depends on worship, popularity,
                                political influence, and status. The system that once promised
                                to reward good deeds has become something much closer to a
                                system of power.
                            </p>
                            <p>
                                Through Xie Lian&apos;s three ascensions and two banishments,
                                the novel asks a simple but important question:
                            </p>
                        </div>

                        <blockquote className="mt-6 border-l-4 border-[#f4a7b9] bg-[#fff9f2] rounded-r-xl px-5 py-4 font-serif italic text-lg sm:text-xl text-[#2b1f2d]">
                            What does it really mean to deserve becoming a god?
                        </blockquote>
                    </section>

                    {/* Section 1 */}
                    <section
                        id="gods-not-born-gods"
                        aria-labelledby="gods-not-born-gods-heading"
                        className="scroll-mt-24"
                    >
                        <LoreSectionHeading
                            id="gods-not-born-gods-heading"
                            kicker="Part 01"
                            title="In Chinese Belief, Gods Are Not Born Gods"
                        />
                        <div className={proseClass}>
                            <p>
                                One of the distinctive ideas in traditional Chinese religious
                                culture is that the boundary between humans and gods is not
                                fixed.
                            </p>
                            <p>
                                In many mythologies, gods belong to a different kind of being.
                                They may be born into divine families or possess powers that
                                ordinary humans can never obtain.
                            </p>
                            <p>
                                Traditional Chinese beliefs offer a different possibility.
                                Through spiritual cultivation, moral conduct, extraordinary
                                deeds, or helping others, a human may become an immortal or a
                                deity.
                            </p>
                            <p>
                                This idea appears in different forms across Daoist traditions
                                and Chinese folk religion. The paths are not all the same, but
                                the idea that humans can move beyond ordinary life and reach a
                                higher spiritual state is an important part of Chinese religious
                                culture.
                            </p>
                            <p>
                                Some folk gods are also remembered because of what they did for
                                ordinary people.
                            </p>
                            <p>
                                They may have protected a community, helped people survive
                                disasters, defended a country, or become known for their courage
                                and kindness. Over time, people may worship and honor them as
                                gods.
                            </p>
                            <p>
                                In this sense, divinity is not simply a privilege of birth. A
                                person becomes worthy of being remembered as a god through what
                                they do for others.
                            </p>
                            <p>
                                This is the cultural idea that makes Xie Lian&apos;s story so
                                meaningful.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section
                        id="merit-as-currency"
                        aria-labelledby="merit-as-currency-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="merit-as-currency-heading"
                            kicker="Part 02"
                            title="The Heavenly Court: When Merit Becomes a Currency"
                        />
                        <div className={proseClass}>
                            <p>
                                At first glance, the heavenly world in{" "}
                                <em>Heaven Official&apos;s Blessing</em> seems to follow this
                                traditional idea.
                            </p>
                            <p>
                                Mortals cultivate themselves, accomplish extraordinary deeds,
                                and ascend to heaven. Some gods become famous because they
                                protect their people, fight disasters, or sacrifice themselves
                                for others.
                            </p>
                            <p>
                                But the novel also introduces another system: the power of a god
                                depends heavily on the worship of humans.
                            </p>
                            <p>
                                More believers mean more spiritual power. More temples and
                                offerings mean greater influence. When a god loses the support
                                of their followers, their power may decline, and they may even
                                fall from heaven.
                            </p>
                            <p>This creates a contradiction.</p>
                            <p>
                                The original purpose of becoming a god is supposed to be serving
                                people. Yet a god&apos;s survival increasingly depends on how
                                many people worship them.
                            </p>
                            <p>
                                Merit becomes something that can be counted. Worship becomes a
                                source of power. Popularity becomes a measure of importance.
                            </p>
                            <p>
                                The heavenly court begins to resemble a political system. Gods
                                have ranks, alliances, rivalries, reputations, and personal
                                interests. They may still carry the title of gods, but they are
                                not free from the weaknesses of human society.
                            </p>
                            <p>
                                The problem is not that worship itself is wrong. In traditional
                                Chinese religion, worship and offerings are meaningful parts of
                                the relationship between people and gods.
                            </p>
                            <p>
                                The problem is what happens when worship becomes more important
                                than the people being worshipped for. The gods are supposed to
                                protect humanity. But what happens when they become more
                                concerned with maintaining their own power?
                            </p>
                            <p>
                                This is one of the central tensions of the novel&apos;s
                                worldbuilding.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section
                        id="first-ascension"
                        aria-labelledby="first-ascension-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="first-ascension-heading"
                            kicker="Part 03"
                            title="Xie Lian's First Ascension: Merit Given by the System"
                        />
                        <div className={proseClass}>
                            <p>
                                Xie Lian&apos;s first ascension happens when he is only
                                seventeen years old.
                            </p>
                            <p>
                                As the Crown Prince of Xianle, he is admired, talented, and
                                deeply devoted to his people. His ascension as the God of
                                Martial Arts and Joy is the result of his exceptional abilities,
                                his position, and the deeds that make him worthy of divine
                                recognition.
                            </p>
                            <p>
                                But at this point, his understanding of merit is still
                                idealistic.
                            </p>
                            <p>
                                He believes that being a god means having the power to help
                                people. If he has the ability to save others, then he should use
                                it.
                            </p>
                            <p>This belief leads to his first downfall.</p>
                            <p>
                                When he tries to interfere with the fate of his kingdom, his
                                actions fail to prevent its destruction. Xianle falls, and the
                                people he once protected turn against him. He is attacked and
                                banished from heaven.
                            </p>
                            <p>
                                His first downfall exposes the painful gap between his ideals
                                and reality. He once believed that divine power could solve
                                human suffering. Instead, he discovers that power does not
                                guarantee success, gratitude, or justice.
                            </p>
                            <p>
                                The people he wanted to save do not necessarily understand him.
                                The system that gave him his divine status does not protect him
                                when everything goes wrong.
                            </p>
                            <p>
                                His first banishment is not simply the punishment of a failed
                                god. It is the moment when his idealistic understanding of merit
                                begins to break apart.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section
                        id="second-ascension"
                        aria-labelledby="second-ascension-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="second-ascension-heading"
                            kicker="Part 04"
                            title="His Second Ascension: Doing Good Without Seeking Recognition"
                        />
                        <div className={proseClass}>
                            <p>
                                Years later, Xie Lian ascends again after stopping the Human
                                Face Disease.
                            </p>
                            <p>
                                This time, his achievement is much more directly connected to
                                saving people from suffering. Yet after his second ascension,
                                he eventually chooses to leave heaven again.
                            </p>
                            <p>This decision is important.</p>
                            <p>
                                He has already experienced what it means to be a god. He has
                                seen the power, the status, and the expectations that come with
                                it. He has also seen how little those things can mean when
                                people are suffering.
                            </p>
                            <p>
                                He no longer believes that becoming a god automatically makes
                                someone better. Nor does he believe that divine status is the
                                ultimate reward for doing good.
                            </p>
                            <p>
                                His second banishment marks a change in how he understands
                                merit. He is no longer trying to prove that he deserves a place
                                in heaven.
                            </p>
                            <p>
                                He has begun to question whether heaven is even the place where
                                his values belong.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section
                        id="scrap-collecting-god"
                        aria-labelledby="scrap-collecting-god-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="scrap-collecting-god-heading"
                            kicker="Part 05"
                            title="Eight Hundred Years as a Scrap-Collecting God"
                        />
                        <div className={proseClass}>
                            <p>
                                By the time Xie Lian ascends for the third time, he has spent
                                eight hundred years wandering through the human world.
                            </p>
                            <p>
                                He has been a god, a prince, an exile, a performer, and a scrap
                                collector. He has experienced poverty, humiliation, loneliness,
                                and rejection. His life is almost the opposite of what people
                                imagine when they think of a divine being.
                            </p>
                            <p>Yet this is where his character becomes most meaningful.</p>
                            <p>
                                He continues to help people, even when there is no guarantee of
                                reward. He takes care of small problems that other gods might
                                consider beneath them. He encounters people who have no temples,
                                no followers, and no one powerful enough to protect them.
                            </p>
                            <p>
                                He does not need these people to worship him. He does not need
                                their gratitude to prove that his actions matter.
                            </p>
                            <p>
                                His third ascension is therefore different from his first. The
                                first time, he is a prince whose greatness is recognized by the
                                heavenly system. The third time, he is someone who has lived
                                through the worst that system and the human world could offer,
                                yet still chooses to help others.
                            </p>
                            <p>
                                His worth no longer depends on being recognized. He has learned
                                to do good without needing the world to reward him for it.
                            </p>
                        </div>

                        <LoreFigure
                            visual={<ThreeAscensionsDiagram />}
                            caption="Xie Lian's path across three ascensions: moving from merit granted by status, to questioning divine rank, to choosing goodness without needing worship or reward."
                        />
                    </section>

                    {/* Section 6 */}
                    <section
                        id="meaning-of-xie-lian"
                        aria-labelledby="meaning-of-xie-lian-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="meaning-of-xie-lian-heading"
                            kicker="Part 06"
                            title="What Does the Character Xie Lian Really Mean?"
                        />
                        <div className={proseClass}>
                            <p>
                                The name Xie Lian (谢怜) contains the character{" "}
                                <span lang="zh" className="font-semibold text-[#9c3f5d]">
                                    怜
                                </span>
                                , which can mean compassion, pity, or sympathy.
                            </p>
                            <p>
                                But his compassion is not simply the kindness of someone who has
                                always been fortunate.
                            </p>
                            <p>
                                He was once a prince who wanted to save everyone. He later
                                became someone who was abandoned, attacked, and humiliated by
                                the very people he had tried to protect.
                            </p>
                            <p>
                                He knows what it feels like to suffer. He knows that people can
                                be cruel, selfish, frightened, and ungrateful. And yet, he does
                                not allow these experiences to turn him into someone who no
                                longer cares.
                            </p>
                            <p>
                                This is what makes his compassion different from a simple act of
                                charity.
                            </p>
                            <p>
                                He does not look down on suffering people from a position of
                                superiority. He has lived among them. He understands their
                                weakness because he has experienced his own.
                            </p>
                            <p>
                                His compassion is not based on the belief that everyone is good.
                                It is based on the decision to continue caring, even when he
                                knows that people are capable of hurting him.
                            </p>
                            <p>
                                And this is also what makes Hua Cheng&apos;s devotion so
                                meaningful.
                            </p>
                            <p>
                                For eight hundred years, Hua Cheng has loved and protected
                                someone who has suffered so much, yet never completely abandoned
                                his compassion for the world. He does not simply admire Xie
                                Lian&apos;s status as a god. He admires the person Xie Lian
                                remains after losing almost everything.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section
                        id="merit-is-a-choice"
                        aria-labelledby="merit-is-a-choice-heading"
                        className="scroll-mt-24 pt-8 border-t border-[#f7c6d9]/40"
                    >
                        <LoreSectionHeading
                            id="merit-is-a-choice-heading"
                            kicker="Part 07"
                            title="Merit Is Not a Score. It Is What You Choose to Do."
                        />
                        <div className={proseClass}>
                            <p>
                                The heavenly court measures merit through worship, power,
                                reputation, and status. Xie Lian&apos;s story offers a different
                                answer.
                            </p>
                            <p>
                                Merit is not simply the number of people who worship you. It is
                                not the rank you hold, the recognition you receive, or the
                                rewards that follow your good deeds. It is the difference you
                                make in the lives of others.
                            </p>
                            <p>
                                And perhaps most importantly, it is what you choose to do when
                                no one is watching, when no one rewards you, and when the world
                                has given you every reason to stop caring.
                            </p>
                            <p>
                                Xie Lian&apos;s three ascensions are not simply three steps
                                toward becoming a more powerful god. They represent three
                                different understandings of what it means to be divine.
                            </p>
                            <p>
                                His first ascension is the promise of greatness. His second is
                                the disappointment of power. His third is the discovery that
                                goodness does not need to be recognized by heaven to be real.
                            </p>
                            <p>
                                Traditional Chinese beliefs have long imagined gods who rise
                                from the human world through their deeds and their relationship
                                with humanity. <em>Heaven Official&apos;s Blessing</em> takes
                                this idea and places it under the harshest possible test.
                            </p>
                            <p>
                                It shows a heavenly system that has forgotten the meaning of its
                                own ideals, and a man who, after eight hundred years of
                                suffering, still refuses to forget them.
                            </p>
                            <p>
                                Xie Lian does not become worthy of being a god because he
                                suffers. He becomes worthy because suffering does not take away
                                his ability to care.
                            </p>
                            <p className="font-serif italic text-lg text-[#2b1f2d]">
                                And perhaps that is the novel&apos;s most beautiful answer to
                                the meaning of merit.
                            </p>
                        </div>
                    </section>

                    {/* Closing related-reading band */}
                    <section
                        aria-label="Continue exploring"
                        className="rounded-2xl bg-gradient-to-br from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d] border border-[#f7c6d9]/20 p-7 sm:p-8 text-center"
                    >
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#f4a7b9]/70 mb-2">
                            Keep Exploring
                        </p>
                        <h2 className="font-serif text-xl sm:text-2xl text-[#f7c6d9] font-normal mb-3">
                            More Stories of Devotion &amp; Cultural Lore
                        </h2>
                        <p className="text-sm text-[#f7c6d9]/75 max-w-xl mx-auto leading-relaxed mb-6">
                            Looking for more xianxia danmei with centuries of devotion, or want
                            to explore another deep dive into Chinese literary and historical
                            context?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={"/bl-recs/xianxia-danmei-like-tgcf/" as Route}
                                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 border-2 border-[#f4a7b9] text-[#f4a7b9] rounded-full hover:bg-[#f4a7b9] hover:text-[#2b1f2d] transition-all no-underline"
                            >
                                Danmei Like TGCF →
                            </Link>
                            <Link
                                href={"/lore/triad-ranks/" as Route}
                                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 border border-[#f7c6d9]/35 text-[#f7c6d9] rounded-full hover:bg-white/10 transition-colors no-underline"
                            >
                                Read Triad Ranks Lore →
                            </Link>
                        </div>
                    </section>
                </article>
            </LorePageLayout>
        </>
    );
}
