# 说岳全传 L3 深读入口推进设计

- 日期：2026-04-14
- 背景：当前公案 / 英雄线已经完成两层基础承接：`三侠五义` 已补到前 `20` 回并升到 `L3`，成为 `公案侠义` 线的强入口；`说岳全传` 与 `隋唐演义` 则都停留在前 `12` 回、`L2`，仍属于稳定试读层。下一步最自然的动作，是先把英雄传奇线也做出一个对称的 `L3` 入口。

## 目标

先把 `说岳全传` 做成英雄传奇线的下一本强深读入口：

- 把 `shuoyuequanzhuan` 从前 `12` 回推进到前 `20` 回
- 把 `src/content/books/shuoyuequanzhuan.json` 的 `completionLevel` 从 `L2` 提升到 `L3`
- 保持 `隋唐演义` 现状不动，继续停在前 `12` 回、`L2`
- 不改模板，只通过真实章节与元数据变化让页面自然升级

用户应当能感受到：

- 英雄传奇线不再只有均衡铺面，也开始有第二个能连续往下读的主打入口
- `说岳全传` 从“可试读”进入“更适合深读”的层级
- 公案线和英雄线都逐步长出自己的主打书，而不是一直停留在平均铺开

## 方案对比

### 方案 A：先把 `说岳全传` 推到前 `20` 回并升到 `L3`（采用）

优点：

- 岳飞、抗金、忠义等主题识别度高，适合作为英雄线主打书
- 与 `三侠五义` 的升级口径一致，整站完成度标准统一
- 改动范围适中，可以快速形成第二个清晰的 `L3` 锚点

缺点：

- `隋唐演义` 仍会继续停留在 `L2`

### 方案 B：把 `说岳全传` 直接补到前 `24` 回再升到 `L3`

优点：

- 深度更强，区分度更大

缺点：

- 本轮改动范围偏大
- 与刚完成的 `三侠五义` 不对称，容易让层级标准变乱

### 方案 C：只补到前 `16` 回，但先不升 `L3`

优点：

- 风险更小，速度更快

缺点：

- 与当前目标“给英雄线立一个真正更强入口”不匹配
- 很容易继续停在“厚了一点，但还不够像主打书”的状态

## 采用方案

采用 **方案 A**：

- 本轮只推进 `说岳全传`
- 目标从前 `12` 回补到前 `20` 回
- `completionLevel: L2 -> L3`
- `隋唐演义` 暂不变化

## 范围

本轮范围：

- `tests/library-data.test.ts`
- `scripts/fetch-chapters.mjs`（只复用，不主动重构）
- `src/content/books/shuoyuequanzhuan.json`
- `src/content/chapters/shuoyuequanzhuan/`
- `docs/progress.md`

## 非目标

本轮不做以下事情：

- 不继续推进 `隋唐演义`
- 不新增专题、搜索入口或分类导览文案
- 不修改首页、搜索页、专题页、书籍页模板
- 不重构抓取脚本
- 不处理 EPUB 下载、阅读器状态持久化等产品功能

## 设计方案

### 1. 用“前 20 回”作为 `说岳全传` 冲 `L3` 的最小门槛

当前站内已经形成比较稳定的完成度节奏：

- 前 `12` 回 / 篇：稳定试读入口，对应 `L2`
- 在此基础上再明显补厚一层：适合作为 `L3` 候选

因此本轮继续沿用与 `三侠五义` 相同的门槛，不另起一套标准：

- `shuoyuequanzhuan`: `12 -> 20`

### 2. 只把 `说岳全传` 升到 `L3`

本轮目标是先把英雄线立起一个对称的强入口，因此：

- `sanxiawuyi`: 继续保持 `L3`
- `shuoyuequanzhuan`: `L2 -> L3`
- `suitangyanyi`: 保持 `L2`

这样公案 / 英雄线会形成更清晰的结构：

- `三侠五义`：公案侠义主打入口
- `说岳全传`：英雄传奇主打入口
- `隋唐演义`：继续作为历史 / 英雄双线的 `L2` 承接书

### 3. 继续走既有抓取链路，只补 `13-20` 回

`说岳全传` 的抓取规则已存在，本轮无需再补规则，只需复用抓取脚本补新增回目。

预期命令：

- `bun scripts/fetch-chapters.mjs -- shuoyuequanzhuan 13 20`

生成结果应为：

- `src/content/chapters/shuoyuequanzhuan/013.md` 到 `020.md`

### 4. 页面模板保持不动，依赖真实内容自然接通

本轮不改模板，原因是：

- 页面层已经能根据真实章节数量和书籍完成度自动显示状态
- 当前缺的不是展示结构，而是更厚的真实正文承接
- 只要章节和 `completionLevel` 到位，英雄线入口自然会更像样

## 测试策略

### 1. 先补数据测试红灯

在 `tests/library-data.test.ts` 先补或调整以下断言：

- `sanxiawuyi >= 20`
- `shuoyuequanzhuan >= 20`
- `suitangyanyi >= 12`
- `sanxiawuyi.completionLevel === 'L3'`
- `shuoyuequanzhuan.completionLevel === 'L3'`
- `suitangyanyi.completionLevel === 'L2'`

### 2. 再抓正文和更新元数据转绿

补齐 `13-20` 回并把 `shuoyuequanzhuan` 的完成度升到 `L3`。

### 3. 最后跑完整验证

最后统一运行：

- `bun run test`
- `bun run build`
- `bun run build:verify`

## 验收标准

本轮完成后，应满足：

- `src/content/chapters/shuoyuequanzhuan/` 至少有前 `20` 回
- `src/content/books/shuoyuequanzhuan.json` 的 `completionLevel` 为 `L3`
- `src/content/books/suitangyanyi.json` 仍为 `L2`
- `bun run test` 通过
- `bun run build` 通过
- `bun run build:verify` 通过
- 本轮结果写入 `docs/progress.md`
