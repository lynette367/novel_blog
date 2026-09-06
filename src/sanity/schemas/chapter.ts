import { defineType, defineField } from "sanity";
import { WordCountInput } from "../components/WordCountInput";

export const chapter = defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    defineField({
      name: "novel",
      title: "Belongs to Novel",
      type: "reference",
      to: [{ type: "novel" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number",
      title: "Chapter Number",
      type: "number",
      description: "Chapter number corresponding to frontend URL, e.g. /chapters/2",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "title",
      title: "Chapter Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Chapter Content",
      type: "text",
      rows: 20,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wordCount",
      title: "Word Count",
      type: "number",
      readOnly: true,
      description: "Automatically calculated from chapter content (Read-only)",
      components: {
        input: WordCountInput,
      },
    }),
    defineField({
      name: "locked",
      title: "🔒 Lock Chapter (Proofreading in progress)",
      type: "boolean",
      description: "When enabled, this chapter is temporarily hidden from readers on the frontend",
      initialValue: false,
    }),
    defineField({
      name: "isPolished",
      title: "✨ Human Proofed",
      type: "boolean",
      description: "Check if this chapter has been manually polished and proofread",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
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
      number: "number",
      novelTitle: "novel.title",
      locked: "locked",
      isPolished: "isPolished",
      content: "content",
    },
    prepare({ title, number, novelTitle, locked, isPolished, content }) {
      const lockIcon = locked ? "🔒 " : "";
      const polishIcon = isPolished ? "✨ " : "";
      const prefix = `${lockIcon}${polishIcon}`;
      const words = typeof content === "string" ? content.trim().split(/\s+/).filter(Boolean).length : 0;
      const countText = words > 0 ? ` · ${words.toLocaleString()} words` : "";
      return {
        title: number != null ? `${prefix}Chapter ${number}: ${title || "Untitled"}` : `${prefix}${title || "Untitled"}`,
        subtitle: `${novelTitle ? `《${novelTitle}》` : ""}${countText}`,
      };
    },
  },
  orderings: [
    {
      title: "Chapter Number",
      name: "numberAsc",
      by: [{ field: "number", direction: "asc" }],
    },
  ],
});
