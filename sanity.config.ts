import { defineConfig, type Template } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

// 初始值模板 - 用于创建关联到特定小说的章节
const initialValueTemplates: Template[] = [
  {
    id: "chapter-for-novel",
    title: "新章节",
    schemaType: "chapter",
    parameters: [{ name: "novelId", type: "string" }],
    value: (params: { novelId: string }) => ({
      novel: { _type: "reference", _ref: params.novelId },
    }),
  },
];

export default defineConfig({
  projectId: "lke4t7vu",
  dataset: "production",
  basePath: "/studio",
  title: "小说管理后台",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev, ...initialValueTemplates],
  },
});
