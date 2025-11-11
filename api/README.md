# Cross The Line - API 文档

这是 Cross The Line 小说网站的后端 API，使用 Vercel Serverless Functions (Python) 实现。

## 🌐 API 端点

### 1. API 索引
**端点:** `/api/index`  
**方法:** `GET`  
**描述:** 返回所有可用的 API 端点文档

**示例请求:**
```bash
curl https://your-domain.vercel.app/api/index
```

**示例响应:**
```json
{
  "success": true,
  "message": "Cross The Line API",
  "version": "1.0.0",
  "endpoints": [...]
}
```

---

### 2. 小说列表
**端点:** `/api/novels`  
**方法:** `GET`  
**描述:** 获取所有小说的列表和元数据

**示例请求:**
```bash
curl https://your-domain.vercel.app/api/novels
```

**示例响应:**
```json
{
  "success": true,
  "count": 3,
  "novels": [
    {
      "id": "big_brother",
      "title": "Big Brother",
      "description": "A compelling story that explores...",
      "chapters": 70,
      "cover": "big_brother.png",
      "url": "/novels/big_brother/index.html"
    }
  ]
}
```

---

### 3. 章节信息
**端点:** `/api/chapters`  
**方法:** `GET`  
**描述:** 获取指定小说的章节列表或章节内容

**查询参数:**
- `novel_id` (必需): 小说ID
- `chapter` (可选): 章节编号，如果提供则返回章节内容

**示例请求 - 获取章节列表:**
```bash
curl "https://your-domain.vercel.app/api/chapters?novel_id=big_brother"
```

**示例响应:**
```json
{
  "success": true,
  "novel_id": "big_brother",
  "count": 70,
  "chapters": [
    {
      "number": 1,
      "title": "I",
      "url": "/novels/big_brother/chapter1.html"
    }
  ]
}
```

**示例请求 - 获取章节内容:**
```bash
curl "https://your-domain.vercel.app/api/chapters?novel_id=big_brother&chapter=1"
```

**示例响应:**
```json
{
  "success": true,
  "chapter": {
    "number": 1,
    "title": "I",
    "content": ["paragraph 1", "paragraph 2", ...],
    "url": "/novels/big_brother/chapter1.html"
  }
}
```

---

### 4. 搜索
**端点:** `/api/search`  
**方法:** `GET`  
**描述:** 搜索小说标题、描述和章节内容

**查询参数:**
- `q` (必需): 搜索关键词（至少2个字符）
- `type` (可选): 搜索类型
  - `all` (默认): 搜索所有内容
  - `novel`: 只搜索小说标题和描述
  - `chapter`: 只搜索章节内容
- `novel_id` (可选): 限制搜索范围到指定小说

**示例请求 - 搜索所有内容:**
```bash
curl "https://your-domain.vercel.app/api/search?q=brother"
```

**示例请求 - 只搜索小说:**
```bash
curl "https://your-domain.vercel.app/api/search?q=love&type=novel"
```

**示例请求 - 在指定小说中搜索章节:**
```bash
curl "https://your-domain.vercel.app/api/search?q=family&type=chapter&novel_id=big_brother"
```

**示例响应:**
```json
{
  "success": true,
  "query": "brother",
  "count": 5,
  "results": [
    {
      "id": "big_brother",
      "title": "Big Brother",
      "description": "...",
      "chapters": 70,
      "cover": "big_brother.png",
      "url": "/novels/big_brother/index.html",
      "type": "novel"
    },
    {
      "novel_id": "big_brother",
      "novel_title": "Big Brother",
      "chapter_number": 1,
      "chapter_title": "I",
      "context": "...brother...",
      "url": "/novels/big_brother/chapter1.html",
      "type": "chapter"
    }
  ]
}
```

---

### 5. 统计信息
**端点:** `/api/stats`  
**方法:** `GET`  
**描述:** 获取网站统计信息

**示例请求:**
```bash
curl https://your-domain.vercel.app/api/stats
```

**示例响应:**
```json
{
  "success": true,
  "stats": {
    "total_novels": 3,
    "total_chapters": 395,
    "categories": {
      "LGBT+": 3
    },
    "avg_chapters_per_novel": 131.67
  }
}
```

---

## 🔒 CORS 支持

所有 API 端点都支持 CORS，允许从任何域名访问：
```
Access-Control-Allow-Origin: *
```

---

## ❌ 错误处理

所有 API 端点在发生错误时返回统一格式：

```json
{
  "success": false,
  "error": "错误描述"
}
```

常见的 HTTP 状态码：
- `200` - 成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 📝 使用示例

### JavaScript (Fetch API)

```javascript
// 获取小说列表
fetch('https://your-domain.vercel.app/api/novels')
  .then(response => response.json())
  .then(data => {
    console.log('小说列表:', data.novels);
  });

// 搜索
fetch('https://your-domain.vercel.app/api/search?q=love&type=novel')
  .then(response => response.json())
  .then(data => {
    console.log('搜索结果:', data.results);
  });
```

### Python

```python
import requests

# 获取小说列表
response = requests.get('https://your-domain.vercel.app/api/novels')
data = response.json()
print(f"找到 {data['count']} 本小说")

# 获取章节列表
response = requests.get(
    'https://your-domain.vercel.app/api/chapters',
    params={'novel_id': 'big_brother'}
)
data = response.json()
print(f"共有 {data['count']} 章")
```

### cURL

```bash
# 获取小说列表
curl https://your-domain.vercel.app/api/novels

# 获取章节内容
curl "https://your-domain.vercel.app/api/chapters?novel_id=big_brother&chapter=1"

# 搜索
curl "https://your-domain.vercel.app/api/search?q=brother"

# 获取统计信息
curl https://your-domain.vercel.app/api/stats
```

---

## 🚀 本地测试

使用 Vercel CLI 在本地运行 API：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目根目录运行
vercel dev
```

然后访问 http://localhost:3000/api/novels

---

## 📦 部署

API 会自动随网站一起部署到 Vercel。详见 [DEPLOYMENT.md](../DEPLOYMENT.md)。
