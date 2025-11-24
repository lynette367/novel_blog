import { promises as fs } from "fs";
import path from "path";

export type Novel = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  path: string;
  totalChapters?: number;
  description?: string;
};

type NovelDataFile = {
  novels: Novel[];
};

const DATA_PATH = path.join(process.cwd(), "data", "novels.json");

async function readNovelsFile(): Promise<NovelDataFile> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(file) as NovelDataFile;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { novels: [] };
    }
    console.error("Unable to read novels.json", error);
    return { novels: [] };
  }
}

export async function getNovels(): Promise<Novel[]> {
  const data = await readNovelsFile();
  return data.novels ?? [];
}

export async function getFeaturedNovels(limit = 3): Promise<Novel[]> {
  const novels = await getNovels();
  return novels.slice(0, limit);
}

export async function getNovelBySlug(slug: string): Promise<Novel | undefined> {
  const novels = await getNovels();
  return novels.find((novel) => novel.slug === slug);
}


export type ChapterInfo = {
  number: number;
  title: string;
  slug: string;
};

export async function getNovelChapters(slug: string): Promise<ChapterInfo[]> {
  try {
    const chaptersJsonPath = path.join(process.cwd(), "data", "novels", slug, "chapters.json");
    const jsonData = await fs.readFile(chaptersJsonPath, "utf-8");
    const data = JSON.parse(jsonData);
    if (data.chapters && Array.isArray(data.chapters)) {
      return data.chapters.map((ch: { number: number; title: string }) => ({
        number: ch.number,
        title: ch.title,
        slug: ch.number.toString(),
      }));
    }
    return [];
  } catch (error) {
    console.warn(`Unable to load chapters for ${slug}`, error);
    return [];
  }
}

export async function getChapterContent(
  slug: string,
  chapterNumber: number
): Promise<{ title: string; content: string; chapterNumber: number } | null> {
  try {
    const chaptersJsonPath = path.join(process.cwd(), "data", "novels", slug, "chapters.json");
    const jsonData = await fs.readFile(chaptersJsonPath, "utf-8");
    const data = JSON.parse(jsonData);
    if (data.chapters && Array.isArray(data.chapters)) {
      const chapter = data.chapters.find(
        (ch: { number: number }) => ch.number === chapterNumber
      );
      if (chapter) {
        // Format content as HTML paragraphs
        const paragraphs = chapter.content
          .split('\n')
          .map((para: string) => para.trim())
          .filter((para: string) => para)
          .map((para: string) => `<p>${para}</p>`)
          .join('\n');

        return {
          title: chapter.title,
          content: paragraphs,
          chapterNumber: chapter.number,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn(`Unable to load chapter ${chapterNumber} for ${slug}`, error);
    return null;
  }
}
