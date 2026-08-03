# 📚 Novel Blog Infrastructure (Next.js 16 + Sanity CMS)

A modern, high-performance, open-source web application designed for web novel translators, bloggers, and reading communities. Features instant static site generation, responsive mobile-first UI, integrated headless CMS management, and automated CLI publishing tools.

---

## ✨ Features

- **⚡ Fast & Modern Tech Stack**: Next.js 16 (App Router + React 18), TypeScript, Vanilla CSS for maximum styling flexibility.
- **🎨 Embedded Headless CMS**: Built-in Sanity Studio at `/studio` route for easy novel & chapter management.
- **📖 Reading Experience**:
  - Interactive **Last Polished Chapter Hero** section on the homepage.
  - Square-proportioned novel cover cards with clean text overflow truncation.
  - Clear **Proofread badges (`【Polished】`)** and accent border highlights for human-proofread chapters vs machine-translated chapters.
  - Estimated reading time and word count calculations for every chapter.
- **🚀 One-Command Importer (`publish-novel.mjs`)**: CLI script to parse TXT novel files, upload covers/illustrations, and create documents directly in Sanity.
- **🌐 SEO Optimized**: Automatic Open Graph tags, canonical URLs, dynamic XML Sitemap, and Schema.org structured data (`WebSite`, `Book`, `Organization`).

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- A free [Sanity.io](https://www.sanity.io/) account

### 2. Clone & Install
```bash
git clone https://github.com/your-username/novel-blog.git
cd novel-blog
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp env.example .env.local
```

Fill in your Sanity credentials and site settings in `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_write_token

NEXT_PUBLIC_SITE_NAME="My Novel Blog"
NEXT_PUBLIC_SITE_TITLE="My Novel Blog | Web Novel Translations"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Optional Sponsor Links
NEXT_PUBLIC_BUY_ME_A_COFFEE="https://buymeacoffee.com/your_id"
NEXT_PUBLIC_KOFI="https://ko-fi.com/your_id"
NEXT_PUBLIC_PATREON="https://patreon.com/your_id"
```

### 4. Customize Site Configuration
Edit `site.config.ts` in the project root to tweak your site branding, default authors, categories, and support buttons.

### 5. Run Locally
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) to view your novel site.
- Open [http://localhost:3000/studio](http://localhost:3000/studio) to manage novels and chapters via Sanity Studio.

---

## 📝 Publishing Novels & Chapters

You can publish novels manually via the CMS at `/studio`, or use the built-in automated CLI script:

```bash
# Publish a single novel text file
npm run publish path/to/novel.txt

# Specify novel cover image and category
npm run publish novel.txt cover.jpg ROMANCE
```

The script automatically detects chapter titles (`Chapter 1`, `第1章`, etc.), extracts text, uploads images, and syncs everything with Sanity CMS.

---

## 🛠 Customizing Categories & Schemas

To add or modify novel categories or tags:
1. Open `src/sanity/schemas/novel.ts`.
2. Edit the fields or tags configuration to suit your genres (e.g. *Fantasy*, *Sci-Fi*, *Romance*, *Mystery*, *Danmei*).
3. Open `src/sanity/schemas/chapter.ts` to adjust chapter flags like `locked` or `isPolished`.

---

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. Add your environment variables in Vercel settings (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.).
4. Add your Vercel domain to **Sanity Management Console > API > CORS Origins** (`https://your-site.vercel.app` with credentials allowed).

---

## 📄 License

MIT License. Free for personal and commercial use.
