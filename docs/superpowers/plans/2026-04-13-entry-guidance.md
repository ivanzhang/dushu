# 首页、搜索页、分类总览页入口导览增强 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让首页、搜索页、分类总览页都具备统一的“入口导览”能力，帮助新读者快速进入馆藏。

**Architecture:** 新增集中式导览数据文件，让首页、搜索页、分类总览页通过数据循环渲染导览模块；分类总览页继续复用现有分类元数据的 `audience`。先用构建校验锁定页面结构，再做最小实现。

**Tech Stack:** Astro 6、TypeScript、Vitest、现有静态页面组件与构建校验

---

### Task 1: 锁定入口页新增导览区块

**Files:**
- Modify: `tests/build-verify.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/category/index.astro`

- [ ] **Step 1: 写失败构建校验**

要求构建产物中至少出现：

- 首页：`怎么逛这座小馆`、`按兴趣进入`、`馆藏地图`
- 搜索页：`如果你不知道搜什么`、`按读法找书`
- 分类总览页：`怎么选馆`、`推荐逛法`、`适合谁`

- [ ] **Step 2: 运行构建校验确认失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示这些导览区块缺失

- [ ] **Step 3: 最小实现页面结构**

实现原则：

- 尽量复用现有 `hall-card-grid`、`hall-card`、`reading-guide-card` 样式
- 不新增复杂组件，优先用现有页面结构完成
- 页面渲染应以数据循环为主，不要把大段导览文案写死在模板里

- [ ] **Step 4: 重新运行构建校验确认通过**

Run: `bun run build && bun run build:verify`
Expected: PASS

### Task 2: 提炼入口导览文案数据

**Files:**
- Create: `src/data/library/entry-guides.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/category/index.astro`

- [ ] **Step 1: 写失败数据测试或先依赖页面校验失败**

本任务可复用 Task 1 的失败结果作为红灯，不额外拆分测试。

- [ ] **Step 2: 新增导览数据文件**

集中管理：

- 首页入口路径
- 首页兴趣入口
- 首页馆藏地图
- 搜索页快捷入口
- 搜索页读法入口
- 分类总览页推荐逛法

- [ ] **Step 3: 页面接入数据文件**

接入文件：

- `src/pages/index.astro`
- `src/pages/search.astro`
- `src/pages/category/index.astro`

- [ ] **Step 4: 再次运行构建校验**

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

把本次完成内容写进 `docs/progress.md`，记录：

- 三个入口页新增的导览区块
- 导览数据文件或导览结构调整
- 最后一轮验证结果
