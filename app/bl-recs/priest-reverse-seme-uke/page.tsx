import type { Metadata } from "next";
import Link from "next/link";
import { FinderPanel } from "@/components/finder-panel";
import { clusterPath } from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

export const dynamic = "force-static";

const SLUG = "priest-reverse-seme-uke";
const PATH = clusterPath(SLUG);

const page = {
  slug: SLUG,
  title: "Why Priest Readers Always Get the Seme and Uke Wrong",
  description:
    "Why Priest's danmei novels keep fooling readers about seme and uke roles. From Guardian to Sha Po Lang, discover Priest's love of strong ukes and beautiful semes.",
};

const works = [
  {
    title: "Guardian",
    original: "镇魂",
    pair: "Shen Wei × Zhao Yunlan",
    text:
      "Shen Wei appears gentle, restrained, and unfailingly polite, while Zhao Yunlan is lively, confident, and full of teasing energy. By the usual BL logic, Zhao Yunlan looks like the obvious seme. Then readers discover that Shen Wei is the seme. Some readers even say they watched the drama without realizing Zhao Yunlan was the uke until someone pointed it out.",
  },
  {
    title: "Imperfections",
    original: "残次品",
    pair: "Lin Jingheng × Lu Bixing",
    text:
      "Lin Jingheng is an alliance general: ruthless, disciplined, and feared across the Eight Star Systems. Lu Bixing, by comparison, has the softer image of a handsome and slightly naive young man. Readers who rely on appearance and status can easily guess the roles backward. The famous reversal became one of those Priest moments that readers remember years later.",
  },
  {
    title: "Liu Yao: The Revitalization of Fuyao Sect",
    original: "六爻",
    pair: "Yan Zhengming × Cheng Qian",
    text:
      "Cheng Qian is cold, rational, and practically overflowing with A-energy, while Yan Zhengming is slender, beautiful, and much more flamboyant. The contrast makes it easy to assume that Cheng Qian must be the seme. Readers who enter the story with that expectation may find themselves asking the same question again and again: how is Senior Brother Yan the seme?",
  },
  {
    title: "Lie Huo Jiao Chou",
    original: "烈火浇愁",
    pair: "Xuan Ji × Sheng Lingyuan",
    text:
      "Sheng Lingyuan is an emperor whose power is so overwhelming that even the Heavenly Dao seems determined to strike him down. Xuan Ji, meanwhile, has a name and personality that can initially feel much less intimidating. Yet Sheng Lingyuan is the uke. Some readers only realize how thoroughly their first assumptions were reversed when they reach the extras.",
  },
  {
    title: "Sha Po Lang",
    original: "杀破狼",
    pair: "Gu Yun × Chang Geng",
    text:
      "Gu Yun is a famous young commander: confident, charismatic, and larger than life. Chang Geng is polite, composed, and capable of taking care of a household. The usual first impression strongly suggests that Gu Yun should be the seme. Priest once again turns that expectation upside down.",
  },
  {
    title: "Silent Reading",
    original: "默读",
    pair: "Fei Du × Luo Wenzhou",
    text:
      "Fei Du has the polished, flirtatious image that makes many readers instinctively place him in the seme role. Some readers also enter the story with the wrong idea about the central pairing itself. By the time the relationship becomes clear, the original assumptions have to be completely rearranged.",
  },
];

const patterns = [
  {
    title: "The uke is often the stronger one",
    text:
      "Priest clearly enjoys the strong-uke dynamic. The uke may have greater physical power, a higher position, or an intimidating reputation. Gu Yun, Lin Jingheng, Sheng Lingyuan, and Cheng Qian are all exceptional figures in their respective worlds. The usual shortcut—stronger character equals seme—simply does not work here.",
  },
  {
    title: "The seme is often the more persistent one",
    text:
      "Priest's semes are often emotionally direct, persistent, and unwilling to let go. Their feelings may be more openly expressed, even when the uke appears more powerful or commanding. Readers often summarize this with a playful rule: follow the thicker emotional arrow.",
  },
  {
    title: "Beautiful semes and strong ukes",
    text:
      "Priest repeatedly plays with the contrast between a beautiful or elegant seme and a powerful uke. Shen Wei and Yan Zhengming are good examples of how appearance can deliberately mislead readers. The uke does not need to fit the traditional image of a delicate beauty to be the emotional center of the relationship.",
  },
];

export const metadata: Metadata = {
  title: `${page.title} | ${SITE_NAME}`,
  description: page.description,
  keywords: [
    "Priest danmei",
    "Priest novels",
    "Priest BL novels",
    "Priest seme uke",
    "strong uke",
    "beautiful seme",
    "Guardian",
    "Imperfections",
    "Sha Po Lang",
    "Silent Reading",
    "Liu Yao",
  ],
  alternates: {
    canonical: absoluteUrl(PATH),
  },
  openGraph: {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.description,
    url: absoluteUrl(PATH),
    siteName: SITE_NAME,
    type: "article",
    images: [
      {
        url: `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

const lineup = works.map((work, index) => ({
  "@type": "ListItem",
  position: index + 1,
  name: work.title,
  description: `${work.title} (${work.original}) - ${work.pair}`,
}));

export default function PriestReverseRolesPage() {
  const canonicalUrl = absoluteUrl(PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    description: page.description,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: works.length,
      itemListElement: lineup,
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
          {/* Breadcrumb */}
          <nav className="text-sm text-brand-ink/50" aria-label="Breadcrumb">
            <Link
              href="/bl-recs"
              className="transition hover:text-brand-ink"
            >
              BL Novel Recs
            </Link>
            <span className="mx-2">/</span>
            <span>Priest: Seme &amp; Uke Dynamics</span>
          </nav>

          {/* Hero */}
          <header className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              Chinese Danmei · Author &amp; Tropes Guide
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {page.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-brand-ink/70">
              Priest has a reputation for making readers question their first
              assumptions about BL relationships. In several of her best-known
              danmei novels, the character who looks like the obvious seme is
              actually the uke—and the beautiful, elegant, or seemingly less
              intimidating character turns out to be the seme.
            </p>

            <div className="mt-6 rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)]">
              <p className="text-sm leading-relaxed text-brand-ink/75">
                From <em>Guardian</em> to <em>Sha Po Lang</em>, discover Priest&apos;s
                signature dynamic of strong ukes, beautiful semes, and why guessing
                the roles backward has become an affectionate initiation ritual among
                danmei readers worldwide.
              </p>
            </div>
          </header>

          {/* The Priest Reader Initiation Ritual */}
          <section className="mt-12" aria-labelledby="ritual-heading">
            <h2 id="ritual-heading" className="text-2xl font-bold">
              The Priest Reader Initiation Ritual
            </h2>

            <div className="mt-4 space-y-4 text-lg leading-relaxed text-brand-ink/75">
              <p>
                The joke about “always guessing Priest&apos;s seme and uke wrong”
                has almost become an initiation ritual among readers. It points to
                a writing style that deliberately goes against the assumptions
                many BL readers have learned to make from appearance, personality,
                status, and power.
              </p>

              <p>
                The result is a very particular reading experience: the character
                you thought was the seme turns out to be the uke, and suddenly every
                scene you have already read needs to be understood in a slightly
                different way.
              </p>
            </div>
          </section>

          {/* Table of Contents / Quick Navigation */}
          <section className="mt-12" aria-labelledby="toc-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                  Table of Contents
                </p>

                <h2 id="toc-heading" className="mt-2 text-2xl font-bold">
                  Featured Works in This Guide
                </h2>
              </div>

              <span className="shrink-0 text-sm text-brand-ink/50">
                {works.length} Works
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-card-border bg-card-bg">
              {works.map((work, index) => (
                <a
                  key={work.title}
                  href={`#work-${index + 1}`}
                  className="flex items-center gap-4 border-b border-card-border px-4 py-3 text-base sm:text-lg transition last:border-b-0 hover:bg-brand-blush/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blush text-xs font-bold text-brand-ink">
                    {index + 1}
                  </span>

                  <span className="font-bold text-brand-ink">{work.title}</span>

                  <span className="ml-auto hidden text-xs text-brand-ink/50 sm:block">
                    {work.original} · {work.pair}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Works List */}
          <section className="mt-12" aria-labelledby="works-heading">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              The Biggest Traps
            </p>

            <h2 id="works-heading" className="mt-2 text-2xl font-bold">
              Priest Novels That Keep Fooling Readers
            </h2>

            <ol className="mt-8 divide-y divide-[#f7c6d9]/40 space-y-12">
              {works.map((work, index) => (
                <li
                  key={work.title}
                  id={`work-${index + 1}`}
                  className="scroll-mt-24 pt-12 first:pt-0"
                >
                  <article>
                    <header>
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-bold text-brand-ink">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold">
                            {work.title}
                          </h3>

                          <p className="mt-1 text-sm font-bold text-brand-pinkdeep">
                            {work.pair}
                          </p>

                          <p className="mt-1 text-sm font-medium text-brand-ink/55">
                            Original: {work.original}
                          </p>
                        </div>
                      </div>
                    </header>

                    <div className="mt-6 text-lg leading-relaxed text-brand-ink/75">
                      {work.text}
                    </div>

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

          {/* Patterns */}
          <section className="mt-14" aria-labelledby="patterns-heading">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              The Pattern
            </p>

            <h2 id="patterns-heading" className="mt-2 text-2xl font-bold">
              Why Are Priest&apos;s Couples So Easy to Misread?
            </h2>

            <div className="mt-6 space-y-6">
              {patterns.map((pattern, index) => (
                <div
                  key={pattern.title}
                  className="border-l-2 border-brand-pinkdeep/60 pl-4 py-1"
                >
                  <h3 className="text-lg font-bold text-brand-ink">
                    {index + 1}. {pattern.title}
                  </h3>

                  <p className="mt-2 text-base leading-relaxed text-brand-ink/75">
                    {pattern.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Reader Experience */}
          <section className="mt-14" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="text-2xl font-bold">
              A Very Priest-Like Reading Experience
            </h2>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink/75">
              <p>
                The reason this joke has lasted is that it describes a real
                reading experience. The things you initially find attractive about
                a character may suddenly need to be reinterpreted once the
                relationship dynamic becomes clear.
              </p>

              <div className="my-6 border-l-2 border-brand-pinkdeep bg-brand-blush/30 pl-4 py-3 text-base italic leading-relaxed text-brand-ink/80">
                “You think you know who the seme is. Then Priest makes you go back
                and rebuild all your assumptions from the beginning.”
              </div>

              <p>
                And for many readers, the reversal eventually becomes part of the
                appeal. Once you accept Priest&apos;s preference for strong ukes
                and beautiful or persistent semes, the pairing logic starts to
                feel less like a trick and more like one of the author&apos;s
                signatures.
              </p>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mt-14" aria-labelledby="conclusion-heading">
            <h2 id="conclusion-heading" className="text-2xl font-bold">
              Don&apos;t Trust Your First Impression
            </h2>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink/75">
              <p>
                “Always getting the seme and uke wrong” is less a criticism than a
                shared joke among Priest readers. It marks a kind of community
                knowledge: don&apos;t decide the roles from height, beauty,
                strength, status, or personality alone.
              </p>

              <p>
                Look at the relationship. Follow the emotional direction. Or, if
                you want to avoid spoilers, simply keep reading until Priest proves
                your first guess wrong.
              </p>

              <p className="font-medium italic text-brand-ink/90">
                That moment of realizing “I had them completely backward” may be
                one of the most recognizable parts of reading Priest.
              </p>
            </div>
          </section>

          {/* Contextual Finder Panel CTA */}
          <div className="mt-14">
            <FinderPanel />
          </div>

          {/* Back link */}
          <p className="mt-10 text-center">
            <Link
              href="/bl-recs"
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