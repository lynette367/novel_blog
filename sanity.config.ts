import { defineConfig, type Template } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lke4t7vu";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Initial value template - used to create chapters linked to a specific novel
const initialValueTemplates: Template[] = [
  {
    id: "chapter-for-novel",
    title: "New Chapter",
    schemaType: "chapter",
    parameters: [{ name: "novelId", type: "string" }],
    value: (params: { novelId: string }) => ({
      novel: { _type: "reference", _ref: params.novelId },
    }),
  },
];

export default defineConfig({
  projectId,
  dataset,
  basePath: "/studio",
  title: "Novel Management CMS",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev, ...initialValueTemplates],
  },
});
