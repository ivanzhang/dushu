import { describe, expect, it } from 'vitest';
import {
  MAX_READER_HISTORY,
  createDefaultReaderState,
  getBookReadingSnapshot,
  parseReaderState,
  patchReaderSettings,
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
});
