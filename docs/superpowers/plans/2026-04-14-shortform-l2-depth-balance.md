# 短篇三书 L2 厚度均衡 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `子不语`、`警世通言`、`醒世恒言` 从前 `12` 篇补到前 `16` 篇，并继续保持三本的真实完成度为 `L2`。

**Architecture:** 先用 `tests/library-data.test.ts` 锁死“三本章节数至少到 16、completionLevel 仍为 L2”这些结果，再复用现有维基文库抓取脚本补 `13-16` 篇正文。页面模板层不动，只通过真实章节文件和既有书籍 JSON 驱动页面自然变厚。

**Tech Stack:** Astro 6、TypeScript、Vitest、Markdown 章节、现有维基文库抓取脚本

---

### Task 1: 先把三本短篇的目标从 12 提升到 16

**Files:**
- Modify: `tests/library-data.test.ts`

- [ ] **Step 1: 先写失败数据测试**

把以下断言从 `12` 提升到 `16`：

- `zibuyu`
- `jingshitongyan`
- `xingshihengyan`

同时继续锁定：

- 三本 `completionLevel` 都必须保持 `L2`

- [ ] **Step 2: 运行局部测试确认红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL，并明确失败在 `zibuyu` / `jingshitongyan` / `xingshihengyan` 章节数仍不足 `16`

### Task 2: 复用抓取脚本补三本的第 13 到 16 篇

**Files:**
- Create: `src/content/chapters/zibuyu/13.md` ... `16.md`
- Create: `src/content/chapters/jingshitongyan/13.md` ... `16.md`
- Create: `src/content/chapters/xingshihengyan/13.md` ... `16.md`

- [ ] **Step 1: 先抓 `子不语` 第 13 到 16 篇**

Run: `bun scripts/fetch-chapters.mjs -- zibuyu 13 16`
Expected: 生成 `src/content/chapters/zibuyu/13.md` 到 `16.md`

- [ ] **Step 2: 再抓 `警世通言` 第 13 到 16 篇**

Run: `bun scripts/fetch-chapters.mjs -- jingshitongyan 13 16`
Expected: 生成 `src/content/chapters/jingshitongyan/13.md` 到 `16.md`

- [ ] **Step 3: 再抓 `醒世恒言` 第 13 到 16 篇**

Run: `bun scripts/fetch-chapters.mjs -- xingshihengyan 13 16`
Expected: 生成 `src/content/chapters/xingshihengyan/13.md` 到 `16.md`

- [ ] **Step 4: 重跑局部测试确认转绿**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS

### Task 3: 确认完成度未被意外改动

**Files:**
- Verify only: `src/content/books/zibuyu.json`
- Verify only: `src/content/books/jingshitongyan.json`
- Verify only: `src/content/books/xingshihengyan.json`

- [ ] **Step 1: 核对三本 completionLevel 仍为 `L2`**
- [ ] **Step 2: 如果测试已覆盖且通过，则不做多余改动**

### Task 4: 跑完整验证并补进度记录

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

- `子不语`、`警世通言`、`醒世恒言` 都已从前 `12` 篇补到前 `16` 篇
- 三本 `completionLevel` 继续保持 `L2`
- 最终测试 / 构建 / 构建校验结果
