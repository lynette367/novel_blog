# Vercel 配置说明

## 配置概述

本项目使用根目录作为静态文件目录，不依赖 `public` 文件夹。

## 配置详解

### 1. 静态文件目录
- `outputDirectory: "."` - 指定根目录作为静态文件输出目录
- `buildCommand: null` - 禁用构建命令（纯静态站点）

### 2. Serverless Functions
- `/api/**/*.js` - 所有 `/api` 目录下的 `.js` 文件都是 Node.js Serverless Functions
- 运行时：`@vercel/node`

### 3. 路由规则

#### API 路由
- `/api/*` → 路由到 `/api/*` 的 Serverless Functions
- 使用 `rewrites` 和 `routes` 确保正确路由

#### 静态文件路由
- `/admin/*` → 静态文件（`/admin/admin.html`, `/admin/index.html` 等）
- `/assets/*` → 静态资源（CSS, JS, images）
- `/novels/*` → 小说内容（HTML 文件）
- `/*` → 根目录的静态文件（`index.html`, `novels.html` 等）

### 4. CORS 配置
- 为 `/api/*` 路径添加了 CORS 头，允许跨域请求

## 文件结构映射

```
项目根目录/
├── index.html          → https://domain.com/
├── novels.html         → https://domain.com/novels.html
├── assets/             → https://domain.com/assets/*
├── novels/             → https://domain.com/novels/*
├── admin/              → https://domain.com/admin/*
└── api/                → https://domain.com/api/* (Serverless Functions)
```

## 部署说明

1. **无需构建步骤**：项目是纯静态文件，不需要构建
2. **直接部署**：所有文件直接从根目录服务
3. **API 自动识别**：Vercel 会自动识别 `/api` 目录下的函数

## 注意事项

- 不要创建 `public` 文件夹
- 所有静态文件都在根目录
- API 函数必须在 `/api` 目录下
- 确保 `package.json` 中包含 `@vercel/node` 依赖

