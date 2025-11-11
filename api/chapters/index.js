import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'lynette367';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'novel_blog';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

// 获取小说目录页内容
async function getNovelIndex(novelFolder) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `novels/${novelFolder}/index.html`,
      ref: BRANCH,
    });
    
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, sha: data.sha };
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

// 更新小说目录页（添加新章节）
async function updateNovelIndex(novelFolder, chapterNum, chapterTitle, totalChapters) {
  const novelIndex = await getNovelIndex(novelFolder);
  if (!novelIndex) {
    throw new Error('Novel not found');
  }

  let content = novelIndex.content;
  
  // 提取章节列表部分
  const chapterListMatch = content.match(/(<div class="chapter-list"[^>]*>)(.*?)(<\/div>\s*<\/section>)/s);
  if (!chapterListMatch) {
    throw new Error('Could not find chapter list section');
  }

  const chapterListStart = chapterListMatch[1];
  const existingChapters = chapterListMatch[2];
  const chapterListEnd = chapterListMatch[3];

  // 检查章节是否已存在
  if (existingChapters.includes(`chapter${chapterNum}.html`)) {
    // 更新现有章节
    const chapterPattern = new RegExp(
      `(<!-- Chapter ${chapterNum} -->\\s*<a[^>]*href="chapter${chapterNum}\\.html"[^>]*>.*?</a>\\s*)`,
      's'
    );
    const newChapterHtml = `                <!-- Chapter ${chapterNum} -->
                <a href="chapter${chapterNum}.html" class="chapter-item" data-chapter="${chapterNum}">
                    <div class="chapter-number">Ch. ${chapterNum}</div>
                    <div class="chapter-details">
                        <div class="chapter-title">${chapterTitle.replace('Chapter ', '')}</div>
                        <div class="chapter-meta-info">
                            <span>📖 Est. 10 min</span>
                        </div>
                    </div>
                    <span class="chapter-arrow">→</span>
                </a>

`;
    
    if (chapterPattern.test(existingChapters)) {
      content = content.replace(chapterPattern, newChapterHtml);
    } else {
      // 如果没找到，添加到末尾
      content = content.replace(
        chapterListMatch[0],
        `${chapterListStart}${existingChapters}${newChapterHtml}            ${chapterListEnd}`
      );
    }
  } else {
    // 添加新章节
    const newChapterHtml = `                <!-- Chapter ${chapterNum} -->
                <a href="chapter${chapterNum}.html" class="chapter-item" data-chapter="${chapterNum}">
                    <div class="chapter-number">Ch. ${chapterNum}</div>
                    <div class="chapter-details">
                        <div class="chapter-title">${chapterTitle.replace('Chapter ', '')}</div>
                        <div class="chapter-meta-info">
                            <span>📖 Est. 10 min</span>
                        </div>
                    </div>
                    <span class="chapter-arrow">→</span>
                </a>

`;
    
    content = content.replace(
      chapterListMatch[0],
      `${chapterListStart}${existingChapters}${newChapterHtml}            ${chapterListEnd}`
    );
  }

  // 更新章节数量
  content = content.replace(
    /(\d+) Chapters Available/,
    `${totalChapters} Chapters Available`
  );

  // 保存更新
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: `novels/${novelFolder}/index.html`,
    message: `Update novel index: Add/Update Chapter ${chapterNum}`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: BRANCH,
    sha: novelIndex.sha,
  });

  return data;
}

// 生成章节 HTML
function generateChapterHtml(chapterNum, chapterTitle, chapterContent, novelTitle, novelFolder, totalChapters) {
  // 格式化内容为段落
  const paragraphs = chapterContent.split('\n').filter(p => p.trim()).map(p => p.trim());
  const paragraphsHtml = paragraphs.map(p => `            <p>${p}</p>\n\n`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapterTitle} | ${novelTitle}</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <style>
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #8b7355, #d4c5b0);
            z-index: 2001;
            transition: width 0.1s ease;
        }
        .chapter-meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            color: #7d6d5d;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="index.html" class="back-btn">← Back to Table of Contents</a>
        </div>
    </nav>
    <header class="chapter-header">
        <div class="chapter-number-badge">Chapter ${chapterNum}</div>
        <h1 class="chapter-title-page">${chapterTitle.replace('Chapter ', '')}</h1>
        <div class="chapter-meta">
            <span>📖 Est. 10 min read</span>
        </div>
    </header>
    <article class="chapter-content">
        <div class="chapter-text">
${paragraphsHtml}        </div>
    </article>
    <nav class="chapter-nav">
${chapterNum > 1 ? `        <a href="chapter${chapterNum - 1}.html" class="nav-btn">← Previous Chapter</a>\n` : '        <a href="#" class="nav-btn disabled">← Previous Chapter</a>\n'}        <a href="index.html" class="index-btn">📚 Table of Contents</a>
${chapterNum < totalChapters ? `        <a href="chapter${chapterNum + 1}.html" class="nav-btn">Next Chapter →</a>\n` : '        <a href="#" class="nav-btn disabled">Next Chapter →</a>\n'}    </nav>
    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Cross The Line. All translations published with respect for original authors.</p>
        </div>
    </footer>
    <script>
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        });
    </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // 获取小说的所有章节
      const { novelId } = req.query;
      
      if (!novelId) {
        return res.status(400).json({ error: 'novelId is required' });
      }

      // 获取小说目录页，解析章节列表
      const novelIndex = await getNovelIndex(novelId);
      if (!novelIndex) {
        return res.status(404).json({ error: 'Novel not found' });
      }

      // 提取章节信息
      const chapterMatches = novelIndex.content.matchAll(
        /<a[^>]*href="chapter(\d+)\.html"[^>]*>.*?<div class="chapter-title">([^<]+)<\/div>/gs
      );

      const chapters = [];
      for (const match of chapterMatches) {
        chapters.push({
          number: parseInt(match[1]),
          title: match[2].trim(),
        });
      }

      chapters.sort((a, b) => a.number - b.number);

      return res.status(200).json({ chapters });
    } else if (req.method === 'POST') {
      // 创建或更新章节
      const { novelId, chapterNum, chapterTitle, chapterContent } = req.body;

      if (!novelId || !chapterNum || !chapterTitle || !chapterContent) {
        return res.status(400).json({
          error: 'novelId, chapterNum, chapterTitle, and chapterContent are required',
        });
      }

      // 获取当前章节数量
      const novelIndex = await getNovelIndex(novelId);
      if (!novelIndex) {
        return res.status(404).json({ error: 'Novel not found' });
      }

      // 计算总章节数
      const existingChapters = (novelIndex.content.match(/chapter\d+\.html/g) || []).length;
      const isNewChapter = !novelIndex.content.includes(`chapter${chapterNum}.html`);
      const totalChapters = isNewChapter ? existingChapters + 1 : existingChapters;

      // 获取小说标题
      const titleMatch = novelIndex.content.match(/<h1>([^<]+)<\/h1>/);
      const novelTitle = titleMatch ? titleMatch[1] : novelId;

      // 生成章节 HTML
      const chapterHtml = generateChapterHtml(
        chapterNum,
        chapterTitle,
        chapterContent,
        novelTitle,
        novelId,
        totalChapters
      );

      // 保存章节文件
      const chapterPath = `novels/${novelId}/chapter${chapterNum}.html`;
      
      let chapterSha = null;
      try {
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: chapterPath,
          ref: BRANCH,
        });
        chapterSha = data.sha;
      } catch (error) {
        // 文件不存在
      }

      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: chapterPath,
        message: `${isNewChapter ? 'Create' : 'Update'} chapter ${chapterNum}: ${chapterTitle}`,
        content: Buffer.from(chapterHtml, 'utf-8').toString('base64'),
        branch: BRANCH,
        sha: chapterSha,
      });

      // 更新目录页
      await updateNovelIndex(novelId, chapterNum, chapterTitle, totalChapters);

      return res.status(200).json({
        success: true,
        chapter: {
          number: chapterNum,
          title: chapterTitle,
        },
      });
    } else if (req.method === 'DELETE') {
      // 删除章节
      const { novelId, chapterNum } = req.query;

      if (!novelId || !chapterNum) {
        return res.status(400).json({ error: 'novelId and chapterNum are required' });
      }

      // 删除章节文件
      try {
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `novels/${novelId}/chapter${chapterNum}.html`,
          ref: BRANCH,
        });

        await octokit.repos.deleteFile({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `novels/${novelId}/chapter${chapterNum}.html`,
          message: `Delete chapter ${chapterNum}`,
          branch: BRANCH,
          sha: data.sha,
        });
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }

      // 更新目录页（移除章节链接）
      const novelIndex = await getNovelIndex(novelId);
      if (novelIndex) {
        let content = novelIndex.content;
        const chapterPattern = new RegExp(
          `<!-- Chapter ${chapterNum} -->\\s*<a[^>]*href="chapter${chapterNum}\\.html"[^>]*>.*?</a>\\s*\\n`,
          's'
        );
        content = content.replace(chapterPattern, '');

        // 更新章节数量
        const chapterCount = (content.match(/chapter\d+\.html/g) || []).length;
        content = content.replace(/(\d+) Chapters Available/, `${chapterCount} Chapters Available`);

        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `novels/${novelId}/index.html`,
          message: `Remove chapter ${chapterNum} from index`,
          content: Buffer.from(content, 'utf-8').toString('base64'),
          branch: BRANCH,
          sha: novelIndex.sha,
        });
      }

      return res.status(200).json({ success: true });
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

