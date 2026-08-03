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
      description: "章节编号对应前台 URL，如 /chapters/2",
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
      name: "excerpt",
      title: "章节摘要",
      type: "text",
      rows: 3,
      description: "显示在章节列表和首页 Hero 中的精简摘录",
    }),
    defineField({
      name: "locked",
      title: "🔒 锁定章节 (校对中)",
      type: "boolean",
      description: "开启后前台暂不对读者公开",
      initialValue: false,
    }),
    defineField({
      name: "isPolished",
      title: "✨ 人工精修 (Human Proofed)",
      type: "boolean",
      description: "勾选代表此章节已经过人工精修润色",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO 设置",
      type: "seo",
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
      locked: "locked",
      isPolished: "isPolished",
    },
    prepare({ title, number, novelTitle, locked, isPolished }) {
      const lockIcon = locked ? "🔒 " : "";
      const polishIcon = isPolished ? "✨ " : "";
      const prefix = `${lockIcon}${polishIcon}`;
      return {
        title: number != null ? `${prefix}Chapter ${number}: ${title || "未命名"}` : `${prefix}${title || "未命名"}`,
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
