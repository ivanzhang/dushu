// 分类页的策展元数据。
// 使用示例：
// import { libraryCategories } from '../data/library/categories';
// const category = libraryCategories.find((item) => item.slug === 'worldly-novels');

export interface LibraryCrossShelfLink {
  slug: string;
  reason: string;
}

export interface LibraryCategoryMeta {
  slug: string;
  name: string;
  description: string;
  featuredBookSlugs: string[];
  readingGuide: string;
  audience: string;
  entryPath: string[];
  crossShelfLinks: LibraryCrossShelfLink[];
}

export const libraryCategories: LibraryCategoryMeta[] = [
  {
    slug: 'worldly-novels',
    name: '世情小说',
    description: '从家族、士林与市井生活切入，适合建立读书馆的人情风貌主轴。',
    featuredBookSlugs: ['hongloumeng', 'jinpingmei', 'rulinwaishi'],
    readingGuide: '先从《红楼梦》入门，再看《儒林外史》的讽刺笔法，最后补《金瓶梅》的市井层次。',
    audience: '适合想先从人物关系、家族兴衰和人情世故进入古典小说的读者。',
    entryPath: [
      '先读《红楼梦》，建立对古典长篇人物群像的熟悉感。',
      '再读《儒林外史》，体会士林讽刺与读书人世界。',
      '最后补《金瓶梅》，把市井日常与世情纵深接起来。',
    ],
    crossShelfLinks: [
      {
        slug: 'story-collections',
        reason: '如果想把长篇世情阅读切换成短篇市井故事，可以转去话本短篇。',
      },
      {
        slug: 'historical-romance',
        reason: '如果想从家族生活切换到权谋与战争格局，可以顺手逛历史演义。',
      },
    ],
  },
  {
    slug: 'historical-romance',
    name: '历史演义',
    description: '以大战略、人物群像与王朝兴替构成最容易逛起来的馆藏分区。',
    featuredBookSlugs: ['sanguoyanyi', 'dongzhoulieguozhi', 'suitangyanyi'],
    readingGuide: '先读《三国演义》建立熟悉感，再扩到《东周列国志》与《隋唐演义》。',
    audience: '适合偏爱大战争、大人物和朝代更替叙事的读者。',
    entryPath: [
      '先从《三国演义》进入，建立人物与权谋的基础印象。',
      '再读《东周列国志》，把视角扩展到更长时段的列国风云。',
      '最后补《隋唐演义》，体验英雄叙事与王朝兴亡的过渡感。',
    ],
    crossShelfLinks: [
      {
        slug: 'heroic-tales',
        reason: '如果你更喜欢单个英雄与聚义人物，可转去英雄传奇看更直接的人物热度。',
      },
      {
        slug: 'gong-an-heroics',
        reason: '如果想从大战略切到通俗传奇与断案江湖，可顺着公案侠义继续逛。',
      },
    ],
  },
  {
    slug: 'myth-fantasy',
    name: '神魔小说',
    description: '神魔、奇想与冒险性最强，适合做首页的轻入口与连续阅读入口。',
    featuredBookSlugs: ['xiyouji', 'fengshenyanyi', 'jinghuayuan'],
    readingGuide: '先看《西游记》，再补《封神演义》，最后逛《镜花缘》的奇想世界。',
    audience: '适合喜欢神仙妖怪、想象世界和连续冒险节奏的读者。',
    entryPath: [
      '先读《西游记》，用最熟悉的神魔冒险打开馆藏。',
      '再看《封神演义》，把人物、封神体系和大战场面接上。',
      '最后读《镜花缘》，体验更游记化、更奇想化的阅读趣味。',
    ],
    crossShelfLinks: [
      {
        slug: 'strange-tales',
        reason: '如果想从长篇神魔切到更轻巧的夜读异闻，可以转去志怪传奇。',
      },
      {
        slug: 'classical-prose',
        reason: '如果读完神魔后想放慢节奏，可以去古文入门换一种阅读密度。',
      },
    ],
  },
  {
    slug: 'heroic-tales',
    name: '英雄传奇',
    description: '以侠义、聚义和群像为主，承担热血感与镇馆气质。',
    featuredBookSlugs: ['shuihuzhuan'],
    readingGuide: '先从《水浒传》读出人物，再回头浏览其他侠义与公案分支。',
    audience: '适合喜欢人物外号鲜明、江湖义气足、出场就有戏的读者。',
    entryPath: [
      '先读《水浒传》，从人物绰号和梁山群像建立熟悉感。',
      '再回头看同类侠义馆藏，比较聚义叙事与公案叙事的差异。',
    ],
    crossShelfLinks: [
      {
        slug: 'gong-an-heroics',
        reason: '如果你喜欢展昭、包公这类侠义断案人物，可直接接到公案侠义分馆。',
      },
      {
        slug: 'historical-romance',
        reason: '如果更在意大战与王朝风云，可以从英雄人物转到历史演义。',
      },
    ],
  },
  {
    slug: 'strange-tales',
    name: '志怪传奇',
    description: '适合做短篇试读与夜读入口，是首页专题感最强的一组。',
    featuredBookSlugs: ['liaozhaizhiyi', 'yueweicaotangbiji', 'zibuyu'],
    readingGuide: '先试《聊斋志异》的名篇，再转向《阅微草堂笔记》和《子不语》的笔记气息。',
    audience: '适合喜欢短篇、夜读氛围、狐鬼花妖与奇闻异事的读者。',
    entryPath: [
      '先从《聊斋志异》名篇进入，抓住这一馆最强的故事性。',
      '再看《阅微草堂笔记》，感受更偏笔记与谈资的气质。',
      '最后补《子不语》，把清代逸闻与异事趣味串起来。',
    ],
    crossShelfLinks: [
      {
        slug: 'strange-notes',
        reason: '如果你更喜欢一则一则的异闻记录，而不是完整传奇，可以直接去志怪笔记。',
      },
      {
        slug: 'myth-fantasy',
        reason: '如果想把短篇奇闻切回长篇神魔冒险，可以转去神魔小说。',
      },
    ],
  },
  {
    slug: 'classical-prose',
    name: '古文入门',
    description: '让站点不只像小说站，也能给读者一个进入古文世界的低门槛入口。',
    featuredBookSlugs: ['guwenguanzhi'],
    readingGuide: '先读《古文观止》的名篇，再顺着作者页与专题页扩展到相关作品。',
    audience: '适合想从短文、名篇和熟悉篇目开始接触古文的读者。',
    entryPath: [
      '先挑《古文观止》中最熟悉的篇目，建立阅读信心。',
      '再顺着作者页和相关专题，把古文与小说馆藏串联起来。',
    ],
    crossShelfLinks: [
      {
        slug: 'worldly-novels',
        reason: '如果你读古文后想回到更强故事性的作品，可顺着世情小说进入长篇。',
      },
      {
        slug: 'historical-romance',
        reason: '如果你想把史识和叙事连接起来，可以转到历史演义继续读。',
      },
    ],
  },
  {
    slug: 'gong-an-heroics',
    name: '公案侠义',
    description: '把公案断狱与江湖侠义并置，适合补足读书馆的通俗传奇层次。',
    featuredBookSlugs: ['sanxiawuyi'],
    readingGuide: '先从《三侠五义》进入包公与展昭的公案世界，再往英雄传奇分馆延伸。',
    audience: '适合喜欢断案节奏、人物出手利落、故事推进明快的读者。',
    entryPath: [
      '先读《三侠五义》，建立包公断案和展昭侠义双主线的印象。',
      '再对照英雄传奇分馆，比较聚义叙事和断案叙事的不同快感。',
    ],
    crossShelfLinks: [
      {
        slug: 'heroic-tales',
        reason: '如果你更想看热血群像，可顺手去英雄传奇。',
      },
      {
        slug: 'story-collections',
        reason: '如果你想换成更短平快的通俗故事阅读节奏，可以去话本短篇。',
      },
    ],
  },
  {
    slug: 'strange-notes',
    name: '志怪笔记',
    description: '以短则一则、长则数页的笔记体异闻为主，适合碎片化试读和夜读。',
    featuredBookSlugs: ['yueweicaotangbiji', 'zibuyu'],
    readingGuide: '先读《阅微草堂笔记》的清代笔记气，再试《子不语》的逸闻趣味。',
    audience: '适合想碎片化阅读、随手翻几则也能获得趣味的读者。',
    entryPath: [
      '先从《阅微草堂笔记》挑几则代表篇章，熟悉笔记体口吻。',
      '再读《子不语》，比较两位作者记录异闻的不同趣味。',
    ],
    crossShelfLinks: [
      {
        slug: 'strange-tales',
        reason: '如果你想把短则笔记切成更完整的传奇故事，可以回到志怪传奇。',
      },
      {
        slug: 'story-collections',
        reason: '如果你喜欢短篇节奏但想更偏人世叙事，可转到话本短篇。',
      },
    ],
  },
  {
    slug: 'story-collections',
    name: '话本短篇',
    description: '用一篇一则的白话短篇，补齐市井叙事与短篇阅读入口。',
    featuredBookSlugs: ['yushimingyan', 'jingshitongyan', 'xingshihengyan'],
    readingGuide: '建议先从《喻世明言》挑熟悉题材入手，再对照“三言”其余两部体会同题不同写法。',
    audience: '适合想快速进入故事、不想先啃长篇、偏爱白话短篇的读者。',
    entryPath: [
      '先从《喻世明言》挑最熟悉的故事切入。',
      '再横向比较《警世通言》和《醒世恒言》的写法与劝世意味。',
      '最后回看世情小说分馆，感受短篇与长篇的人情表达差异。',
    ],
    crossShelfLinks: [
      {
        slug: 'worldly-novels',
        reason: '如果你想把短篇世相继续拉长到家族与士林场景，可去世情小说。',
      },
      {
        slug: 'gong-an-heroics',
        reason: '如果你更喜欢通俗故事的戏剧推进，也可以接着逛公案侠义。',
      },
    ],
  },
];
