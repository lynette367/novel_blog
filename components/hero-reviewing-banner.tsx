import Link from "next/link";
import Image from "next/image";
import type { CurrentlyReviewingNovel } from "@/lib/novels";

type Props = {
  novel: CurrentlyReviewingNovel | null;
};

export function HeroReviewingBanner({ novel }: Props) {
  if (!novel) {
    return null;
  }

  const novelUrl = `/novels/${novel.slug}` as any;
  const latestPolishedChapterNumber = novel.latestPolishedChapterNumber || novel.reviewedUpToChapter || 1;
  const latestChapterUrl = `/novels/${novel.slug}/chapters/${latestPolishedChapterNumber}` as any;

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((novel.reviewedUpToChapter / (novel.totalChapters || 1)) * 100))
  );

  return (
    <div className="relative flex flex-col justify-between">
      {/* Corner badge */}
      <div className="absolute top-0 right-0 bg-[#fde2e8] text-[#d66b85] border border-[#f8bccb] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm z-10">
        🔥 Featured · Refining
      </div>

      {/* Top row: cover + info */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-4">
        {/* Cover image */}
        <Link href={novelUrl} className="block shrink-0" aria-label={`View ${novel.title}`}>
          <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-[#ffe3ef] to-[#fde2e8]">
            {novel.coverImage ? (
              <Image
                src={novel.coverImage}
                alt={`${novel.title} Cover`}
                fill
                sizes="(max-width: 768px) 120px, 160px"
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-2 text-center">
                <span className="font-serif text-xs font-bold text-[#f4a7b9]">
                  {novel.title}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Novel info */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0 pt-1 pr-28 sm:pr-32">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#f4a7b9] bg-white/80 border border-[#f4a7b9]/30 rounded-full px-2.5 py-0.5">
              {novel.totalChapters} Chapters
            </span>
            {novel.tags &&
              novel.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#2b1f2d] bg-white/80 border border-[#f7c6d9]/60 rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
          </div>

          <h2 className="font-serif font-semibold text-xl sm:text-2xl text-[#2b1f2d] leading-snug">
            <Link
              href={novelUrl}
              className="no-underline text-inherit hover:text-[#f4a7b9] transition-colors"
            >
              {novel.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-sm italic text-[#302a2f] leading-relaxed border-l-2 border-[#f4a7b9] pl-3 line-clamp-3">
            {novel.description || novel.excerpt}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 bg-white/60 border border-[#f7c6d9]/40 rounded-xl p-3.5">
        <div className="flex justify-between items-center text-xs font-semibold text-[#302a2f] mb-1.5">
          <span>Refinement Progress</span>
          <span className="text-[#f4a7b9] font-bold">
            Ch. {novel.reviewedUpToChapter} / {novel.totalChapters} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-[#ffe3ef] h-2 rounded-full overflow-hidden border border-[#f7c6d9]/40">
          <div
            className="bg-gradient-to-r from-[#ffd3de] to-[#f4a7b9] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f7c6d9]/30">
        <Link
          href={latestChapterUrl}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#f4a7b9] hover:bg-[#e896a9] text-white rounded-full font-semibold text-sm transition-all shadow-[0_4px_12px_rgba(244,167,185,0.3)] hover:-translate-y-0.5 no-underline"
        >
          Read Ch. {latestPolishedChapterNumber} (Latest Refined) <span>→</span>
        </Link>
        <Link
          href={novelUrl}
          className="text-xs font-bold text-[#f4a7b9] hover:text-[#e896a9] underline underline-offset-4 transition-colors"
        >
          View Novel Details →
        </Link>
      </div>
    </div>
  );
}
