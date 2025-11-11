#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统计 API 端点
返回网站统计信息
"""

import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler

def get_site_stats():
    """获取网站统计信息"""
    novels_dir = Path('./novels')
    
    if not novels_dir.exists():
        return {
            'total_novels': 0,
            'total_chapters': 0,
            'categories': {}
        }
    
    total_novels = 0
    total_chapters = 0
    categories = {}
    
    for novel_folder in novels_dir.iterdir():
        if novel_folder.is_dir():
            index_file = novel_folder / 'index.html'
            if index_file.exists():
                total_novels += 1
                
                # 统计章节数
                chapter_files = list(novel_folder.glob('chapter*.html'))
                chapter_count = len(chapter_files)
                total_chapters += chapter_count
                
                # 统计分类（这里默认为 LGBT+，可以从 HTML 中提取）
                category = 'LGBT+'
                categories[category] = categories.get(category, 0) + 1
    
    return {
        'total_novels': total_novels,
        'total_chapters': total_chapters,
        'categories': categories,
        'avg_chapters_per_novel': round(total_chapters / total_novels, 2) if total_novels > 0 else 0
    }

class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    def do_GET(self):
        """处理 GET 请求"""
        try:
            stats = get_site_stats()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'stats': stats
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
