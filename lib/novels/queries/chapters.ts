import { cache } from "react";
import { client } from "@/src/sanity/client";
import type { ChapterInfo, ChapterContent, SanityChapter, SanityChapterFull } from "../types";
import { ogImageUrl, minutesFromWordCount } from "../image-utils";

// 获取小说的所有章节列表（含字数 / 阅读时长 / 精修状态 / Patreon 状态）
export const getNovelChapters = cache(async (slug: string): Promise<ChapterInfo[]> => {
  const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
    _id,
    number,
    title,
    "excerpt": coalesce(seo.metaDescription, excerpt),
    locked,
    isPolished,
    patreonPublished,
    patreonUrl,
    "wordCount": count(string::split(content, " "))
  }`;

  try {
    const chapters = await client.fetch<SanityChapter[]>(query, { slug });
    return chapters.map((ch) => ({
      _id: ch._id,
      number: ch.number,
      title: ch.title,
      slug: ch.number.toString(),
      excerpt: ch.excerpt || undefined,
      wordCount: ch.wordCount,
      readingMinutes: minutesFromWordCount(ch.wordCount),
      locked: ch.locked || false,
      isPolished: ch.isPolished || false,
      patreonPublished: ch.patreonPublished || false,
      patreonUrl: ch.patreonUrl || undefined,
    }));
  } catch (error) {
    console.error(`Failed to fetch chapters for ${slug} from Sanity:`, error);
    return [];
  }
});

// 获取章节内容（含 SEO 字段 + 字数 / 预估阅读时长）
export const getChapterContent = cache(async (
  slug: string,
  chapterNumber: number
): Promise<ChapterContent | null> => {
  const query = `*[_type == "chapter" && novel->slug.current == $slug && number == $chapterNumber && locked != true][0] {
    title,
    content,
    number,
    "wordCount": count(string::split(content, " ")),
    "ogImageUrl": seo.ogImage.asset->url,
    seo {
      metaTitle,
      metaDescription,
      noIndex,
      ogImage
    }
  }`;

  try {
    const chapter = await client.fetch<SanityChapterFull | null>(query, {
      slug,
      chapterNumber,
    });
    if (!chapter) return null;

    const paragraphs = chapter.content
      .split("\n")
      .map((para: string) => para.trim())
      .filter((para: string) => para)
      .map((para: string) => `<p>${para}</p>`)
      .join("\n");

    return {
      title: chapter.title,
      content: paragraphs,
      chapterNumber: chapter.number,
      wordCount: chapter.wordCount,
      readingMinutes: minutesFromWordCount(chapter.wordCount),
      ogImageUrl: chapter.ogImageUrl || undefined,
      seo: chapter.seo
        ? {
            metaTitle: chapter.seo.metaTitle,
            metaDescription: chapter.seo.metaDescription,
            noIndex: chapter.seo.noIndex,
            ogImage: chapter.seo.ogImage
              ? ogImageUrl(chapter.seo.ogImage)
              : undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error(
      `Failed to fetch chapter ${chapterNumber} for ${slug} from Sanity:`,
      error
    );
    return null;
  }
});
