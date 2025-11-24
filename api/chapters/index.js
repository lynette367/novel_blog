import { Octokit } from '@octokit/rest';

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

// 获取小说的章节列表
async function getChaptersForNovel(novelId) {
  try {
    const chaptersPath = `data/novels/${novelId}/chapters.json`;
    const chaptersContent = await getFileContent(chaptersPath);
    
    if (!chaptersContent) {
      return [];
    }

    const chaptersData = JSON.parse(chaptersContent);
    return chaptersData.chapters || [];
  } catch (error) {
    console.error('Error loading chapters:', error);
    return [];
  }
}

// 更新 novels.json 中的 totalChapters
async function updateNovelTotalChapters(novelId, totalChapters) {
  try {
    const novelsJsonContent = await getFileContent('data/novels.json');
    if (!novelsJsonContent) {
      return;
    }

    const novelsData = JSON.parse(novelsJsonContent);
    const novelIndex = novelsData.novels.findIndex(n => n.slug === novelId);
    
    if (novelIndex >= 0) {
      novelsData.novels[novelIndex].totalChapters = totalChapters;
      await createOrUpdateFile(
        'data/novels.json',
        JSON.stringify(novelsData, null, 2),
        `Update total chapters for novel: ${novelId}`
      );
    }
  } catch (error) {
    console.error('Error updating novel total chapters:', error);
  }
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
      // 获取小说的所有章节或单个章节
      const { novelId, chapterNum } = req.query;
      
      if (!novelId) {
        return res.status(400).json({ error: 'novelId is required' });
      }

      const chapters = await getChaptersForNovel(novelId);
      
      // 如果指定了 chapterNum，返回单个章节的完整内容
      if (chapterNum) {
        const chapter = chapters.find(ch => ch.number === parseInt(chapterNum));
        if (!chapter) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        return res.status(200).json({ chapter });
      }
      
      // 否则返回所有章节列表（不包含完整内容）
      const formattedChapters = chapters.map(ch => ({
        number: ch.number,
        title: ch.title,
      }));

      return res.status(200).json({ chapters: formattedChapters });
    } else if (req.method === 'POST') {
      // 创建或更新章节
      const { novelId, chapterNum, chapterTitle, chapterContent } = req.body;

      if (!novelId || !chapterNum || !chapterTitle || !chapterContent) {
        return res.status(400).json({
          error: 'novelId, chapterNum, chapterTitle, and chapterContent are required',
        });
      }

      // 获取现有章节数据
      const chaptersPath = `data/novels/${novelId}/chapters.json`;
      const existingChaptersContent = await getFileContent(chaptersPath);
      
      let chaptersData = { chapters: [] };
      if (existingChaptersContent) {
        try {
          chaptersData = JSON.parse(existingChaptersContent);
        } catch (error) {
          console.error('Error parsing chapters.json:', error);
        }
      }

      // 查找章节是否存在
      const chapterIndex = chaptersData.chapters.findIndex(
        ch => ch.number === parseInt(chapterNum)
      );

      const chapterEntry = {
        number: parseInt(chapterNum),
        title: chapterTitle,
        content: chapterContent,
      };

      if (chapterIndex >= 0) {
        // 更新现有章节
        chaptersData.chapters[chapterIndex] = chapterEntry;
      } else {
        // 添加新章节
        chaptersData.chapters.push(chapterEntry);
        // 按章节号排序
        chaptersData.chapters.sort((a, b) => a.number - b.number);
      }

      // 保存更新后的 chapters.json
      await createOrUpdateFile(
        chaptersPath,
        JSON.stringify(chaptersData, null, 2),
        `${chapterIndex >= 0 ? 'Update' : 'Create'} chapter ${chapterNum}: ${chapterTitle}`
      );

      // 更新 novels.json 中的 totalChapters
      await updateNovelTotalChapters(novelId, chaptersData.chapters.length);

      return res.status(200).json({
        success: true,
        chapter: {
          number: parseInt(chapterNum),
          title: chapterTitle,
        },
      });
    } else if (req.method === 'DELETE') {
      // 删除章节
      const { novelId, chapterNum } = req.query;

      if (!novelId || !chapterNum) {
        return res.status(400).json({ error: 'novelId and chapterNum are required' });
      }

      // 获取现有章节数据
      const chaptersPath = `data/novels/${novelId}/chapters.json`;
      const existingChaptersContent = await getFileContent(chaptersPath);
      
      if (!existingChaptersContent) {
        return res.status(404).json({ error: 'Novel not found' });
      }

      let chaptersData = JSON.parse(existingChaptersContent);
      
      // 删除指定章节
      const chapterIndex = chaptersData.chapters.findIndex(
        ch => ch.number === parseInt(chapterNum)
      );

      if (chapterIndex < 0) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      chaptersData.chapters.splice(chapterIndex, 1);

      // 保存更新后的 chapters.json
      await createOrUpdateFile(
        chaptersPath,
        JSON.stringify(chaptersData, null, 2),
        `Delete chapter ${chapterNum}`
      );

      // 更新 novels.json 中的 totalChapters
      await updateNovelTotalChapters(novelId, chaptersData.chapters.length);

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
