# 历史风云与神魔奇想入口联动设计

- 日期：2026-04-13
- 背景：短篇线已经通过“三言话本”和搜索页导览被真正立起来，但站内更厚的两条主线——历史演义与神魔小说——仍然主要依赖分类页和单书页承接。当前 `三国演义`、`东周列国志`、`隋唐演义`、`说岳全传` 这条历史线，以及 `西游记`、`封神演义`、`镜花缘` 这条神魔线，已经有足够的馆藏基础，却还缺一层能把搜索、专题、作者串起来的中间入口。

## 目标

把“历史风云”和“神魔奇想”两条主线也补成真正可逛的入口：

- 让搜索页的推荐词、作者入口、专题入口继续向历史 / 神魔两条线扩展
- 新增两个能承接现有馆藏的新专题入口
- 让相关作者页与专题页形成更自然的双向互链

用户应当能明显感受到：

- 站里不只有短篇线和四大名著，也有更完整的历史 / 神魔阅读走法
- 搜索页可以把“权谋战争”和“神魔奇想”直接当成入口使用
- 作者页、专题页、搜索页之间已经开始形成更连续的馆内导流

## 范围

本轮范围只覆盖“历史演义 + 神魔小说”的入口联动，不做正文扩写：

- 搜索与导览数据：
  - `src/data/library/entry-guides.ts`
- 专题与作者数据：
  - `src/data/library/topics.ts`
  - `src/data/library/authors.ts`
  - 相关书籍 JSON 的 `featuredTopics`
- 页面与聚合层：
  - `src/pages/search.astro`
  - `src/pages/topic/[slug].astro`
  - `src/lib/library.ts`（如需补辅助函数则复用现有模式）
- 测试与校验：
  - `tests/library-data.test.ts`
  - `tests/build-verify.ts`

## 非目标

本轮不做以下事情：

- 不新增章节抓取
- 不把 `隋唐演义`、`说岳全传`、`镜花缘` 直接推进到 `L2`
- 不重做搜索页整体布局
- 不扩展到公案侠义或更多新专题波次
- 不修改 Pagefind 搜索算法

## 设计方案

### 1. 先把两条主线各自收成一个专题入口

这轮不从“再补新书”入手，而是优先把现有馆藏组织得更像馆内策展路线。

#### 1.1 历史线专题

新增专题：

- 名称：`历史风云`
- slug：`historical-epics`

收拢书目：

- `三国演义`
- `东周列国志`
- `隋唐演义`
- `说岳全传`

这个专题的职责是：

- 把“王朝更替 / 权谋战争 / 英雄忠义”这一整条阅读线收拢到一起
- 给已经存在的历史演义分馆补一个更像策展入口的落点
- 让 `罗贯中`、`冯梦龙`、`褚人获`、`钱彩` 这些作者有更明确的共同入口

#### 1.2 神魔线专题

新增专题：

- 名称：`神魔奇想`
- slug：`mythic-realms`

收拢书目：

- `西游记`
- `封神演义`
- `镜花缘`

这个专题的职责是：

- 把“神魔冒险 / 封神体系 / 奇想游历”这一条线做成专题入口
- 让神魔小说不再只靠《西游记》单点承接
- 给 `吴承恩`、`许仲琳`、`李汝珍` 建立更强的共同主题入口

### 2. 搜索页继续扩第二波入口，而不是新增新结构

搜索页现有三组区块已经足够：

- `热门搜词`
- `从作者进入`
- `从专题进入`

本轮不再加第四、第五组，而是继续往现有数据中扩容第二波内容。

#### 2.1 热门搜词第二波

建议新增历史 / 神魔方向的高识别度词：

- 历史线：`权谋`、`三国`
- 神魔线：`神魔`、`封神`、`妖怪`

这些词的目标不是替代书名搜索，而是让用户在“不知道搜哪本书”时，能先从题材感受进入。

#### 2.2 作者入口第二波

建议优先增加三位最适合承接这轮入口的作者：

- `罗贯中`
- `吴承恩`
- `许仲琳`

推荐原因：

- 三人都已经有相对更稳的书目承接
- 读者识别成本低
- 能把四大名著主入口和新专题入口自然连接起来

#### 2.3 专题入口第二波

搜索页新增两张专题入口卡：

- `历史风云`
- `神魔奇想`

这样搜索页会逐步形成更清晰的入口分布：

- 短篇轻阅读：志怪 / 三言
- 长篇主线：历史 / 神魔 / 世情

### 3. 专题和作者之间补齐第二波互链

现有 `src/pages/topic/[slug].astro` 已能渲染：

- `相关专题`
- `作者入口`

现有 `src/pages/author/[slug].astro` 也已能渲染：

- `顺手再逛`

所以这一轮优先补数据，不重写模板。

#### 3.1 新专题的推荐作者

建议配置：

- `historical-epics`
  - `luoguanzhong`
  - `fengmenglong`
  - `churenhuo`
  - `qiancai`
- `mythic-realms`
  - `wuchengen`
  - `xuzhonglin`
  - `liruzhen`

#### 3.2 相关专题互链

建议最少补成下面这层关系：

- `historical-epics` → `four-masterpieces`、`worldly-novels`
- `mythic-realms` → `four-masterpieces`、`strange-tales`

如实现成本很低，也可以顺手把：

- `four-masterpieces` 补挂到 `historical-epics`、`mythic-realms`

这样用户从“四大名著”继续往下逛时，会自然分流到更细的历史 / 神魔策展入口。

#### 3.3 作者页互链

建议把以下作者的 `relatedTopicSlugs` 补齐：

- `luoguanzhong` → `historical-epics`
- `fengmenglong` → `historical-epics`
- `churenhuo` → `historical-epics`
- `qiancai` → `historical-epics`
- `wuchengen` → `mythic-realms`
- `xuzhonglin` → `mythic-realms`
- `liruzhen` → `mythic-realms`

这样作者页里的“顺手再逛”才会真正把人带回这轮新增的主题线。

### 4. 书籍 JSON 要真实挂到新专题上

由于当前专题聚合优先读取书籍 JSON 里的 `featuredTopics`，所以这一轮不能只改 `libraryBookPlan`，还必须同步更新对应书籍 JSON。

建议补挂：

- 历史线：
  - `sanguoyanyi` → `historical-epics`
  - `dongzhoulieguozhi` → `historical-epics`
  - `suitangyanyi` → `historical-epics`
  - `shuoyuequanzhuan` → `historical-epics`
- 神魔线：
  - `xiyouji` → `mythic-realms`
  - `fengshenyanyi` → `mythic-realms`
  - `jinghuayuan` → `mythic-realms`

这样专题页生成后，书单不会是空壳。

### 5. 数据驱动边界

本轮继续坚持数据驱动：

- 搜索页模板尽量不动，只扩 `entry-guides.ts`
- 专题页模板只复用已有 `相关专题 / 作者入口` 区块
- 真正的变化主要放在：
  - 搜索入口数据
  - 专题数据
  - 作者互链数据
  - 书籍 JSON 的 `featuredTopics`

这样后续如果还要扩公案、英雄、古文等线路，可以直接复制这一套方法，而不是再改模板结构。

## 数据流

本轮的数据流建议如下：

1. 书籍 JSON 更新 `featuredTopics`
2. 专题数据定义书单、相关专题、作者入口
3. 作者数据补齐 `relatedTopicSlugs`
4. 搜索导览数据追加第二波热门词、作者入口、专题入口
5. 搜索页和专题页继续复用现有模板结构自动渲染

## 测试策略

采用 TDD，并分两层校验：

### 1. 数据测试

在 `tests/library-data.test.ts` 中锁定：

- `historical-epics` 与 `mythic-realms` 两个专题存在
- 新专题的 `bookSlugs`、`featuredAuthorSlugs`、`relatedTopicSlugs` 已补齐
- 对应书籍 JSON 已真实挂上新专题 slug
- 相关作者 `relatedTopicSlugs` 已补齐
- 搜索导览数据已包含第二波历史 / 神魔入口

### 2. 构建产物校验

在 `tests/build-verify.ts` 中锁定：

- 搜索页出现：
  - `历史风云`
  - `神魔奇想`
  - `罗贯中`
  - `吴承恩`
  - `许仲琳`
- `dist/topic/historical-epics.html` 存在
- `dist/topic/mythic-realms.html` 存在
- 新专题页包含：
  - `相关专题`
  - `作者入口`

### 3. 全量验证

实现后必须运行：

- `bun run test`
- `bun run build`
- `bun run build:verify`

## 验收标准

- 搜索页已扩入历史 / 神魔第二波推荐词、作者入口、专题入口
- 新增专题：`历史风云`、`神魔奇想`
- 新专题页能展示实际书单、相关专题和作者入口
- 对应作者页能回链到新专题
- 全量测试、构建、构建校验通过
