# 部署指南

## 快速开始

### 1. 准备 GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `repo` (完整仓库访问权限)
4. 复制生成的 token

### 2. 在 Vercel 中设置环境变量

在 Vercel 项目设置 > Environment Variables 中添加：

```
GITHUB_TOKEN=你的GitHub_Token
GITHUB_REPO_OWNER=lynette367
GITHUB_REPO_NAME=novel_blog
GITHUB_BRANCH=main
ADMIN_SECRET=你的管理密码（建议使用强密码）
```

### 3. 安装依赖并部署

```bash
# 安装依赖
npm install

# 部署到 Vercel
vercel

# 或通过 GitHub 连接自动部署
```

### 4. 访问管理后台

部署完成后，访问：
- `https://your-domain.vercel.app/admin/admin.html`

使用你在环境变量中设置的 `ADMIN_SECRET` 登录。

## 功能说明

### 创建小说
1. 在 "Novels" 标签页填写小说信息
2. 标题、简介、封面图片（可选）
3. 点击 "Create Novel" 创建

### 添加章节
1. 切换到 "Chapters" 标签页
2. 选择要添加章节的小说
3. 填写章节编号、标题和内容
4. 内容格式：每行一个段落
5. 点击 "Save Chapter" 保存

### 编辑章节
1. 在章节列表中找到要编辑的章节
2. 点击 "Edit" 按钮
3. 修改内容后保存

### 删除章节
1. 在章节列表中点击 "Delete" 按钮
2. 确认删除

## 注意事项

1. **Sanity CMS 图片管理**：小说封面和文章插图直接在 CMS 后台（/studio）上传至 Sanity CDN，无需手动放置本地文件
2. **章节内容**：每行一个段落，空行会被忽略

## 故障排除

### API 返回 401 错误
- 检查 `ADMIN_SECRET` 环境变量是否正确设置
- 确认在管理界面输入的密码与环境变量一致

### API 返回 500 错误
- 检查 `GITHUB_TOKEN` 是否正确设置
- 确认 token 有 `repo` 权限
- 查看 Vercel 函数日志

### 文件未更新
- GitHub API 操作是异步的，可能需要等待几秒
- 刷新页面查看最新状态

