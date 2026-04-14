# 公案与英雄三书试读推进设计

- 日期：2026-04-14
- 背景：昨天已经把 `公案侠义 / 英雄传奇` 两条入口线接进了搜索页、专题页、作者页，但 `三侠五义`、`说岳全传`、`隋唐演义` 三本目前仍停留在 `L1`，且本地章节目录尚未建立。也就是说，入口已经立起来了，正文承接还没有跟上。

## 目标

把昨天新立起来的公案 / 英雄入口，补成“点进去就真有东西可读”的状态：

- 为 `三侠五义`、`说岳全传`、`隋唐演义` 建立真实章节目录
- 三本都先补到前 `12` 回，形成稳定试读入口
- 三本书的真实完成度从 `L1` 提升到 `L2`
- 保持现有模板不动，优先复用抓取链路和书籍页展示逻辑

用户应当能感受到：

- `公案侠义` 和 `英雄传奇` 不再只是专题入口，而是点进去就能接住阅读
- `三侠五义`、`说岳全传`、`隋唐演义` 已经像样地形成首排目录
- 站点的“入口扩张”开始同步转成“正文承接”

## 方案对比

### 方案 A：三本都先补到前 12 回并统一升到 `L2`（推荐）

优点：

- 三本都能立刻承担新专题入口的正文承接
- 书架观感和阅读连续性最均衡
- 与前两天“核心长篇补到 12 章”“短篇组补到 12 篇”的节奏一致

缺点：

- 需要一次补三套抓取规则和三组正文

### 方案 B：先只做 `三侠五义` 一书更深

优点：

- 可以更快立起公案线的单点强入口
- 改动更集中

缺点：

- `英雄传奇` 线会继续空心
- 与昨天刚建立的两个专题入口不匹配

### 方案 C：三本都只补到前 6 回

优点：

- 风险更低，抓取时间更短

缺点：

- 试读感偏弱
- 很容易继续停留在“有目录但还不够像一排书”的状态

## 采用方案

采用 **方案 A**：

- `三侠五义`、`说岳全传`、`隋唐演义` 三本都补到前 `12` 回
- 三本真实完成度统一提升到 `L2`
- 这一轮不继续新增入口，不顺手扩更多书

## 范围

本轮范围：

- `scripts/fetch-chapter-helpers.mjs`
- `scripts/fetch-chapters.mjs`（原则上只复用，不主动重构）
- `tests/chapter-fetch-plan.test.ts`
- `tests/library-data.test.ts`
- `src/content/books/sanxiawuyi.json`
- `src/content/books/shuoyuequanzhuan.json`
- `src/content/books/suitangyanyi.json`
- `src/content/chapters/sanxiawuyi/`
- `src/content/chapters/shuoyuequanzhuan/`
- `src/content/chapters/suitangyanyi/`

## 非目标

本轮不做以下事情：

- 不再扩新的专题或搜索入口
- 不改首页、搜索页、专题页模板结构
- 不继续推进 `水浒传`，因为它已有更高完成度基础
- 不把三本一口气推进到 `L3`
- 不处理版权链路和大规模性能验证

## 设计方案

### 1. 统一沿用“前 12 回”作为稳定试读门槛

本站前几轮已经形成一个稳定节奏：

- 核心长篇先补到前 `12` 章
- 短篇组至少补到 `12` 篇

本轮继续沿用同一门槛，可以保持整站完成度判断标准一致。

具体目标：

- `sanxiawuyi`: `0 -> 12`
- `shuoyuequanzhuan`: `0 -> 12`
- `suitangyanyi`: `0 -> 12`

### 2. 三本都提升到 `L2`

这轮的真实性标准是：

- 目录存在
- 正文存在
- 已具备稳定试读入口

因此三本都应从 `L1` 提升到 `L2`，但不夸大成 `L3`。

### 3. 先补抓取规则，再抓正文

当前 `scripts/fetch-chapter-helpers.mjs` 尚未支持这三本，因此先补规则，再补抓取。

预期新增三套配置：

- `sanxiawuyi`
- `shuoyuequanzhuan`
- `suitangyanyi`

每套至少要明确：

- canonical slug
- storageDir
- 维基文库基准 URL
- 回目编号前缀 / 后缀
- 源编号宽度与本地文件宽度

### 4. 继续保持数据驱动，不动展示模板

本轮不改页面模板。

原因：

- 书籍页、专题页、分类页、作者页已经能自动读取真实章节数量与完成度
- 只要书籍 JSON 的 `completionLevel` 和章节目录到位，页面就会自然跟上

## 测试策略

### 1. 抓取规则测试先红灯

在 `tests/chapter-fetch-plan.test.ts` 先补三本规则测试：

- 文件名格式
- 源链接格式
- 抓取配置能被正确读取

### 2. 馆藏数据测试先红灯

在 `tests/library-data.test.ts` 先补：

- 三本至少已有前 `12` 回
- 三本真实完成度已提升到 `L2`

### 3. 完整验证

最后跑：

- `bun run test`
- `bun run build`
- `bun run build:verify`

## 验收标准

本轮完成后，应满足：

- `sanxiawuyi`、`shuoyuequanzhuan`、`suitangyanyi` 都有前 `12` 回正文
- 三本 JSON 的 `completionLevel` 都为 `L2`
- `bun run test` 通过
- `bun run build` 通过
- `bun run build:verify` 通过
- 进度写入 `docs/progress.md`
