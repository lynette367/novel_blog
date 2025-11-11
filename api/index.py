#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API 索引端点
返回所有可用的 API 端点列表
"""

import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler"""
    
    def do_GET(self):
        """处理 GET 请求"""
        try:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'message': 'Cross The Line API',
                'version': '1.0.0',
                'endpoints': [
                    {
                        'path': '/api/novels',
                        'method': 'GET',
                        'description': '获取所有小说列表',
                        'example': '/api/novels'
                    },
                    {
                        'path': '/api/chapters',
                        'method': 'GET',
                        'description': '获取指定小说的章节列表或章节内容',
                        'parameters': {
                            'novel_id': '小说ID（必需）',
                            'chapter': '章节编号（可选，如果提供则返回章节内容）'
                        },
                        'examples': [
                            '/api/chapters?novel_id=big_brother',
                            '/api/chapters?novel_id=big_brother&chapter=1'
                        ]
                    },
                    {
                        'path': '/api/search',
                        'method': 'GET',
                        'description': '搜索小说和章节内容',
                        'parameters': {
                            'q': '搜索关键词（必需，至少2个字符）',
                            'type': '搜索类型（可选：all, novel, chapter，默认为all）',
                            'novel_id': '小说ID（可选，限制搜索范围）'
                        },
                        'examples': [
                            '/api/search?q=brother',
                            '/api/search?q=love&type=novel',
                            '/api/search?q=family&type=chapter&novel_id=big_brother'
                        ]
                    },
                    {
                        'path': '/api/stats',
                        'method': 'GET',
                        'description': '获取网站统计信息',
                        'example': '/api/stats'
                    }
                ]
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False, indent=2).encode('utf-8'))
            
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
