# 系统架构与工程规范 (System Architecture & Guidelines)

_最后更新：2026-11-20_

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
│   ├── lore/                         # Lore 文化解析集群 (暂未设 /lore 聚合页)
│   │   ├── layout.tsx                # 集群共享 Layout (SiteHeader + SiteFooter)
│   │   └── [article-slug]/           # 独立解析文章页 (如 triad-ranks、heaven-officials-blessing-merit-and-godhood)
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
│   ├── lore/
│   │   └── lore-article-components.tsx # Lore 集群共享组件库 (Layout/Hero/Breadcrumb/TOC/ReaderNote/Figure/Sidebar)
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
├── lib/editorial-images.ts           # Sanity 专题图片资产读取与多尺寸复用工具
├── lib/lore/                         # Lore 集群数据与文章注册表
│   ├── articles.ts                   # Lore 文章单一事实来源 (供 Sidebar 与 sitemap 共用)
│   ├── triad-ranks.ts                # Triad Ranks 结构化数据
│   └── triad-history.ts              # Triad Ranks 历史考据数据
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
│   │   ├── editorialImage.ts         # 专题图片资产模型 (Editorial Image Assets)
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

---

## 🏛️ Lore 文化解析集群 (Lore & Cultural Analysis Cluster) 开发与扩展规范

在 `/app/lore/` 下新增或维护文化解析文章页时，**必须严格遵循以下规则**，确保整个集群在页面结构、侧边栏内链、SEO 元数据与网站地图上保持一致。

### 1. 文章注册中心 (Single Source of Truth)
- 新增任何 Lore 文章页后，**必须**在 `lib/lore/articles.ts` 的 `loreArticles` 数组中注册条目（使用 `LORE_PATH = "/lore"` 与 `loreArticlePath(slug)` 生成路径）：
  ```ts
  {
    slug: "heaven-officials-blessing-merit-and-godhood",
    title: "Merit, Godhood, and Xie Lian: The Chinese Belief Behind Heaven Official's Blessing",
    shortTitle: "Merit, Godhood, and Xie Lian (TGCF)",
    category: "Chinese Mythology · Heaven Official's Blessing",
    summary: "How traditional Chinese beliefs make gods through merit, how the heavenly court corrupts that ideal, and how Xie Lian redefines compassion.",
  }
  ```
- **自动同步机制**：`loreArticles` 作为单一事实来源，会自动同步到：
  1. 所有 `/lore/*` 页面右侧栏 `LoreSidebar` 的 **Lore & Cultural Analysis** 目录（自动高亮当前页、链接兄弟文章）。
  2. `app/sitemap.ts` 中 `loreRoutes` 的网站地图动态生成。
- **当前无聚合页规则（重要）**：目前 `/lore/` 尚未建设支柱聚合页（Pillar Page）：
  - **禁止**在无明确需求时自行创建 `app/lore/page.tsx`。
  - **禁止**在面包屑、侧边栏、JSON-LD `BreadcrumbList` 或 `sitemap.ts` 中输出指向 `/lore/` 的链接，避免产生 404 死链或导致 Next.js `typedRoutes` 校验失败。

### 2. 共享外壳与核心 UI 组件规范 (Shared Layout & UI Consistency)
- **集群共享 Layout**：`app/lore/layout.tsx` 统一挂载 `<SiteHeader activePath="lore" />` 与 `<SiteFooter />`。**各文章子页面禁止重复引入 Header / Footer**，防止导出静态 HTML 时出现双层页头页脚。
- **共享组件库**（统一从 `components/lore/lore-article-components.tsx` 引入）：
  1. **`LorePageLayout`**：封装全宽 Hero、`LoreBreadcrumb` 与响应式双栏网格（`grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px]`）。主内容列必须保留 `min-w-0`，防止长表格或 SVG 图表撑破移动端布局；移动端（`< lg`）自动将右侧栏堆叠至正文下方。
  2. **`LoreHero`**：深梅紫渐变横幅（`from-[#2b1f2d] via-[#3a2030] to-[#2b1f2d]`），统一包含眉标 `kicker`、页面唯一 `<h1>`、导语 `description` 与可选锚点按钮 `cta`。
  3. **`LoreBreadcrumb`**：统一格式为 `Home › Lore › [短标题]`（当前无 `/lore/` 聚合页时，`Lore` 保持纯文本 `<span>`，不作跳转链接）。
  4. **`LoreToc`**（文章目录）：
     - 长篇解析文章使用 `variant="list"`（带 `01`–`07` 编号的白色卡片式目录）。
     - 档案/索引型页面（如 `triad-ranks`）使用 `variant="pills"`（圆角胶囊锚点跳转栏）。
  5. **`LoreReaderNote`**：统一读者提示框样式；浅色模式使用 `border-l-4 border-l-[#f4a7b9] bg-[#fff9f2]`，深色受限卡片内使用 `dark` 变体。
  6. **`LoreSectionHeading`**：统一正文章节小节眉标 `kicker` 与带 `scroll-mt-24` 的 `<h2>`（防止点击目录锚点时标题被粘性顶栏遮挡）。
  7. **`LoreFigure`**（图片与图解组件）：统一响应式的图片/可视化容器（`<figure>` + 可选 `<figcaption>`），支持本地图片 `src`（强制 `w-full h-auto block max-w-full` 防破图）与内联响应式 SVG `visual`。**严禁在正文中使用不存在的图片路径或无关小说的封面图凑数**。

### 3. 右侧栏内链规范 (Right Sidebar Internal Links)
- 通过 `LorePageLayout` 自动向所有 `/lore/*` 页面渲染 `LoreSidebar`（桌面端 `lg:sticky lg:top-24`），包含以下必选栏目：
  1. **Explore Cross The Line**：固定指向 `/novels/`（Novel Library）与 `/bl-recs/`（BL Recommendations）。
  2. **Lore & Cultural Analysis**：遍历 `loreArticles`，当前页以 `aria-current="page"` 高亮标注 `Current guide`，其余文章渲染为站内链接（在无 `/lore/` 聚合页期间替代 `/lore/` 入口，零死链）。
  3. **Related Reading（可选）**：通过 `relatedLinks` prop 为单篇文章补充强相关的站内深度阅读链接（例如 TGCF 文化解析页关联 `/bl-recs/xianxia-danmei-like-tgcf/`）。

### 4. SEO、Canonical 与结构化数据规范
- **静态导出配置**：所有文章页必须声明 `export const dynamic = "force-static";`。
- **Canonical 与 Open Graph URL**：统一使用 `absoluteUrl("/lore/<slug>/")`（保留末尾斜杠，与 `next.config.ts` 的 `trailingSlash: true` 及 `sitemap.ts` 完全对齐）。
- **Meta 必备字段**：
  - 明确的 `title` 与 `description`（遵循 SERP 安全长度，避免被截断）。
  - `openGraph`（`type: "article"`、`siteName: SITE_NAME`、1200×630 分享图；若文章无专属 OG 图，使用 `${SITE_URL}/assets/images/immigrating-to-the-jurassic.jpg` 兜底）与 `twitter`（`summary_large_image`）。
- **JSON-LD 结构化数据**：注入 `Article`（或专题适用的 `DefinedTermSet`/`FAQPage`）与 `BreadcrumbList`（序列化时执行 `.replace(/</g, "\\u003c")` 转义；`BreadcrumbList` 仅包含真实可访问 URL）。
- **行文风格**：面向普通英语读者，采用自然流畅的日常英语表达，避免生僻学术词汇和过于复杂的长难句。

### 5. 首页精选入口规范 (Homepage Integration)
- 在首页 `app/page.tsx` 的 `Beyond the Chapters → Literary & Cultural Guides` 区块中引用 Lore 精选文章时，**必须采用极简列表式（`<ul><li><Link>`）**，不得额外引入卡片、背景底色或边框容器，以保持首页的轻量编辑排版风格。

### 6. 未来新增 `/lore/` 聚合页 (Pillar Page) 的升级清单
日后当 Lore 文章数量增长、需要上线 `/lore/` 聚合页时，按以下 6 步统一开启：
1. 新建 `app/lore/page.tsx`（读取 `lib/lore/articles.ts` 的 `loreArticles` 渲染文章目录，并配置 `/lore/` 的 Metadata 与 `CollectionPage` JSON-LD）。
2. 更新 `components/lore/lore-article-components.tsx`：将 `LoreBreadcrumb` 中的 `Lore` 纯文本改为 `<Link href={"/lore/" as Route}>`，并在 `LoreSidebar` 的 **Explore Cross The Line** 栏目中加入 `/lore/`（Lore and Cultural Analysis）总入口链接。
3. 更新 `components/site-header.tsx`：将导航栏 `Lore` 的默认 `href` 从 `/lore/triad-ranks` 切换为 `/lore/`。
4. 更新 `app/sitemap.ts`：在 `baseRoutes` 中补充 `{ url: withOrigin(LORE_PATH) }`。
5. 更新 `app/page.tsx`：`Literary & Cultural Guides` 标题与 `Read Guides →` 链接切换指向 `/lore/`。
6. 更新各 `/lore/*` 文章页的 JSON-LD `BreadcrumbList`，补入第 2 级 `{ position: 2, name: "Lore", item: absoluteUrl("/lore/") }`。

### 7. 新增 Lore 文章上线验收清单 (Release Checklist)
每次新增 Lore 文章后，上线前必须完成以下核验：
1. **注册检查**：确认已在 `lib/lore/articles.ts` 注册，`app/lore/<slug>/page.tsx` 使用 `LorePageLayout` 且未重复挂载 Header/Footer。
2. **代码与类型检查**：运行 `./node_modules/.bin/tsc --noEmit` 与 `./node_modules/.bin/eslint`，确保 0 个错误（Typed Routes 路由全部使用 `Route` 类型）。
3. **生产构建检查**：运行 `./node_modules/.bin/next build`（静态导出至 `out/`），确认无构建报错。
4. **Metadata 核验**：检查生成产物 `out/lore/<slug>/index.html` 中的 `<title>`、`<meta name="description">`、`<link rel="canonical">`、`og:*` 与 `twitter:card`。
5. **内链、图片与响应式核验**：确认页面内所有站内 `href` 与页内 `#id` 锚点均可解析且无 `/lore/` 死链；确认 `<figure>` 图片或 SVG 具有自适应宽度类，桌面双栏与移动端单栏均可正常响应。
6. **Sitemap 核验**：确认 `out/sitemap.xml` 已包含 `https://crossthelinebl.pages.dev/lore/<slug>/`。

---

## 🖼️ Editorial Image Assets (Sanity 专题图片资产库) 管理与复用规范

为避免将首页、Lore 文化解析与推荐页（BL Recs）的专题配图混入小说封面/章节图，同时避免同一张图在不同页面重复上传，全站专题图片统一由 Sanity 的 **`editorialImage`** 文档类型管理，通过前端 `key` 跨页面按需复用。

### 1. 架构定位与边界
- **职责分离**：文章正文、排版与 SEO 结构继续保留在 GitHub 仓库的 `page.tsx` 中；可复用的专题图片文件与元信息集中存放在 Sanity。
- **零复制复用**：同一张图片在 Sanity 仅上传一次。首页精选（如通过 `lib/lore/articles.ts` 的 `imageKey`）、Lore 正文与 BL Recs 推荐页直接通过 `key` 引用同一份资产，**禁止为了首页或不同栏目重复上传副本**。
- **与小说图库隔离**：小说封面与章节插图继续归属于 `novel` / `chapter` 文档，与 `editorialImage` 互不混用。

### 2. Schema 字段规范 (`src/sanity/schemas/editorialImage.ts`)
保持精简，共 7 个核心字段：

| 字段名 | 类型 | 必填 | 用途说明 |
|---|---|---|---|
| `title` | `string` | 是 | **Image Name**，用于 Studio 列表展示与名称搜索 |
| `key` | `slug` | 是 | **稳定引用标识**（由 `title` 生成，如 `tgcf-xie-lian-merit`），前端代码通过它读取图片 |
| `image` | `image` | 是 | 原图文件（开启 `hotspot: true` 保留裁剪焦点） |
| `alt` | `string` | 是 | 默认无障碍与 SEO `alt` 文本（前端可按语境覆盖） |
| `category` | `string` | 是 | Studio 主归档分类（下拉单选，默认为 `general`） |
| `tags` | `array<string>` | 否 | 跨分类检索标签（`layout: "tags"`） |
| `caption` | `string` | 否 | 可选默认图注（用于 `<LoreFigure>` 等正文插图场景） |

> **关键约定**：一旦某个 `key` 已经被前端 `page.tsx` 或注册表引用，**不要修改 `key`**；如需换新图，直接编辑原文档替换 `image` 字段并 Publish，所有引用该 `key` 的页面会在下次构建时自动同步。

### 3. Category 主分类规范（当前 5 类，支持随时增减）
`category` 仅用于在 Sanity Studio 左侧栏（`🖼️ Editorial Images → By Category`）按主归档分组管理，**不会限制该图片被哪些页面引用**。

当前预设的 5 个分类（统一定义在 `src/sanity/schemas/editorialImage.ts` 的 `EDITORIAL_IMAGE_CATEGORIES` 中）：
- `lore` — **Lore & Cultural Analysis**
- `bl-recs` — **BL Recommendations**
- `homepage` — **Homepage**
- `quotes` — **Weekly Quotes**
- `general` — **General / Shared**

> **如何增减分类**：只需修改 `EDITORIAL_IMAGE_CATEGORIES` 数组一处，`editorialImage` 的下拉选项与 `src/sanity/structure.ts` 的侧边栏分组目录会自动同步更新。

### 4. Tags 跨分类检索规范（自由标签，可随时增减）
当图片数量增多、需要跨 `category` 快速定位或按主题筛选时，通过 `tags` 进行跨分类检索：
- **命名约定**：
  1. 统一使用**全小写英文 + 连字符**（如 `xie-lian`、`chinese-mythology`），避免大小写混用或空格导致检索分裂。
  2. 每张图建议打 **2–5 个高区分度标签**，同一作品/角色全站保持唯一写法（例如统一用 `tgcf`，不同时写 `heaven-officials-blessing` 与 `tgcf`）。
- **推荐起始标签维度参考**（可随时增减）：

| 维度 | 推荐起始标签示例 |
|---|---|
| **作品 / 角色 / 作者** | `tgcf`, `xie-lian`, `hua-cheng`, `188-boy-group`, `priest`, `song-yuzhang`, `wo-hing-society`, `yue-xia-sang` |
| **题材 / 文化主题** | `xianxia`, `chinese-mythology`, `hong-kong-noir`, `republic-era`, `sci-fi`, `reincarnation`, `devotion`, `found-family` |
| **构图 / 视觉用途** | `hero`, `wide`, `portrait`, `og`, `mood`, `symbol`, `diagram` |

### 5. 前端读取与多页面复用规范 (`lib/editorial-images.ts`)
前端统一通过 `lib/editorial-images.ts` 读取（内部使用 React `cache()` 做请求去重，并利用 Sanity CDN 从同一张原图自动派生三种尺寸 URL）：
- **`url`**：正文插图（宽 `1200px`，WebP，质量 85）
- **`thumbUrl`**：首页 / 列表缩略图（宽 `600px`，WebP，质量 80）
- **`ogUrl`**：OG / Twitter 分享图（`1200×630`，按 `hotspot` 自动裁剪，WebP，质量 85）

常用调用方式：
- **`getEditorialImage(key)`**：按 `key` 读取单张图片（大小写不敏感；未找到时返回 `null`）。
  - **Lore 文章页**：配合 `<LoreFigure>` 渲染正文插图，或在 `generateMetadata()` 中取 `ogUrl` 作为文章专属分享图。
  - **BL Recs 页**：使用同一个 `key` 直接读取并按需覆盖 `caption` / `alt`。
  - **首页精选**：可在 `lib/lore/articles.ts` 的条目中配置可选字段 `imageKey?: string`，首页按 `article.imageKey` 调用 `getEditorialImage()` 并渲染 `thumbUrl`。
- **`getEditorialImages(keys)`**：批量读取多张图片并按 `key` 映射返回。
- **`getEditorialImagesByFilter({ category?, tag? })`**：按分类和/或标签做跨分类检索（用于专题图集或扩展列表）。

### 6. 静态导出构建与容错规则
- 项目采用 `output: "export"` 静态导出：在 Sanity 上传或替换 `editorialImage` 后，重新构建部署（`npm run deploy`）即可全站生效。
- `getAllEditorialImages()` 已内置 `try/catch` 容错：当 Sanity 暂无该 `key` 或查询失败时安全返回 `null` / `[]`，组件层判空降级（`{img && <LoreFigure ... />}`），确保不会阻塞 `next build`。




