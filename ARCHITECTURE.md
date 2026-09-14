# 系统架构与工程规范 (System Architecture & Guidelines)

_最后更新：2026-09-14_

---

## 📐 工程核心原则：精简代码与高度复用 (DRY Principles)

为了保证代码库长期高内聚、低维护成本，在开发与后续重构中**必须严格遵循以下原则**：

1. **避免重复写胶水代码**：
   - 当多个板块具有相同或相似的视觉/交互结构时（例如 Hero 小说章节与普通校对中小说章节），**必须使用通用组件（如 `NovelSection`）并通过可选 Props（如 `showOverview` / `novelSlug`）进行差异控制**，禁止在 `page.tsx` 中重复编写平铺的 `<section>`、`<h2>` 或卡片网格。
2. **统一数据层 (Single Source of Truth)**：
   - 所有 Sanity GROQ 查询逻辑统一收敛于 `lib/novels/queries/`，并用 React `cache()` 封装去重。
   - 前端组件统一声明标准 TS 类型（位于 `lib/novels/types.ts`），不使用 ad-hoc 的临时对象结构。
3. **视觉卡片与样式规范**：
   - 提示框、声明面板统一继承 `components/info-card.tsx`。
   - 章节卡片统一由 `components/latest-polished-grid.tsx`（`NovelChapterGrid`）管理。

---

## 📂 项目结构 (Project Structure)

```
novel_blog/
├── app/                              # Next.js 16 App Router
│   ├── contact/                      # 联系我们页 (/contact)
│   ├── novels/
│   │   ├── page.tsx                  # 小说书库列表页 (/novels)
│   │   └── [slug]/
│   │       ├── page.tsx              # 小说详情页 + 章节目录 (/novels/[slug])
│   │       └── chapters/[chapter]/
│   │           └── page.tsx          # 章节正文阅读页 (/novels/[slug]/chapters/[chapter])
│   ├── weekly-quotes/                # 每周金句独立动态路由 (SEO 友好)
│   │   ├── page.tsx                  # /weekly-quotes (自动重定向到最新一条金句)
│   │   └── [slug]/
│   │       └── page.tsx              # /weekly-quotes/[slug] (SSG 预渲染详情页)
│   ├── studio/                       # 嵌入式 Sanity CMS 管理后台 (/studio)
│   ├── globals.css                   # 全局基础样式
│   ├── layout.tsx                    # 根 Layout（字体 / Meta / 结构化数据）
│   ├── page.tsx                      # 首页（Hero + Latest Chapters + Weekly Quote + 书库 + Reader's Note）
│   ├── robots.ts                     # robots.txt 动态生成
│   └── sitemap.ts                    # sitemap.xml 动态生成
│
├── components/                       # 纯展示 UI 组件库
│   ├── site-header.tsx               # 全站顶部导航栏 (Home / Novels / Quotes / Contact)
│   ├── site-footer.tsx               # 全站底部页脚
│   ├── hero-reviewing-banner.tsx     # 首页 Hero 焦点精修小说卡（全宽粉色渐变容器）
│   ├── hero-announcement-panel.tsx   # 【💌 Reader's Note】读者说明面板 (基于 InfoCard)
│   ├── weekly-quote.tsx              # 【WEEKLY QUOTE】横向 Editorial 排版金句栏
│   ├── novel-section.tsx             # 通用小说板块组件（支持 novelSlug/novel, showOverview 等）
│   ├── latest-polished-grid.tsx      # 章节卡片网格（Patreon 5 Ahead 提前看 + 精修章节 5 列/3 滑滑动）
│   ├── novel-card.tsx                # 书库列表页小说封面卡片
│   ├── filterable-novel-grid.tsx     # 带标签分类筛选的小说网格
│   ├── mtl-banner.tsx                # 章节阅读页上方 MTL 风险提示与 Patreon 引导条
│   ├── patreon-hook-card.tsx         # 人工精修边界处的 Patreon 提前读提示卡
│   └── info-card.tsx                 # 通用莫兰迪/粉棕暖色卡片容器
│
├── lib/novels/                       # 数据访问层与类型定义
│   ├── index.ts                      # 统一对外导出入口
│   ├── types.ts                      # 核心 TypeScript 类型定义
│   ├── image-utils.ts                # Sanity 图片 URL 与 CDN 尺寸转换工具
│   ├── transform.ts                  # Sanity 原始文档清洗转换器
│   └── queries/                      # GROQ 查询模块
│       ├── homepage.ts               # 首页各模块数据查询 (getNovelHomepageChapters 等)
│       ├── novels.ts                 # 小说列表与详情查询
│       ├── chapters.ts               # 章节正文与目录查询
│       ├── reviews.ts                # 校对中多本小说查询
│       └── quotes.ts                 # 每周金句数据查询 (getLatestWeeklyQuote 等)
│
├── src/sanity/                       # Sanity Studio 架构
│   ├── client.ts                     # Sanity 客户端实例
│   ├── schemas/                      # CMS Schema 定义
│   │   ├── novel.ts                  # 小说模型
│   │   ├── chapter.ts                # 章节模型
│   │   ├── weeklyQuote.ts            # 每周金句模型 (含 seoTitle 自动防爆)
│   │   ├── seo.ts                    # SEO 元数据子模型
│   │   └── index.ts                  # Schema 注册中心
│   └── structure.ts                  # Sanity Studio 后台侧边栏菜单结构
│
├── site.config.ts                    # 品牌信息与赞助/社交链接配置
├── sanity.config.ts                  # Sanity 项目配置
└── next.config.ts                    # Next.js 生产与图片域名配置
```

---

## 🖥️ 首页渲染层级架构 (Homepage Hierarchy)

首页在 `app/page.tsx` 中自上而下严格按以下顺序渲染：

```
1. <SiteHeader> (全站导航: Home / Novels / Quotes / Contact)
2. <h1> (SEO 唯一 H1 标识)
3. <HeroReviewingBanner> (Hero 顶部全宽精修小说推荐卡)
4. <NovelSection showOverview={false}> (Hero 小说章节列表：Patreon 5 提前看 + 精修)
5. <WeeklyQuote> (横向 Editorial 金句展示栏，附带 View Insight 链接)
6. <NovelSection showOverview={true}> (其余校对中小说的独立展示板块)
7. [Overflow Novels] (超出展示数量的其他小说文字链接)
8. <HeroAnnouncementPanel> (【💌 Reader's Note】读者说明板块)
9. "Explore the Full Library →" (全书库引流按钮)
10. <SiteFooter> (页脚)
```

---

## ⚡ 性能与 SEO 优化设计

1. **全量 SSG 静态预渲染**：
   - 章节页 `/novels/[slug]/chapters/[chapter]` 与金句页 `/weekly-quotes/[slug]` 全部使用 `generateStaticParams` 配合轻量并发 GROQ 查询预渲染，全站免登录秒开。
2. **智能 SEO 防爆截断与手动定制**：
   - 金句详情页优先读取 Sanity 的 `seoTitle`。
   - 未填写时自动将章节压缩为 `Ch X`，长书名截断为前 22 字符，动态计算剩余字符预算，确保 Title ≤ 60 字符、Description 在 140~150 字符安全线内。
3. **结构化语义与 JSON-LD**：
   - 全站自动注入 `WebSite`、`Book`、`Chapter`、`BreadcrumbList`、`Quotation` 等 Schema.org 结构化标记。

