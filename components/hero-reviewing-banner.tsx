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
    <div className="relative flex flex-col justify-between h-full rounded-2xl border border-[#f7c6d9]/50 bg-white/90 p-4 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Corner badge */}
      <div className="absolute top-3 right-3 bg-[#fde2e8] text-[#d66b85] border border-[#f8bccb] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm z-10">
        🔥 Refining
      </div>

      {/* Top row: cover (wider) + info */}
      <div className="grid grid-cols-[3fr_4fr] gap-3 mb-3">
        {/* Cover image — enlarged, no max-h cap */}
        <Link href={novelUrl} className="block" aria-label={`View ${novel.title}`}>
          <div className="relative w-full h-[120px] aspect-[4/3] rounded-xl overflow-hidden shadow-md">
            <Image
              src={novel.coverImage || "/assets/images/0.jpg"}
              alt={`${novel.title} Cover`}
              fill
              sizes="(max-width: 768px) 40vw, 160px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </Link>

        {/* Novel info */}
        <div className="flex flex-col gap-2 pt-6">
          <h2 className="font-serif font-semibold text-sm text-[#2b1f2d] leading-snug">
            <Link
              href={novelUrl}
              className="no-underline text-inherit hover:text-[#e499b3] transition-colors"
            >
              {novel.title}
            </Link>
          </h2>
          <p className="text-[10px] font-semibold text-[#e499b3] bg-[#f7c6d9]/20 border border-[#e499b3]/30 rounded-full px-2 py-0.5 w-fit">
            {novel.totalChapters} Chapters
          </p>
          <div className="flex flex-wrap gap-1">
            {novel.tags &&
              novel.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-[#2b1f2d] bg-white border border-[#f7c6d9]/60 rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-xs italic text-[#302a2f] leading-relaxed mb-3 border-l-2 border-[#e499b3] pl-2 line-clamp-2">
        {novel.description || novel.excerpt}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-[10px] font-semibold text-[#302a2f] mb-1">
          <span>Refinement Progress</span>
          <span className="text-[#e499b3] font-bold">
            Ch. {novel.reviewedUpToChapter} / {novel.totalChapters} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-[#ffe3ef] h-1.5 rounded-full overflow-hidden border border-[#f7c6d9]/40">
          <div
            className="bg-gradient-to-r from-[#ffd3de] to-[#f4a7b9] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#f7c6d9]/30">
        <Link
          href={latestChapterUrl}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#f4a7b9] hover:bg-[#e896a9] text-white rounded-full font-semibold text-xs transition-all shadow-[0_4px_12px_rgba(244,167,185,0.3)] no-underline"
        >
          Read Ch. {latestPolishedChapterNumber} (Latest) <span>→</span>
        </Link>
        <Link
          href={novelUrl}
          className="text-[10px] font-bold text-[#e499b3] hover:text-[#c87f9b] underline underline-offset-4 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
