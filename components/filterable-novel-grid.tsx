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

  // 从所有小说的 tags 里动态收集去重列表，大小写不敏感去重
  // （手动打标签容易出现 "Younger Top" / "younger top" 这种不一致，
  // 归一化后只会生成一个按钮，保留第一次出现时的大小写用于展示）
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
      <div className="category-filter">
        <div className="filter-container">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`filter-tab${tag === activeTag ? " active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="novels-grid">
        {filteredNovels.map((novel) => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </>
  );
}
