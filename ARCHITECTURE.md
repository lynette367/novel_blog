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
│   ├── bl-recs/                      # BL 小说推荐集群体系 (Topic Clusters)
│   │   ├── page.tsx                  # 集群支柱页 (/bl-recs，主题目录大纲)
│   │   ├── layout.tsx                # 集群共享 Layout
│   │   ├── bl-recs.css               # 集群专属样式（Editorial 排版 / 引导链接）
│   │   └── [cluster-slug]/           # 独立集群详情页 (SSG 预渲染，如 xianxia-danmei-like-tgcf)
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

---

## 📚 BL 推荐集群 (BL Recs Topic Clusters) 开发规范

在 `/app/bl-recs/` 下新增任何集群详情页（Topic Cluster Page）时，**必须严格遵循以下规范与流程**：

### 1. 集群支柱页（`/bl-recs`）目录注册 (Single Source of Truth)
- 新建集群页后，**必须且仅需**在 `lib/bl-recs.ts` 的 `clusters` 列表中注册该条目：
  ```ts
  {
    slug: "xianxia-danmei-like-tgcf",
    title: "3 BL Danmei Novels Like Heaven Official's Blessing (TGCF)",
    summary: "Centuries of devotion, reincarnation, ancient gods, and unwavering bonds: three xianxia danmei novels to explore if you loved TGCF.",
    count: 3,
    tags: ["TGCF", "Xianxia", "Reincarnation", "Fated Love"],
  }
  ```
- **自动同步机制**：`clusters` 是单一事实来源，会自动同步到：
  1. `/bl-recs` 支柱页的目录展示列表。
  2. `/bl-recs` 支柱页的 Schema.org `ItemList` 结构化数据。
  3. `app/sitemap.ts` 网站地图动态路由生成。

### 2. SEO Title & Description 字数红线 (Strict Character Limits)
- **SEO Title**：**严格控制在 50 ~ 60 字符以内**（不得超过 60 字符），防止在搜索引擎结果页（SERP）中被省略号（`...`）截断。
  - 格式范例：`3 BL Danmei Novels Like Heaven Official's Blessing (TGCF) | Cross The Line`
- **Meta Description**：**严格控制在 140 ~ 155 字符以内**（不得超过 160 字符），保证在移动端与桌面端完整展示核心导读与点击吸引点。
- **页面 Meta 配置必备**：
  - `export const dynamic = "force-static";`
  - `alternates: { canonical: absoluteUrl(PATH) }`
  - `openGraph`（类型为 `article`，带站点名与社交分享图）与 `twitter`（`summary_large_image`）。
  - `BreadcrumbList` 与 `ItemList` 的 Schema.org JSON-LD。

### 3. UI 设计与页面结构规范 (Layout & Visual Consistency)
详情页必须保持全站一致的莫兰迪/粉棕暖色视觉与排版层次：
1. **容器规范**：
   - 最外层使用 `<main className="page-shell py-12 sm:py-16">`。
   - 内容主体居中收敛：`<div className="mx-auto max-w-3xl">`。
2. **面包屑导航**：
   - 必须位于顶部：`<nav className="text-sm text-brand-ink/50" aria-label="Breadcrumb">`，格式为 `BL Novel Recs / [短标题]`。
3. **Hero 区域**：
   - 眉标：`<p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">CROSS THE LINE · BL RECS</p>`。
   - 主标题：`h1` 衬线大字（`font-serif text-[#2b1f2d]`）。
   - 导读卡片：使用统一圆角卡片面板（`rounded-3xl border border-card-border bg-card-bg p-6 shadow-[var(--card-shadow)]`）包裹背景介绍。
4. **快捷目录导航 (Table of Contents / Lineup)**：
   - 在正文前必须提供小说列表快速锚点跳转框（如 `#novel-01`），含编号徽章、书名和作者信息。
5. **小说卡片内容体系**：
   - 顶部：圆形编号徽章（`bg-brand-blush`）、`h3` 标题、作者、分类标签 Pills（`border-[#f1c5d2]`）。
   - 导读金句引文栏：左侧粉色竖线提示框（`border-l-2 border-brand-pinkdeep bg-brand-blush/30 pl-4 py-2 italic`）。
   - 详实分析段落：优雅字间距与行高（`text-base leading-relaxed text-brand-ink/80`）。

### 4. 必备交互与转化组件 (Essential Panels)
1. **每部小说底部的【Want to read this one】引导条**：
   - **必须**在每一部推荐小说的正文末尾放置跳转引导链接，点击平滑滚动到底部 `#find-it` 区域：
     ```tsx
     <div className="blogBookAction">
       <a href="#find-it" className="findLink">
         Want to read this one? We&apos;ll help you find it →
       </a>
     </div>
     ```
2. **页尾必须挂载 FinderPanel 组件**：
   - 在所有小说介绍完毕后，**必须**引入并挂载 `<FinderPanel />`（该组件自带 `id="find-it"`）：
     ```tsx
     <div className="mt-14">
       <FinderPanel />
     </div>
     ```
3. **Keep Exploring 与回退链接**：
   - 放置探索更多推荐列表的行动点（More BL Novel Recs / Browse Novels / Read Weekly Quotes）。
   - 底部提供 `← Back to BL Novel Recs` 快捷返回链接。


