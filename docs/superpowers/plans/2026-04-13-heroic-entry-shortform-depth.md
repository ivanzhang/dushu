# 公案英雄入口联动与短篇正文加深 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把公案侠义 / 英雄传奇补成站内可逛入口，同时把 5 本短篇正文统一加深一轮并立起两本 `L3` 锚点。

**Architecture:** 先用测试把“新专题存在、搜索页已接入公案/英雄入口、短篇目录至少补到 12 篇、两本短篇锚点提升为 L3”锁死，再只通过数据层与正文文件扩展完成目标。模板层尽量不动，入口变化主要集中在 `topics.ts`、`authors.ts`、`entry-guides.ts`、相关书籍 JSON 和短篇章节目录。

**Tech Stack:** Astro 6、TypeScript、Vitest、Astro Content Collections、现有维基文库抓取脚本、Pagefind

---

### Task 1: 先补公案 / 英雄入口联动的失败测试

**Files:**
- Modify: `tests/library-data.test.ts`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 写失败数据测试**

补断言：

- `gong-an-heroics` / `heroic-tales` 新专题存在并挂上目标书目
- `shiyukun` / `shinaianshi` / `qiancai` / `churenhuo` 已补齐对应专题互链
- `sanxiawuyi` / `shuihuzhuan` / `shuoyuequanzhuan` / `suitangyanyi` 的 `featuredTopics` 已挂到新专题
- 搜索导览已出现 `包公`、`梁山`、`石玉昆`、`施耐庵`、`钱彩`、`公案侠义`、`英雄传奇`

- [ ] **Step 2: 写失败构建校验**

补断言：

- `dist/search.html` 包含 `公案侠义`、`英雄传奇`、`石玉昆`、`施耐庵`、`钱彩`
- `dist/topic/gong-an-heroics.html`
- `dist/topic/heroic-tales.html`
- 两个新专题页包含 `相关专题`、`作者入口`

- [ ] **Step 3: 运行红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL

### Task 2: 先补短篇正文加深的失败测试

**Files:**
- Modify: `tests/library-data.test.ts`

- [ ] **Step 1: 写失败短篇深度测试**

补断言：

- `yueweicaotangbiji`、`zibuyu`、`yushimingyan`、`jingshitongyan`、`xingshihengyan` 目录都至少 `12` 篇
- `yueweicaotangbiji`、`yushimingyan` 的 `completionLevel` 为 `L3`
- `zibuyu`、`jingshitongyan`、`xingshihengyan` 继续保持 `L2`

- [ ] **Step 2: 运行红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL

### Task 3: 实现公案侠义 / 英雄传奇入口联动

**Files:**
- Modify: `src/data/library/topics.ts`
- Modify: `src/data/library/authors.ts`
- Modify: `src/data/library/entry-guides.ts`
- Modify: `src/content/books/sanxiawuyi.json`
- Modify: `src/content/books/shuihuzhuan.json`
- Modify: `src/content/books/shuoyuequanzhuan.json`
- Modify: `src/content/books/suitangyanyi.json`

- [ ] **Step 1: 新增两个专题并补齐相关专题 / 作者入口**
- [ ] **Step 2: 补齐作者页 relatedTopicSlugs**
- [ ] **Step 3: 补齐书籍 JSON featuredTopics**
- [ ] **Step 4: 补齐搜索页热门词 / 作者入口 / 专题入口**
- [ ] **Step 5: 重跑数据测试确认入口联动转绿**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS（入口联动相关断言转绿，短篇深度断言仍可能为红）

### Task 4: 补抓取范围并把 5 本短篇补到至少 12 篇

**Files:**
- Reuse: `scripts/fetch-chapter-helpers.mjs`
- Reuse: `scripts/fetch-chapters.mjs`
- Modify: `src/content/books/yueweicaotangbiji.json`
- Modify: `src/content/books/yushimingyan.json`
- Modify: `src/content/books/zibuyu.json`
- Modify: `src/content/books/jingshitongyan.json`
- Modify: `src/content/books/xingshihengyan.json`
- Create: `src/content/chapters/yueweicaotangbiji/09.md`
- Create: `src/content/chapters/yueweicaotangbiji/10.md`
- Create: `src/content/chapters/yueweicaotangbiji/11.md`
- Create: `src/content/chapters/yueweicaotangbiji/12.md`
- Create: `src/content/chapters/zibuyu/09.md`
- Create: `src/content/chapters/zibuyu/10.md`
- Create: `src/content/chapters/zibuyu/11.md`
- Create: `src/content/chapters/zibuyu/12.md`
- Create: `src/content/chapters/yushimingyan/11.md`
- Create: `src/content/chapters/yushimingyan/12.md`
- Create: `src/content/chapters/jingshitongyan/11.md`
- Create: `src/content/chapters/jingshitongyan/12.md`
- Create: `src/content/chapters/xingshihengyan/11.md`
- Create: `src/content/chapters/xingshihengyan/12.md`

- [ ] **Step 1: 先更新书籍 JSON 完成度目标**
- [ ] **Step 2: 用抓取脚本补齐缺失章节**
- [ ] **Step 3: 重跑数据测试确认短篇深度转绿**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS

### Task 5: 跑完整验证并补进度文档

**Files:**
- Modify: `docs/progress.md`

- [ ] **Step 1: 运行全量测试**

Run: `bun run test`
Expected: PASS

- [ ] **Step 2: 运行完整构建**

Run: `bun run build`
Expected: PASS

- [ ] **Step 3: 运行构建校验**

Run: `bun run build:verify`
Expected: PASS

- [ ] **Step 4: 追加进度记录**

记录：

- 公案侠义 / 英雄传奇入口联动
- 搜索页第三波入口扩展
- 5 本短篇统一补到至少 `12` 篇
- `阅微草堂笔记`、`喻世明言` 提升到 `L3`
- 最后一轮测试 / 构建 / 构建校验结果
