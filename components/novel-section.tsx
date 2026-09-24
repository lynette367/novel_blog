import Link from "next/link";
import { NovelChapterGrid } from "@/components/latest-polished-grid";
import type { CurrentlyReviewingNovel, LatestPolishedChapter } from "@/lib/novels";

type Props = {
  novel: CurrentlyReviewingNovel;
  patreonChapters?: LatestPolishedChapter[];
  polishedChapters?: LatestPolishedChapter[];
  /**
   * @deprecated The overview strip (mini cover + tags + excerpt + progress bar)
   * has been removed — every novel section now just shows the title + chapter
   * list. This prop is kept optional so existing call sites (e.g. page.tsx
   * passing showOverview={false}/{true}) don't need to change immediately.
   */
  showOverview?: boolean;
};

export function NovelSection({
  novel,
  patreonChapters = [],
  polishedChapters = [],
}: Props) {
  const novelUrl = `/novels/${novel.slug}` as any;

  return (
    <section className="mb-14">
      {/* Section header — just the novel title, no overview strip */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5 pb-3 border-b border-[#f7c6d9]/40">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl font-normal text-[#2b1f2d] tracking-wide">
            <Link
              href={novelUrl}
              className="no-underline text-inherit hover:text-[#f4a7b9] transition-colors"
            >
              {novel.title}
            </Link>
          </h2>
          <span className="text-xs font-bold text-[#d66b85] bg-[#fde2e8] border border-[#f8bccb] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            🔥 Refining
          </span>
        </div>
        <Link
          href={novelUrl}
          className="text-xs font-semibold text-[#f4a7b9] hover:text-[#f4a7b9] underline underline-offset-4 transition-colors no-underline shrink-0"
        >
          View novel →
        </Link>
      </div>

      {/* Chapter list — no card wrapper, no overview strip above it */}
      <NovelChapterGrid
        patreonChapters={patreonChapters}
        polishedChapters={polishedChapters}
      />
    </section>
  );
}
