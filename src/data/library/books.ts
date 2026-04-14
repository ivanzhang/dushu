// 首轮小型读书馆的馆藏规划数据。
// 使用示例：
// import { libraryBookPlan } from '../data/library/books';
// const coreBooks = libraryBookPlan.filter((book) => book.tier === 'core');

export type LibraryTier = 'core' | 'featured' | 'shelf';
export type CompletionLevel = 'L1' | 'L2' | 'L3' | 'L4';

export interface LibraryBookPlanItem {
  slug: string;
  title: string;
  tier: LibraryTier;
  completionLevel: CompletionLevel;
  primaryCategory: string;
  topicSlugs: string[];
}

export const libraryBookPlan: LibraryBookPlanItem[] = [
  {
    slug: 'hongloumeng',
    title: '红楼梦',
    tier: 'core',
    completionLevel: 'L3',
    primaryCategory: 'worldly-novels',
    topicSlugs: ['four-masterpieces', 'worldly-novels'],
  },
  {
    slug: 'sanguoyanyi',
    title: '三国演义',
    tier: 'core',
    completionLevel: 'L3',
    primaryCategory: 'historical-romance',
    topicSlugs: ['four-masterpieces'],
  },
  {
    slug: 'xiyouji',
    title: '西游记',
    tier: 'core',
    completionLevel: 'L3',
    primaryCategory: 'myth-fantasy',
    topicSlugs: ['four-masterpieces'],
  },
  {
    slug: 'shuihuzhuan',
    title: '水浒传',
    tier: 'core',
    completionLevel: 'L3',
    primaryCategory: 'heroic-tales',
    topicSlugs: ['four-masterpieces'],
  },
  {
    slug: 'jinpingmei',
    title: '金瓶梅',
    tier: 'core',
    completionLevel: 'L3',
    primaryCategory: 'worldly-novels',
    topicSlugs: ['worldly-novels'],
  },
  {
    slug: 'rulinwaishi',
    title: '儒林外史',
    tier: 'featured',
    completionLevel: 'L2',
    primaryCategory: 'worldly-novels',
    topicSlugs: ['worldly-novels'],
  },
  {
    slug: 'liaozhaizhiyi',
    title: '聊斋志异',
    tier: 'featured',
    completionLevel: 'L2',
    primaryCategory: 'strange-tales',
    topicSlugs: ['strange-tales'],
  },
  {
    slug: 'dongzhoulieguozhi',
    title: '东周列国志',
    tier: 'featured',
    completionLevel: 'L2',
    primaryCategory: 'historical-romance',
    topicSlugs: [],
  },
  {
    slug: 'fengshenyanyi',
    title: '封神演义',
    tier: 'featured',
    completionLevel: 'L2',
    primaryCategory: 'myth-fantasy',
    topicSlugs: [],
  },
  {
    slug: 'guwenguanzhi',
    title: '古文观止',
    tier: 'featured',
    completionLevel: 'L2',
    primaryCategory: 'classical-prose',
    topicSlugs: ['classical-prose'],
  },
  {
    slug: 'suitangyanyi',
    title: '隋唐演义',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'historical-romance',
    topicSlugs: [],
  },
  {
    slug: 'shuoyuequanzhuan',
    title: '说岳全传',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'historical-romance',
    topicSlugs: [],
  },
  {
    slug: 'jinghuayuan',
    title: '镜花缘',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'myth-fantasy',
    topicSlugs: [],
  },
  {
    slug: 'xingshiyinyuanzhuan',
    title: '醒世姻缘传',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'worldly-novels',
    topicSlugs: [],
  },
  {
    slug: 'sanxiawuyi',
    title: '三侠五义',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'gong-an-heroics',
    topicSlugs: [],
  },
  {
    slug: 'yueweicaotangbiji',
    title: '阅微草堂笔记',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'strange-notes',
    topicSlugs: ['strange-tales'],
  },
  {
    slug: 'zibuyu',
    title: '子不语',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'strange-notes',
    topicSlugs: ['strange-tales'],
  },
  {
    slug: 'yushimingyan',
    title: '喻世明言',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'story-collections',
    topicSlugs: [],
  },
  {
    slug: 'jingshitongyan',
    title: '警世通言',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'story-collections',
    topicSlugs: [],
  },
  {
    slug: 'xingshihengyan',
    title: '醒世恒言',
    tier: 'shelf',
    completionLevel: 'L1',
    primaryCategory: 'story-collections',
    topicSlugs: [],
  },
];
