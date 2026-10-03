import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TRIAD_RANKS, type TriadRank } from "@/lib/lore/triad-ranks";
import {
  EVIDENCE_LEVELS,
  TRIAD_CODES,
  TRIAD_CODE_NOTES,
  TRIAD_DIFFERENCES,
  TRIAD_FAQ,
  TRIAD_GLOSSARY,
  TRIAD_HISTORY,
  TRIAD_SOURCES,
  TRIAD_TIMELINE,
  type EvidenceLevel,
  type HistoryClaim,
} from "@/lib/lore/triad-history";
import { absoluteUrl } from "@/lib/siteMetadata";

export const dynamic = "force-static";

// ─── Metadata ────────────────────────────────────────────────────────────────

const PAGE_TITLE = "Hong Kong Triad Ranks Explained: History vs. the Novel | Wo Hing Society Lore";
const PAGE_DESCRIPTION =
  "What the triad ranks 489, 426, 415, 432 and 49 meant in real Hung Mun tradition and 1970s Hong Kong, and how the Wo Hing Society of the Kowloon Walled City borrows and bends them.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "hong kong triad ranks",
    "triad hierarchy",
    "triad numbers 489 426 415 432 49",
    "red pole white paper fan straw sandal",
    "hung mun tiandihui history",
    "kowloon walled city history",
    "wo hing society",
    "danmei lore",
    "1970s hong kong noir",
  ],
  alternates: { canonical: absoluteUrl("/lore/triad-ranks") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/lore/triad-ranks"),
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// ─── SVG badge icons (pure inline SVG, no raster) ────────────────────────────

function DiceIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-8 h-8">
      <rect x="5" y="5" width="38" height="38" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="15" cy="15" r="3" fill="currentColor" />
      <circle cx="33" cy="15" r="3" fill="currentColor" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <circle cx="15" cy="33" r="3" fill="currentColor" />
      <circle cx="33" cy="33" r="3" fill="currentColor" />
    </svg>
  );
}

function StrawSandalIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-8 h-8">
      <ellipse cx="24" cy="29" rx="17" ry="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M9 29h30M15 22v14M24 21v15M33 22v14M18 21Q24 12 30 21" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function WhitePaperFanIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-8 h-8">
      <path d="M7 29Q24 8 41 29" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 38V18M24 38L9 27M24 38l15-11M24 38L16 22M24 38l8-16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="38" r="2.5" fill="currentColor" />
    </svg>
  );
}

function RedPoleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-8 h-8">
      <path d="M10 9l28 30M38 9L10 39" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="10" cy="9" r="3" fill="currentColor" />
      <circle cx="38" cy="9" r="3" fill="currentColor" />
      <circle cx="10" cy="39" r="3" fill="currentColor" />
      <circle cx="38" cy="39" r="3" fill="currentColor" />
    </svg>
  );
}

function DragonCrestIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-8 h-8">
      <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 8c8 2 13 9 12 16-1 7-7 11-12 8-5-2-8-8-6-14 1-5 4-9 6-10Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="27" cy="16" r="2" fill="currentColor" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}

function BadgeIcon({ symbol }: { symbol: TriadRank["badge_symbol"] }) {
  switch (symbol) {
    case "dice":           return <DiceIcon />;
    case "straw-sandal":   return <StrawSandalIcon />;
    case "white-paper-fan":return <WhitePaperFanIcon />;
    case "red-pole":       return <RedPoleIcon />;
    case "dragon-crest":   return <DragonCrestIcon />;
  }
}

// ─── Tier dots ────────────────────────────────────────────────────────────────

function TierDots({ tier, total = 5 }: { tier: number; total?: number }) {
  return (
    <span className="flex gap-1 items-center" aria-label={`Tier ${tier} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full border ${
            i < tier
              ? "bg-[#f4a7b9] border-[#f4a7b9]"
              : "bg-transparent border-[#f4a7b9]/40"
          }`}
        />
      ))}
    </span>
  );
}

// ─── Evidence tag ─────────────────────────────────────────────────────────────
// Three levels so readers can tell documented history from society legend
// from screen folklore. Dark variant is used inside the dark (gated) cards.

const EVIDENCE_STYLE: Record<EvidenceLevel, { light: string; dark: string }> = {
  attested: {
    light: "bg-[#2b1f2d] text-[#f7c6d9] border-[#2b1f2d]",
    dark: "bg-[#f4a7b9] text-[#2b1f2d] border-[#f4a7b9]",
  },
  tradition: {
    light: "bg-[#fff9f2] text-[#9c3f5d] border-[#9c3f5d]/50",
    dark: "bg-transparent text-[#f7c6d9] border-[#f7c6d9]/50",
  },
  pop: {
    light: "bg-transparent text-[#7d6f67] border-dashed border-[#7d6f67]/60",
    dark: "bg-transparent text-[#f7c6d9]/70 border-dashed border-[#f7c6d9]/40",
  },
};

function EvidenceTag({ level, dark = false }: { level: EvidenceLevel; dark?: boolean }) {
  const style = EVIDENCE_STYLE[level];
  return (
    <span
      className={`inline-block shrink-0 text-center text-[11px] font-semibold leading-none px-2 py-1 rounded-full border w-[5.75rem] ${
        dark ? style.dark : style.light
      }`}
    >
      {EVIDENCE_LEVELS[level].label}
    </span>
  );
}

function ClaimList({ claims, dark = false }: { claims: HistoryClaim[]; dark?: boolean }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {claims.map((claim, i) => (
        <li key={i} className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 sm:items-start">
          <span className="sm:mt-0.5">
            <EvidenceTag level={claim.level} dark={dark} />
          </span>
          <p className={`text-sm leading-relaxed flex-1 min-w-0 ${dark ? "text-[#f7c6d9]/85" : "text-[#2b1f2d]"}`}>
            {claim.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

// ─── Rank card (native <details> — zero client JS) ────────────────────────────

function RankCard({ rank, index }: { rank: TriadRank; index: number }) {
  const isGated = rank.is_patreon_gated;
  const history = TRIAD_HISTORY[rank.badge_symbol];

  const label = `text-xs font-bold tracking-[0.18em] uppercase ${
    isGated ? "text-[#f4a7b9]/60" : "text-[#9c3f5d]"
  }`;
  const body = `text-sm leading-relaxed ${isGated ? "text-[#f7c6d9]/85" : "text-[#2b1f2d]"}`;
  const divider = isGated ? "border-[#f4a7b9]/15" : "border-[#f7c6d9]/40";

  return (
    <details
      className={`group rounded-xl border transition-all duration-200 overflow-hidden ${
        isGated
          ? "bg-[#2b1f2d] border-[#f4a7b9]/20 [border-left:4px_solid_#f4a7b9]"
          : "bg-white border-[#f7c6d9]/50 [border-left:4px_solid_#f4a7b9] hover:-translate-y-0.5 hover:shadow-md"
      }`}
      id={`rank-${rank.id}`}
    >
      {/* ── Collapsed summary row ── */}
      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        {/* Index number */}
        <span className={`font-mono text-xs shrink-0 ${isGated ? "text-[#f4a7b9]/40" : "text-[#f4a7b9]/60"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Badge icon */}
        <span className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border ${
          isGated
            ? "text-[#f4a7b9] border-[#f4a7b9]/25 bg-[#f4a7b9]/5"
            : "text-[#f4a7b9] border-[#f7c6d9]/50 bg-[#fff9f2]"
        }`}>
          <BadgeIcon symbol={rank.badge_symbol} />
        </span>

        {/* Titles */}
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className={`font-serif text-lg leading-snug ${isGated ? "text-[#f7c6d9]" : "text-[#2b1f2d]"}`}>
            {rank.term_en}
          </span>
          <span className={`text-sm tracking-wide ${isGated ? "text-[#f4a7b9]/50" : "text-[#f4a7b9]/70"}`} lang="zh">
            {rank.term_cn}
          </span>
        </span>

        {/* Code + tier */}
        <span className="hidden sm:flex items-center gap-3 shrink-0">
          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
            isGated
              ? "text-[#f4a7b9]/60 border-[#f4a7b9]/20 bg-[#f4a7b9]/5"
              : "text-[#f4a7b9] border-[#f7c6d9]/60 bg-[#fff9f2]"
          }`}>
            {rank.code_number}
          </span>
          <TierDots tier={rank.tier} />
        </span>

        {/* Patreon pill */}
        {isGated && (
          <span className="shrink-0 text-[10px] font-bold tracking-wider text-[#f4a7b9] border border-[#f4a7b9]/30 px-2 py-0.5 rounded-full">
            Patreon
          </span>
        )}

        {/* Chevron */}
        <span className={`shrink-0 text-[#f4a7b9]/50 transition-transform duration-200 group-open:rotate-180`} aria-hidden="true">
          ▾
        </span>
      </summary>

      {/* ── Expanded body ── */}
      <div className={`flex gap-5 px-5 pb-6 pt-4 border-t animate-[fadeSlideDown_0.22s_ease_both] ${divider}`}>
        {/* Seal column */}
        <div className={`hidden sm:flex shrink-0 flex-col items-center justify-start pt-4 w-24 rounded-lg border gap-2 self-start ${
          isGated
            ? "border-[#f4a7b9]/15 bg-[#f4a7b9]/5 text-[#f4a7b9]/60"
            : "border-[#f7c6d9]/50 bg-[#fff9f2] text-[#f4a7b9]/70"
        }`}>
          <span className="w-10 h-10"><BadgeIcon symbol={rank.badge_symbol} /></span>
          <span className="font-mono text-[10px] tracking-wider pb-4">
            FILE {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {history && (
            <>
              {/* Layer 1 — historical archetype */}
              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className={label}>Historical archetype</p>
                  <p className={`font-serif text-base ${isGated ? "text-[#f7c6d9]" : "text-[#2b1f2d]"}`} lang="zh">
                    {history.historical_name}
                  </p>
                </div>
                <p className={body}>{history.archetype}</p>
                <ClaimList claims={history.claims} dark={isGated} />
              </section>

              {/* Layer 2 — 1970s Hong Kong */}
              <section className={`flex flex-col gap-2 border-t pt-4 ${divider}`}>
                <p className={label}>Hong Kong in practice</p>
                <p className={body}>{history.in_the_1970s}</p>
              </section>
            </>
          )}

          {/* Layer 3 — the novel */}
          <section className={`flex flex-col gap-3 border-t pt-4 ${divider}`}>
            <p className={label}>In the novel</p>
            <p className={body}>{rank.summary}</p>

            <blockquote className={`border-l-2 pl-4 py-1 text-sm leading-relaxed italic ${
              isGated
                ? "border-[#f4a7b9]/40 text-[#f4a7b9]/70"
                : "border-[#f4a7b9] text-[#7d6f67] bg-[#fff9f2] rounded-r"
            }`}>
              <span className={`block text-[10px] font-bold tracking-[0.18em] uppercase not-italic mb-1 ${
                isGated ? "text-[#f4a7b9]/50" : "text-[#9c3f5d]"
              }`}>
                Story Glimpse
              </span>
              {rank.story_hint}
            </blockquote>
          </section>

          {/* Reading note — our interpretation, kept visually apart from the sourced claims */}
          {history && (
            <section className={`rounded-lg px-4 py-3 ${
              isGated ? "bg-[#f4a7b9]/8 border border-[#f4a7b9]/15" : "bg-[#fff9f2] border border-[#f7c6d9]/50"
            }`}>
              <p className={label}>Reading note</p>
              <p className={`${body} mt-1.5`}>{history.reading_note}</p>
            </section>
          )}

          {/* Footer stamp */}
          <div className={`flex flex-wrap gap-3 text-[10px] font-mono tracking-wide ${
            isGated ? "text-[#f4a7b9]/30" : "text-[#f4a7b9]/50"
          }`}>
            <span>Status: {isGated ? "Patreon Restricted" : "Classified"}</span>
            <span aria-hidden="true">◆</span>
            <span>Wo Hing Society Archive</span>
          </div>
        </div>
      </div>
    </details>
  );
}

// ─── Small shared pieces ──────────────────────────────────────────────────────

function SectionHeading({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9c3f5d] mb-1">{kicker}</p>
      <h2 id={id} className="font-serif text-2xl text-[#2b1f2d] font-normal mb-3 scroll-mt-24">
        {title}
      </h2>
      {children && <div className="text-sm text-[#7d6f67] leading-relaxed max-w-2xl">{children}</div>}
    </div>
  );
}

const PAGE_NAV = [
  { href: "#dossiers", label: "Rank dossiers" },
  { href: "#numbers", label: "The numbers" },
  { href: "#history-vs-fiction", label: "History vs. fiction" },
  { href: "#walled-city", label: "Walled City timeline" },
  { href: "#glossary", label: "Glossary" },
  { href: "#faq", label: "FAQ" },
  { href: "#sources", label: "Sources" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TriadRanksPage() {
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": absoluteUrl("/lore/triad-ranks#termset"),
    name: "Hong Kong Triad Ranks: Hung Mun Tradition and the Wo Hing Society",
    description:
      "Traditional triad rank titles and numeric codes from Hung Mun tradition, explained alongside their use by the fictional Wo Hing Society (和兴社) in the Kowloon Walled City of the 1970s.",
    hasDefinedTerm: TRIAD_RANKS.map((rank) => ({
      "@type": "DefinedTerm",
      "@id": absoluteUrl(`/lore/triad-ranks#rank-${rank.id}`),
      name: rank.term_en,
      alternateName: rank.term_cn,
      termCode: rank.code_number,
      description: TRIAD_HISTORY[rank.badge_symbol]?.archetype ?? rank.summary,
      inDefinedTermSet: absoluteUrl("/lore/triad-ranks#termset"),
    })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/lore/triad-ranks#faq"),
    mainEntity: TRIAD_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([definedTermSet, faqPage]) }}
      />

      {/* Minimal keyframe for card reveal — only what Tailwind can't express inline */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          details > div { animation: none !important; }
        }
      `}</style>

      <SiteHeader activePath="lore" />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d] border-b border-[#f7c6d9]/20">
        <div className="page-shell py-16 text-center">
          <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#f4a7b9]/60 mb-4">
            和兴社 · Wo Hing Society · Classified Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f7c6d9] font-normal leading-tight mb-4">
            Hong Kong Triad Ranks<br />
            <span className="text-[#f4a7b9] italic">&amp; Hierarchy Guide</span>
          </h1>
          <p className="text-[#f7c6d9]/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            The five ranks of the Wo Hing Society, set beside the real Hung Mun
            tradition they come from and the Kowloon Walled City of the 1970s.
            What history documents, what the societies claim, and where the
            novel bends it.
          </p>
          <a
            href="#dossiers"
            className="inline-flex items-center gap-2 text-[#f4a7b9] border border-[#f4a7b9]/40 px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#f4a7b9]/10 transition-colors"
          >
            Open the dossiers ↓
          </a>
        </div>
      </div>

      <main className="page-shell py-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap gap-1.5 items-center text-xs text-[#f4a7b9]/60 mb-8" aria-label="Breadcrumb">
          <Link href={"/" as any} className="hover:text-[#f4a7b9] transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span>Lore</span>
          <span aria-hidden="true">›</span>
          <span className="text-[#f4a7b9]" aria-current="page">Triad Ranks</span>
        </nav>

        {/* On-page navigation */}
        <nav aria-label="On this page" className="flex flex-wrap gap-2 mb-10">
          {PAGE_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-semibold text-[#9c3f5d] border border-[#f7c6d9] bg-[#fff9f2] px-3 py-1.5 rounded-full hover:bg-[#f7c6d9]/30 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* How to read */}
        <section className="mb-12 pb-8 border-b border-[#f7c6d9]/30" aria-labelledby="how-to-read">
          <SectionHeading id="how-to-read" kicker="Before you open a file" title="Two stories on one page">
            <p className="mb-3">
              Each rank below is explained twice: first as the real archetype from Hung Mun (triad)
              tradition and Hong Kong history, then as the novel&apos;s version. The Wo Hing Society
              is fictional as the novel presents it. Its titles, numbers and rituals are borrowed from
              real tradition, and its name follows the habits of real societies such as Wo Shing Wo
              (和胜和) and Wo Hop To (和合图).
            </p>
            <p>
              Because the real history is full of legend, every statement in the historical layer is
              tagged with how far it can be trusted.
            </p>
          </SectionHeading>

          <ul className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(EVIDENCE_LEVELS) as EvidenceLevel[]).map((level) => (
              <li key={level} className="rounded-xl border border-[#f7c6d9]/50 bg-white p-4 flex flex-col gap-2">
                <EvidenceTag level={level} />
                <p className="text-sm text-[#7d6f67] leading-relaxed">{EVIDENCE_LEVELS[level].meaning}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#7d6f67] leading-relaxed mt-4 max-w-2xl">
            Passages headed <span className="font-semibold text-[#2b1f2d]">Reading note</span> are our own
            interpretation of where fiction simplifies. They are not sourced claims.
          </p>
        </section>

        {/* Rank cards */}
        <section id="dossiers" aria-labelledby="dossier-heading" className="mb-16 scroll-mt-24">
          <SectionHeading id="dossier-heading" kicker="The path to power" title="Wo Hing Society: five ranks">
            Click a card to unseal it. Each one covers the real archetype, how it worked in Hong
            Kong, and the novel&apos;s version. The top two ranks are gated behind Patreon for their
            story content; the historical notes are open to everyone.
          </SectionHeading>
          <div className="flex flex-col gap-3" role="list">
            {TRIAD_RANKS.map((rank, index) => (
              <div key={rank.id} role="listitem">
                <RankCard rank={rank} index={index} />
              </div>
            ))}
          </div>
        </section>

        {/* The numbers */}
        <section id="numbers" className="mb-16 scroll-mt-24" aria-labelledby="numbers-heading">
          <SectionHeading id="numbers-heading" kicker="Ritual code" title="What the numbers mean">
            Triad offices carry numeric codes that all begin with 4. The five offices in this guide
            are marked with a diamond; the others appear in real lists but not in the dossiers above.
          </SectionHeading>

          <div className="overflow-x-auto rounded-xl border border-[#f7c6d9]/50 bg-white">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">Traditional triad rank codes</caption>
              <thead className="bg-[#fff9f2] text-[#9c3f5d]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Code</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Office</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {TRIAD_CODES.map((row) => (
                  <tr key={row.code} className="border-t border-[#f7c6d9]/40 align-top">
                    <td className="px-4 py-3 font-mono text-[#2b1f2d] whitespace-nowrap">
                      {row.code}
                      {row.in_guide && (
                        <span className="text-[#f4a7b9] ml-1.5" aria-label="has a dossier in this guide">◆</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#2b1f2d]">
                      <span className="block">{row.en}</span>
                      <span className="block text-[#7d6f67]" lang="zh">{row.cn}</span>
                    </td>
                    <td className="px-4 py-3 text-[#7d6f67]">
                      {row.role}
                      {row.note && <span className="block text-xs mt-0.5">{row.note}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 max-w-3xl">
            <ClaimList claims={TRIAD_CODE_NOTES} />
          </div>
        </section>

        {/* History vs fiction */}
        <section id="history-vs-fiction" className="mb-16 scroll-mt-24" aria-labelledby="history-vs-fiction-heading">
          <SectionHeading id="history-vs-fiction-heading" kicker="Where the story departs" title="History vs. fiction: five differences">
            Triad fiction, this novel&apos;s genre included, compresses real history to keep a story
            readable. Here is what changes.
          </SectionHeading>

          <div className="flex flex-col gap-4">
            {TRIAD_DIFFERENCES.map((d) => (
              <article key={d.id} className="rounded-xl border border-[#f7c6d9]/50 bg-white overflow-hidden">
                <h3 className="px-5 pt-4 pb-3 font-serif text-lg text-[#2b1f2d] font-normal">{d.topic}</h3>
                <div className="grid sm:grid-cols-2 gap-px bg-[#f7c6d9]/40">
                  <div className="bg-[#fff9f2] p-4 sm:p-5">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#9c3f5d] mb-1.5">In history</p>
                    <p className="text-sm text-[#2b1f2d] leading-relaxed">{d.history}</p>
                  </div>
                  <div className="bg-white p-4 sm:p-5">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#7d6f67] mb-1.5">In most fiction</p>
                    <p className="text-sm text-[#7d6f67] leading-relaxed">{d.fiction}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Walled City timeline */}
        <section id="walled-city" className="mb-16 scroll-mt-24" aria-labelledby="walled-city-heading">
          <SectionHeading id="walled-city-heading" kicker="Setting the scene" title="From the Heaven and Earth Society to the Walled City">
            The ranks above did not appear in 1970s Kowloon from nowhere. This is the chain of events
            behind them, with the same evidence tags.
          </SectionHeading>

          <ol className="relative border-l-2 border-[#f7c6d9] ml-2 flex flex-col gap-8">
            {TRIAD_TIMELINE.map((entry) => (
              <li key={entry.year + entry.title} className="pl-6 relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[7px] top-1.5 block w-3 h-3 rounded-full bg-[#f4a7b9] border-2 border-white"
                />
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="font-serif text-lg text-[#2b1f2d]">{entry.year}</span>
                  <EvidenceTag level={entry.level} />
                </div>
                <h3 className="text-sm font-semibold text-[#9c3f5d] mb-1">{entry.title}</h3>
                <p className="text-sm text-[#7d6f67] leading-relaxed max-w-3xl">{entry.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Glossary */}
        <section id="glossary" className="mb-16 scroll-mt-24" aria-labelledby="glossary-heading">
          <SectionHeading id="glossary-heading" kicker="Supporting terms" title="Glossary: other words you will meet">
            Terms that appear around the five ranks, in real tradition and in Hong Kong fiction.
          </SectionHeading>

          <dl className="grid gap-3 sm:grid-cols-2">
            {TRIAD_GLOSSARY.map((entry) => (
              <div key={entry.cn} className="rounded-xl border border-[#f7c6d9]/50 bg-white p-4 flex flex-col gap-2">
                <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-serif text-lg text-[#2b1f2d]" lang="zh">{entry.cn}</span>
                  <span className="text-xs text-[#7d6f67]">{entry.en}</span>
                </dt>
                <dd className="flex flex-col gap-2">
                  <span><EvidenceTag level={entry.level} /></span>
                  <span className="text-sm text-[#7d6f67] leading-relaxed">{entry.text}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16 scroll-mt-24" aria-labelledby="faq-heading">
          <SectionHeading id="faq-heading" kicker="Quick answers" title="Frequently asked questions" />

          <div className="flex flex-col gap-2">
            {TRIAD_FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl border border-[#f7c6d9]/50 bg-white overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-base text-[#2b1f2d]">{item.q}</span>
                  <span className="shrink-0 text-[#f4a7b9]/70 transition-transform duration-200 group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-[#7d6f67] leading-relaxed max-w-3xl">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-2xl bg-gradient-to-br from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d] border border-[#f7c6d9]/20 p-8 text-center"
          aria-label="Start reading the novel"
        >
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#f4a7b9]/50 mb-2">
            Ready to enter the Walled City?
          </p>
          <h2 className="font-serif text-xl sm:text-2xl text-[#f7c6d9] font-normal mb-6">
            Follow Chan Ka Nam&apos;s rise through the ranks
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={"/chapter/1" as any}
              id="cta-read-chapter-1"
              className="inline-flex items-center gap-2 text-sm font-semibold px-7 py-3 border-2 border-[#f4a7b9] text-[#f4a7b9] rounded-full hover:bg-[#f4a7b9] hover:text-white transition-all no-underline"
            >
              Start Reading from Chapter 1
            </Link>
            <Link
              href={"/chapter/11" as any}
              id="cta-jump-chapter-11"
              className="text-sm text-[#f4a7b9]/50 hover:text-[#f4a7b9] transition-colors no-underline flex items-center gap-2"
            >
              Already following? Jump to Chapter 11
              <span className="text-[10px] font-bold tracking-wider text-[#f4a7b9] border border-[#f4a7b9]/30 px-2 py-0.5 rounded-full">
                Patreon
              </span>
            </Link>
          </div>
        </section>

        {/* Sources and notes */}
        <section id="sources" className="mt-12 pt-8 border-t border-[#f7c6d9]/30 scroll-mt-24" aria-labelledby="sources-heading">
          <SectionHeading id="sources-heading" kicker="Archive notes" title="Sources and a note on fiction" />

          <p className="text-sm text-[#7d6f67] leading-relaxed max-w-3xl mb-3">
            The Wo Hing Society and its Kowloon Walled City setting are fiction. Real triad societies
            varied in structure, terminology and period, and no single list of ranks describes all of
            them. This guide shows the common version of the tradition and flags where sources
            disagree.
          </p>
          <p className="text-sm text-[#7d6f67] leading-relaxed max-w-3xl mb-6">
            Dates and figures come from the sources below. Several are encyclopaedic or journalistic
            rather than academic, so for the history of the Tiandihui and of Hong Kong triad groups
            the two scholarly books are the better starting point.
          </p>

          <ul className="flex flex-col gap-3 max-w-3xl">
            {TRIAD_SOURCES.map((source) => (
              <li key={source.label} className="text-sm leading-relaxed">
                {source.href ? (
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9c3f5d] underline underline-offset-2 hover:text-[#2b1f2d]"
                  >
                    {source.label}
                  </a>
                ) : (
                  <span className="text-[#2b1f2d]">{source.label}</span>
                )}
                <span className="block text-[#7d6f67]">{source.note}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
