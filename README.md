# Cross The Line 静态站点后端与 Vercel 部署指南

本项目原为纯静态的小说阅读站点，现已补充一组基于 Vercel Python Serverless Functions 的后端接口，并提供部署配置，让 Vercel 能够识别并正确执行。

## 新增后端接口

- `GET /api/novels`：返回全部可用小说的基础信息（标题、封面、章节数量、简介段落等）。
- `GET /api/novels/detail?slug=<slug>`：返回指定小说的完整详情与章节列表。`slug` 对应 `novels/` 目录下的子目录名称。

接口由 `api/novels/` 目录下的 Python 函数实现，核心解析逻辑位于 `backend/novels.py`：

- 自动遍历 `novels/` 目录，读取各小说的 `index.html`，抽取标题、封面、简介与章节信息。
- 结果缓存于内存（同一次无服务器实例生命期内有效），减少重复解析的开销。
- 所有返回结果默认使用 UTF-8 并保留原始中文/英文混合内容。

## 本地快速验证

在项目根目录执行：

```bash
python3 - <<'PY'
from backend.novels import list_novels, get_novel

novels = list_novels()
print(f"发现 {len(novels)} 部小说：", [item['title'] for item in novels])

sample_slug = novels[0]['slug']
detail = get_novel(sample_slug)
print(f\"《{detail['title']}》章节数：\", detail['chapterCount'])
print('首章信息：', detail['chapters'][0])
PY
```

若希望在本地模拟 API 返回，可手动调用 `api/novels/index.py` 与 `api/novels/detail.py` 中的 `handler` 函数。

## Vercel 部署步骤

1. **安装并登录 CLI（如未完成）**
   ```bash
   npm i -g vercel
   vercel login
   ```
2. **链接或初始化项目**
   ```bash
   vercel link   # 按提示选择或创建项目
   ```
3. **运行首个预览部署（可在 CLI 中查看并确认环境类型选择 “Other/静态”）**
   ```bash
   vercel
   ```
4. **发布生产环境**
   ```bash
   vercel deploy --prod
   ```

Vercel 会：

- 直接将根目录视为静态资源输出（包含 `index.html`、`novels/`、`assets/` 等）。
- 依据 `vercel.json` 将 `api/**/*.py` 作为 Python 3.11 运行时的 Serverless Functions 进行部署。

## 注意事项

- 若需自定义依赖，可新增 `requirements.txt`；Vercel 会在部署前自动安装。
- 静态 HTML 中的相对路径已保持不变，部署后访问路径与本地一致。
- 如需扩展更多 API，可在 `api/` 目录继续新增 Python 文件，或在 `backend/` 目录复用解析逻辑。

完成以上步骤后，即可在 Vercel 上获得带后端接口的可用站点。欢迎基于现有结构继续扩展更多功能。

