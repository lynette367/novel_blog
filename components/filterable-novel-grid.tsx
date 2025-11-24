"use client";

import { useMemo, useState } from "react";
import type { Novel } from "@/lib/novels";
import { NovelCard } from "./novel-card";

type Props = {
  novels: Novel[];
};

const DEFAULT_CATEGORY = "ALL";
const BASE_CATEGORIES = ["ALL", "BL", "ROMANCE"];

export function FilterableNovelGrid({ novels }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_CATEGORY);

  const categories = useMemo(() => {
    const unique = novels
      .map((novel) => novel.category)
      .filter((category) => !BASE_CATEGORIES.includes(category));
    return [...BASE_CATEGORIES, ...unique];
  }, [novels]);

  const filteredNovels = activeCategory === DEFAULT_CATEGORY
    ? novels
    : novels.filter((novel) => novel.category === activeCategory);

  return (
    <>
      <div className="category-filter">
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-tab${category === activeCategory ? " active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
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
