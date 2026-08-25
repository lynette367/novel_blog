"use client";

import { useMemo, useState } from "react";
import type { Novel } from "@/lib/novels";
import { NovelCard } from "./novel-card";

type Props = {
  novels: Novel[];
};

const ALL_TAG = "ALL";

export function FilterableNovelGrid({ novels }: Props) {
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);

  const tags = useMemo(() => {
    const seen = new Map<string, string>();
    novels.forEach((novel) => {
      (novel.tags || []).forEach((tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, trimmed);
        }
      });
    });
    const sorted = Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
    return [ALL_TAG, ...sorted];
  }, [novels]);

  const filteredNovels =
    activeTag === ALL_TAG
      ? novels
      : novels.filter((novel) =>
          (novel.tags || []).some(
            (tag) => tag.trim().toLowerCase() === activeTag.toLowerCase()
          )
        );

  return (
    <>
      {/* Filter Tabs — pink capsule style */}
      <div className="py-5 mb-8 border-b border-[#f7c6d9]">
        <div className="flex flex-wrap justify-center gap-2.5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#e499b3] ${
                tag === activeTag
                  ? "bg-[#f4a7b9] text-white border-transparent shadow-[0_4px_10px_rgba(244,167,185,0.3)]"
                  : "bg-white text-[#2b1f2d] border-[#f7c6d9] hover:bg-[#ffe3ef] hover:border-[#e499b3]/60"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Novel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNovels.map((novel) => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </>
  );
}
