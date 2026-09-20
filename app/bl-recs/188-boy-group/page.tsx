import type { Metadata, Route } from "next";
import Link from "next/link";
import { FinderPanel } from "@/components/finder-panel";
import { BL_RECS_PATH, clusterPath } from "@/lib/bl-recs";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteMetadata";

const SLUG = "188-boy-group";
const PATH = clusterPath(SLUG);

const title = "188 Boy Group Scum Gongs Ranked: Who is the Worst?";
const description =
  "Welcome to the infamous 188 Boy Group! Check out our tier list of Shui Qian Cheng’s 11 toxic scum gongs. From massive red flags to the ultimate wife-chasing crematorium.";

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
        url: `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

const members = [
  {
    number: 1,
    name: "Shao Qun",
    role: "Leader",
    novel: "Sissy (娘娘腔)",
    birthday: "April 11",
    intro:
      "The spoiled heir whose arrogance and possessiveness make him one of the defining examples of the 188 Boy Group.",
    content: `
Shao Qun is the youngest son of a powerful wealthy family. Spoiled from childhood, he grows into a self-assured and arrogant playboy.

In high school, curiosity leads him to approach the transfer student Li Chengxiu. After an incident on the rooftop, Shao Qun's retreat and avoidance indirectly contribute to Li Chengxiu being bullied, losing his hearing, leaving school, losing his mother, and taking on debt.

Years later, the two meet again. Driven by possessiveness and unwillingness to let Li Chengxiu go, Shao Qun hides his engagement and approaches him as though he were merely a compliant lover, showing little respect for him as an equal.

When Li Chengxiu discovers the truth, he leaves. Only after losing him completely does Shao Qun realize that he cannot live without him.

His attempts to win Li Chengxiu back are extreme: he secretly arranges for a child to be born as a declaration of commitment and even stabs himself to force Li Chengxiu to confront his feelings.

Eventually, Shao Qun changes from a reckless heir into the pillar of his family, spending the rest of his life proving himself as a husband and father.

As the leader of the 188 Boy Group, Shao Qun establishes much of the group's characteristic "hurt, lose, regret, and chase them back" dynamic.
`,
  },
  {
    number: 2,
    name: "Song Juhan",
    role: "Vice Leader",
    novel: "Years of Intoxication (一醉经年)",
    birthday: "December 5",
    intro:
      "A famous singer whose emotional immaturity turns years of devotion into something he takes for granted.",
    content: `
Song Juhan is a famous singer and a classic example of an emotionally immature, self-centered lover.

He is used to getting his way and treats He Gu's years of companionship and devotion as something he is simply entitled to. His selfishness is often less deliberate cruelty than the result of never truly seeing his partner as an equal.

After losing He Gu, Song Juhan is forced into a long period of pain and self-realization. His attempt to win He Gu back is filled with setbacks and emotional turmoil, making him one of the group's most absurdly immature yet painful characters.

His position as vice leader reflects how closely his emotional failures rival Shao Qun's, while his childishness gives his story a distinctly different tone.
`,
  },
  {
    number: 3,
    name: "Yan Mingxiu",
    novel: "Professional Substitute (职业替身)",
    birthday: "September 6",
    intro:
      "The possessive heir whose story is built around the painful question of who was really the substitute.",
    content: `
Yan Mingxiu comes from a powerful military and political family.

At twenty, he approaches Zhou Xiang because Zhou's profile resembles that of actor Wang Yudong, whom Yan Mingxiu mistakes for the person he wants. Their relationship is shaped by Yan Mingxiu's arrogance, possessiveness, and fixation on the idea of a substitute.

When Zhou Xiang dies in an accident on a film set, Yan Mingxiu finally realizes what he has lost.

Two years later, he encounters a reborn Zhou Xiang, but their relationship once again falls into the shadow of the "substitute" misunderstanding. It is only during an earthquake in the mountains of Guizhou that Yan Mingxiu finally recognizes Zhou Xiang's identity.

He then understands the cruel irony: the person whose back first captured his attention had always been Zhou Xiang himself. Wang Yudong was the real substitute.

Among the 188 Boy Group, Yan Mingxiu is often treated as the group's "visual center," with his obsessive devotion and possessiveness forming the core contradiction of his character.
`,
  },
  {
    number: 4,
    name: "Yuan Yang",
    novel: "Counter Attack Against the Second-Generation Rich (针锋对决)",
    birthday: "July 26",
    intro:
      "The rebellious heir whose story moves from confrontation and impulsiveness toward loyalty and responsibility.",
    content: `
Yuan Yang is the son of Yuan Lijiang and the president of an investment company. Because of his rebellious personality, he was sent into the military for discipline.

Later, his father arranges for him to follow Gu Qingpei and learn the business world.

At first, Yuan Yang treats Gu Qingpei as an opponent. His impulsive, confrontational behavior even leads him to scheme against Gu Qingpei and contribute to his being blacklisted in the industry.

Unlike many other members of the group, Yuan Yang's worst behavior comes more from youthful recklessness and defiance than from deep-rooted indifference.

He later works hard to learn business, studies in the United States, and returns to help Gu Qingpei rebuild his career.

His story is therefore one of the group's clearest transformations from immature troublemaker to dependable partner, with his loyal-dog side eventually outweighing his earlier recklessness.
`,
  },
  {
    number: 5,
    name: "Zhou Jinxing",
    novel:
      "The Grey Uncle and the Mixed-Blood Prince (灰大叔与混血王子), also known as Wife and Children Are the Most Important",
    birthday: "March 12",
    intro:
      "A polished businessman whose warm exterior conceals a calculating mind.",
    content: `
Zhou Jinxing is the heir to Hongyun Capital, a wealthy mixed-race illegitimate son, and a businessman.

He has a striking duality: outwardly warm, elegant, good with children, and capable in the kitchen; inwardly calculating, manipulative, and highly skilled at treating relationships as strategic games.

He is taken in by the single father Ding Xiaowei while pretending to have lost his memory. Beneath the deception, he gradually becomes genuinely moved by Ding Xiaowei's simplicity and warmth.

Once his real identity is exposed, however, Zhou Jinxing returns to the wealthy family and becomes entangled in an inheritance struggle, revealing the extent of the harm caused by his earlier deception.

His defining contradiction is that he treats love as another calculation, only to discover that his own heart is the one variable he cannot control.

His eventual transformation is from emotional disguise to genuine emotional expression, earning him the reader nickname of the emotionally steady "orange cat."
`,
  },
  {
    number: 6,
    name: "Li Yu",
    novel:
      "Beloved Enemy (你却爱着一个他), also known as You Love an Idiot",
    birthday: "January 23",
    intro:
      "A polished model student whose cold exterior hides a ruthless streak.",
    content: `
Li Yu is the second son of the Li family.

When he first appears at eighteen, he seems like a cold, stubborn model student, but beneath that image is a ruthless and decisive personality.

He becomes entangled with Jian Suiying after Jian Suiying pursues him. At first, Li Yu's feelings are directed toward Jian Suilin, Jian Suiying's younger brother, and he responds to Jian Suiying's advances with intense humiliation and retaliation.

Their relationship develops through a volatile clash between two strong personalities.

Li Yu and Jian Suilin secretly work together to damage Jian Suiying's interests. Eventually, the consequences of their actions surface and none of them can escape the fallout.

Li Yu's central flaw is his willingness to turn emotion into a weapon of conflict and revenge. Only after the relationship reaches its most destructive point does he begin to recognize what Jian Suiying means to him.

His name evokes the classical image of "a man as beautiful as jade," creating a deliberate contrast with the ruthlessness beneath his polished exterior.
`,
  },
  {
    number: 7,
    name: "Yu Fengcheng",
    novel: "Little Poplar (小白杨)",
    birthday: "February 28",
    intro:
      "A special forces soldier whose emotional confusion repeatedly collides with his sense of duty.",
    content: `
Yu Fengcheng is a special forces soldier from a military family. He volunteers to serve at a remote camp near an active volcano, where he meets Bai Xinyu, a spoiled young man from a wealthy family.

At first, Yu Fengcheng approaches Bai Xinyu largely to tease and pressure him. Through training and missions together, however, he gradually develops feelings that he can no longer dismiss.

His most controversial conflict comes from his prolonged confusion between his uncle Huo Qiao and his relationship with Bai Xinyu.

During a mission in the Kunlun Mountains, he makes what he sees as the rational choice expected of a soldier and prioritizes rescuing his uncle. The decision shatters his relationship with Bai Xinyu.

Yu Fengcheng's mistakes stem more from emotional confusion and misjudgment than deliberate cruelty.

When Bai Xinyu is later kidnapped and Yu Fengcheng faces a similar choice, his hesitation finally forces him to acknowledge how deeply he loves Bai Xinyu.
`,
  },
  {
    number: 8,
    name: "Luo Yi",
    novel: "Additional Inheritance (附加遗产)",
    birthday: "November 20",
    intro:
      "A brilliant young manipulator whose carefully constructed schemes begin to unravel when genuine attachment enters the equation.",
    content: `
Luo Yi is the son of a mysterious powerful figure. He first appears at only fifteen, yet possesses intelligence and calculation far beyond his age.

Because of his sister's will, he becomes Wen Xiaohui's guardian. At first, he appears warm, cheerful, self-sufficient, and almost impossibly well-adjusted.

In reality, he is a young man with profound emotional deprivation who has learned to survive through performance and manipulation.

To obtain a three-hundred-million-dollar inheritance, Luo Yi forges a will and harms Wen Xiaohui's family and friends.

His methods are cold, deliberate, and intensely controlling, making his particular form of emotional harm one of the most dangerous within the group.

Yet the enormous deception also traps Luo Yi himself. Wen Xiaohui's departure becomes the one variable he cannot calculate away.

His story is less about simple redemption than about what happens when someone who has learned to control everything finally encounters a feeling he cannot control.
`,
  },
  {
    number: 9,
    name: "Zhao Jinxin",
    novel: "Who Can Define Love? (谁把谁当真)",
    birthday: "December 20",
    intro:
      "A wealthy playboy who enters a relationship for someone else's purposes and unexpectedly falls in love for real.",
    content: `
Zhao Jinxin is Shao Qun's cousin, a wealthy playboy who treats life as a game.

He initially approaches Li Shuo with a clear purpose: to help his cousin Shao Qun win Li Chengxiu back.

What begins as manipulation gradually turns into genuine attachment.

Zhao Jinxin's flirtation, cleverness, and playful behavior are both his weapons and the ways he reveals vulnerability around Li Shuo.

When Li Shuo learns the truth and ends the relationship, Zhao Jinxin experiences genuine loss for the first time.

Eventually, he is willing to suffer and take responsibility in order to earn Li Shuo's forgiveness.

His arc is therefore a transition from treating relationships as games to accepting the weight of a lifelong promise.
`,
  },
  {
    number: 10,
    name: "Gong Yingxian",
    novel: "Blazing Armor (火焰戎装)",
    birthday: "August 26",
    intro:
      "A detective whose emotional barriers are shaped more by trauma and self-protection than by deliberate cruelty.",
    content: `
Gong Yingxian is a police detective who grew up in a happy family until a devastating fire took almost everything from him.

The experience leaves him with a deep fear of fire and a rigid emotional shell.

For ten years, he remains obsessed with uncovering the truth behind the arson case. His life changes when he meets Ren Yi, a firefighter.

Gong Yingxian's place within the 188 Boy Group is unusual. His emotional difficulties arise primarily from trauma, emotional isolation, and obsessive self-protection rather than from a deliberate desire to hurt his partner.

The two initially clash, then begin working together to investigate arson, explosions, and biochemical cases.

Their cooperation gradually becomes trust and emotional attachment, eventually leading them to uncover the truth behind the old Gong family case.

His story places more emphasis on healing, partnership, and facing danger together than on the classic "chasing a lost lover" structure found elsewhere in the group.
`,
  },
  {
    number: 11,
    name: "Qu Moyu",
    novel: "The Top Predator (顶级掠食者)",
    birthday: "January 16",
    intro:
      "A calculating Alpha whose obsession with control and family interests ultimately collides with love.",
    content: `
Qu Moyu is the executive director of Xingzhou Group, an S-rank Ebony-pheromone Alpha, twenty-four years old and a Capricorn.

He is competitive, rational, and relentlessly focused on interests and outcomes. His outward manner is serious and cold, with a more restrained and flirtatious side underneath.

Qu Moyu enters into a relationship contract with the Omega Shen Dai.

Under pressure from his family's succession expectations, he demands that Shen Dai remove his mark and terminate the pregnancy, bringing their relationship to a complete break.

His defining flaw is the cold logic of putting reason and family interests above emotion.

Only after learning that Shen Dai has given birth to their child, Qiuqiu, alone does Qu Moyu begin to regret his choices.

He learns to become a father, deals with ending his engagement, and eventually registers his marriage with Shen Dai.

His later devotion is presented as the reversal of the same absolute control that once caused the relationship to collapse.

As one of the later additions to the 188 Boy Group, Qu Moyu also brings ABO themes into the wider "scumbag gong" universe.
`,
  },
];

const lineup = members.map((member) => ({
  "@type": "ListItem",
  position: member.number,
  name: member.name,
  description: `${member.name} from ${member.novel}`,
}));

export default function EightyEightMenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl(PATH),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
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
            <span>188 Boy Group</span>
          </nav>

          {/* Hero */}
          <header className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
              Chinese Danmei · Character Guide
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              188 Boy Group Scum Gongs: The Ultimate Red Flag Tier List
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-brand-ink/70">
              Meet the eleven male characters collectively known as the
              <strong> “188 Boy Group”</strong> — a reader-created group from Shui
              Qian Cheng&apos;s danmei novels.
            </p>

            <div className="mt-6 rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)]">
              <p className="text-sm leading-relaxed text-brand-ink/75">
                The name comes from one shared detail: all eleven characters
                are 188 cm tall. They come from different novels, but their
                stories share a recognizable pattern of emotional damage,
                loss, regret, and difficult attempts to win back the person
                they hurt.
              </p>
            </div>
          </header>

          {/* What is the 188 Boy Group? */}
          <section
            className="mt-12"
            aria-labelledby="what-is-188-men"
          >
            <h2 id="what-is-188-men" className="text-2xl font-bold">
              What Is the 188 Boy Group?
            </h2>

            <div className="mt-4 space-y-4 text-lg leading-relaxed text-brand-ink/75">
              <p>
                The “188 Boy Group” is not a real idol group. It is a reader-created
                collective name for eleven core male characters appearing
                across Shui Qian Cheng&apos;s novels.
              </p>

              <p>
                Their shared narrative pattern is what connects them beyond
                their height. Many begin relationships with some combination
                of possessiveness, arrogance, emotional immaturity,
                manipulation, or a distorted understanding of love.
              </p>

              <p>
                Their partners are hurt to varying degrees, and the characters
                only begin to confront their own flaws after experiencing
                loss. This is why their stories are closely associated with
                the Chinese danmei trope often described as
                <em> chasing the wife after the relationship has broken down</em>.
              </p>

              <p>
                Their flaws are not identical. Some are driven by arrogance,
                some by immaturity, some by calculation, and some by emotional
                confusion or trauma. That difference is a major part of why
                the eleven characters remain individually recognizable within
                the same reader-created label.
              </p>
            </div>
          </section>

          {/* Quick navigation */}
          <section className="mt-12" aria-labelledby="lineup">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
                  The full lineup
                </p>

                <h2 id="lineup" className="mt-2 text-2xl font-bold">
                  Meet the 11 Members
                </h2>
              </div>

              <span className="shrink-0 text-sm text-brand-ink/50">
                188 cm each
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-card-border">
              {members.map((member) => (
                <a
                  key={member.number}
                  href={`#member-${member.number}`}
                  className="flex items-center gap-4 border-b border-card-border px-4 py-3 text-lg transition last:border-b-0 hover:bg-brand-blush/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blush text-xs font-bold">
                    {member.number}
                  </span>

                  <span className="font-bold">{member.name}</span>

                  <span className="ml-auto hidden text-xs text-brand-ink/50 sm:block">
                    {member.novel}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Members */}
          <section className="mt-12" aria-label="The 188 Boy Group">
            <ol className="divide-y divide-[#f7c6d9]/40 space-y-12">
              {members.map((member) => (
                <li
                  key={member.number}
                  id={`member-${member.number}`}
                  className="scroll-mt-24 pt-12 first:pt-0"
                >
                  <article>
                    <header>
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-bold">
                          {member.number}
                        </span>

                        <div className="min-w-0">
                          <h2 className="text-2xl font-bold">
                            {member.name}
                          </h2>

                          {member.role && (
                            <p className="mt-1 text-sm font-bold text-brand-pinkdeep">
                              {member.role}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-medium text-brand-ink/55">
                            {member.novel}
                          </p>

                          <p className="mt-1 text-xs text-brand-ink/45">
                            Birthday: {member.birthday}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 border-l-2 border-brand-pinkdeep bg-brand-blush/30 pl-4 py-2 text-sm font-medium leading-relaxed text-brand-ink/75 italic">
                        {member.intro}
                      </p>
                    </header>

                    <div className="mt-6 whitespace-pre-line text-lg leading-7 text-brand-ink/75">
                      {member.content.trim()}
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

          {/* Conclusion */}
          <section
            className="mt-12"
            aria-labelledby="why-188-men"
          >
            <h2 id="why-188-men" className="text-2xl font-bold">
              Why the 188 Boy Group Remain So Recognizable
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-brand-ink/75">
              <p>
                The height is the easy part to remember. The more interesting
                connection is the way each character&apos;s relationship exposes
                a different personal weakness.
              </p>

              <p>
                One character&apos;s arrogance, another&apos;s immaturity,
                another&apos;s calculated manipulation, and another&apos;s emotional
                isolation can lead to very different relationship conflicts,
                even when the broad story pattern looks familiar.
              </p>

              <p>
                That gives the 188 Boy Group a shared framework without making them
                interchangeable. The “188” is the joke and the shorthand; the
                individual character arcs are what make each novel distinct.
              </p>
            </div>
          </section>

          {/* Contextual finder CTA */}
          <div className="mt-12">
            <FinderPanel />
          </div>

          {/* Back */}
          <p className="mt-10 text-center">
            <Link
              href="/bl-recs"
              className="font-bold underline underline-offset-4"
            >
              ← Back to BL Novel Recs
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}