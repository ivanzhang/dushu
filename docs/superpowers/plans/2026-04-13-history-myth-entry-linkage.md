# 历史风云与神魔奇想入口联动 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把历史演义与神魔小说两条现有馆藏主线补成可直接进入的专题 / 作者 / 搜索联动入口。

**Architecture:** 先用构建校验和数据测试锁定“搜索页新增第二波入口、新专题存在、作者互链到位”这些结果，再只通过数据层扩展实现行为变化，尽量复用已经完成的搜索页与专题页模板。页面模板层预期只需要沿用现有循环渲染，真正变化主要集中在 `entry-guides.ts`、`topics.ts`、`authors.ts` 和相关书籍 JSON 的 `featuredTopics`。

**Tech Stack:** Astro 6、TypeScript、Vitest、Astro Content Collections、现有专题页 / 作者页 / 搜索页数据驱动结构

---

### Task 1: 先锁定搜索页与新专题页必须出现的第二波入口

**Files:**
- Modify: `tests/build-verify.ts`

- [ ] **Step 1: 先写失败构建校验**

补以下检查：

```ts
check(searchHtml.includes('历史风云'), '搜索页缺少 历史风云');
check(searchHtml.includes('神魔奇想'), '搜索页缺少 神魔奇想');
check(searchHtml.includes('罗贯中'), '搜索页缺少 罗贯中');
check(searchHtml.includes('吴承恩'), '搜索页缺少 吴承恩');
check(searchHtml.includes('许仲琳'), '搜索页缺少 许仲琳');

check(existsSync(join(DIST, 'topic', 'historical-epics.html')), '缺少专题页: 历史风云');
check(existsSync(join(DIST, 'topic', 'mythic-realms.html')), '缺少专题页: 神魔奇想');
```

如果页面存在，再继续读取：

```ts
const historicalHtml = readFileSync(join(DIST, 'topic', 'historical-epics.html'), 'utf-8');
check(historicalHtml.includes('相关专题'), '历史风云专题页缺少 相关专题');
check(historicalHtml.includes('作者入口'), '历史风云专题页缺少 作者入口');

const mythicHtml = readFileSync(join(DIST, 'topic', 'mythic-realms.html'), 'utf-8');
check(mythicHtml.includes('相关专题'), '神魔奇想专题页缺少 相关专题');
check(mythicHtml.includes('作者入口'), '神魔奇想专题页缺少 作者入口');
```

- [ ] **Step 2: 跑构建校验确认红灯**

Run: `bun run build && bun run build:verify`
Expected: FAIL，提示搜索页缺少新入口、缺少 `historical-epics` / `mythic-realms` 专题页，或专题页缺少作者入口 / 相关专题

### Task 2: 锁定新专题、作者互链与搜索导览数据目标

**Files:**
- Modify: `tests/library-data.test.ts`
- Modify: `src/data/library/entry-guides.ts`
- Modify: `src/data/library/topics.ts`
- Modify: `src/data/library/authors.ts`
- Modify: `src/content/books/sanguoyanyi.json`
- Modify: `src/content/books/dongzhoulieguozhi.json`
- Modify: `src/content/books/suitangyanyi.json`
- Modify: `src/content/books/shuoyuequanzhuan.json`
- Modify: `src/content/books/xiyouji.json`
- Modify: `src/content/books/fengshenyanyi.json`
- Modify: `src/content/books/jinghuayuan.json`

- [ ] **Step 1: 先写失败数据测试**

补以下断言：

```ts
it('历史风云与神魔奇想专题已经建立并接住对应书目', () => {
  const historicalTopic = libraryTopics.find((item) => item.slug === 'historical-epics');
  const mythicTopic = libraryTopics.find((item) => item.slug === 'mythic-realms');

  expect(historicalTopic?.bookSlugs).toEqual([
    'sanguoyanyi',
    'dongzhoulieguozhi',
    'suitangyanyi',
    'shuoyuequanzhuan',
  ]);
  expect(mythicTopic?.bookSlugs).toEqual([
    'xiyouji',
    'fengshenyanyi',
    'jinghuayuan',
  ]);
});

it('历史与神魔相关作者已经补齐专题互链', () => {
  expect(libraryAuthorProfiles.find((item) => item.slug === 'luoguanzhong')?.relatedTopicSlugs)
    .toContain('historical-epics');
  expect(libraryAuthorProfiles.find((item) => item.slug === 'wuchengen')?.relatedTopicSlugs)
    .toContain('mythic-realms');
  expect(libraryAuthorProfiles.find((item) => item.slug === 'xuzhonglin')?.relatedTopicSlugs)
    .toContain('mythic-realms');
});
```

再补一本真实 JSON 级别检查：

```ts
it('历史与神魔书目已经真实挂到新专题上', () => {
  const sanguo = JSON.parse(readFileSync(join(process.cwd(), 'src/content/books/sanguoyanyi.json'), 'utf8'));
  const fengshen = JSON.parse(readFileSync(join(process.cwd(), 'src/content/books/fengshenyanyi.json'), 'utf8'));

  expect(sanguo.featuredTopics).toContain('historical-epics');
  expect(fengshen.featuredTopics).toContain('mythic-realms');
});
```

再补搜索导览入口检查：

```ts
it('搜索导览已经扩入历史与神魔第二波入口', () => {
  expect(searchKeywordGuides.some((item) => item.query === '权谋')).toBe(true);
  expect(searchKeywordGuides.some((item) => item.query === '封神')).toBe(true);
  expect(searchAuthorGuides.some((item) => item.authorSlug === 'luoguanzhong')).toBe(true);
  expect(searchAuthorGuides.some((item) => item.authorSlug === 'wuchengen')).toBe(true);
  expect(searchTopicGuides.some((item) => item.topicSlug === 'historical-epics')).toBe(true);
  expect(searchTopicGuides.some((item) => item.topicSlug === 'mythic-realms')).toBe(true);
});
```

- [ ] **Step 2: 跑数据测试确认红灯**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: FAIL，提示新专题、新互链或新搜索入口数据尚未存在

- [ ] **Step 3: 最小实现数据层变更**

实现要求：

- 在 `src/data/library/topics.ts` 新增：
  - `historical-epics`
    - `name: '历史风云'`
    - `bookSlugs: ['sanguoyanyi', 'dongzhoulieguozhi', 'suitangyanyi', 'shuoyuequanzhuan']`
    - `featuredAuthorSlugs: ['luoguanzhong', 'fengmenglong', 'churenhuo', 'qiancai']`
    - `relatedTopicSlugs: ['four-masterpieces', 'worldly-novels']`
  - `mythic-realms`
    - `name: '神魔奇想'`
    - `bookSlugs: ['xiyouji', 'fengshenyanyi', 'jinghuayuan']`
    - `featuredAuthorSlugs: ['wuchengen', 'xuzhonglin', 'liruzhen']`
    - `relatedTopicSlugs: ['four-masterpieces', 'strange-tales']`
- 在 `src/data/library/authors.ts` 补齐：
  - `luoguanzhong`、`fengmenglong`、`churenhuo`、`qiancai` → `historical-epics`
  - `wuchengen`、`xuzhonglin`、`liruzhen` → `mythic-realms`
- 在 `src/content/books/*.json` 补齐 `featuredTopics`：
  - `sanguoyanyi`、`dongzhoulieguozhi`、`suitangyanyi`、`shuoyuequanzhuan` → `historical-epics`
  - `xiyouji`、`fengshenyanyi`、`jinghuayuan` → `mythic-realms`
- 在 `src/data/library/entry-guides.ts` 追加：
  - 热门搜词：`权谋`、`三国`、`神魔`、`封神`、`妖怪`
  - 作者入口：`luoguanzhong`、`wuchengen`、`xuzhonglin`
  - 专题入口：`historical-epics`、`mythic-realms`

- [ ] **Step 4: 重新运行数据测试确认通过**

Run: `bun x vitest run tests/library-data.test.ts`
Expected: PASS

### Task 3: 让构建校验从红灯转绿，确认模板已被数据自动接通

**Files:**
- Reuse only: `tests/build-verify.ts`
- Verify existing templates: `src/pages/search.astro`
- Verify existing templates: `src/pages/topic/[slug].astro`

- [ ] **Step 1: 重新运行构建校验**

Run: `bun run build && bun run build:verify`
Expected: PASS，说明现有搜索页 / 专题页模板已经被新数据自动接通

- [ ] **Step 2: 如果仍然失败，再做最小模板修正**

只在必要时修改：

- `src/pages/search.astro`
- `src/pages/topic/[slug].astro`

修正原则：

- 不新增新结构
- 继续复用现有 `热门搜词 / 从作者进入 / 从专题进入`
- 继续复用现有 `相关专题 / 作者入口`

- [ ] **Step 3: 再次运行构建校验确认通过**

Run: `bun run build && bun run build:verify`
Expected: PASS

### Task 4: 全量验证并补进度记录

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

- 搜索页新增历史 / 神魔第二波入口
- 新增专题 `历史风云`、`神魔奇想`
- 作者页与新专题之间的互链补齐情况
- 最后一轮测试 / 构建 / 构建校验结果
