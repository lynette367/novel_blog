const fs = require('fs');
const path = require('path');

/**
 * 读取小说目录结构
 */
function getNovelFolders() {
  const novelsDir = path.join(process.cwd(), 'novels');
  if (!fs.existsSync(novelsDir)) {
    return [];
  }
  
  return fs.readdirSync(novelsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

/**
 * 获取小说信息
 */
function getNovelInfo(novelSlug) {
  const novelDir = path.join(process.cwd(), 'novels', novelSlug);
  const indexFile = path.join(novelDir, 'index.html');
  
  if (!fs.existsSync(indexFile)) {
    return null;
  }
  
  const html = fs.readFileSync(indexFile, 'utf-8');
  
  // 提取标题
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : novelSlug.replace(/_/g, ' ');
  
  // 提取描述
  const descMatch = html.match(/<div class="novel-description">([\s\S]*?)<\/div>/);
  let description = '';
  if (descMatch) {
    const descHtml = descMatch[1];
    const paragraphs = descHtml.match(/<p[^>]*>([^<]+)<\/p>/g) || [];
    description = paragraphs.map(p => {
      const textMatch = p.match(/<p[^>]*>([^<]+)<\/p>/);
      return textMatch ? textMatch[1].trim() : '';
    }).filter(p => p).join('\n\n');
  }
  
  // 提取封面图片
  const coverMatch = html.match(/background-image:\s*url\('\.\.\/\.\.\/assets\/images\/([^']+)'\)/);
  const coverImage = coverMatch ? coverMatch[1] : null;
  
  // 统计章节数
  const chapterFiles = fs.readdirSync(novelDir)
    .filter(file => file.match(/^chapter\d+\.html$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/chapter(\d+)\.html/)[1]);
      const numB = parseInt(b.match(/chapter(\d+)\.html/)[1]);
      return numA - numB;
    });
  
  return {
    slug: novelSlug,
    title,
    description,
    coverImage,
    totalChapters: chapterFiles.length,
    chapters: chapterFiles.map(file => {
      const numMatch = file.match(/chapter(\d+)\.html/);
      return {
        number: parseInt(numMatch[1]),
        filename: file
      };
    })
  };
}

/**
 * 获取所有小说列表
 */
function getAllNovels() {
  const folders = getNovelFolders();
  return folders.map(slug => getNovelInfo(slug)).filter(novel => novel !== null);
}

/**
 * 获取章节内容
 */
function getChapterContent(novelSlug, chapterNumber) {
  const novelDir = path.join(process.cwd(), 'novels', novelSlug);
  const chapterFile = path.join(novelDir, `chapter${chapterNumber}.html`);
  
  if (!fs.existsSync(chapterFile)) {
    return null;
  }
  
  const html = fs.readFileSync(chapterFile, 'utf-8');
  
  // 提取章节标题
  const titleMatch = html.match(/<h1 class="chapter-title-page">([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNumber}`;
  
  // 提取章节内容
  const contentMatch = html.match(/<div class="chapter-text">([\s\S]*?)<\/div>/);
  let content = '';
  if (contentMatch) {
    const contentHtml = contentMatch[1];
    const paragraphs = contentHtml.match(/<p[^>]*>([^<]+)<\/p>/g) || [];
    content = paragraphs.map(p => {
      const textMatch = p.match(/<p[^>]*>([^<]+)<\/p>/);
      return textMatch ? textMatch[1].trim() : '';
    }).filter(p => p);
  }
  
  // 获取小说信息以确定总章节数
  const novelInfo = getNovelInfo(novelSlug);
  
  return {
    novelSlug,
    chapterNumber: parseInt(chapterNumber),
    title,
    content,
    totalChapters: novelInfo ? novelInfo.totalChapters : 0,
    prevChapter: chapterNumber > 1 ? chapterNumber - 1 : null,
    nextChapter: novelInfo && chapterNumber < novelInfo.totalChapters ? chapterNumber + 1 : null
  };
}

/**
 * 搜索小说
 */
function searchNovels(query) {
  const novels = getAllNovels();
  const searchTerm = query.toLowerCase();
  
  return novels.filter(novel => {
    return novel.title.toLowerCase().includes(searchTerm) ||
           novel.description.toLowerCase().includes(searchTerm) ||
           novel.slug.toLowerCase().includes(searchTerm);
  });
}

module.exports = {
  getNovelFolders,
  getNovelInfo,
  getAllNovels,
  getChapterContent,
  searchNovels
};
