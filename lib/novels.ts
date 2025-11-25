import { client } from "@/src/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Sanity 图片 URL 构建器
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type Novel = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  path: string;
  totalChapters?: number;
  description?: string;
};

export type ChapterInfo = {
  _id: string;
  number: number;
  title: string;
  slug: string;
};

// Sanity 返回的原始小说类型
type SanityNovel = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  description?: string;
  coverImage?: SanityImageSource;
  totalChapters?: number;
};

// Sanity 返回的原始章节类型
type SanityChapter = {
  _id: string;
  number: number;
  title: string;
  content: string;
};

// 将 Sanity 小说数据转换为前端格式
function transformNovel(sanityNovel: SanityNovel): Novel {
  const slug = sanityNovel.slug?.current || "";
  return {
    _id: sanityNovel._id,
    title: sanityNovel.title,
    slug,
    category: sanityNovel.category || "OTHER",
    excerpt: sanityNovel.excerpt || "",
    coverImage: sanityNovel.coverImage
      ? urlFor(sanityNovel.coverImage).width(600).height(800).url()
      : "/assets/images/0.jpg",
    path: `/novels/${slug}`,
    totalChapters: sanityNovel.totalChapters || 0,
    description: sanityNovel.description || sanityNovel.excerpt || "",
  };
}

// 获取所有小说
export async function getNovels(): Promise<Novel[]> {
  const query = `*[_type == "novel"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    description,
    coverImage,
    totalChapters
  }`;

  try {
    const novels = await client.fetch<SanityNovel[]>(query, {}, { next: { revalidate: 60 } });
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch novels from Sanity:", error);
    return [];
  }
}

// 获取特色小说（首页展示）
export async function getFeaturedNovels(limit = 3): Promise<Novel[]> {
  const query = `*[_type == "novel"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    category,
    excerpt,
    description,
    coverImage,
    totalChapters
  }`;

  try {
    const novels = await client.fetch<SanityNovel[]>(query, {}, { next: { revalidate: 60 } });
    return novels.map(transformNovel);
  } catch (error) {
    console.error("Failed to fetch featured novels from Sanity:", error);
    return [];
  }
}

// 根据 slug 获取单个小说
export async function getNovelBySlug(slug: string): Promise<Novel | undefined> {
  const query = `*[_type == "novel" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    description,
    coverImage,
    totalChapters
  }`;

  try {
    const novel = await client.fetch<SanityNovel | null>(
      query,
      { slug },
      { next: { revalidate: 60 } }
    );
    return novel ? transformNovel(novel) : undefined;
  } catch (error) {
    console.error(`Failed to fetch novel ${slug} from Sanity:`, error);
    return undefined;
  }
}

// 获取小说的所有章节列表
export async function getNovelChapters(slug: string): Promise<ChapterInfo[]> {
  const query = `*[_type == "chapter" && novel->slug.current == $slug] | order(number asc) {
    _id,
    number,
    title
  }`;

  try {
    const chapters = await client.fetch<SanityChapter[]>(
      query,
      { slug },
      { next: { revalidate: 60 } }
    );
    return chapters.map((ch) => ({
      _id: ch._id,
      number: ch.number,
      title: ch.title,
      slug: ch.number.toString(),
    }));
  } catch (error) {
    console.error(`Failed to fetch chapters for ${slug} from Sanity:`, error);
    return [];
  }
}

// 获取章节内容
export async function getChapterContent(
  slug: string,
  chapterNumber: number
): Promise<{ title: string; content: string; chapterNumber: number } | null> {
  const query = `*[_type == "chapter" && novel->slug.current == $slug && number == $chapterNumber][0] {
    title,
    content,
    number
  }`;

  try {
    const chapter = await client.fetch<SanityChapter | null>(
      query,
      { slug, chapterNumber },
      { next: { revalidate: 60 } }
    );

    if (!chapter) {
      return null;
    }

    // 将纯文本内容转换为 HTML 段落
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
    };
  } catch (error) {
    console.error(`Failed to fetch chapter ${chapterNumber} for ${slug} from Sanity:`, error);
    return null;
  }
}
