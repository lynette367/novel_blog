import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/src/sanity/client";
import { urlFor } from "@/lib/novels/image-utils";
import type { EditorialImageCategory } from "@/src/sanity/schemas/editorialImage";

export type EditorialImage = {
  key: string;
  title: string;
  alt: string;
  caption?: string;
  category: EditorialImageCategory | string;
  tags: string[];
  url: string;
  thumbUrl: string;
  ogUrl: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
};

type RawEditorialImage = {
  key?: string;
  title?: string;
  alt?: string;
  caption?: string;
  category?: string;
  tags?: string[];
  image?: SanityImageSource;
  dimensions?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  };
};

const EDITORIAL_IMAGES_QUERY = `*[_type == "editorialImage" && defined(key.current) && defined(image.asset)] | order(_updatedAt desc) {
  "key": key.current,
  title,
  alt,
  caption,
  category,
  tags,
  image,
  "dimensions": image.asset->metadata.dimensions {
    width,
    height,
    aspectRatio
  }
}`;

function transformEditorialImage(raw: RawEditorialImage): EditorialImage | null {
  const key = raw.key?.trim();
  if (!key || !raw.image) return null;

  return {
    key,
    title: raw.title?.trim() || key,
    alt: raw.alt?.trim() || raw.title?.trim() || key,
    caption: raw.caption?.trim() || undefined,
    category: raw.category || "general",
    tags: (raw.tags || []).map((tag) => tag.trim()).filter(Boolean),
    url: urlFor(raw.image).width(1200).format("webp").quality(85).url(),
    thumbUrl: urlFor(raw.image).width(600).format("webp").quality(80).url(),
    ogUrl: urlFor(raw.image)
      .width(1200)
      .height(630)
      .fit("crop")
      .format("webp")
      .quality(85)
      .url(),
    width: raw.dimensions?.width,
    height: raw.dimensions?.height,
    aspectRatio: raw.dimensions?.aspectRatio,
  };
}

export const getAllEditorialImages = cache(
  async (): Promise<EditorialImage[]> => {
    try {
      const results = await client.fetch<RawEditorialImage[]>(
        EDITORIAL_IMAGES_QUERY
      );
      return results
        .map(transformEditorialImage)
        .filter((img): img is EditorialImage => img !== null);
    } catch (error) {
      console.error("Failed to fetch editorial images from Sanity:", error);
      return [];
    }
  }
);

export const getEditorialImage = cache(
  async (key: string): Promise<EditorialImage | null> => {
    const normalized = key.trim().toLowerCase();
    if (!normalized) return null;
    const all = await getAllEditorialImages();
    return all.find((img) => img.key.toLowerCase() === normalized) ?? null;
  }
);

export async function getEditorialImages(
  keys: string[]
): Promise<Record<string, EditorialImage>> {
  const normalizedKeys = new Set(
    keys.map((k) => k.trim().toLowerCase()).filter(Boolean)
  );
  if (normalizedKeys.size === 0) return {};

  const all = await getAllEditorialImages();
  const map: Record<string, EditorialImage> = {};
  for (const img of all) {
    if (normalizedKeys.has(img.key.toLowerCase())) {
      map[img.key] = img;
    }
  }
  return map;
}

export async function getEditorialImagesByFilter(filter: {
  category?: EditorialImageCategory | string;
  tag?: string;
}): Promise<EditorialImage[]> {
  const all = await getAllEditorialImages();
  const normalizedCategory = filter.category?.trim().toLowerCase();
  const normalizedTag = filter.tag?.trim().toLowerCase();

  return all.filter((img) => {
    if (
      normalizedCategory &&
      img.category.toLowerCase() !== normalizedCategory
    ) {
      return false;
    }
    if (
      normalizedTag &&
      !img.tags.some((t) => t.toLowerCase() === normalizedTag)
    ) {
      return false;
    }
    return true;
  });
}
