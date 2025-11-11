# Novel Blog API Documentation

## 设置说明

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `GITHUB_TOKEN`: GitHub Personal Access Token（需要 `repo` 权限）
- `GITHUB_REPO_OWNER`: GitHub 仓库所有者（默认: lynette367）
- `GITHUB_REPO_NAME`: GitHub 仓库名（默认: novel_blog）
- `GITHUB_BRANCH`: 分支名（默认: main）
- `ADMIN_SECRET`: 管理后台访问密钥

### 2. 创建 GitHub Personal Access Token

1. 访问 GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 权限
4. 复制生成的 token 并添加到 Vercel 环境变量

### 3. 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 添加环境变量
4. 部署

### 4. 访问管理后台

访问：`https://your-domain.vercel.app/admin/admin.html`

## API 端点

### GET /api/novels
获取所有小说列表

**Headers:**
```
Authorization: Bearer {ADMIN_SECRET}
```

**Response:**
```json
{
  "novels": [
    {
      "id": "novel_folder_name",
      "title": "Novel Title",
      "folder": "novel_folder_name"
    }
  ]
}
```

### POST /api/novels
创建新小说

**Headers:**
```
Authorization: Bearer {ADMIN_SECRET}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Novel Title",
  "description": "Novel description",
  "coverImage": "cover_image.png"
}
```

### GET /api/chapters?novelId={novelId}
获取小说的所有章节

**Headers:**
```
Authorization: Bearer {ADMIN_SECRET}
```

**Response:**
```json
{
  "chapters": [
    {
      "number": 1,
      "title": "Chapter 1"
    }
  ]
}
```

### POST /api/chapters
创建或更新章节

**Headers:**
```
Authorization: Bearer {ADMIN_SECRET}
Content-Type: application/json
```

**Body:**
```json
{
  "novelId": "novel_folder_name",
  "chapterNum": 1,
  "chapterTitle": "Chapter 1",
  "chapterContent": "Chapter content here..."
}
```

### DELETE /api/chapters?novelId={novelId}&chapterNum={chapterNum}
删除章节

**Headers:**
```
Authorization: Bearer {ADMIN_SECRET}
```

## 注意事项

1. 所有 API 请求都需要 `Authorization` header
2. 文件操作通过 GitHub API 进行，需要等待 GitHub 处理
3. 章节内容应该每行一个段落
4. 封面图片需要先上传到 `assets/images/` 目录

