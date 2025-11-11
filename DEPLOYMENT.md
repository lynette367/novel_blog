# Cross The Line - Vercel 部署指南

本项目已配置好 Vercel 部署，包含静态前端和 Python Serverless Functions 后端。

## 🚀 快速部署

### 方法 1: 通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测配置

3. **配置项目**
   - **Framework Preset**: 选择 "Other"
   - **Root Directory**: 保持默认 `./`
   - **Build Command**: 留空（静态站点）
   - **Output Directory**: 保持默认 `./`

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（通常 1-2 分钟）
   - 获取你的网站 URL

### 方法 2: 通过 Vercel CLI

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd /workspace
vercel
```

4. **生产环境部署**
```bash
vercel --prod
```

## 📁 项目结构

```
/workspace/
├── api/                      # Serverless Functions (Python)
│   ├── index.py             # API 文档端点
│   ├── novels.py            # 小说列表 API
│   ├── chapters.py          # 章节内容 API
│   ├── search.py            # 搜索 API
│   └── stats.py             # 统计信息 API
├── assets/                   # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── novels/                   # 小说内容
│   ├── big_brother/
│   ├── transmigrated_into_the_villain's_sickly_childhood_friend/
│   └── travel_back_in_time_to_build_up_the_empire/
├── index.html               # 首页
├── novels.html              # 小说列表页
├── vercel.json              # Vercel 配置文件
├── requirements.txt         # Python 依赖
└── .vercelignore           # 忽略文件配置
```

## 🔌 API 端点

部署后，你可以通过以下端点访问后端 API：

### 1. API 文档
```
GET https://your-domain.vercel.app/api/index
```
返回所有可用 API 端点的文档。

### 2. 小说列表
```
GET https://your-domain.vercel.app/api/novels
```
返回所有小说的列表和元数据。

**响应示例：**
```json
{
  "success": true,
  "count": 3,
  "novels": [
    {
      "id": "big_brother",
      "title": "Big Brother",
      "description": "A compelling story...",
      "chapters": 70,
      "cover": "big_brother.png",
      "url": "/novels/big_brother/index.html"
    }
  ]
}
```

### 3. 章节列表/内容
```
GET https://your-domain.vercel.app/api/chapters?novel_id=big_brother
GET https://your-domain.vercel.app/api/chapters?novel_id=big_brother&chapter=1
```

**参数：**
- `novel_id` (必需): 小说ID
- `chapter` (可选): 章节编号，如果提供则返回章节内容

### 4. 搜索
```
GET https://your-domain.vercel.app/api/search?q=brother
GET https://your-domain.vercel.app/api/search?q=love&type=novel
```

**参数：**
- `q` (必需): 搜索关键词（至少2个字符）
- `type` (可选): 搜索类型 (`all`, `novel`, `chapter`)
- `novel_id` (可选): 限制搜索范围到指定小说

### 5. 统计信息
```
GET https://your-domain.vercel.app/api/stats
```
返回网站统计信息（总小说数、章节数等）。

## ⚙️ 配置说明

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*\\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|html))",
      "dest": "/$1"
    }
  ]
}
```

这个配置文件告诉 Vercel：
- 使用 Python 运行时处理 `api/` 目录下的所有 `.py` 文件
- 将 `/api/*` 路由到对应的 Serverless Functions
- 将静态资源直接提供服务

### requirements.txt

目前项目不需要外部 Python 依赖，所以文件为空。如果将来需要添加依赖（如数据库连接），可以在这里添加。

## 🔧 本地测试

### 测试 API（使用 Python 内置服务器）

```bash
# 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 在本地运行开发服务器
vercel dev
```

然后访问：
- 前端: http://localhost:3000
- API: http://localhost:3000/api/novels

### 测试静态页面

```bash
# 使用 Python 简单 HTTP 服务器
python -m http.server 8000
```

然后访问 http://localhost:8000

## 📝 环境变量（可选）

如果需要添加环境变量（如 API 密钥），可以在 Vercel Dashboard 中配置：

1. 进入项目 Settings
2. 选择 Environment Variables
3. 添加变量名和值
4. 在代码中通过 `os.environ.get('VARIABLE_NAME')` 访问

## 🚨 常见问题

### 1. API 返回 404

确保：
- `api/` 目录下的 Python 文件有正确的 `handler` 函数
- `vercel.json` 配置正确
- 重新部署项目

### 2. Python 依赖缺失

在 `requirements.txt` 中添加依赖，然后重新部署。

### 3. CORS 错误

所有 API 端点已经配置了 CORS 头部：
```python
self.send_header('Access-Control-Allow-Origin', '*')
```

如果仍有问题，检查浏览器控制台的具体错误信息。

### 4. 部署超时

如果项目文件太大，可以：
- 在 `.vercelignore` 中添加不需要的文件
- 优化图片大小
- 移除不必要的依赖

## 🔄 自动部署

连接 GitHub 后，每次 push 到 main 分支都会自动触发部署：

1. Push 代码到 GitHub
2. Vercel 自动检测更改
3. 自动构建和部署
4. 部署完成后发送通知

## 📊 监控和日志

在 Vercel Dashboard 中可以查看：
- 部署历史
- 实时日志
- 性能分析
- 错误报告

## 🎉 完成！

部署完成后，你的网站将在以下 URL 可用：
- 生产环境: https://your-project.vercel.app
- 预览环境: https://your-project-git-branch.vercel.app

每个分支都会自动创建预览部署，方便测试。

---

**需要帮助？**
- Vercel 文档: https://vercel.com/docs
- Vercel Python 运行时: https://vercel.com/docs/functions/serverless-functions/runtimes/python
