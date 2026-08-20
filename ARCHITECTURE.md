# 系统架构说明 (System Architecture)

_最后更新：2026-08-20_

---

## 项目结构 (Project Structure)

```
novel_blog/
├── app/                              # Next.js 16 App Router
│   ├── contact/                      # 联系我们页 (/contact)
│   ├── novels/
│   │   ├── page.tsx                  # 小说列表页 (/novels)
│   │   └── [slug]/
│   │       ├── page.tsx              # 小说详情页 + 章节目录 (/novels/[slug])
│   │       └── chapters/[chapter]/
│   │           └── page.tsx          # 章节阅读页 (/novels/[slug]/chapters/[chapter])
│   ├── studio/                       # 嵌入式 Sanity CMS 管理后台 (/studio)
│   ├── globals.css                   # 全局基础样式（极少）
│   ├── layout.tsx                    # 根 Layout（字体 / Meta / 全局 CSS 引入）
│   ├── page.tsx                      # 首页（Hero 二栏 + Latest Human TL+ 书库）
│   ├── robots.ts                     # robots.txt 动态生成
│   └── sitemap.ts                    # sitemap.xml 动态生成
│
├── components/                       # 纯展示 UI 组件库
│   ├── hero-reviewing-banner.tsx     # 首页第一屏：正在精修小说卡（2×2 网格布局）
│   ├── hero-announcement-panel.tsx   # 首页第一屏：译者说明/承诺面板（右侧栏）
│   ├── latest-polished-grid.tsx      # 首页第二屏：最新精修章节卡片网格
│   ├── novel-card.tsx                # 书库 / 列表页小说卡片（封面 16:9 + 信息区）
│   ├── filterable-novel-grid.tsx     # 带分类筛选的小说网格（客户端交互）
│   ├── proofread-banner.tsx          # 小说详情页上方精修章节横幅
│   ├── site-header.tsx               # 全站顶部导航栏
│   ├── site-footer.tsx               # 全站底部页脚
│   └── PortableTextLink.tsx          # Sanity Portable Text 自定义链接渲染器
│
├── lib/                              # 数据访问层与站点配置
│   ├── novels.ts                     # 全部 Sanity GROQ 查询 + React cache() 封装
│   └── siteMetadata.ts               # 站点域名 / URL 辅助函数
│
├── src/sanity/                       # Sanity Studio 集成
│   ├── client.ts                     # Sanity 客户端实例
│   ├── schemas/                      # CMS Schema 定义
│   │   ├── novel.ts                  # 小说 Schema（含 isCurrentlyReviewing、reviewedUpToChapter 字段）
│   │   ├── chapter.ts                # 章节 Schema（含 isPolished 人工精修字段）
│   │   ├── seo.ts                    # SEO 子 Schema（metaTitle / metaDescription / ogImage）
│   │   └── index.ts                  # Schema 注册入口
│   └── structure.ts                  # Sanity Studio 后台导航结构
│
├── scripts/                          # 运维 / 批量发布脚本
│   ├── publish-novel.mjs             # TXT 格式小说一键批量导入并发布到 Sanity
│   └── upload-novel.mjs              # 图片 / 单本小说上传辅助脚本
│
├── public/
│   └── assets/css/style.css          # 主 CSS 文件（Morandi 暖色系 + 全部组件样式）
│
├── site.config.ts                    # 集中式品牌与社交链接配置
├── sanity.config.ts                  # Sanity CMS 配置
├── sanity.cli.ts                     # Sanity CLI 配置
├── next.config.ts                    # Next.js 配置（图片域名白名单等）
├── env.example                       # 环境变量模版
├── ARCHITECTURE.md                   # 本文件
├── DEPLOYMENT.md                     # 部署说明
└── VERCEL_CONFIG.md                  # Vercel 环境配置说明
```

---

## 技术栈 (Tech Stack)

| 层次 | 技术 |
|------|------|
| 前端框架 | Next.js 16 (App Router + Turbopack + React 18) |
| CMS / 后端 | Sanity CMS（通过 `next-sanity` 嵌入运行于 `/studio`） |
| 数据查询 | Sanity GROQ + React `cache()` 消除重复请求 |
| 样式 | Vanilla CSS（`public/assets/css/style.css`）+ Morandi 暖色系设计 |
| 卡片交互 | Tailwind CSS utility（仅 `novel-card.tsx` 局部使用 `group/hover` 等工具类） |
| 图片 | `@sanity/image-url` 构建 CDN URL + Next.js `<Image>` 优化 |
| SEO | 动态 `generateMetadata` + Schema.org JSON-LD + sitemap.xml + robots.txt |
| 部署 | Vercel（Web + ISR）/ Sanity Cloud（数据 + 图片 CDN） |

---

## 核心数据类型 (Key Types in `lib/novels.ts`)

| 类型 | 用途 |
|------|------|
| `Novel` | 小说列表 / 详情页数据（含 `totalChapters`、`tags`、`seo` 子对象） |
| `ChapterInfo` | 章节目录列表（含 `isPolished` 人工精修状态、`locked` 锁定状态） |
| `CurrentlyReviewingNovel` | 首页 Hero 卡：正在精修的小说（含 `reviewedUpToChapter`、`latestPolishedChapterNumber`） |
| `LatestPolishedChapter` | 首页第二屏：最新完成精修的章节卡片 |
| `RecentProofread` | 小说详情页 proofread-banner 使用的精修章节数据 |

---

## 首页布局结构 (Homepage Layout)

```
<SiteHeader>
<h1>  (SEO 唯一 H1)

<section class="hero-section-wrapper">          ← Hero 第一屏
  <div class="hero-split-grid">                 ← 双栏网格 (desktop 1.2fr / 1fr)
    <HeroReviewingBanner>                       ← 左栏：正在精修小说卡 (2×2 内部网格)
      ┌─────────────────────────────────────┐
      │  [封面图]  │  标题 / 标签 / 章节数  │  ← top row: grid-template-columns: 1fr 1fr
      ├─────────────────────────────────────┤
      │  摘要 + 进度条 + CTA 按钮 (全宽)   │  ← bottom row: spans full card width
      └─────────────────────────────────────┘
    <HeroAnnouncementPanel>                     ← 右栏：译者承诺 + /contact 链接

<main class="main-content">
  <section>  Latest Human TL → <LatestPolishedGrid>
  <section>  Explore Library  → <NovelCard> × N  +  "View All Novels →"
<SiteFooter>
```

---

## 章节目录页视觉规则 (`/novels/[slug]`)

章节列表对每个章节方块根据 `isPolished` 字段分两种视觉风格：

| 状态 | 边框 | 背景 | 角标 |
|------|------|------|------|
| `isPolished = true`（人工精修） | 左侧 6px 金色边 + 浅金色边框 | 暖白渐变 | **Polished**（金色渐变） |
| `isPolished = false`（机器翻译） | 灰色边框 (`#cbd5e1`) | 浅灰 (`#f8fafc`) | **Raw MTL**（灰蓝渐变） |

对应 CSS 类：`.chapter-item` / `.chapter-item.is-polished` / `.polished-corner-tag` / `.raw-corner-tag`（均在 `style.css`）。

---

## ⚡ 性能优化设计

### 1. 并发 `generateStaticParams`（解决 N+1 瓶颈）

- **问题**：批量预渲染 1400+ 章节静态页时，串行 `getNovelChapters` 触发 N+1，且原始 GROQ 含重型字数拆分计算。
- **解法**：
  - 引入轻量函数 `getNovelChapterNumbers`，GROQ 仅返回 `number` 与 `locked` 字段。
  - `generateStaticParams` 用 `Promise.all` 对所有小说并发拉取，大幅缩短全站 SSG 构建耗时。

### 2. React `cache()` 数据去重

所有 Sanity GROQ 查询函数（`getNovels`、`getNovelBySlug`、`getCurrentlyReviewingNovel`、`getLatestPolishedChapters` 等）均用 React `cache()` 包装，保证同一请求周期内相同参数只触发一次网络 Fetch。

### 3. 图片 CDN 多规格输出

`lib/novels.ts` 提供四个图片 URL 辅助函数，按使用场景输出不同尺寸 / 格式：

| 函数 | 宽度 | 格式 | 用途 |
|------|------|------|------|
| `coverThumbUrl` | 600px | WebP q80 | 卡片列表缩略图 |
| `ogImageUrl` | 1200px | WebP q85 | Open Graph 社交分享图 |
| `illustrationUrl` | 900px | WebP q85 | 章节正文插图 |
| `urlFor` | 原始 | — | 自定义尺寸（Sanity builder 链式调用） |
