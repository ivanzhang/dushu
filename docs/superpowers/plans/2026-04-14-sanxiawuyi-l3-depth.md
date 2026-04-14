# 三侠五义 L3 深读入口推进 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `三侠五义` 从前 `12` 回补到前 `20` 回，并把它的真实完成度从 `L2` 提升到 `L3`。

**Architecture:** 先用 `tests/library-data.test.ts` 锁死“`sanxiawuyi` 至少到 20 回、`sanxiawuyi` 升到 L3、另外两本仍保持 12 回和 L2”这些结果，再复用现有维基文库抓取脚本补 `013-020` 回正文，最后只更新 `src/content/books/sanxiawuyi.json` 的 `completionLevel`。页面模板层不动，全部变化由真实内容驱动。

**Tech Stack:** Astro 6、TypeScript、Vitest、Markdown 章节、现有维基文库抓取脚本、Astro Content Collections

---

### Task 1: 先把公案 / 英雄三书的目标分层写成失败测试

**Files:**
- Modify: `tests/library-data.test.ts`

- [ ] **Step 1: 先写失败数据测试**

把“公案与英雄三书都到 12 回、都为 L2”的统一断言，改成分层目标：

- `sanxiawuyi >= 20`
- `shuoyuequanzhuan >= 12`
- `suitangyanyi >= 12`
- `sanxiawuyi.completionLevel === 'L3'`
- `shuoyuequanzhuan.completionLevel === 'L2'`
- `suitangyanyi.completionLevel === 'L2'`

- [ ] **Step 2: 运行局部测试确认红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL，并明确失败在 `sanxiawuyi` 章节数仍不足 `20` 或完成度尚未升到 `L3`

### Task 2: 复用抓取脚本补《三侠五义》第 13 到 20 回

**Files:**
- Create: `src/content/chapters/sanxiawuyi/013.md` ... `020.md`

- [ ] **Step 1: 用抓取脚本补 `013-020` 回**

Run: `bun scripts/fetch-chapters.mjs -- sanxiawuyi 13 20`
Expected: 生成 `src/content/chapters/sanxiawuyi/013.md` 到 `020.md`

- [ ] **Step 2: 重跑局部测试看剩余失败点**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: 若仍失败，应只剩 `sanxiawuyi` 的 `completionLevel` 尚未到 `L3`

### Task 3: 只把《三侠五义》的真实完成度升到 L3

**Files:**
- Modify: `src/content/books/sanxiawuyi.json`

- [ ] **Step 1: 把 `completionLevel` 从 `L2` 改到 `L3`**

示例改动：

```json
{
  "completionLevel": "L3"
}
```

- [ ] **Step 2: 重跑局部测试确认转绿**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS

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

- `三侠五义` 已从前 `12` 回补到前 `20` 回
- `sanxiawuyi` 已从 `L2` 升到 `L3`
- `说岳全传`、`隋唐演义` 继续保持 `L2`
- 最终测试 / 构建 / 构建校验结果
