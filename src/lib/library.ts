import { libraryAuthorProfiles } from '../data/library/authors';
import {
  libraryBookPlan,
  type CompletionLevel,
  type LibraryTier,
} from '../data/library/books';
import { libraryCategories } from '../data/library/categories';
import { libraryTopics, type LibraryTopicMeta } from '../data/library/topics';

type MinimalBookEntry = {
  id: string;
  data?: {
    category?: string[];
    chapterCount?: number;
    collectionTier?: LibraryTier;
    completionLevel?: CompletionLevel;
    featuredTopics?: string[];
  };
};

type MinimalChapterEntry = {
  data: {
    bookId: string;
    chapterNumber: number;
    wordCount: number;
  };
};

type BookCollectionStatsShape = {
  collectedChapterCount: number;
  continuousChapterCount: number;
  latestChapterNumber: number;
  collectedWordCount: number;
};

// 统一管理书籍与章节之间的历史别名。
// 使用示例：
// const aliases = chapterBookAliases.shuihuzhuan;
// const normalized = normalizeChapterBookSlug('shuihuzh');
export const chapterBookAliases: Record<string, string[]> = {
  hongloumeng: ['hongloumeng'],
  sanguoyanyi: ['sanguoyanyi'],
  xiyouji: ['xiyouji'],
  shuihuzhuan: ['shuihuzhuan', 'shuihuzh'],
  jinpingmei: ['jinpingmei'],
};

// 规范化章节里的历史 bookId，避免旧内容因为 slug 不一致而失联。
// 使用示例：
// normalizeChapterBookSlug('shuihuzh') => 'shuihuzhuan'
export function normalizeChapterBookSlug(bookSlug: string): string {
  for (const [canonicalSlug, aliases] of Object.entries(chapterBookAliases)) {
    if (aliases.includes(bookSlug)) {
      return canonicalSlug;
    }
  }

  return bookSlug;
}

// 获取某本书允许匹配的章节 bookId 别名。
// 使用示例：
// const aliases = getChapterBookIdsForBook('shuihuzhuan');
export function getChapterBookIdsForBook(bookSlug: string): string[] {
  const canonicalSlug = normalizeChapterBookSlug(bookSlug);
  return chapterBookAliases[canonicalSlug] ?? [canonicalSlug];
}

// 获取某本书在策展计划中的元信息。
// 使用示例：
// const plan = getLibraryPlan('hongloumeng');
export function getLibraryPlan(bookSlug: string) {
  return libraryBookPlan.find((item) => item.slug === normalizeChapterBookSlug(bookSlug));
}

// 统一读取某本书在当前站点里的真实馆藏状态。
// 使用示例：
// const state = getBookLibraryState(book);
export function getBookLibraryState<T extends MinimalBookEntry>(book: T) {
  const plan = getLibraryPlan(book.id);
  const hasFeaturedTopics = Object.prototype.hasOwnProperty.call(book.data ?? {}, 'featuredTopics');

  return {
    tier: book.data?.collectionTier ?? plan?.tier,
    completionLevel: book.data?.completionLevel ?? plan?.completionLevel,
    topicSlugs: hasFeaturedTopics
      ? (book.data?.featuredTopics ?? [])
      : (plan?.topicSlugs ?? []),
  };
}

// 按首轮 20 本策展顺序排序已有书籍，方便首页与专题页直接复用。
// 使用示例：
// const sortedBooks = sortBooksByPlan(books);
export function sortBooksByPlan<T extends MinimalBookEntry>(books: T[]): T[] {
  const orderMap = new Map(
    libraryBookPlan.map((item, index) => [item.slug, index]),
  );

  return [...books].sort((left, right) => {
    const leftOrder = orderMap.get(normalizeChapterBookSlug(left.id)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = orderMap.get(normalizeChapterBookSlug(right.id)) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

// 只挑选当前站点已经存在的书，避免首页引用到尚未落库的馆藏。
// 使用示例：
// const featured = pickPlannedBooks(books, ['hongloumeng', 'sanguoyanyi']);
export function pickPlannedBooks<T extends MinimalBookEntry>(
  books: T[],
  plannedSlugs: string[],
): T[] {
  const bookMap = new Map(
    books.map((book) => [normalizeChapterBookSlug(book.id), book]),
  );

  return plannedSlugs
    .map((slug) => bookMap.get(slug))
    .filter((book): book is T => Boolean(book));
}

// 把书籍内容里的中文分类映射到分馆 slug，优先使用真实书目数据。
// 使用示例：
// const categorySlugs = getBookCategorySlugs(book);
export function getBookCategorySlugs<T extends MinimalBookEntry>(book: T): string[] {
  const matchedCategories = (book.data?.category ?? [])
    .map((categoryName) => getCategoryMetaByName(categoryName)?.slug)
    .filter((slug): slug is string => Boolean(slug));

  if (matchedCategories.length > 0) {
    return [...new Set(matchedCategories)];
  }

  const plannedCategory = getLibraryPlan(book.id)?.primaryCategory;
  return plannedCategory ? [plannedCategory] : [];
}

// 按首轮主分类收集当前已经落库的馆藏。
// 使用示例：
// const historyBooks = pickBooksByCategory(books, 'historical-romance');
export function pickBooksByCategory<T extends MinimalBookEntry>(
  books: T[],
  categorySlug: string,
): T[] {
  return sortBooksByPlan(
    books.filter((book) => getBookCategorySlugs(book).includes(categorySlug)),
  );
}

// 按专题 slug 收集当前已经落库的馆藏，优先读取书目 JSON 里的 featuredTopics。
// 使用示例：
// const topicBooks = pickBooksByTopic(books, 'strange-tales');
export function pickBooksByTopic<T extends MinimalBookEntry>(
  books: T[],
  topicSlug: string,
): T[] {
  return sortBooksByPlan(
    books.filter((book) => getBookLibraryState(book).topicSlugs.includes(topicSlug)),
  );
}

// 生成卡片展示所需的层级和完成度映射。
// 使用示例：
// const { tierLabelMap, completionLevelMap } = buildBookDisplayMaps(books);
export function buildBookDisplayMaps<T extends MinimalBookEntry>(books: T[]) {
  const tierNameMap = {
    core: '镇馆',
    featured: '重点',
    shelf: '铺面',
  } as const;

  const tierLabelMap: Record<string, string> = {};
  const completionLevelMap: Record<string, 'L1' | 'L2' | 'L3' | 'L4'> = {};

  for (const book of books) {
    const state = getBookLibraryState(book);
    if (state.tier) {
      tierLabelMap[book.id] = tierNameMap[state.tier];
    }
    if (state.completionLevel) {
      completionLevelMap[book.id] = state.completionLevel;
    }
  }

  return { tierLabelMap, completionLevelMap };
}

// 把中文分类名转换成现有静态路由 slug，兼容当前 Astro 生成方式。
// 使用示例：
// const slug = categoryNameToRouteSlug('世情小说');
export function categoryNameToRouteSlug(categoryName: string): string {
  return categoryName
    .replace(/[\s　]/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

// 按中文分类名读取策展元数据，供分类页与分类总览页复用。
// 使用示例：
// const meta = getCategoryMetaByName('历史演义');
export function getCategoryMetaByName(categoryName: string) {
  return libraryCategories.find((item) => item.name === categoryName);
}

// 按分类 slug 读取策展元数据，供书籍页和其他聚合入口复用。
// 使用示例：
// const category = getCategoryMetaBySlug('worldly-novels');
export function getCategoryMetaBySlug(categorySlug: string) {
  return libraryCategories.find((item) => item.slug === categorySlug);
}

// 按作者 slug 读取作者展架资料。
// 使用示例：
// const author = getAuthorProfileBySlug('caoxueqin');
export function getAuthorProfileBySlug(authorSlug: string) {
  return libraryAuthorProfiles.find((item) => item.slug === authorSlug);
}

// 按专题 slug 读取专题元数据。
// 使用示例：
// const topic = getTopicMetaBySlug('four-masterpieces');
export function getTopicMetaBySlug(topicSlug: string) {
  return libraryTopics.find((item) => item.slug === topicSlug);
}

// 读取某个专题关联的其它专题，供专题页与导览卡片复用。
// 使用示例：
// const relatedTopics = getRelatedTopicsForTopic(topicMeta);
export function getRelatedTopicsForTopic(topic: Pick<LibraryTopicMeta, 'relatedTopicSlugs'>) {
  return (topic.relatedTopicSlugs ?? [])
    .map((topicSlug) => getTopicMetaBySlug(topicSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

// 读取某个专题推荐进入的作者，供专题页展示“作者入口”。
// 使用示例：
// const featuredAuthors = getFeaturedAuthorsForTopic(topicMeta);
export function getFeaturedAuthorsForTopic(topic: Pick<LibraryTopicMeta, 'featuredAuthorSlugs'>) {
  return (topic.featuredAuthorSlugs ?? [])
    .map((authorSlug) => getAuthorProfileBySlug(authorSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

// 为书籍页生成专题推荐入口，优先读取真实书目里的 featuredTopics。
// 使用示例：
// const topics = getBookTopicEntries(book);
export function getBookTopicEntries<T extends MinimalBookEntry>(book: T) {
  return getBookLibraryState(book).topicSlugs
    .map((topicSlug) => getTopicMetaBySlug(topicSlug))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));
}

// 生成书籍收录进度文案，供书籍详情页直接展示。
// 使用示例：
// const text = getCollectionCoverageText(12, 120);
export function getCollectionCoverageText(
  collectedChapterCount: number,
  totalChapterCount: number,
): string {
  if (totalChapterCount <= 0) {
    return '0 / 0 章';
  }

  const percent = Math.round((collectedChapterCount / totalChapterCount) * 100);
  return `${collectedChapterCount} / ${totalChapterCount} 章 · ${percent}%`;
}

// 判断某本书是否已经达到“全本可读”，统一生成展示文案。
// 使用示例：
// const text = getBookCollectionStatusText(stats, 120);
export function getBookCollectionStatusText(
  stats: Pick<BookCollectionStatsShape, 'collectedChapterCount' | 'continuousChapterCount'>,
  totalChapterCount: number,
) {
  if (totalChapterCount <= 0) {
    return undefined;
  }

  if (stats.collectedChapterCount < totalChapterCount) {
    return undefined;
  }

  if (stats.continuousChapterCount < totalChapterCount) {
    return undefined;
  }

  return '已全本收录，可直接从头读到完结';
}

// 批量生成书卡展示所需的真实整理进度文案。
// 使用示例：
// const { collectionProgressMap, collectionDepthMap, collectionStatusMap } = buildBookCollectionMaps(books, chapters);
export function buildBookCollectionMaps<
  TBook extends MinimalBookEntry,
  TChapter extends MinimalChapterEntry,
>(books: TBook[], chapters: TChapter[]) {
  const collectionProgressMap: Record<string, string> = {};
  const collectionDepthMap: Record<string, string> = {};
  const collectionStatusMap: Record<string, string> = {};

  for (const book of books) {
    const stats = getBookCollectionStats(book.id, chapters);
    if (stats.latestChapterNumber <= 0) {
      continue;
    }

    const totalChapterCount = book.data?.chapterCount ?? 0;
    collectionProgressMap[book.id] = totalChapterCount > 0
      ? `已整理到第 ${stats.latestChapterNumber} 章 / 共 ${totalChapterCount} 章`
      : `已整理到第 ${stats.latestChapterNumber} 章`;
    collectionDepthMap[book.id] = `可连读到第 ${stats.continuousChapterCount} 章`;

    const collectionStatusText = getBookCollectionStatusText(stats, totalChapterCount);
    if (collectionStatusText) {
      collectionStatusMap[book.id] = collectionStatusText;
    }
  }

  return { collectionProgressMap, collectionDepthMap, collectionStatusMap };
}

// 统计单本书当前真实已整理的章节规模。
// 使用示例：
// const stats = getBookCollectionStats('hongloumeng', chapters);
export function getBookCollectionStats<T extends MinimalChapterEntry>(
  bookSlug: string,
  chapters: T[],
): BookCollectionStatsShape {
  const chapterBookIds = new Set(getChapterBookIdsForBook(bookSlug));
  const chapterMap = new Map<number, T['data']>();

  for (const chapter of chapters) {
    const { bookId, chapterNumber } = chapter.data;
    if (!chapterBookIds.has(bookId) || chapterNumber <= 0 || chapterMap.has(chapterNumber)) {
      continue;
    }
    chapterMap.set(chapterNumber, chapter.data);
  }

  const collectedChapters = [...chapterMap.values()]
    .sort((left, right) => left.chapterNumber - right.chapterNumber);
  const chapterNumbers = collectedChapters.map((chapter) => chapter.chapterNumber);

  let continuousChapterCount = 0;
  for (const chapterNumber of chapterNumbers) {
    if (chapterNumber !== continuousChapterCount + 1) {
      break;
    }
    continuousChapterCount = chapterNumber;
  }

  return {
    collectedChapterCount: collectedChapters.length,
    continuousChapterCount,
    latestChapterNumber: chapterNumbers.at(-1) ?? 0,
    collectedWordCount: collectedChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0),
  };
}

// 汇总站内真实已整理规模，供首页展示，不再误用整本理论总量。
// 使用示例：
// const stats = getLibraryCollectionStats(books, chapters);
export function getLibraryCollectionStats<
  TBook extends MinimalBookEntry,
  TChapter extends MinimalChapterEntry,
>(books: TBook[], chapters: TChapter[]) {
  let booksWithChapters = 0;

  for (const book of books) {
    if (getBookCollectionStats(book.id, chapters).collectedChapterCount > 0) {
      booksWithChapters += 1;
    }
  }

  return {
    bookCount: books.length,
    booksWithChapters,
    collectedChapterCount: chapters.length,
    collectedWordCount: chapters.reduce((sum, chapter) => sum + chapter.data.wordCount, 0),
  };
}

export {
  libraryAuthorProfiles,
  libraryBookPlan,
  libraryCategories,
  libraryTopics,
};
