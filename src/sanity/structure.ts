import type { StructureBuilder } from "sanity/structure";

// Custom Sanity Studio Structure
// Groups chapters under their corresponding novel
export const structure = (S: StructureBuilder) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      // Novel Management - with nested chapters
      S.listItem()
        .id("novels")
        .title("Novels")
        .icon(() => "📚")
        .child(
          S.documentTypeList("novel")
            .id("novel-list")
            .title("All Novels")
            .child((novelId) =>
              S.list()
                .id(`novel-${novelId}`)
                .title("Novel Details")
                .items([
                  // Novel Information
                  S.listItem()
                    .id(`novel-info-${novelId}`)
                    .title("Novel Info")
                    .icon(() => "📖")
                    .child(
                      S.document()
                        .schemaType("novel")
                        .documentId(novelId)
                    ),
                  // Chapters under this novel
                  S.listItem()
                    .id(`chapters-${novelId}`)
                    .title("Chapter List")
                    .icon(() => "📝")
                    .child(
                      S.documentList()
                        .id(`chapter-list-${novelId}`)
                        .title("Chapters")
                        .schemaType("chapter")
                        .filter('_type == "chapter" && novel._ref == $novelId')
                        .params({ novelId })
                        .defaultOrdering([{ field: "number", direction: "asc" }])
                    ),
                  // Add New Chapter
                  S.listItem()
                    .id(`add-chapter-${novelId}`)
                    .title("Add New Chapter")
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
