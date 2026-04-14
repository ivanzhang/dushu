# 说岳全传 L3 深读入口推进 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `说岳全传` 从前 `12` 回补到前 `20` 回，并把它的真实完成度从 `L2` 提升到 `L3`。

**Architecture:** 先用 `tests/library-data.test.ts` 锁死“`sanxiawuyi` 与 `shuoyuequanzhuan` 都至少到 20 回、两本都为 L3、`suitangyanyi` 仍保持 12 回和 L2”这些结果，再复用现有维基文库抓取脚本补 `013-020` 回正文，最后只更新 `src/content/books/shuoyuequanzhuan.json` 的 `completionLevel`。页面模板层不动，全部变化由真实内容驱动。

**Tech Stack:** Astro 6、TypeScript、Vitest、Markdown 章节、现有维基文库抓取脚本、Astro Content Collections

---

### Task 1: 先把公案 / 英雄三书的分层目标继续推进成失败测试

**Files:**
- Modify: `tests/library-data.test.ts`

- [ ] **Step 1: 先写失败数据测试**

把当前分层目标进一步改成：

- `sanxiawuyi >= 20`
- `shuoyuequanzhuan >= 20`
- `suitangyanyi >= 12`
- `sanxiawuyi.completionLevel === 'L3'`
- `shuoyuequanzhuan.completionLevel === 'L3'`
- `suitangyanyi.completionLevel === 'L2'`

- [ ] **Step 2: 运行局部测试确认红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL，并明确失败在 `shuoyuequanzhuan` 章节数仍不足 `20` 或完成度尚未升到 `L3`

### Task 2: 复用抓取脚本补《说岳全传》第 13 到 20 回

**Files:**
- Create: `src/content/chapters/shuoyuequanzhuan/013.md` ... `020.md`

- [ ] **Step 1: 用抓取脚本补 `013-020` 回**

Run: `bun scripts/fetch-chapters.mjs -- shuoyuequanzhuan 13 20`
Expected: 生成 `src/content/chapters/shuoyuequanzhuan/013.md` 到 `020.md`

- [ ] **Step 2: 重跑局部测试看剩余失败点**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: 若仍失败，应只剩 `shuoyuequanzhuan` 的 `completionLevel` 尚未到 `L3`

### Task 3: 只把《说岳全传》的真实完成度升到 L3

**Files:**
- Modify: `src/content/books/shuoyuequanzhuan.json`

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

- `说岳全传` 已从前 `12` 回补到前 `20` 回
- `shuoyuequanzhuan` 已从 `L2` 升到 `L3`
- `隋唐演义` 继续保持 `L2`
- 最终测试 / 构建 / 构建校验结果
