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

// 从标题创建 slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100)
    .replace(/^_|_$/g, '');
}

// 获取所有小说列表
async function getNovelsList() {
  try {
    const novelsJsonContent = await getFileContent('data/novels.json');
    if (!novelsJsonContent) {
      return [];
    }

    const novelsData = JSON.parse(novelsJsonContent);
    const novels = (novelsData.novels || []).map(novel => ({
      id: novel.slug,
      title: novel.title,
      folder: novel.slug,
    }));

    return novels;
  } catch (error) {
    console.error('Error loading novels:', error);
    return [];
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
      const { title, description, coverImage, category } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // 生成 slug
      const slug = createSlug(title);
      
      // 读取现有的 novels.json
      const novelsJsonContent = await getFileContent('data/novels.json');
      let novelsData = { novels: [] };
      
      if (novelsJsonContent) {
        try {
          novelsData = JSON.parse(novelsJsonContent);
        } catch (error) {
          console.error('Error parsing novels.json:', error);
        }
      }

      // 检查是否已存在相同 slug 的小说
      const existingIndex = novelsData.novels.findIndex(n => n.slug === slug);
      
      const novelEntry = {
        title: title,
        slug: slug,
        category: category || 'BL',
        excerpt: description ? description.substring(0, 220) + (description.length > 220 ? '...' : '') : 'A captivating Asian BL novel exploring themes of romance, drama, and personal growth.',
        description: description || '',
        coverImage: coverImage ? `/assets/images/${coverImage}` : '/assets/images/0.jpg',
        path: `/novels/${slug}`,
        totalChapters: 0,
      };

      if (existingIndex >= 0) {
        // 更新现有小说
        novelsData.novels[existingIndex] = novelEntry;
      } else {
        // 添加新小说
        novelsData.novels.push(novelEntry);
      }

      // 保存更新后的 novels.json
      await createOrUpdateFile(
        'data/novels.json',
        JSON.stringify(novelsData, null, 2),
        `Create/Update novel: ${title}`
      );

      // 创建空的 chapters.json 文件（如果不存在）
      const chaptersPath = `data/novels/${slug}/chapters.json`;
      const existingChapters = await getFileContent(chaptersPath);
      if (!existingChapters) {
        const emptyChaptersData = { chapters: [] };
        await createOrUpdateFile(
          chaptersPath,
          JSON.stringify(emptyChaptersData, null, 2),
          `Initialize chapters for novel: ${title}`
        );
      }

      return res.status(200).json({
        success: true,
        novel: {
          id: slug,
          title: title,
          folder: slug,
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
