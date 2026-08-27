import { defineType, defineField } from "sanity";

export const novel = defineType({
  name: "novel",
  title: "小说",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "标题",
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
      name: 'tags',
      title: 'Tags (NovelUpdates Style)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags', // 输入完回车即生成标签块
      },
    }),
    defineField({
      name: "author",
      title: "作者",
      type: "string",
      initialValue: "Anonymous",
    }),
    defineField({
      name: "description",
      title: "详细描述",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "seo",
      title: "SEO 设置",
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
      title: "🔥 正在精修校对中 (Human TL)",
      type: "boolean",
      description: "勾选后，此小说将在首页拥有独立的板块（书名 + 最新章节列表）。可多本同时勾选。",
      initialValue: false,
    }),

    defineField({
      name: "heroFeatured",
      title: "⭐ Hero 主推（全站唯一）",
      type: "boolean",
      description: "勾选后，此小说将展示在首页最顶部的 Hero 区块。全站只应有一本书勾选此项。（与 currentlyReviewing 解耦：heroFeatured 决定展示位置，currentlyReviewing 决定是否有独立板块）",
      initialValue: false,
    }),

    defineField({
      name: "totalChapters",
      title: "总章节数",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "publishedAt",
      title: "发布日期",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, author } = selection;
      return {
        title,
        subtitle: author || "Anonymous",
        media: selection.media,
      };
    },
  },
});




