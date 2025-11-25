#!/usr/bin/env node
/**
 * 一键发布小说到 Sanity CMS
 * 
 * 功能：
 * 1. 从 TXT 文件提取小说信息和章节
 * 2. 上传封面图片到 Sanity
 * 3. 创建小说文档
 * 4. 批量创建章节文档
 * 
 * 使用方法：
 *   npm run publish                    # 处理当前目录所有 .txt 文件
 *   npm run publish novel.txt          # 处理指定文件
 *   npm run publish novel.txt cover.png BL  # 指定封面和分类
 */

import { createClient } from '@sanity/client';
import { readFileSync, readdirSync, existsSync, copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 加载环境变量
function loadEnvFile() {
  const envPath = path.join(projectRoot, '.env.local');
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch {
    // 忽略
  }
}

loadEnvFile();

// Sanity 客户端
const client = createClient({
  projectId: 'lke4t7vu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 默认摘要
const DEFAULT_EXCERPT = "Discover this compelling Asian BL novel. A captivating danmei story exploring romance, drama, and character development. Read now in English translation.";

/**
 * 读取文件内容，自动检测编码
 */
function readFileWithEncoding(filePath) {
  const buffer = readFileSync(filePath);
  
  // 尝试 UTF-8
  try {
    const content = buffer.toString('utf-8');
    // 检查是否有乱码特征
    if (!content.includes('�') && !content.includes('Ã')) {
      return content;
    }
  } catch {
    // 继续尝试其他编码
  }
  
  // 尝试 Latin-1 (ISO-8859-1)
  return buffer.toString('latin1');
}

/**
 * 从标题创建 slug
 */
function createSlug(title) {
  let slug = title.toLowerCase().replace(/\s+/g, '_');
  slug = slug.replace(/[^\w-]/g, '');
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
  }
  return slug;
}

/**
 * 创建简洁的摘要
 */
function buildExcerpt(rawDescription) {
  if (rawDescription) {
    let excerpt = rawDescription.replace(/\s+/g, ' ').trim();
    if (excerpt.length > 220) {
      excerpt = excerpt.substring(0, 217).trim() + '...';
    }
    return excerpt;
  }
  return DEFAULT_EXCERPT;
}

/**
 * 从txt文件中提取小说信息
 */
function extractNovelInfo(txtFile) {
  const content = readFileWithEncoding(txtFile);
  const lines = content.split('\n');
  
  // 从文件名提取标题
  const fileName = path.basename(txtFile, '.txt');
  let titleFromFilename = fileName.replace(/[-_]/g, ' ');
  titleFromFilename = titleFromFilename.replace(/[^\w\s-]/g, '');
  titleFromFilename = titleFromFilename.replace(/\s+/g, ' ').trim();
  
  // 从内容中提取标题
  let titleFromContent = null;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const stripped = lines[i].trim();
    if (stripped && !/^(Author|Text|Title|作者|标题|正文)[:：]/i.test(stripped)) {
      if (stripped.length <= 50 && 
          !stripped.startsWith('"') && 
          !stripped.startsWith("'") &&
          !/[.!?]{2,}/.test(stripped) &&
          !stripped.includes('This is') &&
          !stripped.toLowerCase().includes('they are')) {
        titleFromContent = stripped;
        break;
      }
    }
  }
  
  // 选择最佳标题
  let title;
  if (titleFromFilename && titleFromFilename.length > 3) {
    title = titleFromFilename;
  } else if (titleFromContent && titleFromContent.length > 3) {
    title = titleFromContent;
  } else {
    title = "Untitled Novel";
  }
  
  title = title.replace(/^["']+|["']+$/g, '');
  title = title.replace(/\s+/g, ' ').trim();
  
  // 找到第一个章节的位置
  let firstChapterIdx = null;
  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].trim();
    if (/^\d+\.\s*Chapter/i.test(stripped) ||
        /^[^\w]*Chapter\s+\d+/i.test(stripped) ||
        /^[^\w]*Chapter\s+[IVXLC]+/i.test(stripped) ||
        /Chapter\s+\d+/i.test(stripped)) {
      if (stripped.length < 100 || /^[^\w]*Chapter\s+\d+/i.test(stripped)) {
        firstChapterIdx = i;
        break;
      }
    }
  }
  
  // 提取简介
  let descriptionStart = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().toLowerCase() === 'contents') {
      descriptionStart = i + 1;
      break;
    }
  }
  
  if (descriptionStart === null) {
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*Text\s*[:：]/i.test(lines[i])) {
        descriptionStart = i + 1;
        break;
      }
    }
  }
  
  if (descriptionStart === null) {
    descriptionStart = 0;
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const stripped = lines[i].trim();
      if (!stripped) continue;
      if (/^(Author|Title|作者|标题)[:：]/i.test(stripped)) {
        descriptionStart = i + 1;
        continue;
      }
      if (/^\s*Text\s*[:：]/i.test(stripped)) {
        descriptionStart = i + 1;
        break;
      }
      if (!/Chapter\s+\d+/i.test(stripped)) {
        if (descriptionStart === 0 || i > descriptionStart) {
          descriptionStart = i;
          break;
        }
      }
    }
  }
  
  const descriptionLines = [];
  if (firstChapterIdx !== null && descriptionStart < firstChapterIdx) {
    for (let i = descriptionStart; i < firstChapterIdx; i++) {
      const line = lines[i].trim();
      if (line && !/Chapter\s+\d+/i.test(line)) {
        if (!/^(Author|Text|Title|作者|标题|正文)[:：]/i.test(line)) {
          descriptionLines.push(line);
        }
      }
    }
  }
  
  const description = descriptionLines.join('\n');
  
  return { title, description, content };
}

/**
 * 提取所有章节
 * 支持多种章节格式：
 * - "Chapter One..."
 * - "Chapter 1..."
 * - "1. Chapter One..."
 * - "Chapter 124. Side Story 1"
 * - "123. Chapter 123 (Final)"
 */
function extractChapters(content) {
  const lines = content.split('\n');
  const chapters = [];
  let currentChapter = null;
  let currentContent = [];
  let chapterCounter = 0;
  
  // 英文数字映射
  const wordToNum = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25,
    'twenty-six': 26, 'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, 'thirty': 30,
    'thirty-one': 31, 'thirty-two': 32, 'thirty-three': 33, 'thirty-four': 34, 'thirty-five': 35,
    'thirty-six': 36, 'thirty-seven': 37, 'thirty-eight': 38, 'thirty-nine': 39, 'forty': 40,
    'forty-one': 41, 'forty-two': 42, 'forty-three': 43, 'forty-four': 44, 'forty-five': 45,
    'forty-six': 46, 'forty-seven': 47, 'forty-eight': 48, 'forty-nine': 49, 'fifty': 50,
  };
  
  // 大数字英文
  const bigWordToNum = {
    'one hundred': 100, 'one hundred and one': 101, 'one hundred and two': 102,
    'one hundred and three': 103, 'one hundred and four': 104, 'one hundred and five': 105,
    'one hundred and six': 106, 'one hundred and seven': 107, 'one hundred and eight': 108,
    'one hundred and nine': 109, 'one hundred and ten': 110,
  };
  
  function parseChapterNumber(text) {
    // 先尝试直接解析数字
    const numMatch = text.match(/\d+/);
    if (numMatch) {
      return parseInt(numMatch[0], 10);
    }
    
    // 尝试解析英文数字
    const lowerText = text.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // 先检查大数字
    for (const [word, num] of Object.entries(bigWordToNum)) {
      if (lowerText.includes(word)) {
        return num;
      }
    }
    
    // 再检查小数字
    for (const [word, num] of Object.entries(wordToNum)) {
      if (lowerText === word || lowerText.startsWith(word + ' ') || lowerText.endsWith(' ' + word)) {
        return num;
      }
    }
    
    return null;
  }
  
  for (const line of lines) {
    const stripped = line.trim();
    
    // 跳过太长的行（可能是正文）
    if (stripped.length > 200) continue;
    
    // 跳过 Author's Note
    if (/^Author'?s?\s*Note/i.test(stripped)) continue;
    
    let chapterNum = null;
    let chapterTitle = null;
    let isChapter = false;
    
    // 格式1: "123. Chapter 123 (Final) ..." 或 "1. Chapter One..."
    const match1 = stripped.match(/^(\d+)\.\s*(Chapter\s+.+?)(?:\.\.\.|\s*$)/i);
    if (match1) {
      chapterNum = parseInt(match1[1], 10);
      chapterTitle = match1[2].replace(/\.+$/, '').trim();
      isChapter = true;
    }
    
    // 格式2: "Chapter 124. Side Story 1" 或 "Chapter 128. Bonus 2 Plus"
    if (!isChapter) {
      const match2 = stripped.match(/^Chapter\s+(\d+)\.\s*(.+?)(?:\.\.\.|\s*$)/i);
      if (match2) {
        chapterNum = parseInt(match2[1], 10);
        chapterTitle = `Chapter ${match2[1]}. ${match2[2].replace(/\.+$/, '').trim()}`;
        isChapter = true;
      }
    }
    
    // 格式3: "Chapter 111" 或 "Chapter 28..."
    if (!isChapter) {
      const match3 = stripped.match(/^Chapter\s+(\d+)(?:\.\.\.|\s*$)/i);
      if (match3) {
        chapterNum = parseInt(match3[1], 10);
        chapterTitle = `Chapter ${match3[1]}`;
        isChapter = true;
      }
    }
    
    // 格式4: "Chapter One..." 或 "Chapter Twenty-Three ..."
    if (!isChapter) {
      const match4 = stripped.match(/^Chapter\s+([A-Za-z][A-Za-z\s-]+?)(?:\.\.\.|\s*$)/i);
      if (match4) {
        const wordNum = parseChapterNumber(match4[1]);
        if (wordNum) {
          chapterNum = wordNum;
          chapterTitle = `Chapter ${match4[1].replace(/\.+$/, '').trim()}`;
          isChapter = true;
        }
      }
    }
    
    // 格式5: " Chapter 2..." (带前导空格)
    if (!isChapter) {
      const match5 = stripped.match(/Chapter\s+(\d+)(?:\.\.\.|\s*$)/i);
      if (match5 && stripped.length < 50) {
        chapterNum = parseInt(match5[1], 10);
        chapterTitle = `Chapter ${match5[1]}`;
        isChapter = true;
      }
    }
    
    // 格式6: Final Chapter
    if (!isChapter && /^Final\s+Chapter/i.test(stripped)) {
      chapterCounter++;
      chapterNum = chapterCounter;
      chapterTitle = "Final Chapter";
      isChapter = true;
    }
    
    // 格式7: Extra/Bonus chapters
    if (!isChapter) {
      const extraMatch = stripped.match(/^(Extra|Bonus)\s+(\d+|[IVXLC]+)/i);
      if (extraMatch && currentChapter !== null) {
        chapterCounter++;
        chapterNum = chapterCounter;
        chapterTitle = stripped.replace(/\.+$/, '').trim();
        isChapter = true;
      }
    }
    
    if (isChapter && chapterNum !== null) {
      // 保存上一章
      if (currentChapter !== null) {
        chapters.push({
          number: currentChapter.number,
          title: currentChapter.title,
          content: currentContent.join('\n').trim()
        });
      }
      
      currentChapter = {
        number: chapterNum,
        title: chapterTitle
      };
      currentContent = [];
      if (chapterNum > chapterCounter) {
        chapterCounter = chapterNum;
      }
    } else {
      if (currentChapter !== null) {
        currentContent.push(line);
      }
    }
  }
  
  // 保存最后一章
  if (currentChapter !== null) {
    chapters.push({
      number: currentChapter.number,
      title: currentChapter.title,
      content: currentContent.join('\n').trim()
    });
  }
  
  return chapters;
}

/**
 * 上传图片到 Sanity
 */
async function uploadImage(imagePath) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const filename = path.basename(imagePath);
    
    log(`  上传封面图片: ${filename}`, 'cyan');
    
    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    log(`  图片上传失败: ${error.message}`, 'red');
    return null;
  }
}

/**
 * 检查小说是否已存在
 */
async function checkNovelExists(slug) {
  const query = `*[_type == "novel" && slug.current == $slug][0]{ _id }`;
  const result = await client.fetch(query, { slug });
  return result?._id || null;
}

/**
 * 创建或更新小说
 */
async function createOrUpdateNovel(novelData, coverImageAsset, existingId = null) {
  const slug = createSlug(novelData.title);
  const excerpt = buildExcerpt(novelData.description);
  
  const doc = {
    _type: 'novel',
    _id: existingId || `novel-${slug}`,
    title: novelData.title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    category: novelData.category || 'BL',
    excerpt: excerpt,
    description: novelData.description || excerpt,
    totalChapters: novelData.totalChapters || 0,
    publishedAt: new Date().toISOString(),
  };
  
  if (coverImageAsset) {
    doc.coverImage = coverImageAsset;
  }
  
  await client.createOrReplace(doc);
  return { id: doc._id, slug };
}

/**
 * 批量创建章节
 */
async function createChapters(novelId, slug, chapters) {
  const batchSize = 50;
  let successCount = 0;
  
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    const transaction = client.transaction();
    
    for (const chapter of batch) {
      const chapterDoc = {
        _type: 'chapter',
        _id: `chapter-${slug}-${chapter.number}`,
        novel: {
          _type: 'reference',
          _ref: novelId,
        },
        number: chapter.number,
        title: chapter.title || `Chapter ${chapter.number}`,
        content: chapter.content || '',
        publishedAt: new Date().toISOString(),
      };
      transaction.createOrReplace(chapterDoc);
    }
    
    try {
      await transaction.commit();
      successCount += batch.length;
      log(`  ✓ 章节 ${i + 1}-${Math.min(i + batchSize, chapters.length)} 创建成功`, 'green');
    } catch (error) {
      log(`  ✗ 章节批量创建失败: ${error.message}`, 'red');
    }
  }
  
  return successCount;
}

/**
 * 处理单个小说文件
 */
async function processNovel(txtFile, coverImage = null, category = 'BL') {
  const txtPath = path.resolve(txtFile);
  
  if (!existsSync(txtPath)) {
    log(`错误: 文件不存在 ${txtFile}`, 'red');
    return null;
  }
  
  log(`\n处理文件: ${txtFile}`, 'yellow');
  
  // 提取小说信息
  const { title, description, content } = extractNovelInfo(txtPath);
  log(`  标题: ${title}`, 'cyan');
  
  const slug = createSlug(title);
  log(`  Slug: ${slug}`, 'dim');
  
  // 提取章节
  const chapters = extractChapters(content);
  log(`  找到 ${chapters.length} 个章节`, 'cyan');
  
  if (chapters.length === 0) {
    log(`  警告: 未找到任何章节，跳过此文件`, 'yellow');
    return null;
  }
  
  // 处理封面图片
  let coverImageAsset = null;
  let coverPath = coverImage;
  
  if (!coverPath) {
    // 自动查找同名图片
    const baseName = path.basename(txtFile, '.txt');
    const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    const txtDir = path.dirname(txtPath);
    
    for (const ext of possibleExtensions) {
      const tryPath = path.join(txtDir, baseName + ext);
      if (existsSync(tryPath)) {
        coverPath = tryPath;
        break;
      }
    }
  }
  
  if (coverPath && existsSync(coverPath)) {
    coverImageAsset = await uploadImage(coverPath);
  } else {
    log(`  警告: 未找到封面图片`, 'yellow');
  }
  
  // 检查小说是否已存在
  const existingId = await checkNovelExists(slug);
  if (existingId) {
    log(`  小说已存在，将更新内容`, 'yellow');
  }
  
  // 创建或更新小说
  try {
    const { id: novelId } = await createOrUpdateNovel(
      { title, description, category, totalChapters: chapters.length },
      coverImageAsset,
      existingId
    );
    log(`  ✓ 小说${existingId ? '更新' : '创建'}成功`, 'green');
    
    // 创建章节
    const successCount = await createChapters(novelId, slug, chapters);
    
    // 更新小说的章节数
    await client.patch(novelId).set({ totalChapters: chapters.length }).commit();
    
    log(`\n✓ 发布成功: ${title}`, 'green');
    log(`  章节数: ${successCount}/${chapters.length}`, 'green');
    log(`  访问地址: /novels/${slug}`, 'cyan');
    
    return slug;
  } catch (error) {
    log(`  ✗ 发布失败: ${error.message}`, 'red');
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  // 检查 token
  if (!process.env.SANITY_API_TOKEN) {
    log('错误: 请在 .env.local 中设置 SANITY_API_TOKEN', 'red');
    process.exit(1);
  }
  
  log('\n========================================', 'cyan');
  log('   一键发布小说到 Sanity CMS', 'cyan');
  log('========================================\n', 'cyan');
  
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // 处理指定文件
    const txtFile = args[0];
    const coverImage = args[1] || null;
    const category = args[2] || 'BL';
    await processNovel(txtFile, coverImage, category);
  } else {
    // 处理当前目录所有 .txt 文件
    const files = readdirSync('.').filter(f => f.endsWith('.txt'));
    
    if (files.length === 0) {
      log('当前目录没有找到 .txt 文件', 'yellow');
      log('\n使用方法:', 'cyan');
      log('  npm run publish                      # 处理所有 .txt 文件', 'dim');
      log('  npm run publish novel.txt            # 处理指定文件', 'dim');
      log('  npm run publish novel.txt cover.png  # 指定封面图片', 'dim');
      log('  npm run publish novel.txt cover.png ROMANCE  # 指定分类', 'dim');
      return;
    }
    
    log(`找到 ${files.length} 个 .txt 文件\n`, 'green');
    
    for (const file of files) {
      await processNovel(file);
    }
  }
  
  log('\n========================================', 'cyan');
  log('   发布完成！', 'green');
  log('========================================\n', 'cyan');
}

main().catch(error => {
  log(`\n错误: ${error.message}`, 'red');
  process.exit(1);
});

