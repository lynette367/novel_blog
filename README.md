# 小说网站 - Cross The Line

基于 Next.js 和 Sanity CMS 的小说阅读网站。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
SANITY_API_TOKEN=your_sanity_api_token_here
```

**获取 Token 步骤：**
1. 访问 https://www.sanity.io/manage/project/lke4t7vu/api
2. 点击 "Add API token"
3. 选择 "Editor" 权限
4. 复制生成的 token 到 `.env.local`

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问网站和后台

- **网站首页**: http://localhost:3000
- **小说列表**: http://localhost:3000/novels
- **Sanity Studio 后台**: http://localhost:3000/studio

## 📚 管理后台使用

### 访问后台

1. 启动开发服务器：`npm run dev`
2. 打开浏览器访问：http://localhost:3000/studio
3. 使用你的 Sanity 账户登录（创建项目时使用的账户）

### 后台功能

- **小说管理** - 添加、编辑、删除小说
- **章节管理** - 在对应小说下管理章节
- **封面图片** - 上传、修改、删除封面图片

### 后台结构

```
📚 小说管理
  └── [小说名称]
        ├── 📖 小说信息      ← 编辑基本信息
        ├── 📝 章节列表      ← 查看/编辑章节
        └── ➕ 添加新章节    ← 快速添加章节
```

## 📖 一键发布小说

### 使用方法

```bash
# 发布当前目录所有 .txt 文件
npm run publish

# 发布指定小说
npm run publish novel.txt

# 指定封面图片
npm run publish novel.txt cover.png

# 指定封面和分类
npm run publish novel.txt cover.png ROMANCE
```

### 支持的分类

- `BL` (默认)
- `ROMANCE`
- `OTHER`

### 自动功能

- ✅ 自动检测文件编码（UTF-8, GBK 等）
- ✅ 自动提取标题和简介
- ✅ 自动查找同名封面图片（.png, .jpg, .jpeg, .webp）
- ✅ 智能章节解析（支持多种格式）

## 🛠️ 其他命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 部署 Sanity Studio（独立部署）
npm run sanity:deploy
```

## 📁 项目结构

```
novel_blog/
├── app/                    # Next.js 页面
│   ├── page.tsx           # 首页
│   ├── novels/            # 小说页面
│   └── studio/            # Sanity Studio
├── lib/
│   └── novels.ts          # 数据获取函数（从 Sanity）
├── src/sanity/
│   ├── client.ts          # Sanity 客户端
│   ├── schemas/           # 数据模型
│   └── structure.ts       # Studio 结构配置
├── scripts/
│   └── publish-novel.mjs # 一键发布脚本
└── sanity.config.ts       # Sanity 配置
```

## 🔧 技术栈

- **Next.js 16** - React 框架
- **Sanity CMS** - 内容管理系统
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式（如需要）

## 📝 注意事项

1. **环境变量**: 确保 `.env.local` 文件存在且包含 `SANITY_API_TOKEN`
2. **端口冲突**: 如果 3000 端口被占用，Next.js 会自动使用 3001
3. **数据存储**: 所有小说数据存储在 Sanity 云端，本地不需要 JSON 文件
4. **源文件**: `.txt` 和封面图片文件不会被提交到 Git（已在 `.gitignore` 中）

## 🚢 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 添加环境变量 `SANITY_API_TOKEN`
4. 部署完成

### 环境变量配置

在 Vercel 项目设置中添加：
- `SANITY_API_TOKEN`: 你的 Sanity API Token

## 📞 支持

如有问题，请查看：
- [Next.js 文档](https://nextjs.org/docs)
- [Sanity 文档](https://www.sanity.io/docs)
