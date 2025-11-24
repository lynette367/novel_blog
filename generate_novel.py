#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键发布小说脚本 - Next.js App Router
将txt小说文件自动切割成章节并保存数据，Next.js 动态路由自动渲染页面

功能：
1. 从 TXT 文件提取小说信息和章节
2. 保存章节数据到 data/novels/[slug]/chapters.json
3. 更新 data/novels.json（小说元数据）
4. 复制封面图片到 public/assets/images/

注意：不需要生成 TSX 文件，Next.js 动态路由会自动处理页面渲染
"""

import os
import re
import shutil
import json
from pathlib import Path
from typing import List, Dict, Tuple

# 目录配置
APP_DIR = Path('app')
NOVELS_APP_DIR = APP_DIR / 'novels'
PUBLIC_DIR = Path('public')
ASSETS_DIR = PUBLIC_DIR / 'assets'
IMAGES_DIR = ASSETS_DIR / 'images'
DATA_DIR = Path('data')
NOVELS_DATA_FILE = DATA_DIR / 'novels.json'
DEFAULT_EXCERPT = ("Discover this compelling Asian BL novel. A captivating danmei story exploring romance, drama, "
                   "and character development. Read now in English translation.")
SITE_NAME = "Cross The Line"


def ensure_directories():
    """确保输出目录存在"""
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    NOVELS_APP_DIR.mkdir(parents=True, exist_ok=True)


def load_novel_data():
    """加载 novels.json 文件"""
    if NOVELS_DATA_FILE.exists():
        with open(NOVELS_DATA_FILE, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                pass
    return {'novels': []}


def write_novel_data(data):
    """保存 novels.json 到磁盘"""
    with open(NOVELS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def build_excerpt(raw_description):
    """创建简洁的摘要"""
    if raw_description:
        excerpt = re.sub(r'\s+', ' ', raw_description).strip()
        if len(excerpt) > 220:
            excerpt = excerpt[:217].rstrip() + '...'
        return excerpt
    return DEFAULT_EXCERPT


def create_slug(title: str) -> str:
    """从标题创建 slug"""
    slug = title.lower().replace(' ', '_')
    slug = re.sub(r'[^\w-]', '', slug)
    if len(slug) > 100:
        slug = slug[:100]
    return slug


def extract_novel_info(txt_file: Path) -> Tuple[str, str, str]:
    """从txt文件中提取小说信息"""
    txt_path = Path(txt_file)
    
    # 读取原始字节
    with open(txt_path, 'rb') as f:
        raw_bytes = f.read()
    
    # 尝试多种编码
    content = None
    used_encoding = None
    
    # 尝试 UTF-8
    try:
        test_content = raw_bytes.decode('utf-8')
        sample = test_content[:500]
        suspicious_in_utf8 = ['¡', '©', 'Â', 'Ã']
        if not any(pattern in sample for pattern in suspicious_in_utf8):
            content = test_content
            used_encoding = 'utf-8'
    except (UnicodeDecodeError, UnicodeError):
        pass
    
    # 如果 UTF-8 失败，尝试其他编码
    if content is None:
        encodings = ['gbk', 'gb2312', 'utf-8-sig', 'cp1252']
        for encoding in encodings:
            try:
                test_content = raw_bytes.decode(encoding, errors='strict')
                if encoding in ['gbk', 'gb2312']:
                    sample = test_content[:500]
                    if '¡' not in sample and '©' not in sample:
                        content = test_content
                        used_encoding = encoding
                        break
                else:
                    content = test_content
                    used_encoding = encoding
                    break
            except (UnicodeDecodeError, UnicodeError):
                try:
                    test_content = raw_bytes.decode(encoding, errors='ignore')
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
    
    if content is None:
        raise ValueError(f"Could not decode {txt_file} with any encoding")
    
    lines = content.split('\n')
    
    # 提取标题（优先从文件名）
    title_from_filename = txt_path.stem.replace('-', ' ').replace('_', ' ')
    title_from_filename = re.sub(r'[^\w\s-]', '', title_from_filename)
    title_from_filename = re.sub(r'\s+', ' ', title_from_filename).strip()
    
    title_from_content = None
    for line in lines[:5]:
        stripped = line.strip()
        if stripped and not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', stripped, re.IGNORECASE):
            if (len(stripped) <= 50 and 
                not stripped.startswith('"') and 
                not stripped.startswith("'") and
                not re.search(r'[.!?]{2,}', stripped) and
                not 'This is' in stripped and
                not 'they are' in stripped.lower()):
                title_from_content = stripped
                break
    
    if title_from_filename and len(title_from_filename) > 3:
        title = title_from_filename
    elif title_from_content and len(title_from_content) > 3:
        title = title_from_content
    else:
        title = "Untitled Novel"
    
    title = re.sub(r'^["\']+|["\']+$', '', title)
    title = re.sub(r'\s+', ' ', title).strip()
    
    # 找到第一个章节
    first_chapter_idx = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if (re.match(r'^\d+\.\s*Chapter', stripped, re.IGNORECASE) or
            re.match(r'^[^\w]*Chapter\s+\d+', stripped, re.IGNORECASE) or
            re.match(r'^[^\w]*Chapter\s+[IVXLC]+', stripped, re.IGNORECASE) or
            re.search(r'Chapter\s+\d+', stripped, re.IGNORECASE)):
            if len(stripped) < 100 or re.match(r'^[^\w]*Chapter\s+\d+', stripped, re.IGNORECASE):
                first_chapter_idx = i
                break
    
    # 提取简介
    description_start = None
    for i, line in enumerate(lines):
        if line.strip().lower() == 'contents':
            description_start = i + 1
            break
    
    if description_start is None:
        for i, line in enumerate(lines):
            if re.match(r'^\s*Text\s*[:：]', line, re.IGNORECASE):
                description_start = i + 1
                break
    
    if description_start is None:
        description_start = 0
        for i, line in enumerate(lines[:20]):
            stripped = line.strip()
            if not stripped:
                continue
            if re.match(r'^(Author|Title|作者|标题)[:：]', stripped, re.IGNORECASE):
                description_start = i + 1
                continue
            if re.match(r'^\s*Text\s*[:：]', stripped, re.IGNORECASE):
                description_start = i + 1
                break
            if not re.search(r'Chapter\s+\d+', stripped, re.IGNORECASE):
                if description_start == 0 or i > description_start:
                    description_start = i
                    break
    
    description_lines = []
    if first_chapter_idx is not None and description_start < first_chapter_idx:
        for i in range(description_start, first_chapter_idx):
            line = lines[i].strip()
            if line and not re.search(r'Chapter\s+\d+', line, re.IGNORECASE):
                if not re.match(r'^(Author|Text|Title|作者|标题|正文)[:：]', line, re.IGNORECASE):
                    description_lines.append(line)
    
    description = '\n'.join(description_lines)
    
    return title, description, content


def extract_chapters(content: str) -> List[Dict]:
    """提取所有章节"""
    if isinstance(content, bytes):
        content = content.decode('utf-8', errors='ignore')
    lines = content.split('\n')
    chapters = []
    current_chapter = None
    current_content = []
    chapter_counter = 0
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
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
            # 格式4: "Chapter 数字"
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
                        # 格式7: "Extra I"
                        extra_match = re.match(r'^(Extra\s+[IVXLC\d]+.*?)$', stripped, re.IGNORECASE)
                        if extra_match and current_chapter is not None:
                            chapter_counter += 1
                            chapter_num = chapter_counter
                            chapter_title = extra_match.group(1).strip()
                            match = extra_match
        
        if match:
            if current_chapter is not None:
                chapters.append({
                    'number': current_chapter['number'],
                    'title': current_chapter['title'],
                    'content': '\n'.join(current_content).strip()
                })
            
            current_chapter = {
                'number': chapter_num,
                'title': chapter_title
            }
            current_content = []
            if chapter_num > chapter_counter:
                chapter_counter = chapter_num
        else:
            if current_chapter is not None:
                current_content.append(line)
    
    if current_chapter is not None:
        chapters.append({
            'number': current_chapter['number'],
            'title': current_chapter['title'],
            'content': '\n'.join(current_content).strip()
        })
    
    return chapters


def save_chapters_data(slug: str, chapters: List[Dict]):
    """保存章节数据到 JSON 文件，供 lib/novels.ts 读取"""
    chapters_data_dir = DATA_DIR / 'novels' / slug
    chapters_data_dir.mkdir(parents=True, exist_ok=True)
    chapters_file = chapters_data_dir / 'chapters.json'
    
    chapters_data = {
        'chapters': [
            {
                'number': ch['number'],
                'title': ch['title'],
                'content': ch['content']
            }
            for ch in chapters
        ]
    }
    
    with open(chapters_file, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    
    return chapters_file


def update_novels_json(title: str, slug: str, cover_image: str, 
                       total_chapters: int, description: str, category: str = "BL"):
    """更新 novels.json"""
    ensure_directories()
    data = load_novel_data()
    novels_list = data.get('novels', [])
    excerpt = build_excerpt(description)

    novel_payload = {
        'title': title,
        'slug': slug,
        'category': category,
        'excerpt': excerpt,
        'description': description.strip() or excerpt,
        'coverImage': f"/assets/images/{cover_image}",
        'path': f"/novels/{slug}",
        'totalChapters': total_chapters
    }

    updated = False
    for idx, novel in enumerate(novels_list):
        if novel.get('slug') == slug:
            novels_list[idx] = novel_payload
            updated = True
            break

    if not updated:
        novels_list.append(novel_payload)

    data['novels'] = novels_list
    write_novel_data(data)


def process_novel(txt_file: str, cover_image: str = None, category: str = "BL"):
    """处理小说文件，保存数据供 Next.js 动态路由使用"""
    txt_path = Path(txt_file)
    
    if not txt_path.exists():
        print(f"Error: {txt_file} not found!")
        return
    
    ensure_directories()

    # 提取小说信息
    print(f"Processing {txt_file}...")
    title, description, content = extract_novel_info(txt_file)
    print(f"  Title: {title}")
    
    # 创建 slug
    slug = create_slug(title)
    print(f"  Slug: {slug}")
    
    # 提取章节
    chapters = extract_chapters(content)
    print(f"  Found {len(chapters)} chapters")
    
    # 处理封面图片
    if cover_image:
        cover_path = Path(cover_image)
        if cover_path.exists():
            safe_name = cover_path.name.replace(' ', '_')
            new_cover_path = IMAGES_DIR / safe_name
            shutil.copy2(cover_path, new_cover_path)
            print(f"  Copied cover image to: {new_cover_path}")
            cover_image_name = safe_name
        else:
            print(f"  Warning: Cover image {cover_image} not found, using placeholder")
            cover_image_name = "1.jpg"
    else:
        # 尝试自动查找同名图片
        cover_path = txt_path.with_suffix('.png')
        if not cover_path.exists():
            cover_path = txt_path.with_suffix('.jpg')
        
        if cover_path.exists():
            safe_name = cover_path.name.replace(' ', '_')
            new_cover_path = IMAGES_DIR / safe_name
            shutil.copy2(cover_path, new_cover_path)
            print(f"  Found and copied cover image: {new_cover_path}")
            cover_image_name = safe_name
        else:
            print(f"  Warning: No cover image found, using placeholder")
            cover_image_name = "1.jpg"
    
    # 保存章节数据到 JSON 文件
    chapters_data_file = save_chapters_data(slug, chapters)
    print(f"  Saved chapters data to: {chapters_data_file}")
    
    # 更新 novels.json
    update_novels_json(title, slug, cover_image_name, len(chapters), description, category)
    print(f"  Updated novels.json")
    
    print(f"\n✓ Successfully processed {title}!")
    print(f"  Total chapters: {len(chapters)}")
    print(f"  Chapters data: {chapters_data_file}")
    print(f"  Cover image: {cover_image_name}")
    print(f"  Access at: /novels/{slug}")
    print(f"\n  Note: Next.js will automatically render pages using dynamic routes.")
    print(f"  No TSX files need to be created - the existing routes handle all novels.")
    
    return slug


def main():
    """主函数"""
    import sys
    
    # 查找所有txt文件
    txt_files = list(Path('.').glob('*.txt'))
    
    if not txt_files:
        print("No .txt files found in current directory!")
        print("Usage: python generate_novel.py [novel.txt] [cover.png] [category]")
        return
    
    # 如果指定了文件，只处理那个文件
    if len(sys.argv) > 1:
        txt_file = sys.argv[1]
        cover_image = sys.argv[2] if len(sys.argv) > 2 else None
        category = sys.argv[3] if len(sys.argv) > 3 else "BL"
        process_novel(txt_file, cover_image, category)
    else:
        # 处理所有txt文件
        for txt_file in txt_files:
            process_novel(txt_file)
            print()


if __name__ == '__main__':
    main()
