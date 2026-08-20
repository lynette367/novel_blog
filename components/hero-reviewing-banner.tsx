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
    <div className="hero-polished-card min-h-0">
      {/* Corner badge — kept exactly as-is */}
      <div className="hero-polished-badge">
        <span>🔥 Refining</span>
      </div>

      {/* ── TOP ROW: image (left half) + basic info (right half) ── */}
      <div className="hero-card-top-row">
        {/* Top-left: cover image */}
        <Link
          href={novelUrl}
          className="hero-card-image-cell block"
          aria-label={`View ${novel.title}`}
        >
          <div className="hero-card-image-inner">
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

        {/* Top-right: basic info */}
        <div className="hero-card-info-cell">
          <div className="hero-card-info-cell pt-9"></div>
          <h2 className="hero-polished-title">
            <Link href={novelUrl} className="hover:text-[#8b7355] transition-colors">
              {novel.title}
            </Link>
          </h2>

          <p className="hero-card-chapter-count">
            {novel.totalChapters} Chapters
          </p>

          <div className="hero-polished-meta-tag flex flex-wrap gap-2">
            {novel.tags && novel.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="hero-polished-novel-name">
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── BOTTOM ROW: excerpt + progress bar + CTA (full width) ── */}
      <div className="hero-card-bottom-row">
        <p className="hero-polished-excerpt">
          {novel.description || novel.excerpt}
        </p>

        {/* Progress bar — markup unchanged */}
        <div className="hero-progress-wrapper my-3">
          <div className="flex justify-between items-center text-xs font-semibold text-[#5d5246] mb-1.5">
            <span>Refinement Progress</span>
            <span className="text-[#8b7355] font-bold">
              Ch. {novel.reviewedUpToChapter} / {novel.totalChapters} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-[#e8ded0] h-2.5 rounded-full overflow-hidden shadow-inner border border-amber-900/10">
            <div
              className="bg-gradient-to-r from-[#c9a96e] to-[#8b7355] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(percentage, 4)}%` }}
            />
          </div>
        </div>

        {/* CTA buttons */}
        <div className="hero-polished-footer pt-3 mt-auto border-t border-[#c9a96e]/30 flex flex-wrap items-center justify-between gap-3">
          <Link href={latestChapterUrl} className="hero-polished-cta">
            Read Ch. {latestPolishedChapterNumber} (Latest Refined) <span className="arrow">→</span>
          </Link>

          <Link
            href={novelUrl}
            className="text-xs font-bold text-[#8b7355] hover:text-[#5d4e37] underline underline-offset-4 transition-colors"
          >
            View Novel Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
