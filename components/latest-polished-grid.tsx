import Link from "next/link";
import Image from "next/image";
import type { LatestPolishedChapter } from "@/lib/novels";

type Props = {
  chapters: LatestPolishedChapter[];
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

export function LatestPolishedGrid({ chapters }: Props) {
  if (!chapters || chapters.length === 0) {
    return null;
  }

  return (
    <div className="novels-grid featured-grid">
      {chapters.map((ch) => {
        const chapterUrl = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}` as any;
        const relativeTime = formatRelativeTime(ch.updatedAt);

        return (
          <Link
            key={ch._id}
            href={chapterUrl}
            className="chapter-polished-card"
          >
            {/* 章节 OG 封面图 */}
            <div className="chapter-polished-cover relative w-full aspect-[16/9] overflow-hidden rounded-t-[16px]">
              <Image
                src={ch.novelCoverImage || "/assets/images/0.jpg"}
                alt={`${ch.novelTitle} Chapter ${ch.chapterNumber}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                style={{ objectFit: "cover" }}
                className="chapter-polished-img transition-transform duration-500"
              />
              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#c9a96e] to-[#8b7355] text-white text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                ✨ {relativeTime}
              </div>
            </div>

            {/* 卡片下半部分内容区 */}
            <div className="chapter-polished-body p-5 flex flex-col flex-1">
              <div className="chapter-polished-header mb-2">
                <span className="chapter-polished-novel-tag">
                  {ch.novelTitle}
                </span>
              </div>

              <h3 className="chapter-polished-title">
                Chapter {ch.chapterNumber}: {ch.chapterTitle}
              </h3>

              {ch.excerpt ? (
                <p className="chapter-polished-excerpt">
                  &ldquo;{ch.excerpt}&rdquo;
                </p>
              ) : (
                <p className="chapter-polished-excerpt italic text-gray-400">
                  Freshly polished human translation available. Click to read!
                </p>
              )}

              <div className="chapter-polished-footer">
                <span className="chapter-polished-stats">
                  📖 {ch.readingMinutes} min read ({ch.wordCount.toLocaleString()} words)
                </span>
                <span className="chapter-polished-link">
                  Read →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
