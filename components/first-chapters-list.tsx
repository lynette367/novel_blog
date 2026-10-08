import Link from "next/link";
import Image from "next/image";
import type { LatestPolishedChapter } from "@/lib/novels";

type Props = {
  chapters: LatestPolishedChapter[];
  novelSlug?: string;
};

/**
 * 按照章节 1-5 正序排列的章节列表组件
 * 排版要素与 latest-polished-grid.tsx 一致（封面图片、标题、简介/阅读时长），
 * 不包含更新时间。
 */
export function FirstChaptersList({ chapters, novelSlug }: Props) {
  // 确保按章节 1-5 顺序正序排列，并取前 5 章
  const sortedChapters = [...chapters]
    .sort((a, b) => a.chapterNumber - b.chapterNumber)
    .slice(0, 5);

  if (sortedChapters.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-[#f4ece3]">
      {sortedChapters.map((ch) => {
        const targetSlug = ch.novelSlug || novelSlug;
        const chapterUrl = `/novels/${targetSlug}/chapters/${ch.chapterNumber}` as any;

        return (
          <Link
            key={ch._id || `${targetSlug}-${ch.chapterNumber}`}
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

            {/* Info (Title + Excerpt / Stats, without updatedAt) */}
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <h3 className="font-serif font-semibold text-sm sm:text-base text-[#2b1f2d] leading-snug line-clamp-1 group-hover:text-[#f4a7b9] transition-colors">
                Ch. {ch.chapterNumber}: {ch.chapterTitle}
              </h3>

              {ch.excerpt ? (
                <p className="text-xs text-[#7d6f67] italic leading-relaxed line-clamp-1 mt-1">
                  &ldquo;{ch.excerpt}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-[#7d6f67] leading-relaxed line-clamp-1 mt-1">
                  {ch.readingMinutes} min · {(ch.wordCount || 0).toLocaleString()} words
                </p>
              )}
            </div>

            {/* Arrow */}
            <span className="hidden sm:flex items-center text-[#f4a7b9] group-hover:text-[#d66b85] transition-colors shrink-0">
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
