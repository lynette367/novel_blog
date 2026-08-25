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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {chapters.map((ch) => {
        const chapterUrl = `/novels/${ch.novelSlug}/chapters/${ch.chapterNumber}` as any;
        const relativeTime = formatRelativeTime(ch.updatedAt);

        return (
          <Link
            key={ch._id}
            href={chapterUrl}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#f7c6d9]/40 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[#e499b3]/60 no-underline text-inherit"
          >
            {/* Cover image with time badge */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-gray-100">
              <Image
                src={ch.novelCoverImage || "/assets/images/0.jpg"}
                alt={`${ch.novelTitle} Chapter ${ch.chapterNumber}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                style={{ objectFit: "cover" }}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 bg-[#fde2e8] text-[#d66b85] border border-[#f8bccb]/60 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-none uppercase tracking-wider">
                ✨ {relativeTime}
              </div>
            </div>

            {/* Card content */}
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#e499b3] bg-[#f7c6d9]/20 border border-[#e499b3]/45 px-2.5 py-0.5 rounded-full truncate max-w-[170px]">
                  {ch.novelTitle}
                </span>
              </div>

              <h3 className="font-serif font-semibold text-lg text-[#2b1f2d] leading-snug mb-3 line-clamp-2">
                Chapter {ch.chapterNumber}: {ch.chapterTitle}
              </h3>

              {ch.excerpt ? (
                <p className="text-sm text-[#302a2f] italic leading-relaxed mb-4 line-clamp-3 border-l-2 border-[#e499b3] pl-3">
                  &ldquo;{ch.excerpt}&rdquo;
                </p>
              ) : (
                <p className="text-sm italic text-gray-400 mb-4 line-clamp-3">
                  Freshly polished human translation available. Click to read!
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f7c6d9]/25 text-xs">
                <span className="text-[#c87f9b] font-medium">
                  📖 {ch.readingMinutes} min read ({ch.wordCount.toLocaleString()} words)
                </span>
                <span className="text-[#e499b3] font-semibold group-hover:text-[#c87f9b] transition-colors">
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
