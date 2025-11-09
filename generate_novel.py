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
    # 尝试多种编码
    encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
    content = None
    for encoding in encodings:
        try:
            with open(txt_file, 'r', encoding=encoding) as f:
                content = f.read()
            break
        except UnicodeDecodeError:
            continue
    
    if content is None:
        raise ValueError(f"Could not decode {txt_file} with any encoding")
    
    lines = content.split('\n')
    
    # 提取标题（第一行）
    title = lines[0].strip() if lines else "Untitled"
    
    # 找到简介部分（从"Contents"之后到第一个章节之前）
    description_start = None
    for i, line in enumerate(lines):
        if line.strip().lower() == 'contents':
            description_start = i + 1
            break
    
    # 找到第一个章节
    first_chapter_idx = None
    for i, line in enumerate(lines):
        if re.match(r'^\d+\.\s*Chapter', line, re.IGNORECASE):
            first_chapter_idx = i
            break
    
    # 提取简介
    description_lines = []
    if description_start and first_chapter_idx:
        for i in range(description_start, first_chapter_idx):
            line = lines[i].strip()
            if line:  # 跳过空行
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
    
    for i, line in enumerate(lines):
        # 匹配章节标题：支持多种格式
        # 1. 数字. Chapter 罗马数字 (如 "1. Chapter I")
        # 2. 数字. Chapter 数字 (如 "33. Chapter 33")
        # 3. 数字. Final Chapter (如 "69. Final Chapter")
        # 4. Extra I (没有数字前缀，需要特殊处理)
        # 注意：行尾可能有空格，使用\s*$匹配
        match = re.match(r'^(\d+)\.\s*(Chapter\s+[IVXLC\d]+.*?|Final\s+Chapter|Extra\s+[IVXLC\d]+.*?)\s*$', line, re.IGNORECASE)
        if match:
            # 保存上一个章节
            if current_chapter is not None:
                chapters.append({
                    'number': current_chapter['number'],
                    'title': current_chapter['title'],
                    'content': '\n'.join(current_content).strip()
                })
            
            # 开始新章节
            chapter_num = int(match.group(1))
            chapter_title = match.group(2).strip()
            current_chapter = {
                'number': chapter_num,
                'title': chapter_title
            }
            current_content = []
        else:
            # 检查是否是Extra I（没有数字前缀）
            extra_match = re.match(r'^(Extra\s+[IVXLC\d]+.*?)$', line.strip(), re.IGNORECASE)
            if extra_match and current_chapter is not None:
                # 保存上一个章节
                chapters.append({
                    'number': current_chapter['number'],
                    'title': current_chapter['title'],
                    'content': '\n'.join(current_content).strip()
                })
                
                # Extra章节编号为上一个章节+1
                extra_num = current_chapter['number'] + 1
                extra_title = extra_match.group(1).strip()
                current_chapter = {
                    'number': extra_num,
                    'title': extra_title
                }
                current_content = []
            else:
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

def update_novels_html(novel_title, novel_folder, cover_image):
    """更新novels.html，添加新小说卡片"""
    novels_html_path = Path('novels.html')
    
    if not novels_html_path.exists():
        print(f"Error: novels.html not found!")
        return
    
    with open(novels_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经存在该小说的卡片
    if f'novels/{novel_folder}/index.html' in content:
        print(f"  Novel card already exists in novels.html, skipping...")
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
    index_html_path = Path('index.html')
    
    if not index_html_path.exists():
        print(f"Error: index.html not found!")
        return
    
    with open(index_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经存在该小说的卡片
    if f'novels/{novel_folder}/index.html' in content:
        print(f"  Novel card already exists in index.html, skipping...")
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
    novel_folder = title.lower().replace(' ', '_')
    novel_dir = Path('novels') / novel_folder
    novel_dir.mkdir(parents=True, exist_ok=True)
    print(f"  Created folder: {novel_dir}")
    
    # 处理封面图片
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
        cover_path = txt_path.with_suffix('.png')
        if not cover_path.exists():
            cover_path = txt_path.with_suffix('.jpg')
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

