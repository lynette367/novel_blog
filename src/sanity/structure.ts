import type { StructureBuilder } from "sanity/structure";
import { EDITORIAL_IMAGE_CATEGORIES } from "./schemas/editorialImage";

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
      // Weekly Quote Management
      S.listItem()
        .id("weeklyQuotes")
        .title("Weekly Quotes")
        .icon(() => "💬")
        .child(
          S.documentTypeList("weeklyQuote")
            .id("weekly-quote-list")
            .title("All Weekly Quotes")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      // Editorial Image Assets
      S.listItem()
        .id("editorialImages")
        .title("Editorial Images")
        .icon(() => "🖼️")
        .child(
          S.list()
            .id("editorial-images-root")
            .title("Editorial Image Assets")
            .items([
              S.listItem()
                .id("editorial-images-all")
                .title("All Editorial Images")
                .icon(() => "🗂️")
                .child(
                  S.documentTypeList("editorialImage")
                    .id("editorial-image-all")
                    .title("All Editorial Images")
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                ),
              S.listItem()
                .id("editorial-images-by-category")
                .title("By Category")
                .icon(() => "🏷️")
                .child(
                  S.list()
                    .id("editorial-images-category-list")
                    .title("Editorial Images by Category")
                    .items(
                      EDITORIAL_IMAGE_CATEGORIES.map((cat) =>
                        S.listItem()
                          .id(`editorial-images-cat-${cat.value}`)
                          .title(cat.title)
                          .child(
                            S.documentList()
                              .id(`editorial-image-list-${cat.value}`)
                              .title(cat.title)
                              .schemaType("editorialImage")
                              .filter(
                                '_type == "editorialImage" && category == $category'
                              )
                              .params({ category: cat.value })
                              .defaultOrdering([
                                { field: "_updatedAt", direction: "desc" },
                              ])
                          )
                      )
                    )
                ),
            ])
        ),
    ]);
