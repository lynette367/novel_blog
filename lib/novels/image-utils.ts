import { client } from "@/src/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// 封面缩略图：用于卡片列表，600px 宽，WebP，质量 80
export function coverThumbUrl(source: SanityImageSource): string {
  if (typeof source === "string" && (source.startsWith("http") || source.startsWith("/"))) {
    return source;
  }
  return builder.image(source).width(600).format("webp").quality(80).url();
}

// OG 图片：用于 Open Graph，1200px 宽
export function ogImageUrl(source: SanityImageSource): string {
  if (typeof source === "string" && (source.startsWith("http") || source.startsWith("/"))) {
    return source;
  }
  return builder.image(source).width(1200).format("webp").quality(85).url();
}

// 文章插图：用于章节正文，最大宽度 900px
export function illustrationUrl(source: SanityImageSource): string {
  return builder.image(source).width(900).format("webp").quality(85).url();
}

// 阅读速度：英文译文按 220 词/分钟估算，可根据实际读者数据调整
const WORDS_PER_MINUTE = 220;

export function minutesFromWordCount(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
