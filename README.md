# Cross The Line - Novel Translation Platform

## 项目结构

```
/
├── api/                    # Serverless Functions (后端API)
│   ├── novels.js          # 获取所有小说列表
│   ├── novels/
│   │   └── [slug].js     # 获取特定小说信息
│   │       └── chapters.js          # 获取章节列表
│   │           └── [number].js      # 获取章节内容
│   ├── search.js          # 搜索小说
│   └── utils/
│       └── novelReader.js # 工具函数
├── assets/                 # 静态资源
├── novels/                 # 小说内容
├── index.html             # 首页
├── novels.html            # 小说列表页
├── package.json           # Node.js依赖配置
├── vercel.json            # Vercel部署配置
└── API.md                 # API文档
```

## 后端API功能

已创建以下API endpoints：

1. **GET /api/novels** - 获取所有小说列表
2. **GET /api/novels/[slug]** - 获取特定小说信息
3. **GET /api/novels/[slug]/chapters** - 获取章节列表
4. **GET /api/novels/[slug]/chapters/[number]** - 获取章节内容
5. **GET /api/search?q=query** - 搜索小说

详细API文档请查看 [API.md](./API.md)

## Vercel部署

### 自动部署

项目已配置好Vercel部署设置：

1. **package.json** - 定义了项目元数据和Node.js版本要求
2. **vercel.json** - 配置了CORS头和路由设置
3. **api/** - 包含所有serverless functions，Vercel会自动识别

### 部署步骤

1. **连接到Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的GitHub仓库

2. **Vercel会自动检测**
   - Vercel会自动识别 `package.json` 和 `api/` 目录
   - 自动配置serverless functions
   - 无需额外配置

3. **部署完成**
   - 部署后，API endpoints会自动可用
   - 例如：`https://your-project.vercel.app/api/novels`

### 本地开发

```bash
# 安装Vercel CLI（如果还没有）
npm i -g vercel

# 在项目目录运行
vercel dev
```

这将启动本地开发服务器，你可以在 `http://localhost:3000` 访问你的应用和API。

### 环境变量（如果需要）

如果将来需要添加环境变量（如数据库连接等），可以在Vercel项目设置中添加。

## 测试API

部署后，你可以使用以下方式测试API：

```bash
# 获取所有小说
curl https://your-project.vercel.app/api/novels

# 获取特定小说
curl https://your-project.vercel.app/api/novels?slug=big_brother

# 搜索小说
curl "https://your-project.vercel.app/api/search?q=big"
```

## 注意事项

- 所有API endpoints都支持CORS，可以从任何域名访问
- API返回JSON格式数据
- 所有endpoints都支持OPTIONS请求（用于CORS预检）
- 文件系统读取操作在Vercel serverless functions中正常工作
