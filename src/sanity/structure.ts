import type { StructureBuilder } from "sanity/structure";

// 自定义 Sanity Studio 结构
// 让章节显示在对应小说目录下
export const structure = (S: StructureBuilder) =>
  S.list()
    .id("root")
    .title("内容管理")
    .items([
      // 小说管理 - 包含嵌套的章节
      S.listItem()
        .id("novels")
        .title("小说管理")
        .icon(() => "📚")
        .child(
          S.documentTypeList("novel")
            .id("novel-list")
            .title("所有小说")
            .child((novelId) =>
              S.list()
                .id(`novel-${novelId}`)
                .title("小说详情")
                .items([
                  // 编辑小说信息
                  S.listItem()
                    .id(`novel-info-${novelId}`)
                    .title("小说信息")
                    .icon(() => "📖")
                    .child(
                      S.document()
                        .schemaType("novel")
                        .documentId(novelId)
                    ),
                  // 该小说的所有章节
                  S.listItem()
                    .id(`chapters-${novelId}`)
                    .title("章节列表")
                    .icon(() => "📝")
                    .child(
                      S.documentList()
                        .id(`chapter-list-${novelId}`)
                        .title("章节")
                        .schemaType("chapter")
                        .filter('_type == "chapter" && novel._ref == $novelId')
                        .params({ novelId })
                        .defaultOrdering([{ field: "number", direction: "asc" }])
                    ),
                  // 添加新章节
                  S.listItem()
                    .id(`add-chapter-${novelId}`)
                    .title("添加新章节")
                    .icon(() => "➕")
                    .child(
                      S.document()
                        .id(`new-chapter-${novelId}`)
                        .schemaType("chapter")
                        .initialValueTemplate("chapter-for-novel", { novelId })
                    ),
                ])
            )
        ),
    ]);
