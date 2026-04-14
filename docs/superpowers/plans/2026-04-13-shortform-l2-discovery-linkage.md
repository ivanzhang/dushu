# 短篇馆藏 L2 提升与搜索导览联动 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `阅微草堂笔记 / 子不语 / 喻世明言 / 警世通言 / 醒世恒言` 从 `L1` 推到 `L2`，并同时补齐搜索推荐词、作者入口、专题互链，让短篇阅读线真正能逛起来。

**Architecture:** 先用测试锁定 5 本短篇组的目标状态，以及搜索页 / 专题页必须新增的入口区块；再扩展维基文库抓取规则，把 5 本短篇的首批篇目抓到本地；最后通过新的专题数据和搜索导览数据把 `三言话本`、作者入口和推荐词深链接串起来。页面层坚持数据驱动，尽量复用现有 `hall-card`、`reading-guide-card` 和 Pagefind UI 挂载结构。

**Tech Stack:** Astro 6、TypeScript、Vitest、Astro Content Collections、Markdown 章节、Pagefind UI、现有维基文库抓取脚本

---

### Task 1: 锁定 5 本短篇组与新专题的数据目标

**Files:**
- Modify: `tests/library-data.test.ts`
- Modify: `src/data/library/topics.ts`
- Modify: `src/content/books/yueweicaotangbiji.json`
- Modify: `src/content/books/zibuyu.json`
- Modify: `src/content/books/yushimingyan.json`
- Modify: `src/content/books/jingshitongyan.json`
- Modify: `src/content/books/xingshihengyan.json`

- [ ] **Step 1: 先写失败数据测试**

补以下测试：

```ts
it('5 本短篇组的真实完成度已经提升到 L2', () => {
  const shortformBooks = [
    'yueweicaotangbiji',
    'zibuyu',
    'yushimingyan',
    'jingshitongyan',
    'xingshihengyan',
  ];
  // 逐本断言 JSON 中 completionLevel === 'L2'
});

it('三言话本专题已经存在并收拢三言三部', () => {
  const topic = libraryTopics.find((item) => item.slug === 'three-yans');
  expect(topic?.bookSlugs).toEqual([
    'yushimingyan',
    'jingshitongyan',
    'xingshihengyan',
  ]);
});
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `bun run test`
Expected: FAIL，提示 5 本短篇组完成度、`three-yans` 专题或新增字段缺失

- [ ] **Step 3: 最小更新专题与书籍元数据**

实现要求：

- 在 `src/data/library/topics.ts` 为专题类型新增：
  - `relatedTopicSlugs?: string[]`
  - `featuredAuthorSlugs?: string[]`
- 新增专题：
  - `three-yans`
  - `name: '三言话本'`
  - `bookSlugs: ['yushimingyan', 'jingshitongyan', 'xingshihengyan']`
- 更新 5 本书：
  - `completionLevel: 'L2'`
  - `featuredTopics`
    - `阅微草堂笔记`、`子不语` 挂到 `strange-tales`
    - 三言三部挂到 `three-yans`

- [ ] **Step 4: 重新运行测试确认通过**

Run: `bun run test`
Expected: PASS，新增数据测试转绿

### Task 2: 扩抓取规则并锁定 5 本短篇组的章节来源格式

**Files:**
- Modify: `tests/chapter-fetch-plan.test.ts`
- Modify: `scripts/fetch-chapter-helpers.mjs`
- Modify: `scripts/fetch-chapters.mjs`

- [ ] **Step 1: 先写失败抓取规则测试**

补以下断言：

```ts
it('阅微草堂笔记使用卷编号抓取', () => {
  expect(getChapterFilename('yueweicaotangbiji', 1)).toBe('01.md');
  expect(getChapterSourceUrl('yueweicaotangbiji', 1)).toBe(
    'https://zh.wikisource.org/wiki/%E9%96%B1%E5%BE%AE%E8%8D%89%E5%A0%82%E7%AD%86%E8%A8%98/%E5%8D%B71',
  );
});

it('喻世明言使用两位卷编号抓取', () => {
  expect(getChapterSourceUrl('yushimingyan', 1)).toContain('%E7%AC%AC01%E5%8D%B7');
});
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `bun run test`
Expected: FAIL，提示新书抓取配置不存在

- [ ] **Step 3: 在抓取辅助文件补齐 5 本规则**

实现要求：

- `阅微草堂笔记`
  - `storageDir: 'yueweicaotangbiji'`
  - `sourceLabelPrefix: '%E5%8D%B7'`
  - `sourceNumberWidth: 0`
  - `filenameWidth: 2`
- `子不语`
  - `storageDir: 'zibuyu'`
  - `sourceLabelPrefix: '%E5%8D%B7'`
  - `sourceNumberWidth: 0`
  - `filenameWidth: 2`
- `喻世明言 / 警世通言 / 醒世恒言`
  - `sourceLabelPrefix: '%E7%AC%AC'`
  - `sourceLabelSuffix: '%E5%8D%B7'`
  - `sourceNumberWidth: 2`
  - `filenameWidth: 2`

示例配置片段：

```js
yushimingyan: {
  canonicalBookId: 'yushimingyan',
  aliases: ['yushimingyan'],
  storageDir: 'yushimingyan',
  sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%96%BB%E4%B8%96%E6%98%8E%E8%A8%80/',
  sourceLabelPrefix: '%E7%AC%AC',
  sourceLabelSuffix: '%E5%8D%B7',
  sourceNumberWidth: 2,
  filenameWidth: 2,
},
```

- [ ] **Step 4: 重新运行测试确认通过**

Run: `bun run test`
Expected: PASS，抓取规则测试转绿

### Task 3: 导入 5 本短篇组的首批章节，把内容推到可试读

**Files:**
- Create: `src/content/chapters/yueweicaotangbiji/*.md`
- Create: `src/content/chapters/zibuyu/*.md`
- Create: `src/content/chapters/yushimingyan/*.md`
- Create: `src/content/chapters/jingshitongyan/*.md`
- Create: `src/content/chapters/xingshihengyan/*.md`

- [ ] **Step 1: 先写失败内容测试**

在 `tests/library-data.test.ts` 增补：

```ts
it('5 本短篇组至少已有首批可试读章节', () => {
  const chapterTargets = {
    yueweicaotangbiji: 8,
    zibuyu: 8,
    yushimingyan: 10,
    jingshitongyan: 10,
    xingshihengyan: 10,
  };
  // 逐本断言目录存在，且 md 数量 >= 目标值
});
```

- [ ] **Step 2: 跑测试确认红灯**

Run: `bun run test`
Expected: FAIL，提示这些目录不存在或章节数不足

- [ ] **Step 3: 用统一脚本抓取首批章节**

按下面顺序执行，并观察每本是否成功落库：

```bash
python3 scripts/fetch-chapters.py yueweicaotangbiji 1 8
python3 scripts/fetch-chapters.py zibuyu 1 8
python3 scripts/fetch-chapters.py yushimingyan 1 10
python3 scripts/fetch-chapters.py jingshitongyan 1 10
python3 scripts/fetch-chapters.py xingshihengyan 1 10
```

要求：

- 章节 frontmatter 里的 `bookId` 必须使用 canonical slug
- 文件名遵守对应书目的两位编号规则
- 不手写伪正文，优先使用抓取脚本真实生成

- [ ] **Step 4: 重新运行测试确认通过**

Run: `bun run test`
Expected: PASS，5 本短篇组章节覆盖测试转绿

### Task 4: 锁定搜索页与三言专题页的新导览区块

**Files:**
- Modify: `tests/build-verify.ts`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/topic/[slug].astro`

- [ ] **Step 1: 先写失败构建校验**

补以下检查：

```ts
check(searchHtml.includes('热门搜词'), '搜索页缺少 热门搜词');
check(searchHtml.includes('从作者进入'), '搜索页缺少 从作者进入');
check(searchHtml.includes('从专题进入'), '搜索页缺少 从专题进入');
check(existsSync(join(DIST, 'topic', 'three-yans.html')), '缺少专题页: 三言话本');

const threeYansHtml = readFileSync(join(DIST, 'topic', 'three-yans.html'), 'utf-8');
check(threeYansHtml.includes('相关专题'), '三言专题页缺少 相关专题');
check(threeYansHtml.includes('作者入口'), '三言专题页缺少 作者入口');
```

- [ ] **Step 2: 跑构建校验确认红灯**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示搜索页和三言专题页新导览区块缺失

- [ ] **Step 3: 最小实现页面结构**

实现原则：

- 搜索页继续复用 `hall-card-grid`、`hall-card`、`notice`
- 专题页继续复用 `reading-guide-card`
- 模板层优先循环渲染数据，不写死大段文案

- [ ] **Step 4: 重新运行构建校验确认通过**

Run: `bun run build && bun run build:verify`
Expected: PASS

### Task 5: 提炼搜索导览与专题互链数据，并接入深链接搜索

**Files:**
- Modify: `src/data/library/entry-guides.ts`
- Modify: `src/data/library/topics.ts`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/topic/[slug].astro`
- Modify: `src/lib/library.ts`

- [ ] **Step 1: 先依赖 Task 4 的红灯结果，不额外拆测试**

本任务继续复用搜索页 / 专题页构建校验作为红灯。

- [ ] **Step 2: 扩展搜索导览数据**

在 `src/data/library/entry-guides.ts` 新增适合搜索页渲染的结构：

```ts
export interface SearchKeywordGuide {
  label: string;
  query: string;
  hint: string;
}

export interface SearchAuthorGuide {
  authorSlug: string;
  name: string;
  description: string;
  searchQuery: string;
}
```

至少补齐：

- 热门搜词：`志怪`、`话本`、`短篇`、`夜读`、`冯梦龙`
- 作者入口：`冯梦龙`、`纪昀`、`袁枚`
- 专题入口：`strange-tales`、`three-yans`、`worldly-novels`

- [ ] **Step 3: 扩展专题元数据与聚合辅助函数**

在 `src/data/library/topics.ts` 新增：

- `relatedTopicSlugs`
- `featuredAuthorSlugs`

并在 `src/lib/library.ts` 增加辅助读取函数或复用现有作者 / 专题读取函数，保证 `src/pages/topic/[slug].astro` 能直接拿到：

- 相关专题列表
- 作者入口列表

- [ ] **Step 4: 接入搜索页的 `?q=` 直达搜索**

在 `src/pages/search.astro` 内联脚本中：

- 读取 `window.location.search` 中的 `q`
- 初始化 `PagefindUI` 后，如存在 `q`，调用：

```js
const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery) {
  pagefindUi.triggerSearch(initialQuery);
}
```

要求：

- 热门搜词按钮统一链接到 `/search?q=<关键词>`
- 保持无 `q` 时现有搜索页行为不变

- [ ] **Step 5: 接入数据文件并完成页面渲染**

接入文件：

- `src/pages/search.astro`
- `src/pages/topic/[slug].astro`

搜索页至少渲染：

- `热门搜词`
- `从作者进入`
- `从专题进入`

三言专题页至少渲染：

- `相关专题`
- `作者入口`

- [ ] **Step 6: 重新运行构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS

### Task 6: 全量验证与进度留档

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

- 5 本短篇组从 `L1 -> L2`
- 三言专题与专题互链
- 搜索页新增的推荐词、作者入口、专题入口
- 最后一轮验证结果
