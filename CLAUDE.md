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
bun run test         # Vitest 单元测试（全部）
bun vitest run tests/recommend.test.ts  # 运行单个测试文件
bun run build:verify # 构建后验证脚本（需先运行 build）
```

## Architecture

### Tech Stack
- **Astro 6** — SSG 框架，`output: 'static'`，`build.format: 'file'`（生成 `page.html` 而非 `page/index.html`）
- **Content Collections** — 书籍 (JSON) + 章节 (Markdown)，使用 `glob` loader
- **Pagefind** — 客户端搜索，仅索引书籍详情页（`data-pagefind-body`）
- **Vitest** — 单元测试
- **Cloudflare Workers** — 部署（`wrangler.toml`）

### Content Collections (`src/content.config.ts`)

Astro 6 要求配置文件路径为 `src/content.config.ts`（非 `src/content/config.ts`）。

**书籍 JSON schema**（`src/content/books/*.json`）：
```
title, author, authorSlug, dynasty?, category[], tags[], wordCount,
chapterCount, status(完结|连载), copyrightStatus(public-domain|cc-by-sa|cc-by|author-authorized),
copyrightNote, source, sourceUrl(URL), summary
```

**章节 Markdown frontmatter**（`src/content/chapters/{bookId}/*.md`）：
```
title, bookId, chapterNumber, wordCount
```

章节文件名格式为三位零填充数字（`001.md`、`002.md`）。

### Pages & Routing (`src/pages/`)

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

| 组件 | 作用域 | 说明 |
|------|--------|------|
| `SEOHead.astro` | 全局 | JSON-LD (Book/BreadcrumbList)、meta、canonical |
| `BookCard.astro` | 列表页 | 书籍卡片 |
| `Reader.astro` | 书籍详情页 | 侧边栏阅读设置面板（字体大小 range slider、行距、主题），操作 `.reader-content` |
| `ReaderControls.astro` | 章节阅读页 | 顶部工具栏（A-/A+ 按钮、主题切换），操作 `.chapter-content` |
| `Breadcrumb.astro` | 全局 | 面包屑导航 |
| `ChapterNav.astro` | 章节阅读页 | 上一章/下一章导航 |

### Key Files

- `src/lib/recommend.ts` — 相关推荐算法（同分类 +3，同作者 +2，同标签每个 +1）
- `src/styles/global.css` — 全局样式，CSS 变量驱动主题系统
- `src/layouts/Base.astro` — 公共布局（header/nav/footer）
- `astro.config.ts` — Astro 配置（`site` 字段目前为占位符）

### localStorage Keys

| Key | 作用域 | 说明 |
|---|---|---|
| `reader-font-size` | 书籍详情 + 章节页 | 字体大小（16–28px） |
| `reader-line-height` | 书籍详情页 | 行高（1.5–2.5），仅 `Reader.astro` 使用 |
| `reader-theme` | 全站 | 主题 (default/sepia/dark)，body class 切换 |

## Testing

```bash
bun run test         # Vitest 单元测试（src/lib/）
bun run build:verify # 构建后验证：HTML 完整性、Book JSON-LD、Pagefind 索引
```

`build:verify` 检查项：所有 HTML 含 `<title>` 和 `<meta name="description">`、书籍详情页含 Book JSON-LD、关键页面存在（index/404/search/copyright）、`pagefind/` 索引目录存在。

## Deployment

Cloudflare Workers Static Assets，配置在 `wrangler.toml`。CI/CD 在 `.github/workflows/deploy.yml`。
