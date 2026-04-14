// 三个入口页共用的导览文案与跳转数据。
// 使用示例：
// import { homeEntryGuideSteps } from '../data/library/entry-guides';
// const firstGuide = homeEntryGuideSteps[0];

export interface EntryGuideCard {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  meta?: string;
}

export interface CategorySelectionGuide {
  title: string;
  description: string;
  steps: string[];
}

export interface CategoryRouteGuide extends EntryGuideCard {
  route: string[];
}

// 搜索页的热门搜词入口。
// 使用示例：
// import { searchKeywordGuides } from '../data/library/entry-guides';
// const firstKeyword = searchKeywordGuides[0];
export interface SearchKeywordGuide {
  label: string;
  query: string;
  hint: string;
}

// 搜索页的作者入口配置。
// 使用示例：
// import { searchAuthorGuides } from '../data/library/entry-guides';
// const firstAuthorGuide = searchAuthorGuides[0];
export interface SearchAuthorGuide {
  authorSlug: string;
  description: string;
  searchQuery: string;
}

// 搜索页的专题入口配置。
// 使用示例：
// import { searchTopicGuides } from '../data/library/entry-guides';
// const firstTopicGuide = searchTopicGuides[0];
export interface SearchTopicGuide {
  topicSlug: string;
  description: string;
  searchQuery: string;
}

export const homeEntryGuideSteps: EntryGuideCard[] = [
  {
    title: '第一次来先走镇馆入口',
    description: '先逛四大名著专题，从最熟悉的一本开始；如果你只想先挑一本到位，这是最稳的入口。',
    href: '/topic/four-masterpieces',
    ctaLabel: '先逛四大名著',
    meta: '适合第一次来、还没建立阅读路线的读者。',
  },
  {
    title: '想轻松试读就从短篇进',
    description: '不想一上来就啃长篇，可以先去志怪传奇，从《聊斋志异》或《阅微草堂笔记》随手翻起。',
    href: '/topic/strange-tales',
    ctaLabel: '先试夜读入口',
    meta: '适合想先感受站内气质、又不想马上读长篇的读者。',
  },
  {
    title: '知道兴趣方向就直接选馆',
    description: '如果你已经知道自己偏爱历史、世情、神魔或古文，直接去分馆总览；每一馆都会写明适合谁与怎么进入。',
    href: '/category',
    ctaLabel: '去选一个分馆',
    meta: '适合想按题材建立长期阅读路线的读者。',
  },
];

export const homeInterestEntries: EntryGuideCard[] = [
  {
    title: '想看人物关系与人情世故',
    description: '从家族兴衰、士林风气和市井生活进入古典小说的核心地带。',
    href: '/category/世情小说',
    ctaLabel: '进入世情小说',
    meta: '推荐从《红楼梦》起步。',
  },
  {
    title: '想看战争、权谋与王朝更替',
    description: '适合一口气读下去的大场面阅读线，先熟悉人物，再扩展到更长的历史跨度。',
    href: '/category/历史演义',
    ctaLabel: '进入历史演义',
    meta: '先读《三国演义》最稳。',
  },
  {
    title: '想看神仙妖怪和冒险世界',
    description: '神魔小说是站内最轻松好进的一条线，既熟悉又有连续阅读感。',
    href: '/category/神魔小说',
    ctaLabel: '进入神魔小说',
    meta: '从《西游记》开最好上手。',
  },
  {
    title: '想夜里随手翻几篇短故事',
    description: '从志怪传奇和笔记异闻进入，不必先背人物表，也不怕中途停下。',
    href: '/topic/strange-tales',
    ctaLabel: '进入志怪传奇',
    meta: '适合碎片时间和夜读。',
  },
  {
    title: '暂时不想先读长篇小说',
    description: '可以先从古文入门或名篇路线开始，把阅读节奏慢下来。',
    href: '/topic/classical-prose',
    ctaLabel: '先看古文入门',
    meta: '适合先找熟悉篇目热身。',
  },
];

export const homeLibraryMap: EntryGuideCard[] = [
  {
    title: '镇馆入口',
    description: '第一次来先看这里：四大名著会把站内最核心的四条阅读主线一口气展开。',
    href: '/topic/four-masterpieces',
    ctaLabel: '看镇馆入口',
    meta: '世情 / 历史 / 神魔 / 英雄',
  },
  {
    title: '分馆入口',
    description: '已经知道自己偏爱的题材，就去分馆总览；每一馆都会告诉你适合谁、先读什么、还能顺手去哪里。',
    href: '/category',
    ctaLabel: '看分馆地图',
    meta: '最适合建立长期阅读路线。',
  },
  {
    title: '专题入口',
    description: '如果你更想要“我先看一组风格统一的书”，就从专题进，读法会更像馆内策展路线。',
    href: '/topic/worldly-novels',
    ctaLabel: '看专题入口',
    meta: '四大名著 / 志怪传奇 / 世情小说 / 古文入门',
  },
  {
    title: '作者入口',
    description: '已经认作者，或者想顺着一个人的代表作往里读，可以直接从作者展架进入。',
    href: '/author/caoxueqin',
    ctaLabel: '看作者展架',
    meta: '先从曹雪芹、罗贯中、蒲松龄起步。',
  },
];

export const searchQuickStartGuides: EntryGuideCard[] = [
  {
    title: '先从熟悉的镇馆书试词',
    description: '可以先搜“红楼梦”“三国演义”“西游记”，这些入口目前最完整，也最容易接住第一次搜索。',
    href: '/topic/four-masterpieces',
    ctaLabel: '先看镇馆书单',
    meta: '推荐关键词：红楼梦 / 三国演义 / 西游记',
  },
  {
    title: '不会搜就先逛专题',
    description: '如果你没有明确书名，先逛四大名著或志怪传奇专题，再回来搜人物、章节或桥段，会更容易找到手感。',
    href: '/topic/strange-tales',
    ctaLabel: '先逛志怪专题',
    meta: '适合“先看一组风格统一的书”。',
  },
  {
    title: '按分馆缩小范围',
    description: '先去分馆看看自己更像哪一类读者，再回来搜书名、作者或题材词，会比空搜更快。',
    href: '/category',
    ctaLabel: '先看分馆总览',
    meta: '适合还在找兴趣方向的读者。',
  },
];

export const searchReadingModeGuides: EntryGuideCard[] = [
  {
    title: '先稳稳读一本长篇',
    description: '如果你想找一本够经典、又能看出站内气质的书，先去四大名著专题最省心。',
    href: '/topic/four-masterpieces',
    ctaLabel: '按长篇路线找书',
    meta: '推荐：《西游记》《三国演义》《红楼梦》',
  },
  {
    title: '先从夜读短篇进入',
    description: '想要几分钟就能进入状态，可以从志怪传奇或志怪笔记开始。',
    href: '/topic/strange-tales',
    ctaLabel: '按夜读路线找书',
    meta: '推荐：《聊斋志异》《阅微草堂笔记》',
  },
  {
    title: '想看白话故事的推进感',
    description: '如果你想少一点门槛、多一点故事速度，可以先去话本短篇找入口。',
    href: '/category/话本短篇',
    ctaLabel: '按白话短篇找书',
    meta: '推荐：冯梦龙“三言”',
  },
  {
    title: '先从几篇名文热身',
    description: '暂时不想先读小说，可以先从古文入门开始，再回头搜作者或作品名。',
    href: '/topic/classical-prose',
    ctaLabel: '按名篇路线找书',
    meta: '推荐：先读《古文观止》熟篇。',
  },
];

export const searchKeywordGuides: SearchKeywordGuide[] = [
  {
    label: '志怪',
    query: '志怪',
    hint: '适合先找夜读异闻与狐鬼传奇。',
  },
  {
    label: '话本',
    query: '话本',
    hint: '适合先找白话短篇与市井故事。',
  },
  {
    label: '短篇',
    query: '短篇',
    hint: '适合还不想马上读长篇的读者。',
  },
  {
    label: '夜读',
    query: '夜读',
    hint: '适合想先翻几篇有氛围的小故事。',
  },
  {
    label: '冯梦龙',
    query: '冯梦龙',
    hint: '适合顺着三言与通俗叙事一路逛下去。',
  },
  {
    label: '权谋',
    query: '权谋',
    hint: '适合想直接逛历史演义与王朝对弈。',
  },
  {
    label: '三国',
    query: '三国',
    hint: '适合想顺着曹操、诸葛亮的混战与智谋。',
  },
  {
    label: '神魔',
    query: '神魔',
    hint: '适合先找神怪冒险与仙侠乱局。',
  },
  {
    label: '封神',
    query: '封神',
    hint: '适合想从姜子牙与哪吒、封神体系穿过去。',
  },
  {
    label: '妖怪',
    query: '妖怪',
    hint: '适合想先进入神魔世界的怪物想象。',
  },
  {
    label: '包公',
    query: '包公',
    hint: '适合想直接进入断案节奏与公案人物。',
  },
  {
    label: '展昭',
    query: '展昭',
    hint: '适合想从侠义人物与通俗传奇开始逛。',
  },
  {
    label: '公案',
    query: '公案',
    hint: '适合喜欢案情推进、人物出手利落的读者。',
  },
  {
    label: '梁山',
    query: '梁山',
    hint: '适合想直接进入好汉聚义与江湖热血。',
  },
  {
    label: '好汉',
    query: '好汉',
    hint: '适合想先逛英雄群像和人物绰号最密集的一条线。',
  },
  {
    label: '岳飞',
    query: '岳飞',
    hint: '适合从忠义与家国叙事切入英雄传奇。',
  },
];

export const searchAuthorGuides: SearchAuthorGuide[] = [
  {
    authorSlug: 'fengmenglong',
    description: '想看白话短篇与市井世情，可以先顺着冯梦龙进入，再决定要不要直接搜作品名。',
    searchQuery: '冯梦龙',
  },
  {
    authorSlug: 'jiyun',
    description: '想从笔记体异闻开始，可以先逛纪昀，再回到搜索里找“阅微草堂笔记”或“志怪”。',
    searchQuery: '纪昀',
  },
  {
    authorSlug: 'yuanmei',
    description: '想先试更轻灵的怪谈短篇，就从袁枚进入，再搜“子不语”或“怪谈”。',
    searchQuery: '袁枚',
  },
  {
    authorSlug: 'luoguanzhong',
    description: '想先顺着权谋与帝王群像进历史线，可以直接从罗贯中开始搜索。',
    searchQuery: '罗贯中',
  },
  {
    authorSlug: 'wuchengen',
    description: '想要神魔冒险与人物互动密度高的阅读，就从吴承恩和《西游记》开始。',
    searchQuery: '吴承恩',
  },
  {
    authorSlug: 'xuzhonglin',
    description: '想探索封神世界与神怪谱系，可以先搜许仲琳再一路看《封神演义》。',
    searchQuery: '许仲琳',
  },
  {
    authorSlug: 'shiyukun',
    description: '想从包公、展昭和断案侠义的通俗节奏进入，就先从石玉昆开始。',
    searchQuery: '石玉昆',
  },
  {
    authorSlug: 'shinaianshi',
    description: '想直接读梁山好汉和江湖群像，可以先从施耐庵与《水浒传》进入。',
    searchQuery: '施耐庵',
  },
  {
    authorSlug: 'qiancai',
    description: '想先看岳飞与忠义英雄线，可以先搜钱彩再接《说岳全传》。',
    searchQuery: '钱彩',
  },
];

export const searchTopicGuides: SearchTopicGuide[] = [
  {
    topicSlug: 'strange-tales',
    description: '夜里想先翻几篇奇闻异事，就先从志怪传奇进入，再回搜人物、桥段或题材词。',
    searchQuery: '志怪',
  },
  {
    topicSlug: 'three-yans',
    description: '想找白话短篇的推进感，就从三言话本进入，再回搜“话本”或具体卷名。',
    searchQuery: '话本',
  },
  {
    topicSlug: 'worldly-novels',
    description: '想从人情世故和市井生活进入，可以先看世情小说，再回到搜索里缩小范围。',
    searchQuery: '世情',
  },
  {
    topicSlug: 'historical-epics',
    description: '想先跟着权谋与王朝更替的节奏读，可以从历史风云专题进入。',
    searchQuery: '历史演义',
  },
  {
    topicSlug: 'mythic-realms',
    description: '想先逛神魔冒险与奇想游历，就从神魔奇想专题开始。',
    searchQuery: '神魔小说',
  },
  {
    topicSlug: 'gong-an-heroics',
    description: '想先看包公断案、展昭出手与公案节奏，就从公案侠义专题进入。',
    searchQuery: '公案',
  },
  {
    topicSlug: 'heroic-tales',
    description: '想先逛梁山好汉、岳飞和热血群像，就从英雄传奇专题开始。',
    searchQuery: '英雄传奇',
  },
];

export const categorySelectionGuide: CategorySelectionGuide = {
  title: '怎么选馆',
  description: '先别急着把所有分馆都点开，先按你现在最想要的阅读体验选一条线。',
  steps: [
    '先看每张卡上的“适合谁”，挑和你当前兴趣最像的一馆。',
    '想读长篇群像，优先看世情小说、历史演义、神魔小说、英雄传奇。',
    '想先短篇试读，优先去志怪传奇、志怪笔记、话本短篇；不想先读小说，就先去古文入门。',
    '进入分馆后先看“入馆路线”，再决定要不要顺手串逛邻馆。',
  ],
};

export const categoryRecommendedRoutes: CategoryRouteGuide[] = [
  {
    title: '新读者稳妥路线',
    description: '先用最熟悉的镇馆入口建立信心，再回到分馆里按兴趣深挖。',
    route: ['四大名著', '分馆浏览', '世情 / 历史 / 神魔任选一馆'],
    href: '/topic/four-masterpieces',
    ctaLabel: '按稳妥路线进入',
    meta: '适合第一次逛馆、只想先选一条主线。',
  },
  {
    title: '轻阅读试读路线',
    description: '先从短篇异闻找到手感，再扩到更白话、更通俗的故事阅读。',
    route: ['志怪传奇', '志怪笔记', '话本短篇'],
    href: '/topic/strange-tales',
    ctaLabel: '按轻阅读路线进入',
    meta: '适合夜读、碎片时间或不想先啃长篇。',
  },
  {
    title: '非小说热身路线',
    description: '先用熟悉名篇把节奏放慢，再回到作者和专题入口继续扩展。',
    route: ['古文入门', '作者展架', '专题 / 分馆继续延伸'],
    href: '/topic/classical-prose',
    ctaLabel: '按名篇路线进入',
    meta: '适合想先热身、再进入更大体量馆藏的读者。',
  },
];
