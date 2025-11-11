# Cross The Line - 小说翻译网站

一个现代化的小说翻译网站，包含静态前端和 Python Serverless Functions 后端，可部署到 Vercel。

## 📋 项目概览

这是一个展示亚洲流行小说翻译的网站，具有：
- 📚 精美的小说展示页面
- 📖 舒适的阅读体验
- 🔍 搜索功能（通过 API）
- 📊 统计信息（通过 API）
- 🌐 RESTful API 后端

## 🏗️ 项目结构

```
/workspace/
├── api/                      # Python Serverless Functions (后端 API)
│   ├── index.py             # API 文档端点
│   ├── novels.py            # 小说列表 API
│   ├── chapters.py          # 章节内容 API
│   ├── search.py            # 搜索 API
│   ├── stats.py             # 统计信息 API
│   └── README.md            # API 文档
│
├── assets/                   # 静态资源
│   ├── css/
│   │   └── style.css        # 主样式文件
│   ├── js/
│   │   └── main.js          # 前端 JavaScript
│   └── images/              # 图片资源
│       ├── big_brother.png
│       ├── Transmigrated_into_the_Villain's_Sickly_Childhood_Friend.png
│       └── Travel_back_in_time_to_build_up_the_empire.png
│
├── novels/                   # 小说内容
│   ├── big_brother/         # 70 章
│   ├── transmigrated_into_the_villain's_sickly_childhood_friend/  # 143 章
│   └── travel_back_in_time_to_build_up_the_empire/  # 182 章
│
├── admin/                    # 管理后台（可选）
│   ├── config.yml
│   └── index.html
│
├── index.html               # 首页
├── novels.html              # 小说列表页
├── api-test.html            # API 测试页面
├── generate_novel.py        # 小说生成脚本
├── vercel.json              # Vercel 配置文件
├── requirements.txt         # Python 依赖
├── .vercelignore           # Vercel 忽略文件
├── DEPLOYMENT.md            # 部署指南
└── README.md                # 本文件
```

## 🚀 快速开始

### 本地开发

#### 1. 查看静态页面

使用 Python 的内置 HTTP 服务器：

```bash
python -m http.server 8000
```

然后访问 http://localhost:8000

#### 2. 测试 API

安装 Vercel CLI：

```bash
npm install -g vercel
```

运行开发服务器：

```bash
vercel dev
```

然后访问：
- 前端: http://localhost:3000
- API 测试页面: http://localhost:3000/api-test.html
- API 文档: http://localhost:3000/api/index

### 生成新小说

使用 `generate_novel.py` 脚本从 TXT 文件生成小说页面：

```bash
# 处理单个文件
python generate_novel.py novel.txt cover.png

# 处理所有 TXT 文件
python generate_novel.py
```

脚本会：
1. 解析 TXT 文件提取章节
2. 生成小说目录页
3. 生成各章节页面
4. 自动更新 index.html 和 novels.html
5. 复制封面图片到 assets/images/

## 🌐 API 端点

所有 API 端点都支持 CORS，可以从任何域名访问。

### 1. API 文档
```
GET /api/index
```
返回所有可用 API 端点的文档。

### 2. 小说列表
```
GET /api/novels
```
返回所有小说的列表和元数据。

### 3. 章节信息
```
GET /api/chapters?novel_id=big_brother
GET /api/chapters?novel_id=big_brother&chapter=1
```
获取章节列表或特定章节的内容。

### 4. 搜索
```
GET /api/search?q=brother&type=all
```
搜索小说标题、描述和章节内容。

### 5. 统计信息
```
GET /api/stats
```
获取网站统计信息（小说数、章节数等）。

详细的 API 文档请参考：
- [API README](api/README.md)
- 或访问部署后的 `/api/index` 端点

## 📦 部署到 Vercel

### 方法 1: 通过 Vercel Dashboard（推荐）

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 `vercel.json` 配置
5. 点击 "Deploy"

### 方法 2: 通过 Vercel CLI

```bash
# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

详细的部署指南请参考 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 🔧 配置文件说明

### vercel.json

定义了 Vercel 的构建和路由配置：
- 使用 `@vercel/python` 运行时处理 API
- 配置静态文件和 API 的路由规则

### requirements.txt

Python 依赖列表。当前项目不需要外部依赖。

### .vercelignore

定义了不需要上传到 Vercel 的文件。

## 📊 网站统计

当前网站包含：
- **3 本小说**
- **395 章内容**
- **分类**: LGBT+
- **平均每本小说**: 131.67 章

## 🎨 技术栈

### 前端
- HTML5
- CSS3（响应式设计）
- 原生 JavaScript

### 后端
- Python 3.9+
- Vercel Serverless Functions
- 无外部依赖

### 部署
- Vercel（静态托管 + Serverless Functions）

## 📝 开发说明

### 添加新小说

1. 准备 TXT 格式的小说文件
2. 准备封面图片（PNG/JPG）
3. 运行生成脚本：
   ```bash
   python generate_novel.py novel.txt cover.png
   ```
4. 生成的文件会自动添加到 `novels/` 目录
5. 提交并推送到 GitHub，Vercel 会自动部署

### 修改样式

编辑 `assets/css/style.css` 文件，所有页面共享同一个样式表。

### 修改 API

编辑 `api/` 目录下的 Python 文件，推送后会自动部署。

## 🔒 安全说明

- API 端点允许跨域访问（CORS）
- 所有 API 都是只读的，不接受 POST/PUT/DELETE 请求
- 不需要认证或 API 密钥

## 📄 许可证

本项目用于个人学习和展示用途。所有翻译内容尊重原作者版权。

## 🤝 支持

网站包含以下支持方式：
- ☕ [Buy Me a Coffee](https://buymeacoffee.com/yqying95b)
- 💝 [Ko-fi](https://ko-fi.com/crosstheline46370)
- 🎨 [Patreon](https://www.patreon.com/c/CrosstheLine911)

## 📞 联系方式

有问题或建议？欢迎通过以下方式联系：
- 网站: [Cross The Line](https://your-domain.vercel.app)
- GitHub Issues: 在本仓库提交 Issue

---

**Cross The Line** - Where stories transcend boundaries and hearts find their truth.
