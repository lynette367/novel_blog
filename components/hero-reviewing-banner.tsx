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
    <div className="w-full">
      <div className="hero-polished-container w-full md:aspect-[2/1]">
        <div className="hero-polished-card min-h-0">
          {/* Hero 右上角角标 */}
          <div className="hero-polished-badge">
            <span>🔥 Currently Under Review</span>
          </div>

          {/* 左侧：小说封面图 */}
          <Link
            href={novelUrl}
            className="hero-polished-image-wrapper aspect-[16/9] md:aspect-auto md:self-stretch block"
            aria-label={`View ${novel.title}`}
          >
            <Image
              src={novel.coverImage || "/assets/images/0.jpg"}
              alt={`${novel.title} Cover`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: "cover" }}
              priority
            />
          </Link>

          {/* 右侧：正在审核的小说详情与进度 */}
          <div className="hero-polished-content">
            <div className="hero-polished-meta-tag flex-wrap gap-2">
              <span className="text-[#8b7355] font-bold uppercase tracking-wider text-[0.75rem]">
                Proofread In Progress
              </span>
              {novel.tags && novel.tags.length > 0 && (
                <span className="hero-polished-novel-name">
                  {novel.tags[0]}
                </span>
              )}
            </div>

            <h2 className="hero-polished-title">
              <Link href={novelUrl} className="hover:text-[#8b7355] transition-colors">
                {novel.title}
              </Link>
            </h2>

            <p className="hero-polished-excerpt">
              {novel.description || novel.excerpt}
            </p>

            {/* 校对进度条 */}
            <div className="hero-progress-wrapper my-3">
              <div className="flex justify-between items-center text-xs font-semibold text-[#5d5246] mb-1.5">
                <span>Proofread Progress</span>
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

            {/* 底部按钮区 */}
            <div className="hero-polished-footer pt-3 mt-auto border-t border-[#c9a96e]/30 flex flex-wrap items-center justify-between gap-3">
              <Link href={latestChapterUrl} className="hero-polished-cta">
                Read Ch. {latestPolishedChapterNumber} (Latest Polished) <span className="arrow">→</span>
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
      </div>
    </div>
  );
}
