# 快速开始指南

## 步骤 1: 设置 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token

## 步骤 2: 在 Vercel 中配置

### 方法 A: 通过 Vercel Dashboard

1. 登录 Vercel
2. 导入你的 GitHub 仓库
3. 进入项目设置 > Environment Variables
4. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_TOKEN` | 你的GitHub_Token | GitHub Personal Access Token |
| `GITHUB_REPO_OWNER` | lynette367 | 仓库所有者 |
| `GITHUB_REPO_NAME` | novel_blog | 仓库名 |
| `GITHUB_BRANCH` | main | 分支名 |
| `ADMIN_SECRET` | 你的密码 | 管理后台访问密钥 |

### 方法 B: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录中设置环境变量
vercel env add GITHUB_TOKEN
vercel env add ADMIN_SECRET
# ... 其他变量

# 部署
vercel --prod
```

## 步骤 3: 安装依赖

```bash
npm install
```

## 步骤 4: 部署

### 自动部署（推荐）
- 推送代码到 GitHub
- Vercel 会自动检测并部署

### 手动部署
```bash
vercel --prod
```

## 步骤 5: 访问管理后台

部署完成后，访问：
```
https://your-project.vercel.app/admin/admin.html
```

使用 `ADMIN_SECRET` 中设置的密码登录。

## 使用说明

### 创建新小说
1. 登录管理后台
2. 点击 "Novels" 标签
3. 填写小说信息：
   - 标题（必填）
   - 简介（必填）
   - 封面图片（可选，文件名需在 assets/images/ 中）
4. 点击 "Create Novel"

### 添加章节
1. 点击 "Chapters" 标签
2. 选择小说
3. 填写章节信息：
   - 章节编号
   - 章节标题（如 "Chapter 1"）
   - 章节内容（每行一个段落）
4. 点击 "Save Chapter"

### 编辑章节
1. 在章节列表中找到要编辑的章节
2. 点击 "Edit"
3. 修改内容后保存

### 删除章节
1. 在章节列表中点击 "Delete"
2. 确认删除

## 常见问题

**Q: API 返回 401 错误**
A: 检查 `ADMIN_SECRET` 环境变量是否正确设置，并确认在管理界面输入的密码一致。

**Q: API 返回 500 错误**
A: 检查 `GITHUB_TOKEN` 是否正确，并确认 token 有 `repo` 权限。

**Q: 文件更新后看不到变化**
A: GitHub API 操作是异步的，等待几秒后刷新页面。

**Q: 如何更新现有小说的目录页？**
A: 添加新章节时会自动更新目录页。

