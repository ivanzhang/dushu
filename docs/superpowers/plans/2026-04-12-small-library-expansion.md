# 小型读书馆第一轮扩馆 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不破坏现有阅读链路与部署链路的前提下，把墨潮读书扩展成一个拥有 20 本馆藏、首页可策展、分类/作者可逛、专题可导流、核心馆藏可连续阅读的小型古典读书馆。

**Architecture:** 继续沿用 Astro 6 + Content Collections 作为书籍与章节的主数据源，在其上补一层“馆藏策展数据”和“聚合辅助函数”，统一驱动首页、分类页、作者页、专题页与书籍页的展示。内容填充按“核心 5 本 L3、重点 5 本 L2、铺面 10 本 L1”分波次推进，并用 Vitest 数据校验与 `build:verify` 产物校验兜底。

**Tech Stack:** Astro 6 SSG, TypeScript, Astro Content Collections, Markdown 章节, Vitest, Pagefind, Cloudflare Pages, GitHub Actions

---

## 实施输入

### 20 本正式书单与目标完成度

| slug | 书名 | 层级 | 目标完成度 | 主要分类 | 首轮定位 |
| --- | --- | --- | --- | --- | --- |
| `hongloumeng` | 红楼梦 | 核心 | `L3` | 世情小说 | 镇馆长篇、首页主推 |
| `sanguoyanyi` | 三国演义 | 核心 | `L3` | 历史演义 | 镇馆长篇、历史主轴 |
| `xiyouji` | 西游记 | 核心 | `L3` | 神魔小说 | 镇馆长篇、神魔主轴 |
| `shuihuzhuan` | 水浒传 | 核心 | `L3` | 英雄传奇 | 镇馆长篇、侠义主轴 |
| `jinpingmei` | 金瓶梅 | 核心 | `L3` | 世情小说 | 镇馆长篇、世情深化 |
| `rulinwaishi` | 儒林外史 | 重点 | `L2` | 世情讽刺 | 分类拓宽 |
| `liaozhaizhiyi` | 聊斋志异 | 重点 | `L2` | 志怪传奇 | 专题主轴 |
| `dongzhoulieguozhi` | 东周列国志 | 重点 | `L2` | 历史演义 | 历史扩展 |
| `fengshenyanyi` | 封神演义 | 重点 | `L2` | 神魔小说 | 神魔扩展 |
| `guwenguanzhi` | 古文观止 | 重点 | `L2` | 古文入门 | 非小说入口 |
| `suitangyanyi` | 隋唐演义 | 铺面 | `L1` | 历史演义 | 馆藏密度补齐 |
| `shuoyuequanzhuan` | 说岳全传 | 铺面 | `L1` | 历史演义 | 馆藏密度补齐 |
| `jinghuayuan` | 镜花缘 | 铺面 | `L1` | 神魔小说 | 馆藏密度补齐 |
| `xingshiyinyuanzhuan` | 醒世姻缘传 | 铺面 | `L1` | 世情小说 | 馆藏密度补齐 |
| `sanxiawuyi` | 三侠五义 | 铺面 | `L1` | 公案侠义 | 馆藏密度补齐 |
| `yueweicaotangbiji` | 阅微草堂笔记 | 铺面 | `L1` | 志怪笔记 | 馆藏密度补齐 |
| `zibuyu` | 子不语 | 铺面 | `L1` | 志怪笔记 | 馆藏密度补齐 |
| `yushimingyan` | 喻世明言 | 铺面 | `L1` | 话本短篇 | 馆藏密度补齐 |
| `jingshitongyan` | 警世通言 | 铺面 | `L1` | 话本短篇 | 馆藏密度补齐 |
| `xingshihengyan` | 醒世恒言 | 铺面 | `L1` | 话本短篇 | 馆藏密度补齐 |

### 首页 / 分类 / 作者 / 专题信息架构

- 首页：`馆长推荐`、`名著必读`、`历史演义`、`志怪传奇`、`世情小说`、`古文入门`、`最近入藏`
- 分类页：每个分类页固定包含 `分类简介`、`代表作品`、`完整馆藏`、`阅读建议`
- 作者页：每个作者页固定包含 `作者简介`、`时代信息`、`本站收录`、`推荐阅读顺序`
- 专题页：首轮至少落地 `四大名著`、`志怪传奇`、`世情小说`、`古文入门`

## 文件结构与职责

- 修改 `src/content.config.ts`：扩展书籍 schema，支持完成度、馆藏层级、策展专题等字段
- 创建 `src/data/library/books.ts`：维护 20 本正式书单、层级、完成度、首页分区与最近入藏顺序
- 创建 `src/data/library/categories.ts`：维护分馆简介、阅读建议、代表作品顺序
- 创建 `src/data/library/authors.ts`：维护重点作者简介、时代、推荐阅读顺序
- 创建 `src/data/library/topics.ts`：维护专题页元数据与专题说明
- 创建 `src/lib/library.ts`：统一做 slug、别名、章节覆盖率、首页分区、专题聚合
- 修改 `src/components/BookCard.astro`：增加馆藏层级 / 完成度 / 试读状态展示
- 创建 `src/components/CompletionBadge.astro`：统一渲染 `L1/L2/L3/L4`
- 创建 `src/components/CuratedShelf.astro`：复用首页 / 分类 / 作者 / 专题的书架展示
- 创建 `src/components/FeatureCallout.astro`：复用首页主推与专题推荐卡片
- 修改 `src/layouts/Base.astro`：补导航入口、品牌文案与页脚入口
- 修改 `src/styles/global.css`：补“馆入口页”与“展架页”通用样式
- 修改 `src/pages/index.astro`：首页升级为馆入口页
- 创建 `src/pages/category/index.astro`：补齐分类总览入口页
- 修改 `src/pages/category/[slug].astro`：升级为分馆页
- 修改 `src/pages/author/[slug].astro`：升级为作者展架页
- 创建 `src/pages/topic/[slug].astro`：新增专题页路由
- 修改 `src/pages/book/[slug]/index.astro`：展示完成度、收录覆盖率、专题推荐
- 修改 `src/pages/search.astro`：补专题与分馆提示文案
- 创建 `src/pages/about/index.astro`：补齐当前导航指向但尚不存在的关于页
- 修改 `astro.config.ts`：把站点 canonical 域名从占位地址改为 `https://dushu.my`
- 创建 `tests/library-data.test.ts`：校验 20 本书单、层级、专题、分类和 slug 别名
- 修改 `tests/build-verify.ts`：校验首页模块、专题页、关于页、重点页面 HTML 输出
- 修改 `scripts/fetch-chapters.py`
- 修改 `scripts/fetch-chapters.sh`
- 修改 `scripts/fetch-chapters.mjs`：统一为可扩展的章节抓取工具，并消除 `shuihuzh` / `shuihuzhuan` 不一致

## 实施前注意

- 当前工作区不干净，执行时每个任务提交前必须先跑 `git status --short`，只暂存本任务文件
- `src/content/books/jinpingmei.json`、`src/content/books/shuihuzhuan.json`、`src/content/chapters/jinpingmei/`、`src/content/chapters/shuihuzh/` 当前是本地未提交内容，先视为“需要兼容的现有输入”，不要粗暴覆盖
- 现有本地章节里 `水浒传` 的 `bookId` 为 `shuihuzh`，与书籍 slug `shuihuzhuan` 不一致；必须在数据层先补别名兼容，再考虑迁移文件
- `www.dushu.my` 的 301 与 `workflow_dispatch` 仍是批次 0 收尾项，优先在真正大规模扩馆前处理掉

### Task 1: 馆藏数据骨架与别名兼容

**Files:**
- Create: `src/data/library/books.ts`
- Create: `src/data/library/categories.ts`
- Create: `src/data/library/authors.ts`
- Create: `src/data/library/topics.ts`
- Create: `src/lib/library.ts`
- Create: `tests/library-data.test.ts`
- Modify: `src/content.config.ts`

- [ ] **Step 1: 写失败的数据校验测试**

```ts
import { describe, expect, it } from 'vitest';
import { libraryBookPlan, chapterBookAliases } from '../src/lib/library';

describe('small library plan', () => {
  it('首轮书单固定为 20 本', () => {
    expect(libraryBookPlan).toHaveLength(20);
  });

  it('核心/重点/铺面配比正确', () => {
    expect(libraryBookPlan.filter((item) => item.tier === 'core')).toHaveLength(5);
    expect(libraryBookPlan.filter((item) => item.tier === 'featured')).toHaveLength(5);
    expect(libraryBookPlan.filter((item) => item.tier === 'shelf')).toHaveLength(10);
  });

  it('兼容水浒传历史章节别名', () => {
    expect(chapterBookAliases.shuihuzhuan).toContain('shuihuzh');
  });
});
```

- [ ] **Step 2: 运行测试，确认它先失败**

Run: `bun vitest run tests/library-data.test.ts -v`
Expected: FAIL，提示 `src/data/library/books.ts` 或 `src/lib/library.ts` 尚不存在

- [ ] **Step 3: 实现馆藏策展数据与别名工具**

```ts
export const chapterBookAliases = {
  shuihuzhuan: ['shuihuzhuan', 'shuihuzh'],
} as const;

export const libraryBookPlan = [
  { slug: 'hongloumeng', tier: 'core', completionLevel: 'L3', topics: ['four-masterpieces', 'worldly-novels'] },
  { slug: 'liaozhaizhiyi', tier: 'featured', completionLevel: 'L2', topics: ['strange-tales'] },
];
```

- [ ] **Step 4: 回跑数据测试**

Run: `bun vitest run tests/library-data.test.ts -v`
Expected: PASS

- [ ] **Step 5: 提交这一批数据骨架**

```bash
git status --short
git add src/content.config.ts src/data/library/books.ts src/data/library/categories.ts src/data/library/authors.ts src/data/library/topics.ts src/lib/library.ts tests/library-data.test.ts
git commit -m "feat: add curated library metadata foundation"
```

### Task 2: 首页升级为馆入口页

**Files:**
- Create: `src/components/CompletionBadge.astro`
- Create: `src/components/CuratedShelf.astro`
- Create: `src/components/FeatureCallout.astro`
- Modify: `src/components/BookCard.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 先扩展构建验证脚本，锁定首页模块**

```ts
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
check(indexHtml.includes('馆长推荐'), '首页缺少 馆长推荐 模块');
check(indexHtml.includes('最近入藏'), '首页缺少 最近入藏 模块');
check(indexHtml.includes('名著必读'), '首页缺少 名著必读 模块');
```

- [ ] **Step 2: 先运行构建校验，确认首页断言失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示首页缺少新模块文案

- [ ] **Step 3: 用共享组件改造首页**

```astro
<FeatureCallout
  title="馆长推荐"
  description="先从可连续阅读的镇馆书开始。"
  href="/topic/four-masterpieces"
/>

<CuratedShelf
  title="名著必读"
  books={mustReadBooks}
  showCompletion={true}
/>
```

- [ ] **Step 4: 再跑构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS，首页 HTML 含 `馆长推荐`、`名著必读`、`最近入藏`

- [ ] **Step 5: 提交首页升级**

```bash
git status --short
git add src/components/CompletionBadge.astro src/components/CuratedShelf.astro src/components/FeatureCallout.astro src/components/BookCard.astro src/layouts/Base.astro src/pages/index.astro src/styles/global.css tests/build-verify.ts
git commit -m "feat: turn home page into a curated library entrance"
```

### Task 3: 分类页升级为分馆页

**Files:**
- Create: `src/pages/category/index.astro`
- Modify: `src/pages/category/[slug].astro`
- Modify: `src/lib/library.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 给分馆页加产物断言**

```ts
check(existsSync(join(DIST, 'category.html')), '缺少分类总览页');
const worldlyHtml = readFileSync(join(DIST, 'category', '世情小说.html'), 'utf-8');
check(worldlyHtml.includes('阅读建议'), '分类页缺少 阅读建议');
check(worldlyHtml.includes('代表作品'), '分类页缺少 代表作品');
```

- [ ] **Step 2: 跑构建校验，确认它失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL，分类页还没有 `代表作品` / `阅读建议`

- [ ] **Step 3: 注入分类元数据并改造页面结构**

```astro
<section class="category-index-hero">
  <h1>分馆浏览</h1>
</section>

<section class="hall-intro">
  <h2>分类简介</h2>
  <p>{categoryMeta.description}</p>
</section>

<CuratedShelf title="代表作品" books={featuredBooks} />
```

- [ ] **Step 4: 回跑构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS

- [ ] **Step 5: 提交分馆页升级**

```bash
git status --short
git add src/pages/category/index.astro src/pages/category/[slug].astro src/lib/library.ts src/styles/global.css tests/build-verify.ts
git commit -m "feat: upgrade category pages into library halls"
```

### Task 4: 作者页升级为作者展架页

**Files:**
- Modify: `src/pages/author/[slug].astro`
- Modify: `src/lib/library.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 为作者页补构建断言**

```ts
const authorHtml = readFileSync(join(DIST, 'author', 'caoxueqin.html'), 'utf-8');
check(authorHtml.includes('推荐阅读顺序'), '作者页缺少 推荐阅读顺序');
check(authorHtml.includes('作者简介'), '作者页缺少 作者简介');
```

- [ ] **Step 2: 跑构建校验，确认当前失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL

- [ ] **Step 3: 接入作者策展数据**

```astro
<section class="author-bio-card">
  <h2>作者简介</h2>
  <p>{authorMeta.summary}</p>
</section>

<section>
  <h2>推荐阅读顺序</h2>
  <ol>{authorMeta.readingOrder.map((slug) => <li>{slug}</li>)}</ol>
</section>
```

- [ ] **Step 4: 回跑构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS

- [ ] **Step 5: 提交作者展架**

```bash
git status --short
git add src/pages/author/[slug].astro src/lib/library.ts src/styles/global.css tests/build-verify.ts
git commit -m "feat: upgrade author pages into curated shelves"
```

### Task 5: 新增专题页与关于页

**Files:**
- Create: `src/pages/topic/[slug].astro`
- Create: `src/pages/about/index.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/lib/library.ts`
- Modify: `src/pages/search.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 先给新路由写产物断言**

```ts
check(existsSync(join(DIST, 'topic', 'four-masterpieces.html')), '缺少专题页: 四大名著');
check(existsSync(join(DIST, 'topic', 'strange-tales.html')), '缺少专题页: 志怪传奇');
check(existsSync(join(DIST, 'about.html')), '缺少关于页');
const searchHtml = readFileSync(join(DIST, 'search.html'), 'utf-8');
check(searchHtml.includes('分馆浏览') || searchHtml.includes('专题'), '搜索页缺少馆藏导览提示');
```

- [ ] **Step 2: 先跑构建验证**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示新页面不存在

- [ ] **Step 3: 创建专题页和关于页**

```astro
export async function getStaticPaths() {
  return topicEntries.map((topic) => ({ params: { slug: topic.slug }, props: { topic } }));
}
```

- [ ] **Step 4: 回跑构建验证**

Run: `bun run build && bun run build:verify`
Expected: PASS，`dist/topic/*.html` 与 `dist/about.html` 生成成功

- [ ] **Step 5: 提交新路由**

```bash
git status --short
git add src/pages/topic/[slug].astro src/pages/about/index.astro src/layouts/Base.astro src/lib/library.ts src/pages/search.astro src/styles/global.css tests/build-verify.ts
git commit -m "feat: add topic routes and about page"
```

### Task 6: 书籍详情页显示完成度与收录覆盖率

**Files:**
- Modify: `src/pages/book/[slug]/index.astro`
- Modify: `src/pages/book/[slug]/[chapter].astro`
- Modify: `src/lib/library.ts`
- Modify: `src/components/BookCard.astro`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 为书籍详情页加收录覆盖率断言**

```ts
const bookHtml = readFileSync(join(DIST, 'book', 'hongloumeng.html'), 'utf-8');
check(bookHtml.includes('收录进度'), '书籍页缺少 收录进度');
check(bookHtml.includes('完成度'), '书籍页缺少 完成度');
```

- [ ] **Step 2: 先跑构建校验，确认失败**

Run: `bun run build && bun run build:verify`
Expected: FAIL

- [ ] **Step 3: 用别名兼容计算章节覆盖率**

```ts
export function matchChapterBookIds(bookSlug: string) {
  return chapterBookAliases[bookSlug] ?? [bookSlug];
}

export function getCoverageLabel(collected: number, total: number) {
  return `${collected} / ${total}`;
}
```

- [ ] **Step 4: 回跑构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS，书籍页能显示 `收录进度`，且 `水浒传` 本地章节可以被兼容识别

- [ ] **Step 5: 提交书籍页增强**

```bash
git status --short
git add src/pages/book/[slug]/index.astro src/pages/book/[slug]/[chapter].astro src/lib/library.ts src/components/BookCard.astro tests/build-verify.ts
git commit -m "feat: show library completion and coverage on book pages"
```

### Task 7: 章节抓取工具统一化

**Files:**
- Modify: `scripts/fetch-chapters.py`
- Modify: `scripts/fetch-chapters.sh`
- Modify: `scripts/fetch-chapters.mjs`
- Create: `tests/chapter-fetch-plan.test.ts`

- [ ] **Step 1: 先写一个最小工具测试，锁定 slug 与文件名规则**

```ts
import { describe, expect, it } from 'vitest';
import { normalizeChapterBookSlug, getChapterFilename } from '../scripts/fetch-chapters.mjs';

describe('chapter fetch helpers', () => {
  it('把历史别名 shuihuzh 统一映射到 shuihuzhuan', () => {
    expect(normalizeChapterBookSlug('shuihuzh')).toBe('shuihuzhuan');
  });

  it('长篇默认输出三位章节文件名', () => {
    expect(getChapterFilename('shuihuzhuan', 1)).toBe('001.md');
  });
});
```

- [ ] **Step 2: 先运行测试，确认失败**

Run: `bun vitest run tests/chapter-fetch-plan.test.ts -v`
Expected: FAIL，工具函数尚未导出

- [ ] **Step 3: 提取脚本公共规则并统一 slug**

```ts
export function normalizeChapterBookSlug(bookSlug) {
  return bookSlug === 'shuihuzh' ? 'shuihuzhuan' : bookSlug;
}
```

- [ ] **Step 4: 回跑脚本测试**

Run: `bun vitest run tests/chapter-fetch-plan.test.ts -v`
Expected: PASS

- [ ] **Step 5: 提交抓取工具整理**

```bash
git status --short
git add scripts/fetch-chapters.py scripts/fetch-chapters.sh scripts/fetch-chapters.mjs tests/chapter-fetch-plan.test.ts
git commit -m "refactor: normalize chapter fetch scripts for expansion"
```

### Task 8: 波次 A 内容落库（核心 5 本校准 + 重点 5 本 L2）

**Files:**
- Modify: `src/content/books/hongloumeng.json`
- Modify: `src/content/books/sanguoyanyi.json`
- Modify: `src/content/books/xiyouji.json`
- Modify: `src/content/books/shuihuzhuan.json`
- Modify: `src/content/books/jinpingmei.json`
- Create: `src/content/books/rulinwaishi.json`
- Create: `src/content/books/liaozhaizhiyi.json`
- Create: `src/content/books/dongzhoulieguozhi.json`
- Create: `src/content/books/fengshenyanyi.json`
- Create: `src/content/books/guwenguanzhi.json`
- Create: `src/content/chapters/rulinwaishi/`
- Create: `src/content/chapters/liaozhaizhiyi/`
- Create: `src/content/chapters/dongzhoulieguozhi/`
- Create: `src/content/chapters/fengshenyanyi/`
- Create: `src/content/chapters/guwenguanzhi/`

- [ ] **Step 1: 先补齐书籍 JSON 元数据**

```json
{
  "title": "儒林外史",
  "author": "吴敬梓",
  "authorSlug": "wujingzi",
  "collectionTier": "featured",
  "completionLevel": "L2",
  "featuredTopics": ["worldly-novels"]
}
```

- [ ] **Step 2: 为重点 5 本导入首批可试读章节**

Run: `python3 scripts/fetch-chapters.py rulinwaishi 1 12`
Expected: 在 `src/content/chapters/rulinwaishi/` 生成首批章节文件

- [ ] **Step 3: 为核心 5 本补足连续阅读区段**

Run: `bun run build`
Expected: BUILD PASS，且核心 5 本书籍页都能显示非零覆盖率

- [ ] **Step 4: 跑完整验证**

Run: `bun run test && bun run build && bun run build:verify`
Expected: PASS

- [ ] **Step 5: 提交波次 A**

```bash
git status --short
git add src/content/books/hongloumeng.json src/content/books/sanguoyanyi.json src/content/books/xiyouji.json src/content/books/shuihuzhuan.json src/content/books/jinpingmei.json src/content/books/rulinwaishi.json src/content/books/liaozhaizhiyi.json src/content/books/dongzhoulieguozhi.json src/content/books/fengshenyanyi.json src/content/books/guwenguanzhi.json src/content/chapters/rulinwaishi src/content/chapters/liaozhaizhiyi src/content/chapters/dongzhoulieguozhi src/content/chapters/fengshenyanyi src/content/chapters/guwenguanzhi
git commit -m "feat: add first expansion wave of featured library content"
```

### Task 9: 波次 B 内容落库（铺面 10 本 L1）

**Files:**
- Create: `src/content/books/suitangyanyi.json`
- Create: `src/content/books/shuoyuequanzhuan.json`
- Create: `src/content/books/jinghuayuan.json`
- Create: `src/content/books/xingshiyinyuanzhuan.json`
- Create: `src/content/books/sanxiawuyi.json`
- Create: `src/content/books/yueweicaotangbiji.json`
- Create: `src/content/books/zibuyu.json`
- Create: `src/content/books/yushimingyan.json`
- Create: `src/content/books/jingshitongyan.json`
- Create: `src/content/books/xingshihengyan.json`

- [ ] **Step 1: 先补 10 本铺面书的 L1 元数据**

```json
{
  "title": "镜花缘",
  "collectionTier": "shelf",
  "completionLevel": "L1",
  "summary": "……"
}
```

- [ ] **Step 2: 运行一次构建，确认 20 本都能出书籍页**

Run: `bun run build`
Expected: `dist/book/` 下生成 20 本书籍详情页

- [ ] **Step 3: 检查首页/专题/分类是否都能聚合到新书**

Run: `bun run build:verify`
Expected: PASS，且首页总书数、相关页面不报错

- [ ] **Step 4: 更新最近入藏与专题推荐顺序**

Run: `bun vitest run tests/library-data.test.ts -v`
Expected: PASS，最近入藏排序与专题映射仍合法

- [ ] **Step 5: 提交波次 B**

```bash
git status --short
git add src/content/books/suitangyanyi.json src/content/books/shuoyuequanzhuan.json src/content/books/jinghuayuan.json src/content/books/xingshiyinyuanzhuan.json src/content/books/sanxiawuyi.json src/content/books/yueweicaotangbiji.json src/content/books/zibuyu.json src/content/books/yushimingyan.json src/content/books/jingshitongyan.json src/content/books/xingshihengyan.json
git commit -m "feat: add shelf titles for first small library expansion"
```

### Task 10: 批次 0 收尾与上线验收

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `wrangler.toml`
- Modify: `astro.config.ts`
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 先补部署与 canonical 断言**

```ts
const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
check(homeHtml.includes('https://dushu.my'), '首页 canonical 仍不是主域');
```

- [ ] **Step 2: 提交部署收尾**

```bash
git status --short
git add .github/workflows/deploy.yml wrangler.toml astro.config.ts
git commit -m "chore: finalize deployment workflow and redirect setup"
```

- [ ] **Step 3: 推送并观察 Actions**

Run: `bun run build && bun run build:verify && git push origin main`
Expected: 本地验证 PASS，随后 GitHub Actions `Deploy` 工作流启动，Pages 部署成功

- [ ] **Step 4: 验证线上主域与 www 跳转**

Run: `curl -I https://dushu.my && curl -I https://www.dushu.my`
Expected: `https://dushu.my` 返回 `200`；`https://www.dushu.my` 返回 `301`，并带 `Location: https://dushu.my/`

- [ ] **Step 5: 记录收尾结果**

```bash
printf '\n- 2026-04-12：完成第一轮小型读书馆实施计划并进入执行。\n' >> docs/progress.md
git add docs/progress.md
git commit -m "docs: record expansion rollout progress"
```

## 验收清单

- 20 本书全部出现在首页、搜索或相关聚合入口中
- 核心 5 本书籍页显示 `L3` 且具备连续阅读区段
- 重点 5 本至少有可打开的首批章节
- 铺面 10 本至少有完整 L1 元数据、作者页与分类页可见
- 首页含 `馆长推荐 / 名著必读 / 历史演义 / 志怪传奇 / 世情小说 / 古文入门 / 最近入藏`
- 分类页、作者页、专题页都不再只是简单列表
- `bun run test`
- `bun run build`
- `bun run build:verify`
- 线上 `https://dushu.my` 返回 `200`
- 线上 `https://www.dushu.my` 返回 `301` 跳转到主域

## 执行顺序建议

1. 先做 `Task 1` 到 `Task 6`，把馆藏策展框架与页面骨架搭起来
2. 再做 `Task 7`，把章节抓取工具统一，避免内容波次开始后反复返工
3. 然后依次推进 `Task 8`、`Task 9`
4. 最后做 `Task 10`，把运维收尾和线上验收补齐

## 风险补充

- 内容来源与版权链路仍需后续专项审查，当前计划只做首轮馆藏落地，不视为法律闭环
- `Pagefind` 产物体积会随着章节增多继续上涨，扩馆执行中每个波次都要观察构建时间与索引目录大小
- 如果 `水浒传` 章节目录最终从 `shuihuzh/` 迁移到 `shuihuzhuan/`，需额外补一个“目录迁移不影响旧链接”的验证步骤
