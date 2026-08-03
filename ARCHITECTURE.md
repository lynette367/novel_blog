# 系统架构说明 (System Architecture)

## 项目结构 (Project Structure)

```
novel_blog/
├── app/                        # Next.js 16 App Router
│   ├── novels/                # 小说列表及详情路由 (/novels, /novels/[slug])
│   │   └── [slug]/
│   │       └── chapters/[chapter]/ # 章节阅读路由
│   ├── studio/                # 嵌入式 Sanity CMS 管理后台 (/studio)
│   ├── globals.css            # 全局基础样式
│   ├── layout.tsx             # 根 Layout
│   └── page.tsx               # 网站首页 (Hero 精修章节 + 热门推荐)
├── components/                 # UI 组件库 (NovelCard, SiteHeader, SiteFooter, ProofreadBanner)
├── lib/                        # 数据访问层与 Site 配置
│   ├── novels.ts              # Sanity GROQ 查询逻辑与缓存封装
│   └── siteMetadata.ts        # 站点 Metadata 辅助函数
├── src/sanity/                 # Sanity Studio 配置与 Schema 定义
│   ├── schemas/               # 小说 (novel)、章节 (chapter)、SEO (seo) Schema
│   └── structure.ts           # Sanity Studio 后台导航结构
├── scripts/                    # 自动化运维与一键发布脚本
│   ├── publish-novel.mjs      # TXT 格式小说一键批量导入并发布到 Sanity
│   └── upload-novel.mjs       # 图片/单本小说上传辅助脚本
├── site.config.ts              # 集中式品牌与开源配置文件
├── sanity.config.ts            # Sanity CMS 配置文件
├── sanity.cli.ts               # Sanity CLI 配置文件
├── env.example                 # 环境变量模版文件
└── public/                     # 静态资源 (CSS, JS, 默认图片)
```

## 技术栈 (Tech Stack)

- **前端框架**: Next.js 16 (App Router + Turbopack + React 18)
- **CMS / Headless 后端**: Sanity CMS (通过 `next-sanity` 嵌入式运行于 `/studio`)
- **数据查询与缓存**: Sanity GROQ + React `cache()` 消除重复请求
- **样式与设计**: Vanilla CSS + Morandi 暖色系极简设计
- **部署平台**: Vercel (网页与 API) / Sanity Cloud (数据与图片 CDN)

---

## ⚡ 性能优化设计

### 1. 并发与轻量化 `generateStaticParams` 优化 (解决 N+1 瓶颈)
- **问题**: 在批量预渲染数千个章节静态页面 (`/novels/[slug]/chapters/[chapter]`) 时，串行请求 `getNovelChapters` 会触发 N+1 瓶颈，且原始 GROQ 会拉取包含 `content` 字符串拆分的字数统计（重型计算）。
- **解法**:
  - 引入专供路由生成使用的轻量函数 `getNovelChapterNumbers`，GROQ 仅返回 `number` 与 `locked` 字段。
  - 使用 `Promise.all` 对所有小说的章节路由列表进行并发并行拉取，极大缩短全站 1400+ 静态页面的 SSG 构建耗时。

### 2. React `cache()` 数据去重
- 所有 Sanity API 查询函数（如 `getNovels`、`getNovelBySlug`、`getRecentlyProofreadChapter`）均使用 React `cache()` 包装，保证在单次请求或 Metadata 生成流程中相同的参数只会触发一次网络 Fetch。
