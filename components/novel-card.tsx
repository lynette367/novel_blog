import Link from "next/link";
import Image from "next/image";
import type { Novel } from "@/lib/novels";

type NovelCardProps = {
  novel: Novel;
  priority?: boolean;
};

export function NovelCard({ novel, priority = false }: NovelCardProps) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#f7c6d9]/40 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-[#e499b3]/60 no-underline text-inherit"
      data-slug={novel.slug}
      prefetch={false}
    >
      {/* Cover image — no category tag */}
      <div className="relative w-full aspect-[16/9] overflow-hidden flex-shrink-0 bg-gray-100">
        <Image
          src={novel.coverImage}
          alt={novel.coverImageAlt || `${novel.title} - Danmei BL Novel Cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority={priority}
          title={`Read ${novel.title} - Danmei Novel`}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle pink top-edge accent on hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ffd3de] to-[#f4a7b9] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-5 bg-gradient-to-b from-white to-[#fff9f2]">
        {novel.tags && novel.tags.length > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#e499b3] bg-[#f7c6d9]/20 border border-[#e499b3]/45 px-2.5 py-0.5 rounded-full truncate max-w-[170px]">
              {novel.tags[0]}
            </span>
          </div>
        )}

        <h3 className="font-serif font-semibold text-lg text-[#2b1f2d] leading-snug mb-3 line-clamp-2">
          {novel.title}
        </h3>
        <p className="text-sm text-[#302a2f] italic leading-relaxed mb-4 line-clamp-3 border-l-2 border-[#e499b3] pl-3">
          {novel.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f7c6d9]/30 text-xs">
          {novel.totalChapters ? (
            <span className="text-[#c87f9b] font-medium">📚 {novel.totalChapters} chapters</span>
          ) : (
            <span />
          )}
          <span className="text-[#e499b3] font-semibold group-hover:text-[#c87f9b] transition-colors">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}