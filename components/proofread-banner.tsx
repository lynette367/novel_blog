import Link from "next/link";
import Image from "next/image";
import type { RecentProofread } from "@/lib/novels";

type Props = {
  chapter: RecentProofread | null;
};

export function ProofreadBanner({ chapter }: Props) {
  if (!chapter) {
    return null;
  }

  const chapterUrl = `/novels/${chapter.novelSlug}/chapters/${chapter.chapterNumber}` as any;

  return (
    <div className="w-full">
      <Link
        href={chapterUrl}
        aria-label={`Read Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`}
        className="group relative flex flex-col md:flex-row rounded-3xl border border-[#f7c6d9]/50 bg-white/85 overflow-hidden shadow-sm hover:shadow-md transition-all no-underline text-inherit min-h-0 md:aspect-[2/1]"
      >
        {/* Badge */}
        <div className="absolute top-4 right-4 z-10 bg-[#fde2e8] text-[#d66b85] border border-[#f8bccb] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
          ✨ Human Proofread
        </div>

        {/* Left: cover image */}
        <div className="relative w-full md:w-[42%] aspect-[16/9] md:aspect-auto flex-shrink-0 bg-gray-100">
          <Image
            src={chapter.coverImage || "/assets/images/0.jpg"}
            alt={`${chapter.novelTitle} - Chapter ${chapter.chapterNumber} Cover`}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            style={{ objectFit: "cover" }}
            priority
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Right: content */}
        <div className="flex flex-col justify-center p-6 sm:p-8 md:pl-10 flex-1">
          <div className="flex items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wide text-[#c87f9b]">
            <span>Latest Human TL Chapter</span>
            <span className="text-[#2b1f2d] font-semibold italic normal-case px-3 py-0.5 bg-white rounded-full border border-[#f7c6d9]/60 text-xs tracking-normal">
              {chapter.novelTitle}
            </span>
          </div>

          <h2 className="font-serif font-semibold text-xl text-[#2b1f2d] leading-snug mb-3">
            Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
          </h2>

          {chapter.excerpt ? (
            <p className="text-sm italic text-[#302a2f] leading-relaxed mb-5 line-clamp-3 border-l-2 border-[#e499b3] pl-3">
              &ldquo;{chapter.excerpt}&rdquo;
            </p>
          ) : (
            <p className="text-sm italic text-[#302a2f] leading-relaxed mb-5 border-l-2 border-[#e499b3] pl-3">
              Dive into the carefully hand-crafted, human-proofread chapter translation for the best
              reading experience.
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#f7c6d9]/30">
            <div className="flex gap-4 text-sm text-[#c87f9b] font-medium">
              {chapter.readingMinutes ? <span>📖 Est. {chapter.readingMinutes} min read</span> : null}
              {chapter.wordCount ? <span>📝 {chapter.wordCount.toLocaleString()} words</span> : null}
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#f4a7b9] group-hover:bg-[#e896a9] text-white rounded-full font-semibold text-sm transition-all shadow-[0_8px_20px_rgba(244,167,185,0.3)]">
              Read Chapter <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
