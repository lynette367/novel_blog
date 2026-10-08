import Link from "next/link";
import Image from "next/image";
import type { LatestPolishedChapter } from "@/lib/novels";
import { FirstChaptersList } from "@/components/first-chapters-list";

// 首页目前已有的两部小说白名单：左侧 Human Refined 暂时按照章节 1-5 顺序排列
// 未来若新增 refining novel，不在该名单中，左侧自动保持使用 latest-polished-grid.tsx 倒序列表
export const INITIAL_ORDER_NOVEL_SLUGS = new Set([
  "big_brother",
  "transmigrated_into_the_villains_sickly_childhood_friend",
  "transmigrated-villain-childhood-friend",
]);

type NovelChapterGridProps = {
  novelSlug?: string;
  patreonChapters?: LatestPolishedChapter[];
  polishedChapters?: LatestPolishedChapter[];
  firstChapters?: LatestPolishedChapter[];
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

type ChapterVariant = "patreon" | "polished";

// ── 单行章节列表项（左缩略图 + 右侧信息，无卡片边框/阴影）────────────────────────
function ChapterListItem({
  ch,
  variant,
}: {
  ch: LatestPolishedChapter;
  variant: ChapterVariant;
}) {
  const chapterUrl = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}` as any;
  const relativeTime = formatRelativeTime(ch.updatedAt);
  const isPatreon = variant === "patreon";

  return (
    <Link
      href={chapterUrl}
      className="group flex gap-4 py-3.5 first:pt-0 last:pb-0 -mx-3 px-3 rounded-md transition-colors duration-200 hover:bg-[#faf6ee] no-underline text-inherit"
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-20 sm:w-16 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-[#ffe3ef] to-[#fde2e8]">
        {ch.novelCoverImage ? (
          <Image
            src={ch.novelCoverImage}
            alt={`${ch.novelTitle} Chapter ${ch.chapterNumber}`}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-1">
            <span className="font-serif text-[9px] font-bold text-[#f4a7b9] opacity-60 text-center line-clamp-2">
              {ch.novelTitle}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {isPatreon && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide text-[#d66b85] bg-[#fde2e8] border border-[#f8bccb]/60">
              🔒 Patreon
            </span>
          )}
          <span className="text-[11px] text-[#9c8560]">{relativeTime}</span>
        </div>

        <h3 className="font-serif font-semibold text-sm sm:text-base text-[#2b1f2d] leading-snug line-clamp-1 group-hover:text-[#f4a7b9] transition-colors">
          Ch. {ch.chapterNumber}: {ch.chapterTitle}
        </h3>

        {ch.excerpt ? (
          <p className="text-xs text-[#7d6f67] italic leading-relaxed line-clamp-1 mt-0.5">
            &ldquo;{ch.excerpt}&rdquo;
          </p>
        ) : !isPatreon ? (
          <p className="text-xs text-[#7d6f67] leading-relaxed line-clamp-1 mt-0.5">
            {ch.readingMinutes} min · {ch.wordCount.toLocaleString()} words
          </p>
        ) : null}
      </div>

      <span className="hidden sm:flex items-center text-[#f4a7b9] group-hover:text-[#d66b85] transition-colors shrink-0">
        →
      </span>
    </Link>
  );
}

// 兼容旧组件名导出（原先是完整卡片，现在统一走列表项，variant 决定角标文案）
export function PatreonChapterCard({ ch }: { ch: LatestPolishedChapter }) {
  return <ChapterListItem ch={ch} variant="patreon" />;
}

export function PolishedChapterCard({ ch }: { ch: LatestPolishedChapter }) {
  return <ChapterListItem ch={ch} variant="polished" />;
}

// ── 一组章节的纯列表（分割线代替卡片边框）──────────────────────────
function ChapterList({
  items,
  variant,
}: {
  items: LatestPolishedChapter[];
  variant: ChapterVariant;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`flex flex-col divide-y ${variant === "patreon" ? "divide-[#fce8ef]" : "divide-[#f4ece3]"
        }`}
    >
      {items.map((ch) => (
        <ChapterListItem key={ch._id} ch={ch} variant={variant} />
      ))}
    </div>
  );
}

// ── 综合小说章节列表（一左一右两个 Volume：左 Free Refined，右 Patreon Premium）──
export function NovelChapterGrid({
  novelSlug,
  patreonChapters = [],
  polishedChapters = [],
  firstChapters = [],
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

  // 判断是否属于当前首页已有的两部小说：左侧暂时展示章节 1-5 顺序排列
  // 若未来新增 refining novel，不在白名单中，左侧仍然使用 ChapterList (latest-polished-grid 倒序章节列表)
  const isInitialNovel = Boolean(novelSlug && INITIAL_ORDER_NOVEL_SLUGS.has(novelSlug));
  const hasFirstChapters = firstChapters.length > 0;
  const showFirstChaptersOrder = isInitialNovel && hasFirstChapters;

  const hasLeftChapters = showFirstChaptersOrder || effectivePolishedChapters.length > 0;
  const hasAnyChapters =
    effectivePatreonChapters.length > 0 || hasLeftChapters;

  if (!hasAnyChapters) {
    return (
      <p className="text-sm italic text-gray-400 py-4">
        No refined chapters yet — check back soon!
      </p>
    );
  }

  const isTwoColumns = hasLeftChapters && effectivePatreonChapters.length > 0;

  return (
    <div
      className={
        isTwoColumns
          ? "grid grid-cols-1 divide-y divide-[#f7c6d9]/40 md:divide-y-0 md:grid-cols-2 md:divide-x md:divide-[#f7c6d9]/40 items-start"
          : "grid grid-cols-1 gap-6"
      }
    >
      {/* ── 左侧栏目：Refined Chapters ── */}
      {hasLeftChapters && (
        <div className={isTwoColumns ? "pb-6 md:pb-0 md:pr-8 lg:pr-10" : ""}>
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#f7c6d9]/40">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-[#5c4a42]">
                Human Refined
              </h3>
            </div>
          </div>

          {showFirstChaptersOrder ? (
            <FirstChaptersList chapters={firstChapters} novelSlug={novelSlug} />
          ) : (
            <ChapterList items={effectivePolishedChapters} variant="polished" />
          )}
        </div>
      )}

      {/* ── 右侧栏目：Patreon Chapters ── */}
      {effectivePatreonChapters.length > 0 && (
        <div className={isTwoColumns ? "pt-6 md:pt-0 md:pl-8 lg:pl-10" : ""}>
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#f7c6d9]/40">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-[#d66b85]">
                Support us on Patreon
              </h3>
            </div>
          </div>

          <ChapterList items={effectivePatreonChapters} variant="patreon" />
        </div>
      )}
    </div>
  );
}

// 兼容旧组件名导出
export const LatestPolishedGrid = NovelChapterGrid;
