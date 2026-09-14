import Link from "next/link";
import Image from "next/image";
import type { LatestPolishedChapter } from "@/lib/novels";

type NovelChapterGridProps = {
  patreonChapters?: LatestPolishedChapter[];
  polishedChapters?: LatestPolishedChapter[];
  chapters?: LatestPolishedChapter[]; // 兼容旧属性
};

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "Recently";
  const days = Math.floor(diffInSeconds / 86400);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ── Patreon 独占提前看卡片 ───────────────────────────────────────────────────
// 点击后直接进入本站 MTL 章节页面，由 MTL 页面顶部的 MtlBanner 进行引导
export function PatreonChapterCard({ ch }: { ch: LatestPolishedChapter }) {
  const chapterUrl = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}` as any;
  const relativeTime = formatRelativeTime(ch.updatedAt);

  return (
    <Link
      href={chapterUrl}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#c9a96e]/40 bg-gradient-to-b from-[#fffefc] to-[#fdf9f2] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#c9a96e]/80 no-underline text-inherit"
    >
      {/* 封面与 Patreon 时间角标 */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-gradient-to-br from-[#fdf6e8] to-[#f7ecd3]">
        {ch.novelCoverImage ? (
          <Image
            src={ch.novelCoverImage}
            alt={`${ch.novelTitle} Chapter ${ch.chapterNumber}`}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 220px"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <span className="font-serif text-sm font-bold text-[#c9a96e] opacity-60 text-center line-clamp-1">
              {ch.novelTitle}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-[#fdf6e8]/95 backdrop-blur-sm text-[#8b6f3f] border border-[#c9a96e]/60 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-none uppercase tracking-wider">
          🔒 {relativeTime}
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[#8b6f3f] bg-[#fdf6e8] border border-[#c9a96e]/35 px-2 py-0.5 rounded-full truncate max-w-[130px]">
            {ch.novelTitle}
          </span>
        </div>

        <h3 className="font-serif font-semibold text-xs sm:text-sm text-[#2b1f2d] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#8b6f3f] transition-colors">
          Ch. {ch.chapterNumber}: {ch.chapterTitle}
        </h3>

        {ch.excerpt ? (
          <p className="text-[11px] text-[#6b5738] leading-relaxed line-clamp-2 italic mb-2">
            &ldquo;{ch.excerpt}&rdquo;
          </p>
        ) : (
          <p className="text-[11px] text-[#6b5738] leading-relaxed line-clamp-2 mb-2">
            Polished on Patreon · Click to read MTL on site
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#c9a96e]/20 text-[10px] sm:text-[11px]">
          <span className="text-[#8b6f3f] font-medium">
            ⚡ Free MTL
          </span>
          <span className="text-[#c9a96e] font-semibold group-hover:text-[#8b6f3f] transition-colors flex items-center gap-0.5">
            Read <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── 本站精修卡片 ────────────────────────────────────────────────────────────
export function PolishedChapterCard({ ch }: { ch: LatestPolishedChapter }) {
  const chapterUrl = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}` as any;
  const relativeTime = formatRelativeTime(ch.updatedAt);

  return (
    <Link
      href={chapterUrl}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#f7c6d9]/40 bg-gradient-to-b from-white to-[#fff9f5] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#f4a7b9]/70 no-underline text-inherit"
    >
      {/* 封面与精修角标 */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-gradient-to-br from-[#ffe3ef] to-[#fde2e8]">
        {ch.novelCoverImage ? (
          <Image
            src={ch.novelCoverImage}
            alt={`${ch.novelTitle} Chapter ${ch.chapterNumber}`}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 220px"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <span className="font-serif text-sm font-bold text-[#f4a7b9] opacity-60 text-center line-clamp-1">
              {ch.novelTitle}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-[#fde2e8]/95 backdrop-blur-sm text-[#d66b85] border border-[#f8bccb]/60 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-none uppercase tracking-wider">
          ✨ {relativeTime}
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[#f4a7b9] bg-[#f7c6d9]/20 border border-[#f4a7b9]/45 px-2 py-0.5 rounded-full truncate max-w-[130px]">
            {ch.novelTitle}
          </span>
        </div>

        <h3 className="font-serif font-semibold text-xs sm:text-sm text-[#2b1f2d] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#f4a7b9] transition-colors">
          Ch. {ch.chapterNumber}: {ch.chapterTitle}
        </h3>

        {ch.excerpt ? (
          <p className="text-[11px] text-[#302a2f] italic leading-relaxed line-clamp-2 border-l border-[#f4a7b9] pl-1.5 mb-2">
            &ldquo;{ch.excerpt}&rdquo;
          </p>
        ) : (
          <p className="text-[11px] text-[#7d6f67] leading-relaxed line-clamp-2 mb-2">
            📖 {ch.readingMinutes} min · {ch.wordCount.toLocaleString()} words
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f7c6d9]/25 text-[10px] sm:text-[11px]">
          <span className="text-[#f4a7b9] font-medium">
            📖 {ch.readingMinutes}m read
          </span>
          <span className="text-[#f4a7b9] font-semibold group-hover:text-[#d66b85] transition-colors flex items-center gap-0.5">
            Read <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── 章节卡片单行容器（桌面 5 个留白，iPad/iPhone 3 个支持滑动）───────────────────
function ChapterCardRow({
  items,
  renderCard,
}: {
  items: LatestPolishedChapter[];
  renderCard: (ch: LatestPolishedChapter) => React.ReactNode;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:gap-3.5">
      {items.map((ch) => (
        <div
          key={ch._id}
          className="shrink-0 snap-start w-[calc((100%-2*0.75rem)/3)] min-w-[130px] lg:w-auto"
        >
          {renderCard(ch)}
        </div>
      ))}
    </div>
  );
}

// ── 综合小说章节网格（拆分 Patreon 和 精修两个板块）──────────────────────────────
export function NovelChapterGrid({
  patreonChapters = [],
  polishedChapters = [],
  chapters,
}: NovelChapterGridProps) {
  // 如果直接传了 chapters（兼容模式），拆分为 Patreon 和 Refined
  const effectivePatreonChapters =
    patreonChapters.length > 0
      ? patreonChapters.slice(0, 5)
      : (chapters?.filter((c) => c.isPatreonOnly).slice(0, 5) ?? []);

  const effectivePolishedChapters =
    polishedChapters.length > 0
      ? polishedChapters.slice(0, 5)
      : (chapters?.filter((c) => !c.isPatreonOnly).slice(0, 5) ?? []);

  const hasAnyChapters =
    effectivePatreonChapters.length > 0 || effectivePolishedChapters.length > 0;

  if (!hasAnyChapters) {
    return (
      <p className="text-sm italic text-gray-400 py-4">
        No refined chapters yet — check back soon!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── 板块一：Patreon 提前看章节（最多 5 章，不满 5 章自然留白）── */}
      {effectivePatreonChapters.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-[#8b6f3f] flex items-center gap-1.5">
                <span>🔒</span> Patreon Early Access
              </span>
              <span className="text-[10px] font-bold text-[#8b6f3f] bg-[#fdf6e8] border border-[#c9a96e]/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                5 Ahead
              </span>
            </div>
            <span className="text-[11px] text-[#9c8560] hidden sm:inline">
              Polished early on Patreon · Free MTL on site
            </span>
          </div>

          <ChapterCardRow
            items={effectivePatreonChapters}
            renderCard={(ch) => <PatreonChapterCard ch={ch} />}
          />
        </div>
      )}

      {/* ── 板块二：本站精修章节（最多 5 章，不满 5 章自然留白）── */}
      {effectivePolishedChapters.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-[#2b1f2d] flex items-center gap-1.5">
                <span>✨</span> Latest Refined Chapters
              </span>
              <span className="text-[10px] font-bold text-[#d66b85] bg-[#fde2e8] border border-[#f8bccb]/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Free
              </span>
            </div>
            <span className="text-[11px] text-[#7d6f67] hidden sm:inline">
              Human proofread &amp; polished
            </span>
          </div>

          <ChapterCardRow
            items={effectivePolishedChapters}
            renderCard={(ch) => <PolishedChapterCard ch={ch} />}
          />
        </div>
      )}
    </div>
  );
}

// 兼容旧组件名导出
export const LatestPolishedGrid = NovelChapterGrid;
