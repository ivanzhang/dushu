import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  searchAuthorGuides,
  searchKeywordGuides,
  searchTopicGuides,
} from '../src/data/library/entry-guides';
import {
  buildBookDisplayMaps,
  chapterBookAliases,
  libraryAuthorProfiles,
  libraryBookPlan,
  libraryCategories,
  libraryTopics,
  normalizeChapterBookSlug,
  pickBooksByTopic,
} from '../src/lib/library';

describe('small library metadata foundation', () => {
  it('首轮正式书单固定为 20 本', () => {
    expect(libraryBookPlan).toHaveLength(20);
  });

  it('当前书目 JSON 已补齐到 20 本', () => {
    const bookFiles = readdirSync(join(process.cwd(), 'src/content/books'))
      .filter((file) => file.endsWith('.json'));

    expect(bookFiles).toHaveLength(20);
  });

  it('重点 5 本至少已有首批可试读章节', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const featuredBooks = [
      'rulinwaishi',
      'liaozhaizhiyi',
      'dongzhoulieguozhi',
      'fengshenyanyi',
      'guwenguanzhi',
    ];

    for (const slug of featuredBooks) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 还没有首批章节`,
      ).toBeGreaterThan(0);
    }
  });

  it('公案与英雄三书已形成双 L3 入口，三侠五义与说岳全传都补到前 20 回', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const chapterTargets = {
      sanxiawuyi: 20,
      shuoyuequanzhuan: 20,
      suitangyanyi: 12,
    };

    for (const [slug, targetCount] of Object.entries(chapterTargets)) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 章节数还不足 ${targetCount}`,
      ).toBeGreaterThanOrEqual(targetCount);
    }
  });

  it('5 本短篇组已经补到更稳的试读深度，三本支撑书拉齐到 16 篇', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const chapterTargets = {
      yueweicaotangbiji: 12,
      zibuyu: 16,
      yushimingyan: 12,
      jingshitongyan: 16,
      xingshihengyan: 16,
    };

    for (const [slug, targetCount] of Object.entries(chapterTargets)) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 章节数还不足 ${targetCount}`,
      ).toBeGreaterThanOrEqual(targetCount);
    }
  });

  it('重点 5 本的真实完成度已经提升到 L2', () => {
    const featuredBooks = [
      'rulinwaishi',
      'liaozhaizhiyi',
      'dongzhoulieguozhi',
      'fengshenyanyi',
      'guwenguanzhi',
    ];

    for (const slug of featuredBooks) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 尚未提升`).toBe('L2');
    }
  });

  it('公案与英雄三书已形成双 L3 / 单 L2 分层', () => {
    const l3Anchors = ['sanxiawuyi', 'shuoyuequanzhuan'];
    const l2SupportBooks = ['suitangyanyi'];

    for (const slug of l3Anchors) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 尚未提升到 L3`).toBe('L3');
    }

    for (const slug of l2SupportBooks) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 不应偏离 L2`).toBe('L2');
    }
  });

  it('说岳全传新增深读章节应使用真实回目标题，而不是诗曰等引子', () => {
    const chapterContent = readFileSync(
      join(process.cwd(), 'src/content/chapters/shuoyuequanzhuan/013.md'),
      'utf8',
    );

    expect(chapterContent).toContain('title: "第十三回 昭豐鎮王貴染病　牟駝岡宗澤踹營"');
    expect(chapterContent).not.toContain('title: "詩曰："');
  });

  it('5 本短篇组已形成 L2 / L3 的分层完成度', () => {
    const l3Anchors = ['yueweicaotangbiji', 'yushimingyan'];
    const l2SupportBooks = ['zibuyu', 'jingshitongyan', 'xingshihengyan'];

    for (const slug of l3Anchors) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 尚未提升到 L3`).toBe('L3');
    }

    for (const slug of l2SupportBooks) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 不应偏离 L2`).toBe('L2');
    }
  });

  it('核心 3 本已经补齐到前 12 章，可作为深读入口', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const coreBooks = ['hongloumeng', 'sanguoyanyi', 'xiyouji'];

    for (const slug of coreBooks) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 章节数还不足 12`,
      ).toBeGreaterThanOrEqual(12);
    }
  });

  it('核心 3 本已经继续补到前 50 章，能形成更稳的连读入口', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const coreBooks = ['hongloumeng', 'sanguoyanyi', 'xiyouji'];

    for (const slug of coreBooks) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 章节数还不足 50`,
      ).toBeGreaterThanOrEqual(50);
    }
  });

  it('核心 3 本已经继续补到前 60 章，长篇主入口更接近稳定小馆藏', () => {
    const chapterRoot = join(process.cwd(), 'src/content/chapters');
    const coreBooks = ['hongloumeng', 'sanguoyanyi', 'xiyouji'];

    for (const slug of coreBooks) {
      const chapterDir = join(chapterRoot, slug);
      expect(existsSync(chapterDir), `${slug} 章节目录不存在`).toBe(true);
      expect(
        readdirSync(chapterDir).filter((file) => file.endsWith('.md')).length,
        `${slug} 章节数还不足 60`,
      ).toBeGreaterThanOrEqual(60);
    }
  });

  it('核心 3 本的真实完成度已经提升到 L3', () => {
    const coreBooks = ['hongloumeng', 'sanguoyanyi', 'xiyouji'];

    for (const slug of coreBooks) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.completionLevel, `${slug} 的 completionLevel 尚未提升`).toBe('L3');
    }
  });

  it('核心、重点、铺面配比正确', () => {
    expect(libraryBookPlan.filter((item) => item.tier === 'core')).toHaveLength(5);
    expect(libraryBookPlan.filter((item) => item.tier === 'featured')).toHaveLength(5);
    expect(libraryBookPlan.filter((item) => item.tier === 'shelf')).toHaveLength(10);
  });

  it('四大名著专题至少包含四本核心名著', () => {
    const topic = libraryTopics.find((item) => item.slug === 'four-masterpieces');
    expect(topic?.bookSlugs).toEqual([
      'hongloumeng',
      'sanguoyanyi',
      'xiyouji',
      'shuihuzhuan',
    ]);
  });

  it('世情小说分馆包含阅读建议与代表作配置', () => {
    const category = libraryCategories.find((item) => item.slug === 'worldly-novels');
    expect(category?.featuredBookSlugs.length).toBeGreaterThan(0);
    expect(category?.readingGuide).toContain('先');
  });

  it('新增题材分馆已经补齐策展元数据', () => {
    expect(libraryCategories.find((item) => item.slug === 'gong-an-heroics')?.name).toBe('公案侠义');
    expect(libraryCategories.find((item) => item.slug === 'strange-notes')?.name).toBe('志怪笔记');
    expect(libraryCategories.find((item) => item.slug === 'story-collections')?.name).toBe('话本短篇');
  });

  it('分类策展元数据已经包含适读人群、入馆路线和邻馆串逛', () => {
    const category = libraryCategories.find((item) => item.slug === 'historical-romance');
    expect(category?.audience).toContain('读者');
    expect(category?.entryPath.length).toBeGreaterThanOrEqual(2);
    expect(category?.crossShelfLinks.length).toBeGreaterThan(0);
    expect(category?.crossShelfLinks[0]?.slug).toBeTruthy();
    expect(category?.crossShelfLinks[0]?.reason).toBeTruthy();
  });

  it('专题策展元数据已经支持策展说明、阅读路线和分馆联动', () => {
    const topic = libraryTopics.find((item) => item.slug === 'four-masterpieces');
    expect(topic?.curatorNote).toContain('入口');
    expect(topic?.readingPathBookSlugs.length).toBeGreaterThanOrEqual(2);
    expect(topic?.relatedCategorySlugs.length).toBeGreaterThan(0);
  });

  it('三言话本专题已经存在并收拢三言三部', () => {
    const topic = libraryTopics.find((item) => item.slug === 'three-yans');

    expect(topic?.name).toBe('三言话本');
    expect(topic?.bookSlugs).toEqual([
      'yushimingyan',
      'jingshitongyan',
      'xingshihengyan',
    ]);
    expect(topic?.relatedTopicSlugs?.length).toBeGreaterThan(0);
    expect(topic?.featuredAuthorSlugs).toContain('fengmenglong');
  });

  it('历史风云与神魔奇想专题已经建立并接住对应书目', () => {
    const historicalTopic = libraryTopics.find((item) => item.slug === 'historical-epics');
    const mythicTopic = libraryTopics.find((item) => item.slug === 'mythic-realms');

    expect(historicalTopic?.name).toBe('历史风云');
    expect(historicalTopic?.bookSlugs).toEqual([
      'sanguoyanyi',
      'dongzhoulieguozhi',
      'suitangyanyi',
      'shuoyuequanzhuan',
    ]);
    expect(historicalTopic?.featuredAuthorSlugs).toContain('luoguanzhong');
    expect(historicalTopic?.relatedTopicSlugs).toContain('four-masterpieces');

    expect(mythicTopic?.name).toBe('神魔奇想');
    expect(mythicTopic?.bookSlugs).toEqual([
      'xiyouji',
      'fengshenyanyi',
      'jinghuayuan',
    ]);
    expect(mythicTopic?.featuredAuthorSlugs).toContain('wuchengen');
    expect(mythicTopic?.relatedTopicSlugs).toContain('strange-tales');
  });

  it('历史与神魔相关作者已经补齐专题互链', () => {
    expect(libraryAuthorProfiles.find((item) => item.slug === 'luoguanzhong')?.relatedTopicSlugs)
      .toContain('historical-epics');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'fengmenglong')?.relatedTopicSlugs)
      .toContain('historical-epics');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'wuchengen')?.relatedTopicSlugs)
      .toContain('mythic-realms');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'xuzhonglin')?.relatedTopicSlugs)
      .toContain('mythic-realms');
  });

  it('历史与神魔书目已经真实挂到新专题上', () => {
    const historicalTargets = [
      'sanguoyanyi',
      'dongzhoulieguozhi',
      'suitangyanyi',
      'shuoyuequanzhuan',
    ];
    const mythicTargets = [
      'xiyouji',
      'fengshenyanyi',
      'jinghuayuan',
    ];

    for (const slug of historicalTargets) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.featuredTopics, `${slug} 尚未挂到历史风云专题`).toContain('historical-epics');
    }

    for (const slug of mythicTargets) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.featuredTopics, `${slug} 尚未挂到神魔奇想专题`).toContain('mythic-realms');
    }
  });

  it('搜索导览已经扩入历史与神魔第二波入口', () => {
    expect(searchKeywordGuides.some((item) => item.query === '权谋')).toBe(true);
    expect(searchKeywordGuides.some((item) => item.query === '封神')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'luoguanzhong')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'wuchengen')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'xuzhonglin')).toBe(true);
    expect(searchTopicGuides.some((item) => item.topicSlug === 'historical-epics')).toBe(true);
    expect(searchTopicGuides.some((item) => item.topicSlug === 'mythic-realms')).toBe(true);
  });

  it('公案侠义与英雄传奇专题已经建立并接住对应书目', () => {
    const gongAnTopic = libraryTopics.find((item) => item.slug === 'gong-an-heroics');
    const heroicTopic = libraryTopics.find((item) => item.slug === 'heroic-tales');

    expect(gongAnTopic?.name).toBe('公案侠义');
    expect(gongAnTopic?.bookSlugs).toEqual(['sanxiawuyi']);
    expect(gongAnTopic?.featuredAuthorSlugs).toContain('shiyukun');
    expect(gongAnTopic?.relatedTopicSlugs).toContain('heroic-tales');

    expect(heroicTopic?.name).toBe('英雄传奇');
    expect(heroicTopic?.bookSlugs).toEqual([
      'shuihuzhuan',
      'shuoyuequanzhuan',
      'suitangyanyi',
    ]);
    expect(heroicTopic?.featuredAuthorSlugs).toContain('shinaianshi');
    expect(heroicTopic?.relatedTopicSlugs).toContain('gong-an-heroics');
    expect(heroicTopic?.relatedTopicSlugs).toContain('historical-epics');
  });

  it('公案与英雄相关作者已经补齐专题互链', () => {
    expect(libraryAuthorProfiles.find((item) => item.slug === 'shiyukun')?.relatedTopicSlugs)
      .toContain('gong-an-heroics');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'shinaianshi')?.relatedTopicSlugs)
      .toContain('heroic-tales');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'qiancai')?.relatedTopicSlugs)
      .toContain('heroic-tales');
    expect(libraryAuthorProfiles.find((item) => item.slug === 'churenhuo')?.relatedTopicSlugs)
      .toContain('heroic-tales');
  });

  it('公案与英雄书目已经真实挂到新专题上', () => {
    const gongAnTargets = ['sanxiawuyi'];
    const heroicTargets = ['shuihuzhuan', 'shuoyuequanzhuan', 'suitangyanyi'];

    for (const slug of gongAnTargets) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.featuredTopics, `${slug} 尚未挂到公案侠义专题`).toContain('gong-an-heroics');
    }

    for (const slug of heroicTargets) {
      const bookJson = JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/books', `${slug}.json`), 'utf8'),
      );

      expect(bookJson.featuredTopics, `${slug} 尚未挂到英雄传奇专题`).toContain('heroic-tales');
    }
  });

  it('搜索导览已经扩入公案与英雄第三波入口', () => {
    expect(searchKeywordGuides.some((item) => item.query === '包公')).toBe(true);
    expect(searchKeywordGuides.some((item) => item.query === '梁山')).toBe(true);
    expect(searchKeywordGuides.some((item) => item.query === '岳飞')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'shiyukun')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'shinaianshi')).toBe(true);
    expect(searchAuthorGuides.some((item) => item.authorSlug === 'qiancai')).toBe(true);
    expect(searchTopicGuides.some((item) => item.topicSlug === 'gong-an-heroics')).toBe(true);
    expect(searchTopicGuides.some((item) => item.topicSlug === 'heroic-tales')).toBe(true);
  });

  it('作者展架数据至少覆盖曹雪芹', () => {
    const author = libraryAuthorProfiles.find((item) => item.slug === 'caoxueqin');
    expect(author?.name).toBe('曹雪芹');
    expect(author?.recommendedBookSlugs).toContain('hongloumeng');
  });

  it('作者展架资料已覆盖当前全部入藏作者，并补齐导览字段', () => {
    const bookAuthorSlugs = new Set(
      readdirSync(join(process.cwd(), 'src/content/books'))
        .filter((file) => file.endsWith('.json'))
        .map((file) => JSON.parse(
          readFileSync(join(process.cwd(), 'src/content/books', file), 'utf8'),
        ).authorSlug),
    );

    const authorProfileMap = new Map(
      libraryAuthorProfiles.map((author) => [author.slug, author]),
    );

    for (const slug of bookAuthorSlugs) {
      const author = authorProfileMap.get(slug);
      expect(author, `${slug} 尚未补齐作者展架资料`).toBeTruthy();
      expect(author?.styleTags.length, `${slug} 尚未补齐作者气质标签`).toBeGreaterThan(0);
      expect(author?.libraryRole, `${slug} 尚未补齐馆内定位`).toBeTruthy();
      expect(author?.entryBookSlug, `${slug} 尚未设置入门书`).toBeTruthy();
      expect(
        author?.recommendedBookSlugs.includes(author.entryBookSlug ?? ''),
        `${slug} 的 entryBookSlug 必须属于 recommendedBookSlugs`,
      ).toBe(true);
    }
  });

  it('展示层优先读取书籍 JSON 里的馆藏状态', () => {
    const { tierLabelMap, completionLevelMap } = buildBookDisplayMaps([
      {
        id: 'hongloumeng',
        data: {
          category: ['世情小说'],
          collectionTier: 'core',
          completionLevel: 'L2',
          featuredTopics: ['four-masterpieces'],
        },
      },
      {
        id: 'liaozhaizhiyi',
        data: {
          category: ['志怪传奇'],
          collectionTier: 'featured',
          completionLevel: 'L1',
          featuredTopics: ['strange-tales'],
        },
      },
    ]);

    expect(tierLabelMap.hongloumeng).toBe('镇馆');
    expect(completionLevelMap.hongloumeng).toBe('L2');
    expect(tierLabelMap.liaozhaizhiyi).toBe('重点');
    expect(completionLevelMap.liaozhaizhiyi).toBe('L1');
  });

  it('专题聚合优先读取书籍 JSON 里的 featuredTopics', () => {
    const topicBooks = pickBooksByTopic([
      {
        id: 'hongloumeng',
        data: {
          category: ['世情小说'],
          featuredTopics: ['worldly-novels'],
        },
      },
      {
        id: 'liaozhaizhiyi',
        data: {
          category: ['志怪传奇'],
          featuredTopics: ['strange-tales'],
        },
      },
      {
        id: 'guwenguanzhi',
        data: {
          category: ['古文入门'],
        },
      },
    ], 'strange-tales');

    expect(topicBooks.map((book) => book.id)).toEqual(['liaozhaizhiyi']);
  });

  it('兼容水浒传历史章节别名', () => {
    expect(chapterBookAliases.shuihuzhuan).toContain('shuihuzh');
    expect(normalizeChapterBookSlug('shuihuzh')).toBe('shuihuzhuan');
  });
});
