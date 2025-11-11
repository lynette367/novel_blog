#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
搜索 API 端点
搜索小说标题和章节内容
"""

import os
import json
import re
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

def search_novels(query):
    """搜索小说标题和描述"""
    query = query.lower()
    novels_dir = Path('./novels')
    results = []
    
    if not novels_dir.exists():
        return []
    
    for novel_folder in novels_dir.iterdir():
        if novel_folder.is_dir():
            index_file = novel_folder / 'index.html'
            if index_file.exists():
                try:
                    with open(index_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 提取标题
                    title_match = re.search(r'<h1>([^<]+)</h1>', content)
                    title = title_match.group(1) if title_match else novel_folder.name
                    
                    # 提取简介
                    desc_match = re.search(r'<div class="novel-description">(.*?)</div>', content, re.DOTALL)
                    description = desc_match.group(1) if desc_match else ''
                    description = re.sub(r'<[^>]+>', '', description).strip()
                    
                    # 检查标题或描述是否匹配查询
                    if query in title.lower() or query in description.lower():
                        # 提取封面
                        cover_match = re.search(r'background-image:\s*url\([\'"]?\.\.\/\.\.\/assets\/images\/([^\'"\)]+)', content)
                        cover_image = cover_match.group(1) if cover_match else '0.jpg'
                        
                        # 统计章节数
                        chapter_files = list(novel_folder.glob('chapter*.html'))
                        chapter_count = len(chapter_files)
                        
                        results.append({
                            'id': novel_folder.name,
                            'title': title,
                            'description': description[:200] + '...' if len(description) > 200 else description,
                            'chapters': chapter_count,
                            'cover': cover_image,
                            'url': f'/novels/{novel_folder.name}/index.html',
                            'type': 'novel'
                        })
                        
                except Exception as e:
                    print(f"Error processing {novel_folder}: {e}")
                    continue
    
    return results

def search_chapters(query, novel_id=None):
    """搜索章节内容"""
    query = query.lower()
    novels_dir = Path('./novels')
    results = []
    
    if not novels_dir.exists():
        return []
    
    # 如果指定了小说ID，只搜索该小说
    if novel_id:
        novel_folders = [novels_dir / novel_id]
    else:
        novel_folders = [f for f in novels_dir.iterdir() if f.is_dir()]
    
    for novel_folder in novel_folders:
        if not novel_folder.exists():
            continue
            
        # 获取小说标题
        index_file = novel_folder / 'index.html'
        novel_title = novel_folder.name
        if index_file.exists():
            try:
                with open(index_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                title_match = re.search(r'<h1>([^<]+)</h1>', content)
                novel_title = title_match.group(1) if title_match else novel_folder.name
            except:
                pass
        
        # 搜索章节
        chapter_files = sorted(novel_folder.glob('chapter*.html'),
                              key=lambda x: int(re.search(r'chapter(\d+)', x.name).group(1)))
        
        for chapter_file in chapter_files:
            try:
                with open(chapter_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 提取章节编号
                chapter_num_match = re.search(r'chapter(\d+)', chapter_file.name)
                chapter_num = int(chapter_num_match.group(1)) if chapter_num_match else 0
                
                # 提取章节标题
                title_match = re.search(r'<h1 class="chapter-title-page">([^<]+)</h1>', content)
                chapter_title = title_match.group(1) if title_match else f'Chapter {chapter_num}'
                
                # 提取章节内容
                content_match = re.search(r'<div class="chapter-text">(.*?)</div>', content, re.DOTALL)
                if content_match:
                    chapter_content = content_match.group(1)
                    # 移除HTML标签
                    chapter_text = re.sub(r'<[^>]+>', '', chapter_content)
                    
                    # 检查是否匹配查询
                    if query in chapter_text.lower() or query in chapter_title.lower():
                        # 找到匹配的上下文（前后50个字符）
                        match_pos = chapter_text.lower().find(query)
                        if match_pos != -1:
                            start = max(0, match_pos - 50)
                            end = min(len(chapter_text), match_pos + len(query) + 50)
                            context = '...' + chapter_text[start:end] + '...'
                        else:
                            context = chapter_text[:100] + '...'
                        
                        results.append({
                            'novel_id': novel_folder.name,
                            'novel_title': novel_title,
                            'chapter_number': chapter_num,
                            'chapter_title': chapter_title,
                            'context': context,
                            'url': f'/novels/{novel_folder.name}/chapter{chapter_num}.html',
                            'type': 'chapter'
                        })
                
            except Exception as e:
                print(f"Error processing {chapter_file}: {e}")
                continue
    
    return results

class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    def do_GET(self):
        """处理 GET 请求"""
        try:
            # 解析查询参数
            parsed_url = urlparse(self.path)
            params = parse_qs(parsed_url.query)
            
            query = params.get('q', [''])[0]
            search_type = params.get('type', ['all'])[0]  # all, novel, chapter
            novel_id = params.get('novel_id', [None])[0]
            
            if not query or len(query.strip()) < 2:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                error_response = {
                    'success': False,
                    'error': 'Query parameter "q" is required and must be at least 2 characters'
                }
                
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
                return
            
            results = []
            
            # 搜索小说
            if search_type in ['all', 'novel']:
                novel_results = search_novels(query)
                results.extend(novel_results)
            
            # 搜索章节
            if search_type in ['all', 'chapter']:
                chapter_results = search_chapters(query, novel_id)
                results.extend(chapter_results)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'query': query,
                'count': len(results),
                'results': results
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'success': False,
                'error': str(e)
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
