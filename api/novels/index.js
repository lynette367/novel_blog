import { Octokit } from '@octokit/rest';

// 初始化 GitHub API
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'lynette367';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'novel_blog';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

// 辅助函数：获取文件内容
async function getFileContent(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: path,
      ref: BRANCH,
    });
    
    if (data.type === 'file') {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    }
    return null;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

// 辅助函数：创建或更新文件
async function createOrUpdateFile(path, content, message) {
  try {
    // 先尝试获取文件（如果存在）
    let sha = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: path,
        ref: BRANCH,
      });
      sha = data.sha;
    } catch (error) {
      // 文件不存在，sha 保持为 null
    }

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: path,
      message: message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch: BRANCH,
      sha: sha,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

// 获取所有小说列表
async function getNovelsList() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'novels',
      ref: BRANCH,
    });

    const novels = [];
    for (const item of data) {
      if (item.type === 'dir') {
        // 检查是否有 index.html
        try {
          const indexContent = await getFileContent(`novels/${item.name}/index.html`);
          if (indexContent) {
            // 提取标题
            const titleMatch = indexContent.match(/<h1>([^<]+)<\/h1>/);
            const title = titleMatch ? titleMatch[1] : item.name;
            
            novels.push({
              id: item.name,
              title: title,
              folder: item.name,
            });
          }
        } catch (error) {
          // 忽略错误，继续下一个
        }
      }
    }

    return novels;
  } catch (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  // 处理 CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 简单的认证检查
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // 获取小说列表
      const novels = await getNovelsList();
      return res.status(200).json({ novels });
    } else if (req.method === 'POST') {
      // 创建新小说
      const { title, description, coverImage } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // 生成文件夹名
      const folderName = title.toLowerCase().replace(/[^\w-]/g, '_').substring(0, 100);
      const novelPath = `novels/${folderName}`;

      // 创建目录页 HTML（简化版，实际应该使用 generate_novel.py 的逻辑）
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Table of Contents | Cross The Line</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../../novels.html" class="back-btn">← Back to Novels</a>
        </div>
    </nav>
    <div class="container">
        <section class="novel-header">
            <div class="novel-header-cover" style="background-image: url('../../assets/images/${coverImage || '1.jpg'}');"></div>
            <div class="novel-header-info">
                <div>
                    <h1>${title}</h1>
                    <div class="novel-meta">
                        <span class="meta-item">✍️ Author: Anonymous</span>
                        <span class="meta-item">🌐 Translator: Cross The Line</span>
                        <span class="meta-item">📅 Status: Ongoing</span>
                    </div>
                </div>
                <span class="novel-category-badge">LGBT+</span>
                <div class="novel-description">
                    ${description ? description.split('\n').map(p => `<p style="margin-bottom: 0.5rem;">${p}</p>`).join('') : ''}
                </div>
            </div>
        </section>
        <section class="chapter-section">
            <div class="section-header">
                <div>
                    <h2>Table of Contents</h2>
                    <span style="color: #7d6d5d; font-size: 0.95rem;">0 Chapters Available</span>
                </div>
            </div>
            <div class="chapter-list" id="chapterList">
            </div>
        </section>
    </div>
    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Cross The Line. All translations published with respect for original authors.</p>
        </div>
    </footer>
    <script src="../../assets/js/main.js"></script>
</body>
</html>`;

      await createOrUpdateFile(
        `${novelPath}/index.html`,
        indexHtml,
        `Create novel: ${title}`
      );

      return res.status(200).json({
        success: true,
        novel: {
          id: folderName,
          title: title,
          folder: folderName,
        },
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

