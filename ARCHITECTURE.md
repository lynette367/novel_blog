# 系统架构说明

## 项目结构

```
novel_blog/
├── api/                    # Vercel Serverless Functions
│   ├── novels/
│   │   └── index.js        # 小说管理 API
│   └── chapters/
│       └── index.js        # 章节管理 API
├── admin/                  # 管理后台
│   ├── admin.html         # 管理界面
│   ├── index.html         # Netlify CMS (可选)
│   └── config.yml         # Netlify CMS 配置
├── assets/                 # 静态资源
│   ├── css/
│   ├── images/
│   └── js/
├── novels/                # 小说内容
│   └── {novel_folder}/
│       ├── index.html     # 小说目录页
│       └── chapter*.html  # 章节页面
├── vercel.json            # Vercel 配置
├── package.json           # Node.js 依赖
└── generate_novel.py      # Python 脚本（本地使用）

```

## 技术栈

- **前端**: 静态 HTML + CSS + JavaScript
- **后端**: Vercel Serverless Functions (Node.js)
- **存储**: GitHub Repository (通过 GitHub API)
- **部署**: Vercel

## API 架构

### 认证机制
- 使用 Bearer Token 认证
- Token 存储在环境变量 `ADMIN_SECRET` 中
- 所有 API 请求都需要在 Header 中包含：`Authorization: Bearer {ADMIN_SECRET}`

### 数据流

1. **用户操作** → 管理界面 (`admin/admin.html`)
2. **管理界面** → API 请求 (`/api/novels` 或 `/api/chapters`)
3. **API 路由** → GitHub API (读写文件)
4. **GitHub API** → 更新仓库文件
5. **Vercel** → 自动重新部署（如果配置了）

## API 端点

### `/api/novels`
- `GET`: 获取所有小说列表
- `POST`: 创建新小说

### `/api/chapters`
- `GET`: 获取小说的所有章节
- `POST`: 创建或更新章节
- `DELETE`: 删除章节

## 文件操作流程

### 创建小说
1. 用户填写小说信息
2. API 生成 `novels/{folder}/index.html`
3. 通过 GitHub API 创建文件
4. 更新 `index.html` 和 `novels.html`（需要手动或通过脚本）

### 添加章节
1. 用户填写章节信息
2. API 生成 `novels/{folder}/chapter{N}.html`
3. 更新 `novels/{folder}/index.html`（添加章节链接）
4. 通过 GitHub API 保存文件

## 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | ✅ |
| `GITHUB_REPO_OWNER` | 仓库所有者 | ✅ |
| `GITHUB_REPO_NAME` | 仓库名 | ✅ |
| `GITHUB_BRANCH` | 分支名 | ❌ (默认: main) |
| `ADMIN_SECRET` | 管理后台密码 | ✅ |

## 安全考虑

1. **认证**: 所有 API 都需要 Bearer Token
2. **GitHub Token**: 使用最小权限原则（只需要 `repo` 权限）
3. **环境变量**: 敏感信息存储在 Vercel 环境变量中
4. **CORS**: API 设置了适当的 CORS 头

## 限制

1. **文件大小**: GitHub API 限制单个文件最大 100MB
2. **请求频率**: GitHub API 有速率限制（5000 请求/小时）
3. **异步操作**: 文件操作是异步的，可能需要几秒生效
4. **静态部署**: Vercel 会在文件更新后自动重新部署

## 扩展建议

1. **图片上传**: 可以添加图片上传 API，使用 Vercel Blob Storage
2. **批量操作**: 支持批量导入章节
3. **预览功能**: 添加章节预览功能
4. **版本控制**: 利用 GitHub 的版本历史功能
5. **搜索功能**: 添加全文搜索

