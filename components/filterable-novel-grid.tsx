"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { Novel } from "@/lib/novels";

type Props = {
  novels: Novel[];
  initialTag?: string;
};

const ALL_TAG = "ALL";

export function FilterableNovelGrid({ novels, initialTag = ALL_TAG }: Props) {
  const tags = getAllTags(novels);
  const [activeTag, setActiveTag] = useState<string>(initialTag);

  useEffect(() => {
    // Read category or tag from query params in client
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get("tag") || params.get("category");
    if (tagParam) {
      const match = tags.find((t) => t.toLowerCase() === tagParam.trim().toLowerCase());
      if (match) {
        setActiveTag(match);
      }
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tag") || p.get("category");
      if (t) {
        const match = tags.find((item) => item.toLowerCase() === t.trim().toLowerCase());
        setActiveTag(match || ALL_TAG);
      } else {
        setActiveTag(ALL_TAG);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tags]);

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTag(tag);

    const url = new URL(window.location.href);
    if (tag === ALL_TAG) {
      url.searchParams.delete("tag");
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("tag", tag);
      url.searchParams.delete("category");
    }
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));
  };

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
      {/* Filter Tabs — client-side filtering with crawlable fallback URLs */}
      <div className="py-5 mb-8 border-b border-[#f7c6d9]">
        <div className="flex flex-wrap justify-center gap-2.5">
          {tags.map((tag) => {
            const isActive = tag.toLowerCase() === activeTag.toLowerCase();
            const href = (tag === ALL_TAG ? "/novels" : `/novels?tag=${encodeURIComponent(tag)}`) as Route;
            return (
              <a
                key={tag}
                href={href}
                onClick={(e) => handleTagClick(tag, e)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#f4a7b9] cursor-pointer ${
                  isActive
                    ? "bg-[#f4a7b9] text-white border-transparent shadow-[0_4px_10px_rgba(244,167,185,0.3)]"
                    : "bg-white text-[#2b1f2d] border-[#f7c6d9] hover:bg-[#ffe3ef] hover:border-[#f4a7b9]/60"
                }`}
              >
                {tag}
              </a>
            );
          })}
        </div>
      </div>

      {/* Novel List */}
      <div className="flex flex-col divide-y divide-[#f0e6d2]">
        {filteredNovels.length > 0 ? (
          filteredNovels.map((novel) => (
            <NovelListItem key={novel.slug} novel={novel} />
          ))
        ) : (
          <p className="text-center text-[#7d6f67] py-12">
            No novels found in this category.
          </p>
        )}
      </div>
    </>
  );
}

function getAllTags(novels: Novel[]): string[] {
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
}

function NovelListItem({ novel }: { novel: Novel }) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      prefetch={false}
      className="group flex gap-5 py-5 first:pt-0 last:pb-0 transition-colors duration-200 no-underline text-inherit hover:bg-[#faf6ee] -mx-3 px-3 rounded-md"
    >
      <div
        className="w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-md bg-cover bg-center bg-[#f5f0e8]"
        style={{ backgroundImage: `url('${novel.coverImage}')` }}
        aria-label={`Cover image for ${novel.title} - English Translation`}
        title={`Read ${novel.title} English Translation`}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2c3e50] leading-snug group-hover:text-[#8b7355] transition-colors">
            {novel.title}
          </h3>
          {novel.tags && novel.tags.length > 0 && (
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#8b7355] bg-[#f5f0e8] rounded-full px-2.5 py-1 whitespace-nowrap">
              {novel.tags[0]}
            </span>
          )}
        </div>

        <p className="text-sm text-[#5d5d5d] mt-1.5 line-clamp-2 leading-relaxed">
          {novel.excerpt}
        </p>

        {novel.tags && novel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {novel.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f0e8] text-[#8b7355] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-2.5 sm:mt-auto sm:pt-2 text-sm font-semibold text-[#8b7355] group-hover:text-[#6d5d4b] transition-colors">
          Read →
        </span>
      </div>
    </Link>
  );
}
