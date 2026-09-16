import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TRIAD_RANKS, type TriadRank } from "@/lib/lore/triad-ranks";
import { absoluteUrl } from "@/lib/siteMetadata";

export const dynamic = "force-static";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Hong Kong Triad Ranks & Hierarchy Guide | Wo Hing Society Lore",
  description:
    "Explore the 1970s Hong Kong triad ranks from Four-Nine Boys to the Loong-head in the Kowloon Walled City, featuring Wo Hing Society lore and character tiers.",
  keywords: [
    "hong kong triad ranks",
    "wo hing society",
    "kowloon walled city",
    "triad hierarchy",
    "danmei lore",
    "1970s hong kong noir",
  ],
  alternates: { canonical: absoluteUrl("/lore/triad-ranks") },
  openGraph: {
    title: "Hong Kong Triad Ranks & Hierarchy Guide | Wo Hing Society Lore",
    description:
      "Explore the 1970s Hong Kong triad ranks from Four-Nine Boys to the Loong-head in the Kowloon Walled City, featuring Wo Hing Society lore and character tiers.",
    url: absoluteUrl("/lore/triad-ranks"),
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hong Kong Triad Ranks & Hierarchy Guide | Wo Hing Society Lore",
    description:
      "Explore the 1970s Hong Kong triad ranks from Four-Nine Boys to the Loong-head in the Kowloon Walled City, featuring Wo Hing Society lore and character tiers.",
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

// ─── Rank card (native <details> — zero client JS) ────────────────────────────

function RankCard({ rank, index }: { rank: TriadRank; index: number }) {
  const isGated = rank.is_patreon_gated;

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
      <div className={`flex gap-5 px-5 pb-5 pt-4 border-t animate-[fadeSlideDown_0.22s_ease_both] ${
        isGated ? "border-[#f4a7b9]/15" : "border-[#f7c6d9]/40"
      }`}>
        {/* Seal column */}
        <div className={`hidden sm:flex shrink-0 flex-col items-center justify-center w-24 rounded-lg border gap-2 ${
          isGated
            ? "border-[#f4a7b9]/15 bg-[#f4a7b9]/5 text-[#f4a7b9]/60"
            : "border-[#f7c6d9]/50 bg-[#fff9f2] text-[#f4a7b9]/70"
        }`}>
          <span className="w-10 h-10"><BadgeIcon symbol={rank.badge_symbol} /></span>
          <span className="font-mono text-[10px] tracking-wider">
            FILE {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className={`text-xs font-bold tracking-[0.18em] uppercase ${isGated ? "text-[#f4a7b9]/50" : "text-[#f4a7b9]"}`}>
            Dossier Note
          </p>
          <p className={`text-sm leading-relaxed ${isGated ? "text-[#f7c6d9]/80" : "text-[#2b1f2d]"}`}>
            {rank.summary}
          </p>

          <blockquote className={`border-l-2 pl-4 py-1 text-sm leading-relaxed italic ${
            isGated
              ? "border-[#f4a7b9]/40 text-[#f4a7b9]/60"
              : "border-[#f4a7b9] text-[#7d6f67] bg-[#fff9f2] rounded-r"
          }`}>
            <span className={`block text-[10px] font-bold tracking-[0.18em] uppercase not-italic mb-1 ${
              isGated ? "text-[#f4a7b9]/40" : "text-[#f4a7b9]"
            }`}>
              Story Glimpse
            </span>
            {rank.story_hint}
          </blockquote>

          {/* Footer stamp */}
          <div className={`flex flex-wrap gap-3 text-[10px] font-mono tracking-wide mt-1 ${
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TriadRanksPage() {
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": absoluteUrl("/lore/triad-ranks#termset"),
    name: "1970s Hong Kong Triad Ranks (Wo Hing Society)",
    description:
      "Traditional triad hierarchy ranks of the Wo Hing Society (和兴社) operating within the Kowloon Walled City during the 1970s.",
    hasDefinedTerm: TRIAD_RANKS.map((rank) => ({
      "@type": "DefinedTerm",
      "@id": absoluteUrl(`/lore/triad-ranks#rank-${rank.id}`),
      name: rank.term_en,
      alternateName: rank.term_cn,
      termCode: rank.code_number,
      description: rank.summary,
      inDefinedTermSet: absoluteUrl("/lore/triad-ranks#termset"),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSet) }}
      />

      {/* Minimal keyframe for card reveal — only what Tailwind can't express inline */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
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
            A classified dossier on the five-tier rank structure of the Wo Hing
            Society, as observed within the Kowloon Walled City, 1970s.
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

        {/* Intro */}
        <section className="mb-8 pb-6 border-b border-[#f7c6d9]/30" id="dossiers">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4a7b9] mb-1">
            The path to power
          </p>
          <h2 className="font-serif text-2xl text-[#2b1f2d] font-normal mb-3">
            Wo Hing Society — Five Ranks
          </h2>
          <p className="text-sm text-[#7d6f67] leading-relaxed max-w-2xl">
            Each rank dossier below covers the role, numeric code, and a glimpse
            into how the rank appears in the novel. Click any card to unseal it.
            The top two ranks are gated behind Patreon.
          </p>
        </section>

        {/* Rank cards */}
        <section aria-labelledby="dossier-heading">
          <h2 id="dossier-heading" className="sr-only">Triad rank dossiers</h2>
          <div className="flex flex-col gap-3" role="list">
            {TRIAD_RANKS.map((rank, index) => (
              <div key={rank.id} role="listitem">
                <RankCard rank={rank} index={index} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-12 rounded-2xl bg-gradient-to-br from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d] border border-[#f7c6d9]/20 p-8 text-center"
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

        {/* SEO context */}
        <section className="mt-12 pt-8 border-t border-[#f7c6d9]/30">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#f4a7b9] mb-2">
            Archive Notes
          </p>
          <h2 className="font-serif text-2xl text-[#2b1f2d] font-normal mb-4">
            Hong Kong triad ranks &amp; hierarchy
          </h2>
          <p className="text-sm text-[#7d6f67] leading-relaxed max-w-3xl mb-3">
            This page presents the rank terminology used by the Wo Hing Society
            setting of the novel. Terminology, duties, and ordering can vary
            across real triad societies and historical periods — this dossier is
            specific to the fictional Kowloon Walled City setting and should not
            be read as a universal description of every organisation.
          </p>
          <p className="text-sm text-[#7d6f67] leading-relaxed max-w-3xl">
            In the novel, these titles form the social architecture around Chan Ka
            Nam and Kiu Man. Use the dossiers above for the story-facing
            introduction to each rank and character context.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
