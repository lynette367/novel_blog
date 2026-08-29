"use client";

import { useState } from "react";

type Props = {
  paragraphs: string[];
  excerpt?: string;
};

export function NovelDescription({ paragraphs, excerpt }: Props) {
  const [expanded, setExpanded] = useState(false);

  const hasContent = paragraphs.length > 0;
  const content = hasContent ? paragraphs : excerpt ? [excerpt] : [];

  // We'll always show the first 2 paragraphs; collapse the rest
  const visibleContent = expanded ? content : content.slice(0, 2);
  const hasMore = content.length > 2;

  return (
    <div className="text-[#302a2f] text-base leading-relaxed">
      {visibleContent.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 20)}-${index}`} className="mb-2">
          {paragraph}
        </p>
      ))}

      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-semibold text-[#e499b3] hover:text-[#c87f9b] transition-colors cursor-pointer bg-transparent border-none p-0 underline underline-offset-4"
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
}
