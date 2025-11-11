#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小说列表 API 端点
返回所有可用小说的列表和元数据
"""

import os
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler

def get_novels_list():
    """获取所有小说的列表"""
    novels_dir = Path('./novels')
    novels = []
    
    if not novels_dir.exists():
        return []
    
    # 遍历小说目录
    for novel_folder in novels_dir.iterdir():
        if novel_folder.is_dir():
            index_file = novel_folder / 'index.html'
            if index_file.exists():
                # 读取 index.html 提取小说信息
                try:
                    with open(index_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 提取标题
                    import re
                    title_match = re.search(r'<h1>([^<]+)</h1>', content)
                    title = title_match.group(1) if title_match else novel_folder.name
                    
                    # 提取简介
                    desc_match = re.search(r'<div class="novel-description">(.*?)</div>', content, re.DOTALL)
                    description = desc_match.group(1) if desc_match else ''
                    # 清理HTML标签
                    description = re.sub(r'<[^>]+>', '', description).strip()
                    description = description[:200] + '...' if len(description) > 200 else description
                    
                    # 统计章节数
                    chapter_files = list(novel_folder.glob('chapter*.html'))
                    chapter_count = len(chapter_files)
                    
                    # 提取封面图片
                    cover_match = re.search(r'background-image:\s*url\([\'"]?\.\.\/\.\.\/assets\/images\/([^\'"\)]+)', content)
                    cover_image = cover_match.group(1) if cover_match else '0.jpg'
                    
                    novels.append({
                        'id': novel_folder.name,
                        'title': title,
                        'description': description,
                        'chapters': chapter_count,
                        'cover': cover_image,
                        'url': f'/novels/{novel_folder.name}/index.html'
                    })
                except Exception as e:
                    print(f"Error processing {novel_folder}: {e}")
                    continue
    
    # 按章节数排序（可选）
    novels.sort(key=lambda x: x['chapters'], reverse=True)
    
    return novels

class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    def do_GET(self):
        """处理 GET 请求"""
        try:
            novels = get_novels_list()
            
            # 返回 JSON 响应
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'count': len(novels),
                'novels': novels
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
