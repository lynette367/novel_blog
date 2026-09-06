import { cache } from "react";
import { client } from "@/src/sanity/client";
import type { Novel, SanityNovel } from "../types";
import { transformNovel } from "../transform";

const NOVEL_PROJECTION = `{
  _id,
  title,
  slug,
  "excerpt": coalesce(seo.metaDescription, excerpt),
  description,
  coverImage,
  totalChapters,
  tags,
  seo {
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage
  }
}`;

export const getNovels = cache(async (): Promise<Novel[]> => {
  const query = `*[_type == "novel"] | order(publishedAt desc) ${NOVEL_PROJECTION}`;
  try {
    const novels = await client.fetch<SanityNovel[]>(query);
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch novels from Sanity:", error);
    return [];
  }
});

export const getFeaturedNovels = cache(async (limit = 6): Promise<Novel[]> => {
  const query = `*[_type == "novel"] | order(publishedAt desc)[0...${limit}] ${NOVEL_PROJECTION}`;
  try {
    const novels = await client.fetch<SanityNovel[]>(query);
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch featured novels from Sanity:", error);
    return [];
  }
});

// 根据 slug 获取单个小说（含 SEO 字段 + 全书总字数）
export const getNovelBySlug = cache(async (slug: string): Promise<Novel | undefined> => {
  const query = `*[_type == "novel" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    description,
    coverImage,
    totalChapters,
    tags,
    "totalWordCount": math::sum(
      *[_type == "chapter" && references(^._id) && locked != true]{
        "wordCount": count(string::split(content, " "))
      }.wordCount
    ),
    seo {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage
    }
  }`;
  try {
    const novel = await client.fetch<SanityNovel | null>(query, { slug });
    return novel ? transformNovel(novel) : undefined;
  } catch (error) {
    console.error(`Failed to fetch novel ${slug} from Sanity:`, error);
    return undefined;
  }
});

// 仅用于 generateStaticParams，不含 content 字数计算等重型开销
export const getNovelChapterNumbers = cache(
  async (slug: string): Promise<{ number: number; locked: boolean }[]> => {
    const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
      number,
      "locked": coalesce(locked, false)
    }`;
    try {
      return await client.fetch(query, { slug });
    } catch (error) {
      console.error(`Failed to fetch chapter numbers for ${slug}:`, error);
      return [];
    }
  }
);
