import { defineType, defineField } from "sanity";

export const weeklyQuote = defineType({
  name: "weeklyQuote",
  title: "Weekly Quote",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / Emotional Hook",
      type: "string",
      description: "Page title / Core emotional description used for H1 (e.g. He Had Always Thought That Losing Someone Was The Same As Being Left Behind)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL slug generated from title",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Custom Title (手动定制谷歌搜索标题)",
      type: "string",
      description:
        "专门应对长书名！允许译者自己挑选2-3个核心词或缩写（例如：Sickly Friend Ch 5 Quote）。若不填则由前端代码自动截断。",
    }),
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      rows: 4,
      description: "The core quote text to display prominently",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "novelTitle",
      title: "Novel Title",
      type: "string",
      description: "Name of the novel (e.g. Big Brother)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "chapter",
      title: "Chapter",
      type: "string",
      description: "Corresponding chapter identifier (e.g. Chapter 12)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "insight",
      title: "Translator Insight / Notes",
      type: "text",
      rows: 3,
      description: "1-2 sentences of translator reflection / commentary highlighting the nuances of human translation",
    }),
    defineField({
      name: "targetChapterUrl",
      title: "Target Chapter URL",
      type: "string",
      description: "Internal reading route when clicking 'Read the chapter ->' (e.g. /novels/big_brother/chapters/12)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      novelTitle: "novelTitle",
      chapter: "chapter",
      publishedAt: "publishedAt",
    },
    prepare({ title, novelTitle, chapter, publishedAt }) {
      const dateStr = publishedAt ? new Date(publishedAt).toLocaleDateString() : "";
      return {
        title: title || "Untitled Quote",
        subtitle: `${novelTitle || ""} (${chapter || ""}) · ${dateStr}`,
      };
    },
  },
  orderings: [
    {
      title: "Published Date (Newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
