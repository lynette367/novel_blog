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
      description: "勾选代表此小说为当前主打精修校对的小说，将展示在首页 Hero 区块",
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




