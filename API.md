# API Documentation

## Endpoints

### 1. Get All Novels
**GET** `/api/novels`

返回所有小说的列表。

**Response:**
```json
{
  "success": true,
  "count": 3,
  "novels": [
    {
      "slug": "big_brother",
      "title": "Big Brother",
      "description": "...",
      "coverImage": "big_brother.png",
      "totalChapters": 70
    }
  ]
}
```

### 2. Get Novel by Slug
**GET** `/api/novels/[slug]`

获取特定小说的详细信息，包括章节列表。

**Parameters:**
- `slug` (query): 小说的slug（文件夹名）

**Response:**
```json
{
  "success": true,
  "novel": {
    "slug": "big_brother",
    "title": "Big Brother",
    "description": "...",
    "coverImage": "big_brother.png",
    "totalChapters": 70,
    "chapters": [
      {
        "number": 1,
        "filename": "chapter1.html"
      }
    ]
  }
}
```

### 3. Get Novel Chapters
**GET** `/api/novels/[slug]/chapters`

获取小说的章节列表。

**Parameters:**
- `slug` (query): 小说的slug

**Response:**
```json
{
  "success": true,
  "novelSlug": "big_brother",
  "totalChapters": 70,
  "chapters": [
    {
      "number": 1,
      "filename": "chapter1.html"
    }
  ]
}
```

### 4. Get Chapter Content
**GET** `/api/novels/[slug]/chapters/[number]`

获取特定章节的内容。

**Parameters:**
- `slug` (query): 小说的slug
- `number` (query): 章节编号

**Response:**
```json
{
  "success": true,
  "chapter": {
    "novelSlug": "big_brother",
    "chapterNumber": 1,
    "title": "Chapter 1",
    "content": ["段落1", "段落2"],
    "totalChapters": 70,
    "prevChapter": null,
    "nextChapter": 2
  }
}
```

### 5. Search Novels
**GET** `/api/search?q=query`

搜索小说。

**Parameters:**
- `q` (query): 搜索关键词

**Response:**
```json
{
  "success": true,
  "query": "big",
  "count": 1,
  "results": [
    {
      "slug": "big_brother",
      "title": "Big Brother",
      "description": "...",
      "coverImage": "big_brother.png",
      "totalChapters": 70
    }
  ]
}
```

## Vercel Deployment

项目已配置为Vercel部署：

1. **package.json** - 定义了项目依赖和脚本
2. **vercel.json** - 配置了路由和构建设置
3. **api/** - 包含所有serverless functions

### 部署步骤：

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. Vercel会自动检测并部署

### 本地开发：

```bash
npm install
vercel dev
```
