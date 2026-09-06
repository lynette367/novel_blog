import { defineType, defineField } from "sanity";

export const novel = defineType({
  name: "novel",
  title: "Novel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags (NovelUpdates Style)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
    defineField({
      name: "coverImage",
      title: "NovelCover (OG Image)",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "currentlyReviewing",
      title: "🔥 Currently Proofreading (Human TL)",
      type: "boolean",
      description: "When checked, this novel will have a dedicated section on the homepage (title + latest chapters). Multiple novels can be selected.",
      initialValue: false,
    }),

    defineField({
      name: "heroFeatured",
      title: "⭐ Hero Featured (Site Exclusive)",
      type: "boolean",
      description: "When checked, this novel will be featured in the top Hero section of the homepage. Only one novel should be selected site-wide.",
      initialValue: false,
    }),

    defineField({
      name: "totalChapters",
      title: "Total Chapters",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "patreonAheadChapter",
      title: "Patreon Ahead Chapter (Patreon 提前看至第几章)",
      type: "number",
      description: "Patreon 赞助者目前可提前阅读到的最高精修章节编号（用于章节页的 Patreon 引导卡片）",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title,
        media: selection.media,
      };
    },
  },
});




