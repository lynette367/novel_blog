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
      <div className="hero-polished-container w-full">
        <Link
          href={chapterUrl}
          className="hero-polished-card min-h-0 md:aspect-[2/1]"
          aria-label={`Read Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`}
        >
          {/* 整体 Hero 板块右上角角标 */}
          <div className="hero-polished-badge">
            <span>✨ Human Proofread</span>
          </div>

          {/* 左侧：章节图片 / 小说封面 */}
          <div className="hero-polished-image-wrapper aspect-[16/9] md:aspect-auto md:self-stretch">
            <Image
              src={chapter.coverImage || "/assets/images/0.jpg"}
              alt={`${chapter.novelTitle} - Chapter ${chapter.chapterNumber} Cover`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* 右侧：章节精修介绍与 Excerpt */}
          <div className="hero-polished-content">
            <div className="hero-polished-meta-tag">
              <span>Latest Human TLChapter</span>
              <span className="hero-polished-novel-name">{chapter.novelTitle}</span>
            </div>

            <h2 className="hero-polished-title">
              Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
            </h2>

            {chapter.excerpt ? (
              <p className="hero-polished-excerpt">
                &ldquo;{chapter.excerpt}&rdquo;
              </p>
            ) : (
              <p className="hero-polished-excerpt">
                Dive into the carefully hand-crafted, human-proofread chapter translation for the best reading experience.
              </p>
            )}

            <div className="hero-polished-footer">
              <div className="hero-polished-stats">
                {chapter.readingMinutes ? <span>📖 Est. {chapter.readingMinutes} min read</span> : null}
                {chapter.wordCount ? <span>📝 {chapter.wordCount.toLocaleString()} words</span> : null}
              </div>

              <span className="hero-polished-cta">
                Read Chapter <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
