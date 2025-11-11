#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
章节内容 API 端点
返回指定小说的章节列表和内容
"""

import os
import json
import re
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

def get_chapters(novel_id):
    """获取指定小说的所有章节"""
    novel_dir = Path('./novels') / novel_id
    
    if not novel_dir.exists():
        return None
    
    chapters = []
    chapter_files = sorted(novel_dir.glob('chapter*.html'), 
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
            title = title_match.group(1) if title_match else f'Chapter {chapter_num}'
            
            # 提取章节内容（可选，可能很大）
            # 只返回章节元数据，不返回完整内容
            chapters.append({
                'number': chapter_num,
                'title': title,
                'url': f'/novels/{novel_id}/chapter{chapter_num}.html'
            })
            
        except Exception as e:
            print(f"Error processing {chapter_file}: {e}")
            continue
    
    return chapters

def get_chapter_content(novel_id, chapter_num):
    """获取指定章节的完整内容"""
    chapter_file = Path('./novels') / novel_id / f'chapter{chapter_num}.html'
    
    if not chapter_file.exists():
        return None
    
    try:
        with open(chapter_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取章节标题
        title_match = re.search(r'<h1 class="chapter-title-page">([^<]+)</h1>', content)
        title = title_match.group(1) if title_match else f'Chapter {chapter_num}'
        
        # 提取章节内容
        content_match = re.search(r'<div class="chapter-text">(.*?)</div>', content, re.DOTALL)
        if content_match:
            chapter_content = content_match.group(1)
            # 提取所有段落
            paragraphs = re.findall(r'<p>([^<]+)</p>', chapter_content)
        else:
            paragraphs = []
        
        return {
            'number': chapter_num,
            'title': title,
            'content': paragraphs,
            'url': f'/novels/{novel_id}/chapter{chapter_num}.html'
        }
        
    except Exception as e:
        print(f"Error reading chapter: {e}")
        return None

class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    def do_GET(self):
        """处理 GET 请求"""
        try:
            # 解析查询参数
            parsed_url = urlparse(self.path)
            params = parse_qs(parsed_url.query)
            
            novel_id = params.get('novel_id', [None])[0]
            chapter_num = params.get('chapter', [None])[0]
            
            if not novel_id:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                error_response = {
                    'success': False,
                    'error': 'novel_id parameter is required'
                }
                
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
                return
            
            # 如果指定了章节号，返回章节内容
            if chapter_num:
                try:
                    chapter_num = int(chapter_num)
                    chapter_data = get_chapter_content(novel_id, chapter_num)
                    
                    if chapter_data is None:
                        self.send_response(404)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        
                        error_response = {
                            'success': False,
                            'error': 'Chapter not found'
                        }
                        
                        self.wfile.write(json.dumps(error_response).encode('utf-8'))
                        return
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = {
                        'success': True,
                        'chapter': chapter_data
                    }
                    
                    self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                    
                except ValueError:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    error_response = {
                        'success': False,
                        'error': 'Invalid chapter number'
                    }
                    
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
                    return
            
            # 否则返回章节列表
            else:
                chapters = get_chapters(novel_id)
                
                if chapters is None:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    error_response = {
                        'success': False,
                        'error': 'Novel not found'
                    }
                    
                    self.wfile.write(json.dumps(error_response).encode('utf-8'))
                    return
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    'success': True,
                    'novel_id': novel_id,
                    'count': len(chapters),
                    'chapters': chapters
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
