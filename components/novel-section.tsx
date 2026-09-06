import Link from "next/link";
import Image from "next/image";
import { LatestPolishedGrid } from "@/components/latest-polished-grid";
import type { CurrentlyReviewingNovel, LatestPolishedChapter } from "@/lib/novels";

type Props = {
  novel: CurrentlyReviewingNovel;
  chapters: LatestPolishedChapter[];
};

export function NovelSection({ novel, chapters }: Props) {
  const novelUrl = `/novels/${novel.slug}` as any;
  const latestChapterNumber =
    novel.latestPolishedChapterNumber || novel.reviewedUpToChapter || 1;
  const latestChapterUrl =
    `/novels/${novel.slug}/chapters/${latestChapterNumber}` as any;

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((novel.reviewedUpToChapter / (novel.totalChapters || 1)) * 100))
  );

  return (
    <section className="mb-14">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
            <Link
              href={novelUrl}
              className="no-underline text-inherit hover:text-[#e499b3] transition-colors"
            >
              {novel.title}
            </Link>
          </h2>
          <span className="text-xs font-bold text-[#d66b85] bg-[#fde2e8] border border-[#f8bccb] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            🔥 Refining
          </span>
        </div>
        <Link
          href={novelUrl}
          className="text-xs font-semibold text-[#e499b3] hover:text-[#c87f9b] underline underline-offset-4 transition-colors no-underline shrink-0"
        >
          View novel →
        </Link>
      </div>

      {/* Novel info strip: cover + meta */}
      <div className="flex items-start gap-4 mb-6 p-4 rounded-2xl border border-[#f7c6d9]/30 bg-white/60">
        {/* Mini cover */}
        <Link href={novelUrl} className="shrink-0 block" aria-label={`View ${novel.title}`}>
          <div className="relative w-14 aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-gradient-to-br from-[#ffe3ef] to-[#fde2e8]">
            {novel.coverImage ? (
              <Image
                src={novel.coverImage}
                alt={`${novel.title} Cover`}
                fill
                sizes="56px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-1 text-center">
                <span className="font-serif text-[9px] font-bold text-[#e499b3] line-clamp-2">
                  {novel.title}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Meta */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Tags */}
          {novel.tags && novel.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {novel.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-[#2b1f2d] bg-white border border-[#f7c6d9]/60 rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {(novel.description || novel.excerpt) && (
            <p className="text-xs italic text-[#302a2f] leading-relaxed line-clamp-2 border-l-2 border-[#e499b3] pl-2">
              {novel.description || novel.excerpt}
            </p>
          )}

          {/* Progress bar + CTA */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-[10px] font-semibold text-[#302a2f] mb-1">
                <span>Refinement</span>
                <span className="text-[#e499b3]">
                  Ch. {novel.reviewedUpToChapter}/{novel.totalChapters} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-[#ffe3ef] h-1.5 rounded-full overflow-hidden border border-[#f7c6d9]/40">
                <div
                  className="bg-gradient-to-r from-[#ffd3de] to-[#f4a7b9] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(percentage, 4)}%` }}
                />
              </div>
            </div>
            <Link
              href={latestChapterUrl}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-[#f4a7b9] hover:bg-[#e896a9] text-white rounded-full font-semibold text-xs transition-all shadow-sm no-underline"
            >
              Ch. {latestChapterNumber} →
            </Link>
          </div>
        </div>
      </div>

      {/* Chapter grid */}
      {chapters.length > 0 ? (
        <LatestPolishedGrid chapters={chapters} />
      ) : (
        <p className="text-sm italic text-gray-400 py-4">
          No refined chapters yet — check back soon!
        </p>
      )}
    </section>
  );
}
