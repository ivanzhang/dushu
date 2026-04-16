import { describe, expect, it } from 'vitest';
import * as readerState from '../src/lib/reader-state';
import {
  MAX_READER_HISTORY,
  createDefaultReaderState,
  getBookCatalogMarkers,
  getBookReadingSnapshot,
  mergeReaderStates,
  parseReaderState,
  patchReaderSettings,
  resolvePersistedReadingProgress,
  recordReadingHistory,
  toggleBookmark,
  updateReadingProgress,
} from '../src/lib/reader-state';

describe('reader state helpers', () => {
  it('非法存储内容会回退到默认阅读状态', () => {
    const state = parseReaderState('{not-json');

    expect(state).toEqual(createDefaultReaderState());
  });

  it('阅读设置会在写入前归一化并夹紧边界', () => {
    const next = patchReaderSettings(createDefaultReaderState(), {
      fontSize: 99,
      lineHeight: 0.5,
      contentWidth: 2000,
      theme: 'unknown-theme',
    });

    expect(next.settings.fontSize).toBe(28);
    expect(next.settings.lineHeight).toBe(1.4);
    expect(next.settings.contentWidth).toBe(960);
    expect(next.settings.theme).toBe('default');
  });

  it('阅读进度会按书籍覆盖为最近一次记录', () => {
    const state = createDefaultReaderState();

    const next = updateReadingProgress(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '002',
      chapterTitle: '贾夫人仙逝扬州城',
      chapterNumber: 2,
      progress: 0.4567,
      updatedAt: 1713000000000,
    });

    expect(next.progress.hongloumeng?.chapterSlug).toBe('002');
    expect(next.progress.hongloumeng?.progress).toBe(0.457);
  });

  it('阅读历史会去重，并把最近访问章节放到最前面', () => {
    let state = createDefaultReaderState();

    state = recordReadingHistory(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '001',
      chapterTitle: '甄士隐梦幻识通灵',
      chapterNumber: 1,
      progress: 0.2,
      visitedAt: 1713000000000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '002',
      chapterTitle: '贾夫人仙逝扬州城',
      chapterNumber: 2,
      progress: 0.5,
      visitedAt: 1713000001000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '001',
      chapterTitle: '甄士隐梦幻识通灵',
      chapterNumber: 1,
      progress: 0.9,
      visitedAt: 1713000002000,
    });

    expect(state.history).toHaveLength(2);
    expect(state.history[0]).toMatchObject({
      chapterSlug: '001',
      progress: 0.9,
    });
  });

  it('阅读历史只保留最近上限条目', () => {
    let state = createDefaultReaderState();

    for (let index = 1; index <= MAX_READER_HISTORY + 3; index += 1) {
      state = recordReadingHistory(state, {
        bookSlug: 'sanguoyanyi',
        bookTitle: '三国演义',
        chapterSlug: String(index).padStart(3, '0'),
        chapterTitle: `第${index}回`,
        chapterNumber: index,
        progress: 0.1,
        visitedAt: 1713000000000 + index,
      });
    }

    expect(state.history).toHaveLength(MAX_READER_HISTORY);
    expect(state.history[0]?.chapterSlug).toBe(String(MAX_READER_HISTORY + 3).padStart(3, '0'));
    expect(state.history.at(-1)?.chapterSlug).toBe('004');
  });

  it('书签支持同章切换增删', () => {
    const baseState = createDefaultReaderState();

    const added = toggleBookmark(baseState, {
      bookSlug: 'sanxiawuyi',
      bookTitle: '三侠五义',
      chapterSlug: '008',
      chapterTitle: '第八回',
      chapterNumber: 8,
      progress: 0.61,
      createdAt: 1713000000000,
    });

    expect(added.active).toBe(true);
    expect(added.state.bookmarks).toHaveLength(1);

    const removed = toggleBookmark(added.state, {
      bookSlug: 'sanxiawuyi',
      bookTitle: '三侠五义',
      chapterSlug: '008',
      chapterTitle: '第八回',
      chapterNumber: 8,
      progress: 0.74,
      createdAt: 1713000003000,
    });

    expect(removed.active).toBe(false);
    expect(removed.state.bookmarks).toHaveLength(0);
  });

  it('按书籍读取快照时只返回当前书的进度、历史和书签', () => {
    let state = createDefaultReaderState();

    state = updateReadingProgress(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.33,
      updatedAt: 1713000000000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.33,
      visitedAt: 1713000000000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'sanguoyanyi',
      bookTitle: '三国演义',
      chapterSlug: '001',
      chapterTitle: '宴桃园豪杰三结义',
      chapterNumber: 1,
      progress: 0.5,
      visitedAt: 1713000001000,
    });

    state = toggleBookmark(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.33,
      createdAt: 1713000002000,
    }).state;

    const snapshot = getBookReadingSnapshot(state, 'hongloumeng');

    expect(snapshot.progress?.chapterSlug).toBe('003');
    expect(snapshot.history).toHaveLength(1);
    expect(snapshot.bookmarks).toHaveLength(1);
    expect(snapshot.history[0]?.bookSlug).toBe('hongloumeng');
  });

  it('书页目录标记会返回当前书的上次进度章节和书签章节', () => {
    let state = createDefaultReaderState();

    state = updateReadingProgress(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.64,
      updatedAt: 1713000000000,
    });

    state = toggleBookmark(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.21,
      createdAt: 1713000001000,
    }).state;

    state = toggleBookmark(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.64,
      createdAt: 1713000002000,
    }).state;

    state = toggleBookmark(state, {
      bookSlug: 'sanguoyanyi',
      bookTitle: '三国演义',
      chapterSlug: '002',
      chapterTitle: '张翼德怒鞭督邮',
      chapterNumber: 2,
      progress: 0.3,
      createdAt: 1713000003000,
    }).state;

    const markers = getBookCatalogMarkers(state, 'hongloumeng');

    expect(markers.lastProgressChapterSlug).toBe('008');
    expect(markers.lastProgressChapterNumber).toBe(8);
    expect(markers.bookmarkChapterSlugs).toEqual(['008', '003']);
  });

  it('强制落盘时如果测得进度异常回退，不应覆盖掉已有阅读进度', () => {
    const persisted = resolvePersistedReadingProgress({
      currentProgress: 1,
      measuredProgress: 0,
      force: true,
    });

    expect(persisted).toBe(1);
  });

  it('普通滚动落盘时仍应使用最新测得进度', () => {
    const persisted = resolvePersistedReadingProgress({
      currentProgress: 0.35,
      measuredProgress: 0.62,
      force: false,
    });

    expect(persisted).toBe(0.62);
  });

  it('页面进入隐藏态后，延迟落盘不应把已保存进度冲回 0', () => {
    const persisted = resolvePersistedReadingProgress({
      currentProgress: 1,
      measuredProgress: 0,
      force: false,
      pageHidden: true,
    });

    expect(persisted).toBe(1);
  });

  it('阅读总览会按最近更新时间输出在读书目，并汇总书签与历史数量', () => {
    expect(typeof (readerState as Record<string, unknown>).getReadingDashboardSnapshot).toBe('function');

    let state = createDefaultReaderState();

    state = updateReadingProgress(state, {
      bookSlug: 'sanguoyanyi',
      bookTitle: '三国演义',
      chapterSlug: '002',
      chapterTitle: '张翼德怒鞭督邮',
      chapterNumber: 2,
      progress: 0.41,
      updatedAt: 1713000001000,
    });

    state = updateReadingProgress(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.76,
      updatedAt: 1713000003000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.76,
      visitedAt: 1713000003000,
    });

    state = recordReadingHistory(state, {
      bookSlug: 'sanguoyanyi',
      bookTitle: '三国演义',
      chapterSlug: '002',
      chapterTitle: '张翼德怒鞭督邮',
      chapterNumber: 2,
      progress: 0.41,
      visitedAt: 1713000001000,
    });

    state = toggleBookmark(state, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '003',
      chapterTitle: '贾雨村夤缘复旧职',
      chapterNumber: 3,
      progress: 0.76,
      createdAt: 1713000004000,
    }).state;

    const snapshot = (
      readerState as Record<string, (value: typeof state) => {
        activeBooks: Array<{
          bookSlug: string;
          historyCount: number;
          bookmarkCount: number;
          progress: number;
          chapterSlug: string;
        }>;
      }>
    ).getReadingDashboardSnapshot(state);

    expect(snapshot.activeBooks.map((item) => item.bookSlug)).toEqual(['hongloumeng', 'sanguoyanyi']);
    expect(snapshot.activeBooks[0]).toMatchObject({
      bookSlug: 'hongloumeng',
      chapterSlug: '003',
      progress: 0.76,
      historyCount: 1,
      bookmarkCount: 1,
    });
    expect(snapshot.activeBooks[1]).toMatchObject({
      bookSlug: 'sanguoyanyi',
      historyCount: 1,
      bookmarkCount: 0,
    });
  });

  it('导入阅读记录时会合并本地与备份状态，并优先保留较新的进度', () => {
    let localState = createDefaultReaderState();

    localState = patchReaderSettings(localState, {
      fontSize: 22,
      lineHeight: 2.1,
      contentWidth: 820,
      theme: 'dark',
    });

    localState = updateReadingProgress(localState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.42,
      updatedAt: 1713000001000,
    });

    localState = recordReadingHistory(localState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.42,
      visitedAt: 1713000001000,
    });

    localState = toggleBookmark(localState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.42,
      createdAt: 1713000001000,
    }).state;

    let importedState = createDefaultReaderState();

    importedState = patchReaderSettings(importedState, {
      fontSize: 24,
      lineHeight: 1.8,
      contentWidth: 760,
      theme: 'sepia',
    });

    importedState = updateReadingProgress(importedState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '012',
      chapterTitle: '王熙凤毒设相思局',
      chapterNumber: 12,
      progress: 0.77,
      updatedAt: 1713000005000,
    });

    importedState = updateReadingProgress(importedState, {
      bookSlug: 'sanguoyanyi',
      bookTitle: '三国演义',
      chapterSlug: '003',
      chapterTitle: '议温明董卓叱丁原',
      chapterNumber: 3,
      progress: 0.38,
      updatedAt: 1713000004000,
    });

    importedState = recordReadingHistory(importedState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '012',
      chapterTitle: '王熙凤毒设相思局',
      chapterNumber: 12,
      progress: 0.77,
      visitedAt: 1713000005000,
    });

    importedState = recordReadingHistory(importedState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.65,
      visitedAt: 1713000004500,
    });

    importedState = toggleBookmark(importedState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '012',
      chapterTitle: '王熙凤毒设相思局',
      chapterNumber: 12,
      progress: 0.77,
      createdAt: 1713000005000,
    }).state;

    importedState = toggleBookmark(importedState, {
      bookSlug: 'hongloumeng',
      bookTitle: '红楼梦',
      chapterSlug: '008',
      chapterTitle: '比通灵金莺微露意',
      chapterNumber: 8,
      progress: 0.65,
      createdAt: 1713000004500,
    }).state;

    const merged = mergeReaderStates(localState, importedState);

    expect(merged.settings).toMatchObject({
      fontSize: 24,
      lineHeight: 1.8,
      contentWidth: 760,
      theme: 'sepia',
    });
    expect(merged.progress.hongloumeng).toMatchObject({
      chapterSlug: '012',
      chapterNumber: 12,
      progress: 0.77,
    });
    expect(merged.progress.sanguoyanyi).toMatchObject({
      chapterSlug: '003',
      chapterNumber: 3,
      progress: 0.38,
    });
    expect(merged.history.slice(0, 3).map((item) => `${item.bookSlug}:${item.chapterSlug}`)).toEqual([
      'hongloumeng:012',
      'hongloumeng:008',
    ]);
    expect(merged.bookmarks.map((item) => `${item.bookSlug}:${item.chapterSlug}`)).toEqual([
      'hongloumeng:012',
      'hongloumeng:008',
    ]);
  });
});
