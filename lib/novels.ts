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
const PUBLIC_NOVELS_DIR = path.join(process.cwd(), "public", "novels");

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

function extractChapterSection(html: string): string | null {
  const match = html.match(/<section[^>]*class="[^"]*chapter-section[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  return match ? match[0] : null;
}

function normalizeChapterLinks(html: string, slug: string): string {
  return html
    .replace(/href=(['"])chapter/gi, (_match, quote: string) => `href=${quote}/novels/${slug}/chapter`)
    .replace(/href=(['"])\.\.\/\.\.\/novels\.html\1/gi, (_match, quote: string) => `href=${quote}/novels${quote}`);
}

export async function getNovelChapterContent(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(PUBLIC_NOVELS_DIR, slug, "index.html");
    const html = await fs.readFile(filePath, "utf-8");
    const section = extractChapterSection(html);
    if (!section) {
      return null;
    }
    return normalizeChapterLinks(section, slug);
  } catch (error) {
    console.warn(`Unable to load chapter section for ${slug}`, error);
    return null;
  }
}
