import Link from "next/link";
import Image from "next/image";
import type { Novel } from "@/lib/novels";

type NovelCardProps = {
  novel: Novel;
  priority?: boolean; // pass priority={true} for above-the-fold cards
};

export function NovelCard({ novel, priority = false }: NovelCardProps) {
  // 取第一个 tag 作为封面角标展示
  const categoryTag = novel.tags && novel.tags.length > 0 ? novel.tags[0] : undefined;

  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="novel-card group flex flex-col bg-white dark:bg-zinc-900 rounded-[16px] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300"
      data-slug={novel.slug}
      prefetch={false}
    >
      {/* 1. 小说封面图区 */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-[16px] flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
        <Image
          src={novel.coverImage}
          alt={novel.coverImageAlt || `Cover image for ${novel.title} - English Translation`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority={priority}
          title={`Read ${novel.title} English Translation`}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* 高亮分类徽章（参照章节卡片时间徽章的高亮渐变样式） */}
        {categoryTag && (
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#c9a96e] to-[#8b7355] text-white text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            🏷️ {categoryTag}
          </div>
        )}
      </div>

      {/* 2. 卡片内容区 */}


      {/* 3. 底部信息与行动栏 */}
      <div className="novel-info">
        <h3 className="novel-title">{novel.title}</h3>
        <p className="novel-excerpt">{novel.excerpt}</p>
        <div className="novel-card-footer">
          {novel.totalChapters ? (
            <span className="novel-card-stat">
              📚 {novel.totalChapters} chapters
            </span>
          ) : (
            <span />
          )}
          <span className="read-btn">Read →</span>
        </div>
      </div>
    </Link >
  );
}