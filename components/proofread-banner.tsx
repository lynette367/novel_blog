import Link from "next/link";
import type { RecentProofread } from "@/lib/novels";

type Props = {
  chapter: RecentProofread | null;
};

// 没有数据时（比如站点刚起步、还没有任何章节）优雅隐藏，不展示空横幅
export function ProofreadBanner({ chapter }: Props) {
  if (!chapter) {
    return null;
  }

  return (
    <div className="proofread-banner">
      <span className="proofread-banner-icon" aria-hidden="true">
        🔍
      </span>
      <p className="proofread-banner-text">
        <span className="proofread-banner-label">Currently Polishing:</span>{" "}
        Chapter {chapter.chapterNumber} — {chapter.chapterTitle}
        <span className="proofread-banner-novel"> · {chapter.novelTitle}</span>
      </p>
      <Link
        href={`/novels/${chapter.novelSlug}/chapters/${chapter.chapterNumber}`}
        className="proofread-banner-link"
      >
        Read →
      </Link>
    </div>
  );
}
