import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO Settings",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Search result title (50-60 chars recommended). Falls back to novel/chapter title.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description(Excerpt)",
      type: "text",
      rows: 3,
      description: "Search result snippet (120-160 chars recommended). Also used as the excerpt.",
      validation: (rule) => rule.max(160),
    }),

    defineField({
      name: "noIndex",
      title: "Hide from Search Engines (noindex)",
      type: "boolean",
      description: "Check to prevent search engines from indexing this page.",
      initialValue: false,
    }),
  ],
});
