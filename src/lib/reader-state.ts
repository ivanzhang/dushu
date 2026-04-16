export type ReaderTheme = 'default' | 'sepia' | 'dark';

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  contentWidth: number;
  theme: ReaderTheme;
}

export interface ReaderProgressEntry {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  progress: number;
  updatedAt: number;
}

export interface ReaderHistoryEntry {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  progress: number;
  visitedAt: number;
}

export interface ReaderBookmarkEntry {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  progress: number;
  createdAt: number;
}

export interface ReaderState {
  version: 1;
  settings: ReaderSettings;
  progress: Record<string, ReaderProgressEntry>;
  history: ReaderHistoryEntry[];
  bookmarks: ReaderBookmarkEntry[];
}

export interface ReadingDashboardBookEntry extends ReaderProgressEntry {
  historyCount: number;
  bookmarkCount: number;
}

export interface ReadingDashboardSnapshot {
  activeBooks: ReadingDashboardBookEntry[];
  recentHistory: ReaderHistoryEntry[];
  recentBookmarks: ReaderBookmarkEntry[];
  settings: ReaderSettings;
}

export const READER_STORAGE_KEY = 'mochao-reader-state';
export const MAX_READER_HISTORY = 12;
export const MAX_BOOKMARKS_PER_BOOK = 12;

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 20,
  lineHeight: 1.9,
  contentWidth: 760,
  theme: 'default',
};

// 创建默认阅读状态，供首次进入或存储损坏时回退。
// 使用示例：
// const state = createDefaultReaderState();
export function createDefaultReaderState(): ReaderState {
  return {
    version: 1,
    settings: { ...DEFAULT_READER_SETTINGS },
    progress: {},
    history: [],
    bookmarks: [],
  };
}

// 解析 localStorage 中的阅读状态，并自动兜底异常内容。
// 使用示例：
// const state = parseReaderState(localStorage.getItem(READER_STORAGE_KEY));
export function parseReaderState(raw: string | null | undefined): ReaderState {
  if (!raw) {
    return createDefaultReaderState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ReaderState>;
    return {
      version: 1,
      settings: normalizeReaderSettings(parsed.settings),
      progress: normalizeProgressMap(parsed.progress),
      history: normalizeHistoryList(parsed.history),
      bookmarks: normalizeBookmarkList(parsed.bookmarks),
    };
  } catch {
    return createDefaultReaderState();
  }
}

// 持久化阅读状态时统一走 JSON 序列化，保持结构稳定。
// 使用示例：
// localStorage.setItem(READER_STORAGE_KEY, serializeReaderState(state));
export function serializeReaderState(state: ReaderState): string {
  return JSON.stringify(state);
}

// 更新阅读设置，并在写入前统一做边界收敛。
// 使用示例：
// state = patchReaderSettings(state, { fontSize: 22, theme: 'sepia' });
export function patchReaderSettings(
  state: ReaderState,
  partial: Partial<ReaderSettings> & { theme?: ReaderTheme | string },
): ReaderState {
  return {
    ...state,
    settings: normalizeReaderSettings({
      ...state.settings,
      ...partial,
    }),
  };
}

// 把阅读设置恢复到默认值，方便读者随时重置阅读器样式。
// 使用示例：
// state = resetReaderSettings(state);
export function resetReaderSettings(state: ReaderState): ReaderState {
  return {
    ...state,
    settings: { ...DEFAULT_READER_SETTINGS },
  };
}

// 按书籍保存最近阅读进度，便于“继续阅读”和章节恢复。
// 使用示例：
// state = updateReadingProgress(state, entry);
export function updateReadingProgress(
  state: ReaderState,
  entry: ReaderProgressEntry,
): ReaderState {
  const normalized = normalizeProgressEntry(entry);

  return {
    ...state,
    progress: {
      ...state.progress,
      [normalized.bookSlug]: normalized,
    },
  };
}

// 记录阅读历史，同一本同一章会去重并前移。
// 使用示例：
// state = recordReadingHistory(state, entry);
export function recordReadingHistory(
  state: ReaderState,
  entry: ReaderHistoryEntry,
): ReaderState {
  const normalized = normalizeHistoryEntry(entry);
  const deduped = state.history.filter((item) => {
    return !isSameChapter(item.bookSlug, item.chapterSlug, normalized.bookSlug, normalized.chapterSlug);
  });

  return {
    ...state,
    history: [normalized, ...deduped].slice(0, MAX_READER_HISTORY),
  };
}

// 删除单条阅读足迹，供“我的阅读”页做逐条整理。
// 使用示例：
// state = removeHistoryEntry(state, 'hongloumeng', '003');
export function removeHistoryEntry(
  state: ReaderState,
  bookSlug: string,
  chapterSlug: string,
): ReaderState {
  return {
    ...state,
    history: state.history.filter((item) => !isSameChapter(item.bookSlug, item.chapterSlug, bookSlug, chapterSlug)),
  };
}

// 切换当前章节书签：已存在则删除，不存在则新增。
// 使用示例：
// const result = toggleBookmark(state, entry);
// state = result.state;
export function toggleBookmark(
  state: ReaderState,
  entry: ReaderBookmarkEntry,
): { state: ReaderState; active: boolean } {
  const normalized = normalizeBookmarkEntry(entry);
  const existingIndex = state.bookmarks.findIndex((item) => {
    return isSameChapter(item.bookSlug, item.chapterSlug, normalized.bookSlug, normalized.chapterSlug);
  });

  if (existingIndex >= 0) {
    return {
      active: false,
      state: {
        ...state,
        bookmarks: state.bookmarks.filter((_, index) => index !== existingIndex),
      },
    };
  }

  const deduped = state.bookmarks.filter((item) => item.bookSlug !== normalized.bookSlug);
  const sameBook = state.bookmarks.filter((item) => item.bookSlug === normalized.bookSlug);

  return {
    active: true,
    state: {
      ...state,
      bookmarks: [
        normalized,
        ...sameBook,
      ].slice(0, MAX_BOOKMARKS_PER_BOOK).concat(deduped),
    },
  };
}

// 删除单条书签，方便在“我的阅读”页直接整理收藏位置。
// 使用示例：
// state = removeBookmarkEntry(state, 'hongloumeng', '003');
export function removeBookmarkEntry(
  state: ReaderState,
  bookSlug: string,
  chapterSlug: string,
): ReaderState {
  return {
    ...state,
    bookmarks: state.bookmarks.filter((item) => !isSameChapter(item.bookSlug, item.chapterSlug, bookSlug, chapterSlug)),
  };
}

// 清空某本书的全部阅读记录：进度、足迹和书签一起移除。
// 使用示例：
// state = clearBookReadingState(state, 'hongloumeng');
export function clearBookReadingState(state: ReaderState, bookSlug: string): ReaderState {
  const progress = { ...state.progress };
  delete progress[bookSlug];

  return {
    ...state,
    progress,
    history: state.history.filter((item) => item.bookSlug !== bookSlug),
    bookmarks: state.bookmarks.filter((item) => item.bookSlug !== bookSlug),
  };
}

// 读取某本书的阅读快照，集中供书页和章节页展示。
// 使用示例：
// const snapshot = getBookReadingSnapshot(state, 'hongloumeng');
export function getBookReadingSnapshot(state: ReaderState, bookSlug: string) {
  return {
    progress: state.progress[bookSlug],
    history: state.history.filter((item) => item.bookSlug === bookSlug),
    bookmarks: state.bookmarks.filter((item) => item.bookSlug === bookSlug),
  };
}

// 生成书页目录所需的阅读标记，方便把“上次读到”和“已存书签”直接标在章节目录里。
// 使用示例：
// const markers = getBookCatalogMarkers(state, 'hongloumeng');
export function getBookCatalogMarkers(state: ReaderState, bookSlug: string) {
  const snapshot = getBookReadingSnapshot(state, bookSlug);

  return {
    lastProgressChapterSlug: snapshot.progress?.chapterSlug,
    lastProgressChapterNumber: snapshot.progress?.chapterNumber,
    bookmarkChapterSlugs: snapshot.bookmarks.map((item) => item.chapterSlug),
  };
}

// 生成“我的阅读”页所需的聚合快照，集中展示在读、书签与历史。
// 使用示例：
// const dashboard = getReadingDashboardSnapshot(state);
export function getReadingDashboardSnapshot(state: ReaderState): ReadingDashboardSnapshot {
  const historyCountMap = countEntriesByBook(state.history);
  const bookmarkCountMap = countEntriesByBook(state.bookmarks);

  return {
    activeBooks: Object.values(state.progress)
      .map((entry) => ({
        ...entry,
        historyCount: historyCountMap[entry.bookSlug] ?? 0,
        bookmarkCount: bookmarkCountMap[entry.bookSlug] ?? 0,
      }))
      .sort((left, right) => right.updatedAt - left.updatedAt),
    recentHistory: [...state.history].sort((left, right) => right.visitedAt - left.visitedAt),
    recentBookmarks: [...state.bookmarks].sort((left, right) => right.createdAt - left.createdAt),
    settings: { ...state.settings },
  };
}

// 合并本地阅读状态与导入备份，尽量保留每项里“更新更晚”的记录。
// 使用示例：
// const merged = mergeReaderStates(currentState, importedState);
export function mergeReaderStates(current: ReaderState, imported: ReaderState): ReaderState {
  const progress = mergeProgressEntries(current.progress, imported.progress);
  const history = mergeHistoryEntries(current.history, imported.history);
  const bookmarks = mergeBookmarkEntries(current.bookmarks, imported.bookmarks);

  return {
    version: 1,
    settings: normalizeReaderSettings(imported.settings),
    progress,
    history,
    bookmarks,
  };
}

// 构造章节链接，供继续阅读、历史、书签统一跳转。
// 使用示例：
// const href = buildChapterHref('hongloumeng', '003');
export function buildChapterHref(bookSlug: string, chapterSlug: string): string {
  return `/book/${bookSlug}/${chapterSlug}`;
}

// 把 0-1 之间的进度值转成百分比文案。
// 使用示例：
// formatProgressLabel(0.428) => '43%'
export function formatProgressLabel(progress: number): string {
  return `${Math.round(normalizeProgress(progress) * 100)}%`;
}

// 解决页面卸载瞬间 DOM 测量回落导致的进度被冲成 0 的问题。
// 使用示例：
// const next = resolvePersistedReadingProgress({
//   currentProgress: 1,
//   measuredProgress: 0,
//   force: true,
// });
export function resolvePersistedReadingProgress(input: {
  currentProgress: number;
  measuredProgress: number;
  force: boolean;
  pageHidden?: boolean;
}): number {
  const currentProgress = normalizeProgress(input.currentProgress);
  const measuredProgress = normalizeProgress(input.measuredProgress);

  // 页面切换时浏览器可能先把滚动位置重置，再触发强制落盘。
  // 同样地，隐藏页签后的延迟定时器也可能读到瞬时 0 值。
  // 这种情况下保留上一份有效进度更安全，避免书页回显被错误打回起点。
  if ((input.force || input.pageHidden) && currentProgress >= 0.03 && measuredProgress === 0) {
    return currentProgress;
  }

  return measuredProgress;
}

function normalizeReaderSettings(
  settings: Partial<ReaderSettings> | undefined,
): ReaderSettings {
  const source = (settings ?? {}) as Record<string, unknown>;

  return {
    fontSize: clampInteger(source.fontSize, 16, 28, DEFAULT_READER_SETTINGS.fontSize),
    lineHeight: clampDecimal(source.lineHeight, 1.4, 2.6, DEFAULT_READER_SETTINGS.lineHeight),
    contentWidth: clampInteger(source.contentWidth, 560, 960, DEFAULT_READER_SETTINGS.contentWidth),
    theme: isReaderTheme(source.theme) ? source.theme : DEFAULT_READER_SETTINGS.theme,
  };
}

function normalizeProgressMap(
  progressMap: Partial<Record<string, ReaderProgressEntry>> | undefined,
): Record<string, ReaderProgressEntry> {
  if (!progressMap || typeof progressMap !== 'object') {
    return {};
  }

  const entries = Object.entries(progressMap)
    .map(([bookSlug, entry]) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      return [bookSlug, normalizeProgressEntry(entry)] as const;
    })
    .filter((entry): entry is readonly [string, ReaderProgressEntry] => Boolean(entry));

  return Object.fromEntries(entries);
}

function mergeProgressEntries(
  current: Record<string, ReaderProgressEntry>,
  imported: Record<string, ReaderProgressEntry>,
): Record<string, ReaderProgressEntry> {
  const merged = new Map<string, ReaderProgressEntry>();

  for (const entry of [...Object.values(current), ...Object.values(imported)]) {
    const normalized = normalizeProgressEntry(entry);
    const existing = merged.get(normalized.bookSlug);

    if (!existing || normalized.updatedAt >= existing.updatedAt) {
      merged.set(normalized.bookSlug, normalized);
    }
  }

  return Object.fromEntries([...merged.entries()]);
}

function mergeHistoryEntries(
  current: ReaderHistoryEntry[],
  imported: ReaderHistoryEntry[],
): ReaderHistoryEntry[] {
  const merged = new Map<string, ReaderHistoryEntry>();

  for (const entry of [...current, ...imported]) {
    const normalized = normalizeHistoryEntry(entry);
    const key = `${normalized.bookSlug}::${normalized.chapterSlug}`;
    const existing = merged.get(key);

    if (!existing || normalized.visitedAt >= existing.visitedAt) {
      merged.set(key, normalized);
    }
  }

  return [...merged.values()]
    .sort((left, right) => right.visitedAt - left.visitedAt)
    .slice(0, MAX_READER_HISTORY);
}

function mergeBookmarkEntries(
  current: ReaderBookmarkEntry[],
  imported: ReaderBookmarkEntry[],
): ReaderBookmarkEntry[] {
  const merged = new Map<string, ReaderBookmarkEntry>();

  for (const entry of [...current, ...imported]) {
    const normalized = normalizeBookmarkEntry(entry);
    const key = `${normalized.bookSlug}::${normalized.chapterSlug}`;
    const existing = merged.get(key);

    if (!existing || normalized.createdAt >= existing.createdAt) {
      merged.set(key, normalized);
    }
  }

  const perBookCount = new Map<string, number>();

  return [...merged.values()]
    .sort((left, right) => right.createdAt - left.createdAt)
    .filter((entry) => {
      const count = perBookCount.get(entry.bookSlug) ?? 0;
      if (count >= MAX_BOOKMARKS_PER_BOOK) {
        return false;
      }

      perBookCount.set(entry.bookSlug, count + 1);
      return true;
    });
}

function normalizeHistoryList(history: ReaderHistoryEntry[] | undefined): ReaderHistoryEntry[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry) => typeof entry === 'object' && entry !== null)
    .map((entry) => normalizeHistoryEntry(entry))
    .sort((left, right) => right.visitedAt - left.visitedAt)
    .slice(0, MAX_READER_HISTORY);
}

function normalizeBookmarkList(bookmarks: ReaderBookmarkEntry[] | undefined): ReaderBookmarkEntry[] {
  if (!Array.isArray(bookmarks)) {
    return [];
  }

  return bookmarks
    .filter((entry) => typeof entry === 'object' && entry !== null)
    .map((entry) => normalizeBookmarkEntry(entry))
    .sort((left, right) => right.createdAt - left.createdAt);
}

function normalizeProgressEntry(entry: Partial<ReaderProgressEntry>): ReaderProgressEntry {
  return {
    bookSlug: sanitizeText(entry.bookSlug),
    bookTitle: sanitizeText(entry.bookTitle),
    chapterSlug: sanitizeText(entry.chapterSlug),
    chapterTitle: sanitizeText(entry.chapterTitle),
    chapterNumber: clampInteger(entry.chapterNumber, 1, Number.MAX_SAFE_INTEGER, 1),
    progress: normalizeProgress(entry.progress),
    updatedAt: normalizeTimestamp(entry.updatedAt),
  };
}

function normalizeHistoryEntry(entry: Partial<ReaderHistoryEntry>): ReaderHistoryEntry {
  return {
    ...normalizeProgressEntry({
      ...entry,
      updatedAt: entry.visitedAt,
    }),
    visitedAt: normalizeTimestamp(entry.visitedAt),
  };
}

function normalizeBookmarkEntry(entry: Partial<ReaderBookmarkEntry>): ReaderBookmarkEntry {
  return {
    ...normalizeProgressEntry({
      ...entry,
      updatedAt: entry.createdAt,
    }),
    createdAt: normalizeTimestamp(entry.createdAt),
  };
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numeric)));
}

function clampDecimal(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.round(Math.min(max, Math.max(min, numeric)) * 10) / 10;
}

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeProgress(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.round(Math.min(1, Math.max(0, numeric)) * 1000) / 1000;
}

function normalizeTimestamp(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return Date.now();
  }

  return Math.round(numeric);
}

function isReaderTheme(value: unknown): value is ReaderTheme {
  return value === 'default' || value === 'sepia' || value === 'dark';
}

function isSameChapter(
  leftBookSlug: string,
  leftChapterSlug: string,
  rightBookSlug: string,
  rightChapterSlug: string,
): boolean {
  return leftBookSlug === rightBookSlug && leftChapterSlug === rightChapterSlug;
}

function countEntriesByBook(entries: Array<{ bookSlug: string }>): Record<string, number> {
  return entries.reduce<Record<string, number>>((accumulator, entry) => {
    accumulator[entry.bookSlug] = (accumulator[entry.bookSlug] ?? 0) + 1;
    return accumulator;
  }, {});
}
