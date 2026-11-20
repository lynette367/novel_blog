import { defineType, defineField } from "sanity";

export const EDITORIAL_IMAGE_CATEGORIES = [
  { title: "Lore & Cultural Analysis", value: "lore" },
  { title: "BL Recommendations", value: "bl-recs" },
  { title: "Homepage", value: "homepage" },
  { title: "Weekly Quotes", value: "quotes" },
  { title: "General / Shared", value: "general" },
] as const;

export type EditorialImageCategory =
  (typeof EDITORIAL_IMAGE_CATEGORIES)[number]["value"];

const CATEGORY_TITLE_MAP: Record<string, string> = Object.fromEntries(
  EDITORIAL_IMAGE_CATEGORIES.map((c) => [c.value, c.title])
);

export const editorialImage = defineType({
  name: "editorialImage",
  title: "Editorial Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Image Name",
      type: "string",
      description:
        "Clear descriptive name for Studio search (e.g., TGCF Xie Lian Red Umbrella).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "key",
      title: "Reference Key (Slug)",
      type: "slug",
      description:
        "Stable identifier referenced by frontend page.tsx files (e.g., tgcf-xie-lian-merit). Do not rename once referenced in code; to swap the visual, replace the Image field directly.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Default Alt Text",
      type: "string",
      description:
        "Default accessibility & SEO alt text (can be overridden in page code when needed).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Primary folder in Studio. Only used for organization; any page can reuse this image by key.",
      initialValue: "general",
      options: {
        list: EDITORIAL_IMAGE_CATEGORIES.map((c) => ({
          title: c.title,
          value: c.value,
        })),
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Cross-category search tags (lowercase, hyphenated, 2-5 tags). Examples — Work/Character: tgcf, xie-lian, hua-cheng, 188-boy-group, priest, song-yuzhang, wo-hing-society, yue-xia-sang · Theme: xianxia, chinese-mythology, hong-kong-noir, republic-era, sci-fi, reincarnation, devotion, found-family · Visual/Layout: hero, wide, portrait, og, mood, symbol, diagram.",
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "caption",
      title: "Default Caption (Optional)",
      type: "string",
      description:
        "Optional default figure caption used by <LoreFigure> or article illustrations.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      key: "key.current",
      category: "category",
      tags: "tags",
      media: "image",
    },
    prepare({ title, key, category, tags, media }) {
      const catLabel = (category && CATEGORY_TITLE_MAP[category]) || category || "Uncategorized";
      const tagList = Array.isArray(tags)
        ? tags
            .slice(0, 3)
            .map((t: string) => `#${t}`)
            .join(" ")
        : "";
      const parts = [catLabel, key, tagList].filter(Boolean);
      return {
        title: title || "Untitled Image",
        subtitle: parts.join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Updated (Newest first)",
      name: "updatedAtDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
    {
      title: "Image Name (A-Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Category (A-Z)",
      name: "categoryAsc",
      by: [
        { field: "category", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
