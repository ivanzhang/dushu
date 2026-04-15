import { describe, expect, it } from 'vitest';
import {
  getBookCollectionStats,
  getLibraryCollectionStats,
} from '../src/lib/library';

describe('library collection stats', () => {
  it('能按章节列表统计单本书的已收录深度', () => {
    const stats = getBookCollectionStats('hongloumeng', [
      { data: { bookId: 'hongloumeng', chapterNumber: 1, wordCount: 1200 } },
      { data: { bookId: 'hongloumeng', chapterNumber: 2, wordCount: 900 } },
      { data: { bookId: 'hongloumeng', chapterNumber: 4, wordCount: 800 } },
      { data: { bookId: 'sanguoyanyi', chapterNumber: 1, wordCount: 700 } },
    ]);

    expect(stats.collectedChapterCount).toBe(3);
    expect(stats.continuousChapterCount).toBe(2);
    expect(stats.latestChapterNumber).toBe(4);
    expect(stats.collectedWordCount).toBe(2900);
  });

  it('会兼容章节里的历史书籍别名', () => {
    const stats = getBookCollectionStats('shuihuzhuan', [
      { data: { bookId: 'shuihuzh', chapterNumber: 1, wordCount: 1200 } },
      { data: { bookId: 'shuihuzhuan', chapterNumber: 2, wordCount: 900 } },
    ]);

    expect(stats.collectedChapterCount).toBe(2);
    expect(stats.continuousChapterCount).toBe(2);
    expect(stats.latestChapterNumber).toBe(2);
  });

  it('能汇总站内真实已整理的章节与正文规模', () => {
    const stats = getLibraryCollectionStats(
      [
        { id: 'hongloumeng' },
        { id: 'sanguoyanyi' },
        { id: 'xiyouji' },
      ],
      [
        { data: { bookId: 'hongloumeng', chapterNumber: 1, wordCount: 1200 } },
        { data: { bookId: 'hongloumeng', chapterNumber: 2, wordCount: 800 } },
        { data: { bookId: 'sanguoyanyi', chapterNumber: 1, wordCount: 1000 } },
      ],
    );

    expect(stats.bookCount).toBe(3);
    expect(stats.booksWithChapters).toBe(2);
    expect(stats.collectedChapterCount).toBe(3);
    expect(stats.collectedWordCount).toBe(3000);
  });
});
