import { defineType, defineField } from "sanity";

export const chapter = defineType({
  name: "chapter",
  title: "章节",
  type: "document",
  fields: [
    defineField({
      name: "novel",
      title: "所属小说",
      type: "reference",
      to: [{ type: "novel" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number",
      title: "章节编号",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "title",
      title: "章节标题",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "章节内容",
      type: "text",
      rows: 20,
      validation: (Rule) => Rule.required(),
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
      number: "number",
      novelTitle: "novel.title",
    },
    prepare({ title, number, novelTitle }) {
      return {
        title: `第 ${number} 章: ${title || "未命名"}`,
        subtitle: novelTitle ? `《${novelTitle}》` : "",
      };
    },
  },
  orderings: [
    {
      title: "章节编号",
      name: "numberAsc",
      by: [{ field: "number", direction: "asc" }],
    },
  ],
});



