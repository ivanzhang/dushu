# 分类页、专题页、作者页策展增强 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让分类页、专题页、作者页从基础聚合页升级为可导览、可策展、可延展的小型读书馆页面。

**Architecture:** 保持现有 Astro 静态页面与 `src/data/library/*.ts` 数据驱动结构不变，只扩充策展元数据字段，并让页面多渲染几组导览内容块。测试先锁定数据字段和最终构建产物，再做最小实现。

**Tech Stack:** Astro 6、TypeScript、Vitest、现有内容集合与构建校验脚本

---

### Task 1: 锁定新增策展元数据

**Files:**
- Modify: `tests/library-data.test.ts`
- Modify: `src/data/library/categories.ts`
- Modify: `src/data/library/topics.ts`
- Modify: `src/data/library/authors.ts`

- [ ] **Step 1: 写失败测试**

要求测试以下行为：

- 分类元数据包含 `audience`、`entryPath`、`crossShelfLinks`
- 专题元数据包含 `curatorNote`、`readingPathBookSlugs`、`relatedCategorySlugs`
- 作者资料覆盖当前全部作者 slug，且包含 `styleTags`、`libraryRole`、`entryBookSlug`

- [ ] **Step 2: 运行测试确认失败**

Run: `bun test tests/library-data.test.ts`
Expected: FAIL，提示新增字段缺失或作者资料覆盖不足

- [ ] **Step 3: 最小实现数据结构**

在以下文件中补齐字段与内容：

- `src/data/library/categories.ts`
- `src/data/library/topics.ts`
- `src/data/library/authors.ts`

- [ ] **Step 4: 重新运行测试确认通过**

Run: `bun test tests/library-data.test.ts`
Expected: PASS

### Task 2: 锁定页面必须出现的新策展区块

**Files:**
- Modify: `tests/build-verify.ts`
- Modify: `src/pages/category/[slug].astro`
- Modify: `src/pages/topic/[slug].astro`
- Modify: `src/pages/author/[slug].astro`

- [ ] **Step 1: 写失败构建校验**

要求构建产物中至少出现：

- 分类页：`适合谁读`、`入馆路线`、`邻馆串逛`
- 专题页：`策展缘起`、`阅读路线`、`相关分馆`
- 作者页：`馆内定位`、`气质标签`、`从哪本开始`、`顺手再逛`

- [ ] **Step 2: 运行构建校验确认失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示这些区块缺失

- [ ] **Step 3: 最小实现页面渲染**

页面实现原则：

- 复用现有 `section`、`reading-guide-card`、`tag`、`CuratedShelf` 样式和组件
- 不重写卡片系统
- 尽量通过数据循环输出，避免写死文案到页面模板中

- [ ] **Step 4: 重新运行构建校验确认通过**

Run: `bun run build && bun run build:verify`
Expected: PASS

### Task 3: 全量验证与进度留档

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

- [ ] **Step 4: 追加进度记录**

把本次完成内容追加到 `docs/progress.md`，记录：

- 三类页面新增的策展模块
- 作者资料扩充范围
- 最后一轮验证结果
