# 公案与英雄三书试读推进 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `三侠五义`、`说岳全传`、`隋唐演义` 建立真实试读目录，把三本都补到前 12 回并提升到 `L2`。

**Architecture:** 先用测试锁死“抓取规则存在、三本章节都至少到 12 回、完成度升到 L2”这些结果，再补 `fetch-chapter-helpers` 的最小配置并复用既有抓取脚本落正文。展示模板层不动，只通过真实书籍 JSON 和章节文件驱动页面变化。

**Tech Stack:** Astro 6、TypeScript、Vitest、现有维基文库抓取脚本、Astro Content Collections

---

### Task 1: 先补三本抓取规则与试读目标的失败测试

**Files:**
- Modify: `tests/chapter-fetch-plan.test.ts`
- Modify: `tests/library-data.test.ts`

- [ ] **Step 1: 先写抓取规则红灯测试**

补三本断言：

- `sanxiawuyi`
- `shuoyuequanzhuan`
- `suitangyanyi`

至少锁定：

- `getChapterFilename(...)`
- `getChapterSourceUrl(...)`
- `getBookFetchConfig(...)`

- [ ] **Step 2: 先写馆藏深度红灯测试**

补断言：

- 三本章节目录都至少 `12` 个 Markdown 文件
- 三本 `completionLevel` 都为 `L2`

- [ ] **Step 3: 跑红灯确认失败**

Run: `bun x vitest run tests/chapter-fetch-plan.test.ts tests/library-data.test.ts`
Expected: FAIL，并明确失败在“抓取规则不存在”或“章节目录尚未建立”

### Task 2: 补三本抓取规则

**Files:**
- Modify: `scripts/fetch-chapter-helpers.mjs`
- Modify: `tests/chapter-fetch-plan.test.ts`

- [ ] **Step 1: 为三本补最小抓取配置**
- [ ] **Step 2: 只实现通过测试所需的最小规则**
- [ ] **Step 3: 重跑抓取规则测试确认转绿**

Run: `bun x vitest run tests/chapter-fetch-plan.test.ts`
Expected: PASS

### Task 3: 抓取三本前 12 回正文并提升完成度

**Files:**
- Modify: `src/content/books/sanxiawuyi.json`
- Modify: `src/content/books/shuoyuequanzhuan.json`
- Modify: `src/content/books/suitangyanyi.json`
- Create: `src/content/chapters/sanxiawuyi/001.md` ... `012.md`
- Create: `src/content/chapters/shuoyuequanzhuan/001.md` ... `012.md`
- Create: `src/content/chapters/suitangyanyi/001.md` ... `012.md`

- [ ] **Step 1: 用抓取脚本补齐三本前 12 回**
- [ ] **Step 2: 把三本 completionLevel 提升到 `L2`**
- [ ] **Step 3: 重跑馆藏数据测试确认转绿**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS

### Task 4: 跑完整验证并补进度

**Files:**
- Modify: `docs/progress.md`

- [ ] **Step 1: 运行全量测试**

Run: `bun run test`
Expected: PASS

- [ ] **Step 2: 运行完整构建**

Run: `bun run build`
Expected: PASS

- [ ] **Step 3: 运行构建验证**

Run: `bun run build:verify`
Expected: PASS

- [ ] **Step 4: 更新进度文档**

记录：

- 三本公案 / 英雄作品补到前 `12` 回
- 三本完成度从 `L1` 升到 `L2`
- 最终测试 / 构建 / 校验结果
