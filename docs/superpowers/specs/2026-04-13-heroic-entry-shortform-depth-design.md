# 公案英雄入口联动与短篇正文加深设计

- 日期：2026-04-13
- 背景：站内已经补齐了短篇线、历史线、神魔线的入口导览，但还剩两块明显缺口：一是 `公案侠义 / 英雄传奇` 这条通俗热血线还没有像历史风云、神魔奇想那样的专题承接；二是短篇组虽然已从 `L1` 推到 `L2`，但正文深度仍偏浅，还不够像“可以连续翻下去的一排书架”。

## 目标

本轮一次性完成两条工作：

- 把 `公案侠义 / 英雄传奇` 补成站内可直接进入的专题、作者、搜索联动入口
- 把 5 本短篇组的正文深度再补一轮，让短篇线从“能试读”更接近“能连续翻读”
- 最终让站点同时补上“入口广度”和“正文厚度”这两块短板

用户应当能明显感受到：

- 搜索页里已经不只剩历史、神魔、短篇，也能直接走包公、展昭、梁山、岳飞这类入口
- 公案侠义与英雄传奇不再只是分类名，而是能承接流量的专题入口
- 短篇馆藏不再只是首批几篇试读，而开始出现更稳定的连续阅读感

## 方案对比

### 方案 A：只补入口，不补正文

优点：

- 改动小，风险低
- 可以快速继续扩大站内入口地图

缺点：

- 短篇深度问题会继续拖着
- 这轮做完后，站点仍然会停留在“入口像馆，但书架不够厚”

### 方案 B：入口联动 + 短篇正文一起推进（推荐）

优点：

- 同时补齐广度与厚度，体感最完整
- 入口新扩出来后，短篇线也能马上接得住进入的读者
- 更符合本项目当前“像一个免费的小型读书馆”的方向

缺点：

- 涉及数据、测试、抓取脚本与正文文件，工作量更大

### 方案 C：只继续补短篇正文，不扩入口

优点：

- 能最快提升实际阅读体验

缺点：

- 整站导览会继续失衡
- 公案侠义 / 英雄传奇这条线还会继续像“分馆有了，专题入口没立起来”

## 采用方案

采用 **方案 B**：

- 入口层继续沿用现有数据驱动结构，只新增公案侠义 / 英雄传奇两组专题与搜索联动
- 正文层只补短篇组，不顺手扩到更多长篇，保证今晚能收束并完成验证

## 范围

### 入口联动范围

- `src/data/library/topics.ts`
- `src/data/library/authors.ts`
- `src/data/library/entry-guides.ts`
- 相关书籍 JSON 的 `featuredTopics`
- `tests/library-data.test.ts`
- `tests/build-verify.ts`

### 正文加深范围

- `scripts/fetch-chapter-helpers.mjs`
- `scripts/fetch-chapters.mjs`（如需仅复用，不主动重构）
- `src/content/chapters/yueweicaotangbiji/`
- `src/content/chapters/zibuyu/`
- `src/content/chapters/yushimingyan/`
- `src/content/chapters/jingshitongyan/`
- `src/content/chapters/xingshihengyan/`
- 对应 5 本书籍 JSON 的 `completionLevel`
- `tests/chapter-fetch-plan.test.ts`
- `tests/library-data.test.ts`

## 非目标

本轮不做以下事情：

- 不重做首页、搜索页或专题页模板结构
- 不把 `三侠五义`、`说岳全传`、`隋唐演义` 继续推进到正文扩写
- 不额外新扩更多书目
- 不修改 Pagefind 搜索逻辑
- 不处理版权链路和大规模页面性能验证

## 设计方案

### 1. 公案侠义 / 英雄传奇继续用“专题入口”承接

延续历史风云、神魔奇想这一轮的方法，本轮不新增模板能力，而是继续新增两个专题：

- `gong-an-heroics` / `公案侠义`
- `heroic-tales` / `英雄传奇`

这样做的原因是：

- 当前 `topic/[slug].astro` 已能承接 `相关专题`、`作者入口`
- 当前搜索页也已经有 `从专题进入`、`从作者进入`、`热门搜词`
- 继续走数据层扩展，最稳、最不容易把模板打散

#### 1.1 公案侠义专题

建议收拢：

- `sanxiawuyi`

并让它重点服务以下入口词：

- `包公`
- `展昭`
- `公案`
- `断案`

专题推荐作者：

- `shiyukun`

相关专题建议：

- `heroic-tales`
- `three-yans`

#### 1.2 英雄传奇专题

建议收拢：

- `shuihuzhuan`
- `shuoyuequanzhuan`
- `suitangyanyi`

这条线负责承接：

- `梁山`
- `好汉`
- `岳飞`
- `英雄`

专题推荐作者：

- `shinaianshi`
- `qiancai`
- `churenhuo`

相关专题建议：

- `four-masterpieces`
- `historical-epics`
- `gong-an-heroics`

### 2. 搜索页继续扩第三波入口，但不新增结构

继续沿用现有三组：

- `热门搜词`
- `从作者进入`
- `从专题进入`

建议新增：

#### 2.1 热门搜词

- `包公`
- `展昭`
- `公案`
- `梁山`
- `好汉`
- `岳飞`

#### 2.2 作者入口

- `石玉昆`
- `施耐庵`
- `钱彩`

#### 2.3 专题入口

- `公案侠义`
- `英雄传奇`

### 3. 相关作者与书籍数据补双向互链

#### 3.1 作者页互链

补齐：

- `shiyukun` -> `gong-an-heroics`
- `shinaianshi` -> `heroic-tales`
- `qiancai` -> `heroic-tales`
- `churenhuo` -> `heroic-tales`

必要时顺手补齐专题之间的回链对称性，避免再次出现单向能到、反向回不去的情况。

#### 3.2 书籍 JSON 挂专题

补齐：

- `sanxiawuyi` -> `gong-an-heroics`
- `shuihuzhuan` -> `heroic-tales`
- `shuoyuequanzhuan` -> `heroic-tales`
- `suitangyanyi` -> `heroic-tales`

其中：

- `shuoyuequanzhuan`、`suitangyanyi` 允许同时保留在 `historical-epics`
- `shuihuzhuan` 允许同时保留在 `four-masterpieces`

### 4. 短篇正文统一再补到更稳的试读深度

本轮不把短篇线一次性全推到终点，而是做一轮“稳妥但有体感”的加深：

- `阅微草堂笔记`：`8 -> 12`
- `子不语`：`8 -> 12`
- `喻世明言`：`10 -> 12`
- `警世通言`：`10 -> 12`
- `醒世恒言`：`10 -> 12`

这样好处是：

- 五本短篇组全部至少都具备更像样的一排目录
- 不会只做两本，导致短篇组内部体验参差太大
- 额外工作量仍在今晚可控范围内

### 5. 短篇完成度只提升两本锚点到 `L3`

为了保持完成度标注的诚实度，本轮不把五本短篇全部直接写成 `L3`。

建议提升为 `L3` 的两本锚点：

- `yueweicaotangbiji`
- `yushimingyan`

理由：

- `阅微草堂笔记` 可代表“志怪笔记”这条短篇入口，补到 12 卷后已接近半数
- `喻世明言` 可代表“三言话本”这条白话短篇入口，是最适合承担短篇馆面主入口的一本

其余三本继续保持 `L2`，但正文深度一起补到 12，形成“同组都更稳、两本先立锚点”的效果。

## 测试策略

### 数据与入口

先补红灯测试，锁定：

- 新专题 `gong-an-heroics`、`heroic-tales` 存在
- 搜索页导览已扩入公案 / 英雄第三波入口
- 作者页与专题页互链到位
- 相关书目 JSON 已真实挂到新专题

### 正文深度

先补红灯测试，锁定：

- 五本短篇目录均达到至少 `12` 篇
- `yueweicaotangbiji` 与 `yushimingyan` 的真实完成度提升到 `L3`
- 其余三本仍为 `L2`，避免夸大完成度

### 构建校验

继续用 `build:verify` 锁定：

- 搜索页必须出现 `公案侠义`、`英雄传奇`、`石玉昆`、`施耐庵`、`钱彩`
- `dist/topic/gong-an-heroics.html`
- `dist/topic/heroic-tales.html`
- 新专题页必须出现 `相关专题`、`作者入口`

## 验收标准

本轮完成后，应满足：

- `bun run test` 通过
- `bun run build` 通过
- `bun run build:verify` 通过
- 搜索页已接住公案侠义 / 英雄传奇入口
- 专题页新增公案侠义 / 英雄传奇两条策展入口
- 5 本短篇组目录都扩到至少 `12` 篇
- `阅微草堂笔记`、`喻世明言` 真实完成度提升到 `L3`
- 最终进度写入 `docs/progress.md`
