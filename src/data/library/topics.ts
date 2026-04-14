// 专题页的策展数据。
// 使用示例：
// import { libraryTopics } from '../data/library/topics';
// const topic = libraryTopics.find((item) => item.slug === 'four-masterpieces');

export interface LibraryTopicMeta {
  slug: string;
  name: string;
  description: string;
  bookSlugs: string[];
  curatorNote: string;
  readingPathBookSlugs: string[];
  relatedCategorySlugs: string[];
  relatedTopicSlugs?: string[];
  featuredAuthorSlugs?: string[];
}

export const libraryTopics: LibraryTopicMeta[] = [
  {
    slug: 'four-masterpieces',
    name: '四大名著',
    description: '镇馆主入口，优先承接首页与新读者首访流量。',
    bookSlugs: ['hongloumeng', 'sanguoyanyi', 'xiyouji', 'shuihuzhuan'],
    curatorNote: '这是全站最核心的入口专题，负责把第一次进站的读者稳稳接住，再分流到世情、历史、神魔和英雄四条主阅读入口。',
    readingPathBookSlugs: ['xiyouji', 'sanguoyanyi', 'hongloumeng', 'shuihuzhuan'],
    relatedCategorySlugs: ['myth-fantasy', 'historical-romance', 'worldly-novels', 'heroic-tales'],
    relatedTopicSlugs: ['historical-epics', 'mythic-realms', 'heroic-tales'],
  },
  {
    slug: 'strange-tales',
    name: '志怪传奇',
    description: '突出夜读、短篇、奇闻异事的策展感。',
    bookSlugs: ['liaozhaizhiyi', 'yueweicaotangbiji', 'zibuyu'],
    curatorNote: '这个专题把最适合夜里随手翻读的异闻作品放在一起，让读者可以从故事性最强的传奇一路走到更轻巧的笔记异闻。',
    readingPathBookSlugs: ['liaozhaizhiyi', 'yueweicaotangbiji', 'zibuyu'],
    relatedCategorySlugs: ['strange-tales', 'strange-notes', 'myth-fantasy'],
    relatedTopicSlugs: ['three-yans', 'mythic-realms'],
    featuredAuthorSlugs: ['pusongling', 'jiyun', 'yuanmei'],
  },
  {
    slug: 'worldly-novels',
    name: '世情小说',
    description: '从家族、士林与市井观察中国古典小说的世情线。',
    bookSlugs: ['hongloumeng', 'jinpingmei', 'rulinwaishi'],
    curatorNote: '这是站内最能体现“读书馆气质”的专题入口，既能看家族盛衰，也能看士林讽刺和市井日常，是理解世情文学的重要入口。',
    readingPathBookSlugs: ['hongloumeng', 'rulinwaishi', 'jinpingmei'],
    relatedCategorySlugs: ['worldly-novels', 'story-collections', 'classical-prose'],
    relatedTopicSlugs: ['three-yans', 'classical-prose', 'historical-epics'],
    featuredAuthorSlugs: ['caoxueqin', 'wujingzi', 'lanlingxiaoxiaosheng'],
  },
  {
    slug: 'classical-prose',
    name: '古文入门',
    description: '给第一次进入本站的读者留一个非小说入口。',
    bookSlugs: ['guwenguanzhi'],
    curatorNote: '这个专题是给“暂时不想读长篇小说”的入口，帮助读者先从名篇和短文熟悉古典文本，再回到更大体量的馆藏。',
    readingPathBookSlugs: ['guwenguanzhi'],
    relatedCategorySlugs: ['classical-prose', 'historical-romance', 'worldly-novels'],
    relatedTopicSlugs: ['worldly-novels'],
    featuredAuthorSlugs: ['wuchucai-wudiaohou'],
  },
  {
    slug: 'three-yans',
    name: '三言话本',
    description: '把冯梦龙的三部白话短篇总集收成一个最适合碎片阅读的专题入口。',
    bookSlugs: ['yushimingyan', 'jingshitongyan', 'xingshihengyan'],
    curatorNote: '这个专题负责把站内的白话短篇阅读线真正立起来，让读者既可以从市井故事入门，也可以顺着冯梦龙这一位作者一路看下去。',
    readingPathBookSlugs: ['yushimingyan', 'jingshitongyan', 'xingshihengyan'],
    relatedCategorySlugs: ['story-collections', 'worldly-novels', 'gong-an-heroics'],
    relatedTopicSlugs: ['strange-tales', 'worldly-novels', 'gong-an-heroics'],
    featuredAuthorSlugs: ['fengmenglong'],
  },
  {
    slug: 'historical-epics',
    name: '历史风云',
    description: '把王朝更替、权谋对弈与忠义群像集合在一个稳稳的历史阅读入口。',
    bookSlugs: ['sanguoyanyi', 'dongzhoulieguozhi', 'suitangyanyi', 'shuoyuequanzhuan'],
    curatorNote: '这个专题让历史演义分馆的四条重磅作品有一个清晰一致的落点，读者可以一气呵成地感受权谋、帝王与忠义。',
    readingPathBookSlugs: ['sanguoyanyi', 'dongzhoulieguozhi', 'suitangyanyi', 'shuoyuequanzhuan'],
    relatedCategorySlugs: ['historical-romance', 'heroic-tales'],
    relatedTopicSlugs: ['four-masterpieces', 'worldly-novels', 'heroic-tales'],
    featuredAuthorSlugs: ['luoguanzhong', 'fengmenglong', 'churenhuo', 'qiancai'],
  },
  {
    slug: 'mythic-realms',
    name: '神魔奇想',
    description: '把神魔冒险、封神大战与奇想游历策略性地拼成一个完整的阅读入口。',
    bookSlugs: ['xiyouji', 'fengshenyanyi', 'jinghuayuan'],
    curatorNote: '这个专题让神魔分馆有更丰富的故事地图，既能从《西游记》开始，也能顺着《封神》与《镜花缘》探索不同气质的神魔世界。',
    readingPathBookSlugs: ['xiyouji', 'fengshenyanyi', 'jinghuayuan'],
    relatedCategorySlugs: ['myth-fantasy', 'strange-tales'],
    relatedTopicSlugs: ['four-masterpieces', 'strange-tales'],
    featuredAuthorSlugs: ['wuchengen', 'xuzhonglin', 'liruzhen'],
  },
  {
    slug: 'gong-an-heroics',
    name: '公案侠义',
    description: '把包公断案、展昭侠义与通俗传奇节奏集中到一个最容易点开的入口里。',
    bookSlugs: ['sanxiawuyi'],
    curatorNote: '这个专题负责把站内最鲜明的断案与侠义气质立起来，让读者从包公、展昭这样的高识别度人物快速入馆。',
    readingPathBookSlugs: ['sanxiawuyi'],
    relatedCategorySlugs: ['gong-an-heroics', 'heroic-tales', 'story-collections'],
    relatedTopicSlugs: ['heroic-tales', 'three-yans'],
    featuredAuthorSlugs: ['shiyukun'],
  },
  {
    slug: 'heroic-tales',
    name: '英雄传奇',
    description: '把梁山好汉、岳家军与隋唐英雄这条热血线整理成更直观的策展入口。',
    bookSlugs: ['shuihuzhuan', 'shuoyuequanzhuan', 'suitangyanyi'],
    curatorNote: '这个专题把站内最容易形成人物热度与江湖血性的作品收在一起，适合想直接看好汉、忠义和战场传奇的读者。',
    readingPathBookSlugs: ['shuihuzhuan', 'shuoyuequanzhuan', 'suitangyanyi'],
    relatedCategorySlugs: ['heroic-tales', 'historical-romance', 'gong-an-heroics'],
    relatedTopicSlugs: ['four-masterpieces', 'historical-epics', 'gong-an-heroics'],
    featuredAuthorSlugs: ['shinaianshi', 'qiancai', 'churenhuo'],
  },
];
