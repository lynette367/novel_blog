#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动生成小说网页脚本
将txt小说文件自动切割成章节并生成网页
"""

import os
import re
import shutil
from pathlib import Path

def extract_novel_info(txt_file):
    """从txt文件中提取小说信息"""
    # 将txt_file转换为Path对象
    txt_path = Path(txt_file)
    
    # 读取原始字节
    with open(txt_path, 'rb') as f:
        raw_bytes = f.read()
    
    # 首先尝试 UTF-8（最常见）
    # 检查是否是有效的 UTF-8
    content = None
    used_encoding = None
    
    # 尝试 UTF-8
    try:
        test_content = raw_bytes.decode('utf-8')
        # 检查是否有明显的乱码模式（如果文件真的是 UTF-8，不应该有这些）
        sample = test_content[:500]
        # 如果包含常见的乱码字符，可能不是 UTF-8
        suspicious_in_utf8 = ['¡', '©', 'Â', 'Ã']
        if not any(pattern in sample for pattern in suspicious_in_utf8):
            content = test_content
            used_encoding = 'utf-8'
    except (UnicodeDecodeError, UnicodeError):
        pass
    
    # 如果 UTF-8 失败，尝试其他编码（优先 GBK，因为中文文件常用）
    if content is None:
        encodings = ['gbk', 'gb2312', 'utf-8-sig', 'cp1252']
        for encoding in encodings:
            try:
                # 先尝试严格解码
                test_content = raw_bytes.decode(encoding, errors='strict')
                # 对于 GBK/GB2312，验证解码结果是否合理
                if encoding in ['gbk', 'gb2312']:
                    sample = test_content[:500]
                    # 检查是否包含明显的乱码（GBK 解码应该不会产生这些字符）
                    if '¡' not in sample and '©' not in sample:
                        content = test_content
                        used_encoding = encoding
                        break
                else:
                    content = test_content
                    used_encoding = encoding
                    break
            except (UnicodeDecodeError, UnicodeError):
                # 如果严格解码失败，尝试忽略错误（对于可能有少量无效字节的文件）
                try:
                    test_content = raw_bytes.decode(encoding, errors='ignore')
                    # 验证前500字符是否合理
                    sample = test_content[:500]
                    if encoding in ['gbk', 'gb2312']:
                        if '¡' not in sample and '©' not in sample and len(sample) > 100:
                            content = test_content
                            used_encoding = encoding
                            break
                    elif len(sample) > 100:
                        content = test_content
                        used_encoding = encoding
                        break
                except:
                    continue
    
    # 如果还是失败，最后尝试 latin-1（但需要验证）
    if content is None:
        try:
            test_content = raw_bytes.decode('latin-1')
            # 检查是否是误读的 UTF-8
            sample = test_content[:500]
            suspicious_patterns = ['¡', '©', 'Â', 'Ã', 'â', 'ã']
            # 如果包含很多乱码字符，尝试用 UTF-8 重新解码
            if any(pattern in sample for pattern in suspicious_patterns):
                # 再次尝试 UTF-8，这次忽略错误
                try:
                    utf8_content = raw_bytes.decode('utf-8', errors='strict')
                    # 验证 UTF-8 版本是否更合理
                    utf8_sample = utf8_content[:500]
                    if not any(p in utf8_sample for p in suspicious_patterns):
                        content = utf8_content
                        used_encoding = 'utf-8'
                    else:
                        content = test_content
                        used_encoding = 'latin-1'
                except:
                    content = test_content
                    used_encoding = 'latin-1'
            else:
                content = test_content
                used_encoding = 'latin-1'
        except Exception:
            pass
    
    if content is None:
        raise ValueError(f"Could not decode {txt_file} with any encoding")
    
    lines = content.split('\n')
    
    # 提取标题
    # 优先从文件名提取标题（更可靠）
    title_from_filename = txt_path.stem.replace('-', ' ').replace('_', ' ')
    # 清理文件名中的特殊字符
    title_from_filename = re.sub(r'[^\w\s-]', '', title_from_filename)
    title_from_filename = re.sub(r'\s+', ' ', title_from_filename).strip()
    
    # 也可以尝试从文件内容提取标题（仅作为备选）
    # 但通常文件名更可靠，所以优先使用文件名
    title_from_content = None
    for line in lines[:5]:  # 只检查前5行
        stripped = line.strip()
        # 跳过空行和明显的元数据标记
        if stripped and not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', stripped, re.IGNORECASE):
            # 只接受短的、看起来像标题的行（不超过50个字符，不包含句子标点）
            if (len(stripped) <= 50 and 
                not stripped.startswith('"') and 
                not stripped.startswith("'") and
                not re.search(r'[.!?]{2,}', stripped) and  # 不包含多个句号/问号/感叹号
                not 'This is' in stripped and  # 排除明显是简介开头的句子
                not 'they are' in stripped.lower()):
                title_from_content = stripped
                break
    
    # 优先使用文件名作为标题
    if title_from_filename and len(title_from_filename) > 3:
        title = title_from_filename
    elif title_from_content and len(title_from_content) > 3:
        title = title_from_content
    else:
        title = "Untitled Novel"
    
    # 清理标题中的特殊字符和引号
    title = re.sub(r'^["\']+|["\']+$', '', title)  # 移除首尾引号
    title = re.sub(r'\s+', ' ', title).strip()
    
    # 找到第一个章节（支持多种格式）
    first_chapter_idx = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        # 支持格式：
        # 1. "1. Chapter X" 
        # 2. "Chapter 1" (没有数字前缀)
        # 3. "Chapter I" (罗马数字)
        # 4. "?, Chapter 1" (问号前缀)
        # 5. "Chapter 1" (可能在行中有其他字符，但包含 "Chapter 数字" 模式)
        if (re.match(r'^\d+\.\s*Chapter', stripped, re.IGNORECASE) or
            re.match(r'^[^\w]*Chapter\s+\d+', stripped, re.IGNORECASE) or
            re.match(r'^[^\w]*Chapter\s+[IVXLC]+', stripped, re.IGNORECASE) or
            re.search(r'Chapter\s+\d+', stripped, re.IGNORECASE)):
            # 确保这一行确实是一个章节标题（不是章节内容中的文字）
            # 检查是否看起来像一个标题（通常章节标题是独立的行，不包含太多文字）
            if len(stripped) < 100 or re.match(r'^[^\w]*Chapter\s+\d+', stripped, re.IGNORECASE):
                first_chapter_idx = i
                break
    
    # 找到简介部分
    # 1. 如果有 "Contents" 标记，从其后开始
    # 2. 如果有 "Text:" 标记，从其后开始
    # 3. 否则从标题和作者信息后开始
    description_start = None
    
    # 查找 "Contents" 标记
    for i, line in enumerate(lines):
        if line.strip().lower() == 'contents':
            description_start = i + 1
            break
    
    # 如果没有找到 "Contents"，查找 "Text:" 标记
    if description_start is None:
        for i, line in enumerate(lines):
            if re.match(r'^\s*Text\s*[:：]', line, re.IGNORECASE):
                description_start = i + 1
                break
    
    # 如果还是没有找到，跳过标题和作者信息
    if description_start is None:
        # 跳过空行、标题、作者信息
        description_start = 0
        for i, line in enumerate(lines[:20]):
            stripped = line.strip()
            # 跳过空行、标题行、作者行
            if not stripped:
                continue
            if re.match(r'^(Author|Title|作者|标题)[:：]', stripped, re.IGNORECASE):
                description_start = i + 1
                continue
            # 如果遇到 "Text:" 标记，从下一行开始
            if re.match(r'^\s*Text\s*[:：]', stripped, re.IGNORECASE):
                description_start = i + 1
                break
            # 如果这一行看起来像简介内容（不是章节标题），开始提取
            if not re.search(r'Chapter\s+\d+', stripped, re.IGNORECASE):
                if description_start == 0 or i > description_start:
                    description_start = i
                    break
    
    # 提取简介（从 description_start 到第一个章节之前）
    description_lines = []
    if first_chapter_idx is not None and description_start < first_chapter_idx:
        # 从 description_start 到第一个章节之前的所有内容
        for i in range(description_start, first_chapter_idx):
            line = lines[i].strip()
            # 跳过明显的章节标题行（即使被误识别）
            if line and not re.search(r'Chapter\s+\d+', line, re.IGNORECASE):
                # 跳过一些明显的元数据标记
                if not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', line, re.IGNORECASE):
                    description_lines.append(line)
    elif first_chapter_idx is None:
        # 如果没有找到章节，尝试更智能的方法
        # 查找包含 "Chapter" 关键词的行（即使格式不完全匹配）
        potential_chapter_idx = None
        for i, line in enumerate(lines[description_start:description_start+50], description_start):
            if re.search(r'\bChapter\s+\d+\b', line, re.IGNORECASE):
                # 检查这一行是否看起来像章节标题（简短，主要是章节信息）
                if len(line.strip()) < 150:
                    potential_chapter_idx = i
                    break
        
        if potential_chapter_idx:
            # 使用找到的潜在章节位置
            for i in range(description_start, potential_chapter_idx):
                line = lines[i].strip()
                if line and not re.search(r'Chapter\s+\d+', line, re.IGNORECASE):
                    if not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', line, re.IGNORECASE):
                        description_lines.append(line)
        else:
            # 最后的手段：取前20行作为简介（排除标题和明显的元数据）
            for i in range(description_start, min(description_start + 20, len(lines))):
                line = lines[i].strip()
                if line and not re.search(r'Chapter\s+\d+', line, re.IGNORECASE):
                    if not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', line, re.IGNORECASE):
                        description_lines.append(line)
    
    description = '\n'.join(description_lines)
    
    return title, description, content

def extract_chapters(content):
    """提取所有章节"""
    # 确保内容是字符串
    if isinstance(content, bytes):
        content = content.decode('utf-8', errors='ignore')
    lines = content.split('\n')
    chapters = []
    current_chapter = None
    current_content = []
    chapter_counter = 0  # 用于追踪章节编号
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # 匹配章节标题：支持多种格式
        # 1. 数字. Chapter 罗马数字/数字 (如 "1. Chapter I", "1. Chapter 1")
        # 2. 数字. Final Chapter (如 "69. Final Chapter")
        # 3. 数字. Extra (如 "70. Extra I")
        # 4. Chapter 数字 (如 "Chapter 1", "Chapter 2") - 没有数字前缀
        # 5. Chapter 罗马数字 (如 "Chapter I")
        # 6. Final Chapter
        # 7. Extra I (没有数字前缀)
        
        match = None
        chapter_num = None
        chapter_title = None
        
        # 格式1-3: "数字. Chapter/Extra/Final Chapter ..."
        match1 = re.match(r'^(\d+)\.\s*(Chapter\s+[IVXLC\d]+.*?|Final\s+Chapter|Extra\s+[IVXLC\d]+.*?)\s*$', stripped, re.IGNORECASE)
        if match1:
            chapter_num = int(match1.group(1))
            chapter_title = match1.group(2).strip()
            match = match1
        else:
            # 格式4: "Chapter 数字" (没有数字前缀，可能前面有其他字符如 "?, Chapter 1")
            match2 = re.search(r'Chapter\s+(\d+)', stripped, re.IGNORECASE)
            if match2:
                chapter_num = int(match2.group(1))
                chapter_title = f"Chapter {chapter_num}"
                match = match2
            else:
                # 格式5: "Chapter 罗马数字"
                match3 = re.match(r'^Chapter\s+([IVXLC]+)\s*$', stripped, re.IGNORECASE)
                if match3:
                    chapter_counter += 1
                    chapter_num = chapter_counter
                    chapter_title = f"Chapter {match3.group(1)}"
                    match = match3
                else:
                    # 格式6: "Final Chapter"
                    if re.match(r'^Final\s+Chapter\s*$', stripped, re.IGNORECASE):
                        chapter_counter += 1
                        chapter_num = chapter_counter
                        chapter_title = "Final Chapter"
                        match = True
                    else:
                        # 格式7: "Extra I" (没有数字前缀，需要当前已有章节)
                        extra_match = re.match(r'^(Extra\s+[IVXLC\d]+.*?)$', stripped, re.IGNORECASE)
                        if extra_match and current_chapter is not None:
                            chapter_counter += 1
                            chapter_num = chapter_counter
                            chapter_title = extra_match.group(1).strip()
                            match = extra_match
        
        if match:
            # 保存上一个章节
            if current_chapter is not None:
                chapters.append({
                    'number': current_chapter['number'],
                    'title': current_chapter['title'],
                    'content': '\n'.join(current_content).strip()
                })
            
            # 开始新章节
            current_chapter = {
                'number': chapter_num,
                'title': chapter_title
            }
            current_content = []
            # 更新章节计数器（如果章节编号大于计数器，更新计数器）
            if chapter_num > chapter_counter:
                chapter_counter = chapter_num
        else:
            # 如果不是章节标题，添加到当前章节内容
            if current_chapter is not None:
                current_content.append(line)
    
    # 保存最后一个章节
    if current_chapter is not None:
        chapters.append({
            'number': current_chapter['number'],
            'title': current_chapter['title'],
            'content': '\n'.join(current_content).strip()
        })
    
    return chapters

def generate_chapter_html(chapter, novel_title, novel_folder, total_chapters):
    """生成章节HTML页面"""
    chapter_num = chapter['number']
    chapter_title = chapter['title']
    chapter_content = chapter['content']
    
    # 格式化章节内容（段落处理）
    paragraphs = []
    for para in chapter_content.split('\n'):
        para = para.strip()
        if para:
            paragraphs.append(para)
    
    # 生成HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{chapter_title} | {novel_title}</title>
    <meta name="description" content="Read {chapter_title} of {novel_title} - A compelling Asian pop novel translation.">
    <meta name="keywords" content="{novel_title}, {chapter_title}, asian pop novel, translated fiction">
    <link rel="stylesheet" href="../../assets/css/style.css">
    <style>
        .progress-bar {{
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #8b7355, #d4c5b0);
            z-index: 2001;
            transition: width 0.1s ease;
        }}

        .chapter-meta {{
            display: flex;
            justify-content: center;
            gap: 2rem;
            color: #7d6d5d;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }}

        .chapter-meta span {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }}
    </style>
</head>
<body>
    <!-- Reading Progress Bar -->
    <div class="progress-bar" id="progressBar"></div>

    <!-- Top Navigation -->
    <nav class="top-nav">
        <div class="nav-container">
            <a href="index.html" class="back-btn">← Back to Table of Contents</a>
        </div>
    </nav>

    <!-- Chapter Header -->
    <header class="chapter-header">
        <div class="chapter-number-badge">Chapter {chapter_num}</div>
        <h1 class="chapter-title-page">{chapter_title.replace('Chapter ', '')}</h1>
        <div class="chapter-meta">
            <span>📖 Est. 10 min read</span>
        </div>
    </header>

    <!-- Chapter Content -->
    <article class="chapter-content">
        <div class="chapter-text">
"""
    
    # 添加段落
    for para in paragraphs:
        html += f"            <p>{para}</p>\n\n"
    
    html += """        </div>
    </article>

    <!-- Chapter Navigation -->
    <nav class="chapter-nav">
"""
    
    # 上一章按钮
    if chapter_num > 1:
        prev_num = chapter_num - 1
        html += f'        <a href="chapter{prev_num}.html" class="nav-btn">← Previous Chapter</a>\n'
    else:
        html += '        <a href="#" class="nav-btn disabled">← Previous Chapter</a>\n'
    
    # 目录按钮
    html += '        <a href="index.html" class="index-btn">📚 Table of Contents</a>\n'
    
    # 下一章按钮
    if chapter_num < total_chapters:
        next_num = chapter_num + 1
        html += f'        <a href="chapter{next_num}.html" class="nav-btn">Next Chapter →</a>\n'
    else:
        html += '        <a href="#" class="nav-btn disabled">Next Chapter →</a>\n'
    
    html += """    </nav>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Cross The Line. All translations published with respect for original authors.</p>
        </div>
    </footer>

    <script>
        // Reading progress bar
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        });

        // Track reading progress
        window.addEventListener('load', () => {{
            localStorage.setItem('{novel_title.lower().replace(" ", "_")}_chapter{chapter_num}_read', 'true');
        }});
    </script>
</body>
</html>"""
    
    return html

def generate_index_html(novel_title, description, chapters, cover_image):
    """生成小说目录页"""
    # 格式化简介
    description_paragraphs = description.split('\n')
    formatted_description = '<br><br>'.join([f'<p style="margin-bottom: 1rem;">{p}</p>' for p in description_paragraphs if p.strip()])
    
    # 生成章节列表
    chapter_list_html = ""
    for chapter in chapters:
        chapter_num = chapter['number']
        chapter_title = chapter['title'].replace('Chapter ', '')
        chapter_list_html += f"""                <!-- Chapter {chapter_num} -->
                <a href="chapter{chapter_num}.html" class="chapter-item" data-chapter="{chapter_num}">
                    <div class="chapter-number">Ch. {chapter_num}</div>
                    <div class="chapter-details">
                        <div class="chapter-title">{chapter_title}</div>
                        <div class="chapter-meta-info">
                            <span>📖 Est. 10 min</span>
                        </div>
                    </div>
                    <span class="chapter-arrow">→</span>
                </a>

"""
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{novel_title} - Table of Contents | Cross The Line</title>
    <meta name="description" content="Complete chapter list for {novel_title}. Read all chapters of this compelling Asian pop novel translation.">
    <meta name="keywords" content="{novel_title} chapters, asian pop novel, translated fiction">
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
    <!-- Top Navigation -->
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../../novels.html" class="back-btn">← Back to Novels</a>
        </div>
    </nav>

    <div class="container">
        <!-- Novel Header -->
        <section class="novel-header">
            <div class="novel-header-cover" style="background-image: url('../../assets/images/{cover_image}');"></div>
            <div class="novel-header-info">
                <div>
                    <h1>{novel_title}</h1>
                    <div class="novel-meta">
                        <span class="meta-item">✍️ Author: Anonymous</span>
                        <span class="meta-item">🌐 Translator: Cross The Line</span>
                        <span class="meta-item">📅 Status: Completed</span>
                    </div>
                </div>
                
                <span class="novel-category-badge">LGBT+</span>
                
                <div class="novel-description">
                    {formatted_description}
                </div>
            </div>
        </section>

        <!-- Chapter List -->
        <section class="chapter-section">
            <div class="section-header">
                <div>
                    <h2>Table of Contents</h2>
                    <span style="color: #7d6d5d; font-size: 0.95rem;">{len(chapters)} Chapters Available</span>
                </div>
            </div>

            <div class="chapter-list" id="chapterList">
{chapter_list_html}
            </div>
        </section>
    </div>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Cross The Line. All translations published with respect for original authors.</p>
        </div>
    </footer>

    <script src="../../assets/js/main.js"></script>
</body>
</html>"""
    
    return html

def clean_duplicate_cards(content, novel_title, novel_folder):
    """清理重复的小说卡片和无效路径的卡片"""
    import re
    
    # 首先清理所有无效路径的卡片（无论是否与当前小说相关）
    invalid_patterns = [
        # 包含引号的路径
        r'<!--[^\n]*-->\s*\n\s*<a[^>]*href="novels/"ancient[^>]*>.*?</a>\s*\n\s*',
        r'<a[^>]*href="novels/"[^>]*>.*?</a>\s*\n\s*',
        # 空路径
        r'<!--[^\n]*-->\s*\n\s*<a[^>]*href="novels//index\.html"[^>]*>.*?</a>\s*\n\s*',
    ]
    
    for pattern in invalid_patterns:
        matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
        for match in matches:
            content = content.replace(match, '', 1)
            # 清理多余空行
            content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    # 规范化标题（用于比较）
    def normalize_title(title):
        # 移除特殊字符，转换为小写，用于比较
        title = title.lower()
        # 将常见的乱码字符替换为正常字符
        title = title.replace('¡', "'").replace('©', "'").replace('¯', "'")
        # 移除多余空格和标点
        title = re.sub(r'\s+', ' ', title).strip()
        # 移除常见标点符号用于比较
        title = re.sub(r'[^\w\s]', '', title)
        return title
    
    normalized_title = normalize_title(novel_title)
    expected_path = f'novels/{novel_folder}/index.html'
    
    # 匹配所有小说卡片（从注释开始，到 </a> 标签和后面的空行结束）
    # 改进的正则：匹配注释、空行、卡片内容、结束标签和后续空行
    card_pattern = r'(<!--[^\n]*-->\s*\n\s*<a\s+href="novels/[^"]+\.html"[^>]*>.*?</a>\s*\n\s*)'
    cards = re.findall(card_pattern, content, re.DOTALL)
    
    # 如果上面的模式没匹配到，尝试更宽松的模式
    if not cards:
        card_pattern = r'(<!--[^>]*-->.*?<a\s+href="novels/[^"]+\.html"[^>]*>.*?</a>\s*\n)'
        cards = re.findall(card_pattern, content, re.DOTALL)
    
    # 找出需要删除的卡片
    cards_to_remove = []
    correct_card_found = False
    correct_card = None
    
    for card in cards:
        # 提取标题
        title_match = re.search(r'<h3 class="novel-title">([^<]+)</h3>', card)
        if not title_match:
            continue
        
        card_title = title_match.group(1)
        normalized_card_title = normalize_title(card_title)
        
        # 提取路径
        path_match = re.search(r'href="(novels/[^"]+\.html)"', card)
        card_path = path_match.group(1) if path_match else ''
        
        # 检查路径是否有效（不包含引号，路径存在）
        path_valid = (
            card_path and 
            '"' not in card_path and 
            card_path != 'novels//index.html' and
            Path(card_path).exists()
        )
        
        # 如果路径无效，标记为需要删除
        if not path_valid:
            cards_to_remove.append(card)
            continue
        
        # 检查是否是当前小说的卡片（通过标题或路径）
        title_matches = normalized_card_title == normalized_title
        path_matches = expected_path in card_path if card_path else False
        
        # 检查是否包含乱码
        has_malformed_chars = '¡' in card_title or '©' in card_title
        
        # 只处理与当前小说相关的卡片
        if title_matches or path_matches:
            # 这是当前小说的卡片
            if path_matches and not has_malformed_chars:
                # 正确的卡片：路径正确、没有乱码
                if not correct_card_found:
                    correct_card_found = True
                    correct_card = card
                else:
                    # 已经有正确的卡片了，这个是重复的
                    cards_to_remove.append(card)
            else:
                # 需要删除：路径错误、包含乱码或路径不存在（只删除与当前小说相关的）
                cards_to_remove.append(card)
    
    # 删除重复的卡片（从后往前删除，避免索引问题）
    removed_count = 0
    for card in cards_to_remove:
        # 使用更精确的替换，避免误删
        content_before = content
        content = content.replace(card, '', 1)  # 只替换第一次出现
        if content != content_before:
            removed_count += 1
            # 清理多余空行
            content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    if removed_count > 0:
        print(f"  Removed {removed_count} duplicate/malformed/invalid card(s)")
    
    return content, correct_card_found

def update_novels_html(novel_title, novel_folder, cover_image):
    """更新novels.html，添加新小说卡片"""
    import re
    novels_html_path = Path('novels.html')
    
    if not novels_html_path.exists():
        print(f"Error: novels.html not found!")
        return
    
    with open(novels_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 清理重复的卡片
    content, correct_card_found = clean_duplicate_cards(content, novel_title, novel_folder)
    
    # 如果已经存在正确的卡片，不需要添加
    if correct_card_found:
        # 保存清理后的内容
        with open(novels_html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Novel card already exists in novels.html, cleaned duplicates")
        return
    
    # 找到novels-grid的开始位置
    grid_start = content.find('<div class="novels-grid">')
    if grid_start == -1:
        print("Error: Could not find novels-grid in novels.html")
        return
    
    # 插入新小说卡片（在grid开始后）
    insert_pos = content.find('>', grid_start) + 1
    
    novel_card = f"""
            <!-- {novel_title} -->
            <a href="novels/{novel_folder}/index.html" class="novel-card" data-category="LGBT+">
                <div class="novel-cover" style="background-image: url('assets/images/{cover_image}');">
                    <span class="novel-category">LGBT+</span>
                </div>
                <div class="novel-info">
                    <h3 class="novel-title">{novel_title}</h3>
                    <p class="novel-excerpt">A compelling story that explores themes of family, love, and personal growth. Follow the journey of complex characters as they navigate life's challenges.</p>
                    <span class="read-btn">Read →</span>
                </div>
            </a>

"""
    
    new_content = content[:insert_pos] + novel_card + content[insert_pos:]
    
    with open(novels_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Updated novels.html")

def update_index_html(novel_title, novel_folder, cover_image):
    """更新index.html，添加新小说卡片"""
    import re
    index_html_path = Path('index.html')
    
    if not index_html_path.exists():
        print(f"Error: index.html not found!")
        return
    
    with open(index_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 清理重复的卡片（使用相同的清理函数）
    content, correct_card_found = clean_duplicate_cards(content, novel_title, novel_folder)
    
    # 如果已经存在正确的卡片，不需要添加
    if correct_card_found:
        # 保存清理后的内容
        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Novel card already exists in index.html, cleaned duplicates")
        return
    
    # 找到novels-grid的开始位置
    grid_start = content.find('<div class="novels-grid">')
    if grid_start == -1:
        print("Error: Could not find novels-grid in index.html")
        return
    
    # 插入新小说卡片（在grid开始后）
    insert_pos = content.find('>', grid_start) + 1
    
    novel_card = f"""
            <!-- {novel_title} -->
            <a href="novels/{novel_folder}/index.html" class="novel-card" data-category="LGBT+">
                <div class="novel-cover" style="background-image: url('assets/images/{cover_image}');">
                    <span class="novel-category">LGBT+</span>
                </div>
                <div class="novel-info">
                    <h3 class="novel-title">{novel_title}</h3>
                    <p class="novel-excerpt">A compelling story that explores themes of family, love, and personal growth. Follow the journey of complex characters as they navigate life's challenges.</p>
                    <span class="read-btn">Read →</span>
                </div>
            </a>

"""
    
    new_content = content[:insert_pos] + novel_card + content[insert_pos:]
    
    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Updated index.html")

def process_novel(txt_file, cover_image=None):
    """处理小说文件，生成所有网页"""
    txt_path = Path(txt_file)
    
    if not txt_path.exists():
        print(f"Error: {txt_file} not found!")
        return
    
    # 提取小说信息
    print(f"Processing {txt_file}...")
    title, description, content = extract_novel_info(txt_file)
    print(f"  Title: {title}")
    
    # 提取章节
    chapters = extract_chapters(content)
    print(f"  Found {len(chapters)} chapters")
    
    # 创建小说文件夹（使用小写和连字符）
    # 限制文件夹名长度，避免文件名过长错误
    novel_folder = title.lower().replace(' ', '_')
    # 移除特殊字符，只保留字母、数字、下划线和连字符
    novel_folder = re.sub(r'[^\w-]', '', novel_folder)
    # 限制长度为100个字符
    if len(novel_folder) > 100:
        novel_folder = novel_folder[:100]
    novel_dir = Path('novels') / novel_folder
    novel_dir.mkdir(parents=True, exist_ok=True)
    print(f"  Created folder: {novel_dir}")
    
    # 处理封面图片
    def normalize_filename(name):
        """规范化文件名用于比较（移除连字符、下划线、空格的区别）"""
        return name.lower().replace('-', '').replace('_', '').replace(' ', '')
    
    if cover_image:
        cover_path = Path(cover_image)
        if cover_path.exists():
            # 移动图片到assets/images/，处理文件名中的空格
            assets_images = Path('assets/images')
            assets_images.mkdir(parents=True, exist_ok=True)
            # 将文件名中的空格替换为下划线
            safe_name = cover_path.name.replace(' ', '_')
            new_cover_path = assets_images / safe_name
            shutil.copy2(cover_path, new_cover_path)
            print(f"  Copied cover image to: {new_cover_path}")
            cover_image_name = safe_name
        else:
            print(f"  Warning: Cover image {cover_image} not found, using placeholder")
            cover_image_name = "1.jpg"  # 默认图片
    else:
        # 尝试自动查找同名图片
        # 首先尝试直接匹配（相同的文件名，只是扩展名不同）
        cover_path = txt_path.with_suffix('.png')
        if not cover_path.exists():
            cover_path = txt_path.with_suffix('.jpg')
        
        # 如果直接匹配失败，尝试模糊匹配（忽略连字符、下划线、空格的区别）
        if not cover_path.exists():
            txt_base_name = txt_path.stem
            normalized_txt_name = normalize_filename(txt_base_name)
            
            # 在当前目录查找所有图片文件
            parent_dir = txt_path.parent
            image_extensions = ['.png', '.jpg', '.jpeg']
            
            for ext in image_extensions:
                # 查找所有匹配扩展名的文件
                for img_file in parent_dir.glob(f'*{ext}'):
                    img_base_name = img_file.stem
                    normalized_img_name = normalize_filename(img_base_name)
                    
                    # 如果规范化后的名称匹配，使用这个文件
                    if normalized_img_name == normalized_txt_name:
                        cover_path = img_file
                        print(f"  Found matching image (fuzzy match): {cover_path.name}")
                        break
                
                if cover_path.exists():
                    break
        
        if cover_path.exists():
            assets_images = Path('assets/images')
            assets_images.mkdir(parents=True, exist_ok=True)
            # 将文件名中的空格替换为下划线
            safe_name = cover_path.name.replace(' ', '_')
            new_cover_path = assets_images / safe_name
            shutil.copy2(cover_path, new_cover_path)
            print(f"  Found and copied cover image: {new_cover_path}")
            cover_image_name = safe_name
        else:
            print(f"  Warning: No cover image found, using placeholder")
            cover_image_name = "1.jpg"
    
    # 生成目录页
    index_html = generate_index_html(title, description, chapters, cover_image_name)
    index_path = novel_dir / 'index.html'
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_html)
    print(f"  Generated: {index_path}")
    
    # 生成章节页
    for chapter in chapters:
        chapter_html = generate_chapter_html(chapter, title, novel_folder, len(chapters))
        chapter_path = novel_dir / f"chapter{chapter['number']}.html"
        with open(chapter_path, 'w', encoding='utf-8') as f:
            f.write(chapter_html)
        print(f"  Generated: {chapter_path}")
    
    # 更新novels.html和index.html
    update_novels_html(title, novel_folder, cover_image_name)
    update_index_html(title, novel_folder, cover_image_name)
    
    print(f"\n✓ Successfully processed {title}!")
    print(f"  Total chapters: {len(chapters)}")
    print(f"  Output folder: {novel_dir}")
    
    return novel_folder

def main():
    """主函数"""
    import sys
    
    # 查找所有txt文件
    txt_files = list(Path('.').glob('*.txt'))
    
    if not txt_files:
        print("No .txt files found in current directory!")
        print("Usage: python generate_novel.py [novel.txt] [cover.png]")
        return
    
    # 如果指定了文件，只处理那个文件
    if len(sys.argv) > 1:
        txt_file = sys.argv[1]
        cover_image = sys.argv[2] if len(sys.argv) > 2 else None
        process_novel(txt_file, cover_image)
    else:
        # 处理所有txt文件
        for txt_file in txt_files:
            process_novel(txt_file)
            print()

if __name__ == '__main__':
    main()

