import Link from "next/link";
import type { WeeklyQuoteData } from "@/lib/novels";

type WeeklyQuoteProps = Partial<WeeklyQuoteData>;

export function WeeklyQuote({
  quoteText = "He had always thought that losing someone was the same as being left behind.",
  novelTitle = "Big Brother",
  chapter = "Chapter 12",
  slug = "losing-someone-vs-being-left-behind",
  targetChapterUrl = "/novels/big_brother/chapters/12",
}: WeeklyQuoteProps) {
  const quoteDetailUrl = `/weekly-quotes/${slug}` as any;
  const chapterUrl = (targetChapterUrl || "/novels") as any;

  return (
    <section className="page-shell py-8 md:py-10">
      <div className="max-w-3xl mx-auto text-center border-y border-[#f7c6d9]/45 py-10 sm:py-12 px-4 relative">
        {/* Section title */}
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#d66b85] mb-6">
          Weekly Quote
        </p>

        {/* Quote text */}
        <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl font-normal text-[#2b1f2d] leading-relaxed max-w-xl mx-auto mb-6">
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        {/* Decorative star */}
        <div className="flex items-center justify-center text-[#f4a7b9] text-sm mb-5 select-none" aria-hidden="true">
          ✦
        </div>

        {/* Attribution */}
        <div className="space-y-1 mb-6">
          <p className="font-serif text-base sm:text-lg font-medium text-[#4a3b32]">
            {novelTitle}
          </p>
          <p className="text-xs sm:text-sm text-[#7d6f67]">
            {chapter}
          </p>
        </div>

        {/* Action links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link
            href={chapterUrl}
            className="inline-flex items-center gap-1.5 font-semibold text-[#f4a7b9] hover:text-[#d66b85] underline underline-offset-4 transition-colors no-underline group"
          >
            Read the chapter <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <span className="text-[#f7c6d9] select-none" aria-hidden="true">·</span>

          <Link
            href={quoteDetailUrl}
            className="inline-flex items-center gap-1 font-medium text-[#7d6f67] hover:text-[#f4a7b9] transition-colors no-underline group"
          >
            <span>View Insight</span> <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
