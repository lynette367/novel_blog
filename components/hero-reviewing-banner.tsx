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
    <div className="relative flex flex-col justify-between h-full rounded-3xl border border-[#f7c6d9]/50 bg-white/85 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Corner badge */}
      <div className="absolute top-4 right-4 bg-[#fde2e8] text-[#d66b85] border border-[#f8bccb] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm z-10">
        🔥 Refining
      </div>

      {/* Top row: cover + info */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Cover image */}
        <Link href={novelUrl} className="block" aria-label={`View ${novel.title}`}>
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-md max-h-60">
            <Image
              src={novel.coverImage || "/assets/images/0.jpg"}
              alt={`${novel.title} Cover`}
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </Link>

        {/* Novel info */}
        <div className="flex flex-col gap-3 pt-8">
          <h2 className="font-serif font-semibold text-lg text-[#2b1f2d] leading-snug">
            <Link
              href={novelUrl}
              className="no-underline text-inherit hover:text-[#e499b3] transition-colors"
            >
              {novel.title}
            </Link>
          </h2>
          <p className="text-xs font-semibold text-[#e499b3] bg-[#f7c6d9]/20 border border-[#e499b3]/30 rounded-full px-3 py-0.5 w-fit">
            {novel.totalChapters} Chapters
          </p>
          <div className="flex flex-wrap gap-1.5">
            {novel.tags &&
              novel.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#2b1f2d] bg-white border border-[#f7c6d9]/60 rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-sm italic text-[#302a2f] leading-relaxed mb-4 border-l-2 border-[#e499b3] pl-3 line-clamp-3">
        {novel.description || novel.excerpt}
      </p>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center text-xs font-semibold text-[#302a2f] mb-1.5">
          <span>Refinement Progress</span>
          <span className="text-[#e499b3] font-bold">
            Ch. {novel.reviewedUpToChapter} / {novel.totalChapters} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-[#ffe3ef] h-2.5 rounded-full overflow-hidden border border-[#f7c6d9]/40">
          <div
            className="bg-gradient-to-r from-[#ffd3de] to-[#f4a7b9] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#f7c6d9]/30">
        <Link
          href={latestChapterUrl}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#f4a7b9] hover:bg-[#e896a9] text-white rounded-full font-semibold text-sm transition-all shadow-[0_8px_20px_rgba(244,167,185,0.3)] no-underline"
        >
          Read Ch. {latestPolishedChapterNumber} (Latest Refined) <span>→</span>
        </Link>
        <Link
          href={novelUrl}
          className="text-xs font-bold text-[#e499b3] hover:text-[#c87f9b] underline underline-offset-4 transition-colors"
        >
          View Novel Details →
        </Link>
      </div>
    </div>
  );
}
