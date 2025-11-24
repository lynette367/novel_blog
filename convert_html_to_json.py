#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从现有的 HTML 文件提取章节数据并转换为 JSON 格式
用于迁移到新的 JSON 数据格式
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict

DATA_DIR = Path('data')
NOVELS_DATA_FILE = DATA_DIR / 'novels.json'
PUBLIC_NOVELS_DIR = Path('public/novels')


def load_novels_json():
    """加载 novels.json"""
    with open(NOVELS_DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_chapter_from_html(html_file: Path) -> Dict:
    """从 HTML 文件提取章节信息"""
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 提取章节标题
    title_match = re.search(r'<h1[^>]*class="chapter-title-page"[^>]*>([^<]+)</h1>', html)
    chapter_title = title_match.group(1).strip() if title_match else None
    
    # 提取章节编号
    number_match = re.search(r'Chapter\s+(\d+)', html)
    if not number_match:
        # 尝试从文件名提取
        number_match = re.search(r'chapter(\d+)', html_file.name)
    
    chapter_number = int(number_match.group(1)) if number_match else None
    
    # 提取章节内容
    content_match = re.search(r'<div class="chapter-text">([\s\S]*?)</div>\s*</article>', html)
    if not content_match:
        return None
    
    content_html = content_match.group(1)
    
    # 清理内容：移除脚本标签
    content_html = re.sub(r'<script[\s\S]*?</script>', '', content_html, flags=re.IGNORECASE)
    
    # 将 HTML 段落转换为纯文本段落
    # 移除所有 HTML 标签，保留文本
    paragraphs = []
    # 先提取所有 <p> 标签的内容
    p_matches = re.findall(r'<p[^>]*>([\s\S]*?)</p>', content_html)
    for p_content in p_matches:
        # 清理内嵌标签
        text = re.sub(r'<[^>]+>', '', p_content)
        text = text.strip()
        if text:
            paragraphs.append(text)
    
    # 如果没有找到 <p> 标签，尝试直接提取文本
    if not paragraphs:
        # 移除所有 HTML 标签
        text = re.sub(r'<[^>]+>', '', content_html)
        # 按换行分割
        for line in text.split('\n'):
            line = line.strip()
            if line:
                paragraphs.append(line)
    
    content = '\n'.join(paragraphs)
    
    if not chapter_number or not chapter_title:
        return None
    
    return {
        'number': chapter_number,
        'title': chapter_title,
        'content': content
    }


def extract_chapters_from_novel(slug: str) -> List[Dict]:
    """从小说目录提取所有章节"""
    novel_dir = PUBLIC_NOVELS_DIR / slug
    if not novel_dir.exists():
        print(f"  Warning: Directory {novel_dir} not found")
        return []
    
    chapters = []
    
    # 读取 index.html 获取章节列表
    index_file = novel_dir / 'index.html'
    chapter_titles = {}
    
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            index_html = f.read()
        
        # 提取章节标题
        chapter_item_regex = r'<a[^>]*href="chapter(\d+)\.html"[^>]*>[\s\S]*?<div class="chapter-title">([^<]+)</div>'
        matches = re.finditer(chapter_item_regex, index_html)
        for match in matches:
            chapter_num = int(match.group(1))
            title = match.group(2).strip()
            chapter_titles[chapter_num] = title
    
    # 读取所有章节文件
    def get_chapter_number(file_path):
        match = re.search(r'chapter(\d+)', file_path.name)
        return int(match.group(1)) if match else 0
    
    chapter_files = sorted(
        novel_dir.glob('chapter*.html'),
        key=get_chapter_number
    )
    
    for chapter_file in chapter_files:
        chapter_data = extract_chapter_from_html(chapter_file)
        if chapter_data:
            # 如果 index.html 中有标题，使用它
            if chapter_data['number'] in chapter_titles:
                chapter_data['title'] = chapter_titles[chapter_data['number']]
            chapters.append(chapter_data)
    
    return sorted(chapters, key=lambda x: x['number'])


def save_chapters_json(slug: str, chapters: List[Dict]):
    """保存章节数据到 JSON 文件"""
    chapters_dir = DATA_DIR / 'novels' / slug
    chapters_dir.mkdir(parents=True, exist_ok=True)
    chapters_file = chapters_dir / 'chapters.json'
    
    chapters_data = {
        'chapters': chapters
    }
    
    with open(chapters_file, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    
    return chapters_file


def main():
    """主函数"""
    print("Converting HTML files to JSON format...\n")
    
    # 加载小说列表
    novels_data = load_novels_json()
    novels = novels_data.get('novels', [])
    
    print(f"Found {len(novels)} novels to process\n")
    
    for novel in novels:
        slug = novel['slug']
        title = novel['title']
        print(f"Processing: {title} ({slug})")
        
        # 提取章节
        chapters = extract_chapters_from_novel(slug)
        
        if not chapters:
            print(f"  ⚠️  No chapters found, skipping...")
            continue
        
        # 保存 JSON
        json_file = save_chapters_json(slug, chapters)
        print(f"  ✓ Extracted {len(chapters)} chapters")
        print(f"  ✓ Saved to: {json_file}")
        print()
    
    print("✓ Conversion completed!")
    print("\nNext steps:")
    print("1. Test the build: npm run build")
    print("2. If successful, delete public/novels/ folder")
    print("3. Clean up lib/novels.ts fallback code")


if __name__ == '__main__':
    main()

