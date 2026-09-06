import { cache } from "react";
import { client } from "@/src/sanity/client";
import type {
  ReviewingNovelWithChapters,
  ReviewingNovelsResult,
  RawNovelResult,
} from "../types";
import { transformReviewingNovel } from "../transform";
import { getLatestPolishedChaptersForNovel } from "./homepage";

type RawNovelItem = RawNovelResult & { lastChapterUpdatedAt?: string };

// 获取所有 currentlyReviewing 书（排除 heroSlug），
// 前 displayLimit 本各附 ≤6 个精修章节，超出部分作为 overflow 文字链接。
export const getReviewingNovelsWithChapters = cache(
  async (heroSlug: string, displayLimit = 2): Promise<ReviewingNovelsResult> => {
    const query = `*[_type == "novel" && currentlyReviewing == true && slug.current != $heroSlug] {
      _id,
      title,
      "slug": slug.current,
      "excerpt": coalesce(seo.metaDescription, excerpt),
      description,
      coverImage,
      tags,
      reviewedUpToChapter,
      totalChapters,
      "latestPolishedChapterNumber": *[_type == "chapter" && references(^._id) && isPolished == true] | order(number desc)[0].number,
      "maxChapterNumber": *[_type == "chapter" && references(^._id)] | order(number desc)[0].number,
      "totalChapterCount": count(*[_type == "chapter" && references(^._id)]),
      "lastChapterUpdatedAt": *[_type == "chapter" && references(^._id) && isPolished == true] | order(_updatedAt desc)[0]._updatedAt
    }`;

    try {
      let novels = await client.fetch<RawNovelItem[]>(query, { heroSlug });
      if (!novels || novels.length === 0) return { sections: [], overflow: [] };

      // 按最近精修章节时间降序排序（无精修章节的排最后）
      novels = novels.sort((a, b) => {
        const ta = a.lastChapterUpdatedAt ? new Date(a.lastChapterUpdatedAt).getTime() : 0;
        const tb = b.lastChapterUpdatedAt ? new Date(b.lastChapterUpdatedAt).getTime() : 0;
        return tb - ta;
      });

      const sectionNovels = novels.slice(0, displayLimit);
      const overflowNovels = novels.slice(displayLimit);

      const sections = await Promise.all(
        sectionNovels.map(async (raw): Promise<ReviewingNovelWithChapters> => {
          const novel = transformReviewingNovel(raw);
          const chapters = await getLatestPolishedChaptersForNovel(novel.slug, 6);
          return { novel, chapters };
        })
      );

      const overflow = overflowNovels.map((n) => ({ title: n.title, slug: n.slug }));
      return { sections, overflow };
    } catch (error) {
      console.error("Failed to fetch reviewing novels with chapters:", error);
      return { sections: [], overflow: [] };
    }
  }
);
