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
      name: "excerpt",
      title: "简介摘要",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "详细描述",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "coverImage",
      title: "封面图片",
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
      category: "category",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, author, category } = selection;
      return {
        title,
        subtitle: author ? `${author} · ${category}` : category,
        media: selection.media,
      };
    },
  },
});




