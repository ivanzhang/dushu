# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**墨潮小说** (MoChao Novel) — Astro 6 SSG 公版书聚合阅读站。纯静态生成，部署到 Cloudflare Workers Static Assets。收录公有领域古典文学作品，提供在线阅读体验。

## Development

```bash
bun install          # 安装依赖
bun run dev          # 本地开发服务器 (http://localhost:4321)
bun run build        # SSG 构建 + Pagefind 索引
bun run preview      # 预览构建产物
bun run test         # Vitest 单元测试
bun run build:verify # 构建后验证脚本
```

## Architecture

### Tech Stack
- **Astro 6** — SSG 框架，`output: 'static'`
- **Content Collections** — 书籍 (JSON) + 章节 (Markdown)，使用 `glob` loader
- **Pagefind** — 客户端搜索，仅索引书籍详情页
- **Vitest** — 单元测试
- **Cloudflare Workers** — 部署（`wrangler.toml`）

### Content Structure (`src/content/`)

```
src/content/
├── books/              # JSON 数据文件（每本书一个）
│   ├── sanguoyanyi.json
│   ├── hongloumeng.json
│   └── xiyouji.json
└── chapters/           # Markdown 章节内容
    ├── sanguoyanyi/
    │   ├── 001.md, 002.md, 003.md
    ├── hongloumeng/
    │   ├── 001.md, 002.md, 003.md
    └── xiyouji/
        ├── 001.md, 002.md, 003.md
```

Content Collections 配置在 `src/content.config.ts`（Astro 6 要求此路径，非 `src/content/config.ts`）。

### Pages (`src/pages/`)

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `index.astro` | 首页：推荐、统计、分类入口 |
| `/category/{slug}` | `category/[slug].astro` | 分类页 |
| `/author/{slug}` | `author/[slug].astro` | 作者页 |
| `/book/{slug}` | `book/[slug]/index.astro` | 书籍详情 + 目录（`data-pagefind-body`） |
| `/book/{slug}/{chapter}` | `book/[slug]/[chapter].astro` | 章节阅读页（`data-pagefind-ignore`） |
| `/search` | `search.astro` | Pagefind 搜索 |
| `/about/copyright` | `about/copyright.astro` | 版权说明 |
| `/404` | `404.astro` | 404 页 |

### Components (`src/components/`)

| 组件 | 说明 |
|------|------|
| `SEOHead.astro` | JSON-LD (Book/BreadcrumbList)、meta、canonical |
| `BookCard.astro` | 书籍卡片 |
| `Reader.astro` | 阅读器控件（字体/行距/主题，localStorage 持久化） |
| `Breadcrumb.astro` | 面包屑导航 |
| `ChapterNav.astro` | 上一章/下一章导航 |

### Key Files

- `src/lib/recommend.ts` — 相关推荐算法（同分类+3, 同标签+1, 同作者+2）
- `src/styles/global.css` — 全局样式，CSS 变量驱动主题系统
- `src/layouts/Base.astro` — 公共布局（header/nav/footer）

### localStorage Keys

| Key | Usage |
|---|---|
| `reader-font-size` | 阅读器字体大小 |
| `reader-line-height` | 阅读器行高 |
| `reader-theme` | 阅读器主题 (default/sepia/dark) |

## Testing

```bash
bun run test         # Vitest 单元测试
bun run build:verify # 构建后验证（HTML 完整性、JSON-LD、Pagefind 索引）
```

## Deployment

Cloudflare Workers Static Assets，配置在 `wrangler.toml`。CI/CD 在 `.github/workflows/deploy.yml`。
