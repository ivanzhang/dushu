// 抓取章节脚本的公共规则。
// 使用示例：
// import { normalizeChapterBookSlug, getChapterFilename } from './fetch-chapter-helpers.mjs';
// normalizeChapterBookSlug('shuihuzh') => 'shuihuzhuan'
// getChapterFilename('jinpingmei', 1) => '01.md'

const BOOK_FETCH_CONFIGS = {
  sanxiawuyi: {
    canonicalBookId: 'sanxiawuyi',
    aliases: ['sanxiawuyi'],
    storageDir: 'sanxiawuyi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E4%B8%89%E4%BF%A0%E4%BA%94%E7%BE%A9/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  shuihuzhuan: {
    canonicalBookId: 'shuihuzhuan',
    aliases: ['shuihuzh', 'shuihuzhuan'],
    // 先沿用现有目录名，避免覆盖或复制用户已抓好的旧章节目录。
    storageDir: 'shuihuzh',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E6%B0%B4%E6%BB%B8%E5%82%B3_(120%E5%9B%9E%E6%9C%AC)/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  jinpingmei: {
    canonicalBookId: 'jinpingmei',
    aliases: ['jinpingmei'],
    storageDir: 'jinpingmei',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E9%87%91%E7%93%B6%E6%A2%85/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  rulinwaishi: {
    canonicalBookId: 'rulinwaishi',
    aliases: ['rulinwaishi'],
    storageDir: 'rulinwaishi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%84%92%E6%9E%97%E5%A4%96%E5%8F%B2/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  liaozhaizhiyi: {
    canonicalBookId: 'liaozhaizhiyi',
    aliases: ['liaozhaizhiyi'],
    storageDir: 'liaozhaizhiyi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E8%81%8A%E9%BD%8B%E5%BF%97%E7%95%B0/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%8D%B7',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  dongzhoulieguozhi: {
    canonicalBookId: 'dongzhoulieguozhi',
    aliases: ['dongzhoulieguozhi'],
    storageDir: 'dongzhoulieguozhi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E6%9D%B1%E5%91%A8%E5%88%97%E5%9C%8B%E5%BF%97/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  fengshenyanyi: {
    canonicalBookId: 'fengshenyanyi',
    aliases: ['fengshenyanyi'],
    storageDir: 'fengshenyanyi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%B0%81%E7%A5%9E%E6%BC%94%E7%BE%A9/',
    sourceLabelPrefix: '%E5%8D%B7',
    sourceLabelSuffix: '',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  guwenguanzhi: {
    canonicalBookId: 'guwenguanzhi',
    aliases: ['guwenguanzhi'],
    storageDir: 'guwenguanzhi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%8F%A4%E6%96%87%E8%A7%80%E6%AD%A2/',
    sourceLabelPrefix: '%E5%8D%B7',
    sourceLabelSuffix: '',
    sourceNumberWidth: 0,
    filenameWidth: 2,
  },
  yueweicaotangbiji: {
    canonicalBookId: 'yueweicaotangbiji',
    aliases: ['yueweicaotangbiji'],
    storageDir: 'yueweicaotangbiji',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E9%96%B1%E5%BE%AE%E8%8D%89%E5%A0%82%E7%AD%86%E8%A8%98/',
    sourceLabelPrefix: '%E5%8D%B7',
    sourceLabelSuffix: '',
    sourceNumberWidth: 0,
    filenameWidth: 2,
  },
  zibuyu: {
    canonicalBookId: 'zibuyu',
    aliases: ['zibuyu'],
    storageDir: 'zibuyu',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%AD%90%E4%B8%8D%E8%AA%9E/',
    sourceLabelPrefix: '%E5%8D%B7',
    sourceLabelSuffix: '',
    sourceNumberWidth: 0,
    filenameWidth: 2,
  },
  yushimingyan: {
    canonicalBookId: 'yushimingyan',
    aliases: ['yushimingyan'],
    storageDir: 'yushimingyan',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E5%96%BB%E4%B8%96%E6%98%8E%E8%A8%80/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%8D%B7',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  jingshitongyan: {
    canonicalBookId: 'jingshitongyan',
    aliases: ['jingshitongyan'],
    storageDir: 'jingshitongyan',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E8%AD%A6%E4%B8%96%E9%80%9A%E8%A8%80/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%8D%B7',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  xingshihengyan: {
    canonicalBookId: 'xingshihengyan',
    aliases: ['xingshihengyan'],
    storageDir: 'xingshihengyan',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E9%86%92%E4%B8%96%E6%81%86%E8%A8%80/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%8D%B7',
    sourceNumberWidth: 2,
    filenameWidth: 2,
  },
  hongloumeng: {
    canonicalBookId: 'hongloumeng',
    aliases: ['hongloumeng'],
    storageDir: 'hongloumeng',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E7%B4%85%E6%A8%93%E5%A4%A2/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  sanguoyanyi: {
    canonicalBookId: 'sanguoyanyi',
    aliases: ['sanguoyanyi'],
    storageDir: 'sanguoyanyi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E4%B8%89%E5%9C%8B%E6%BC%94%E7%BE%A9/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  xiyouji: {
    canonicalBookId: 'xiyouji',
    aliases: ['xiyouji'],
    storageDir: 'xiyouji',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E8%A5%BF%E9%81%8A%E8%A8%98/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
  shuoyuequanzhuan: {
    canonicalBookId: 'shuoyuequanzhuan',
    aliases: ['shuoyuequanzhuan'],
    storageDir: 'shuoyuequanzhuan',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E8%AA%AA%E5%B2%B3%E5%85%A8%E5%82%B3/',
    sourceLabelPrefix: '%E7%AC%AC',
    sourceLabelSuffix: '%E5%9B%9E',
    sourceNumberFormat: 'chinese-lower',
    filenameWidth: 3,
  },
  suitangyanyi: {
    canonicalBookId: 'suitangyanyi',
    aliases: ['suitangyanyi'],
    storageDir: 'suitangyanyi',
    sourceBaseUrl: 'https://zh.wikisource.org/wiki/%E9%9A%8B%E5%94%90%E6%BC%94%E7%BE%A9/',
    sourceLabelPrefix: '',
    sourceLabelSuffix: '',
    sourceNumberWidth: 3,
    filenameWidth: 3,
  },
};

const aliasToCanonical = new Map(
  Object.values(BOOK_FETCH_CONFIGS).flatMap((config) =>
    config.aliases.map((alias) => [alias, config.canonicalBookId]),
  ),
);

// 统一历史别名，后续页面与脚本都以 canonical slug 为主。
// 使用示例：
// normalizeChapterBookSlug('shuihuzh') => 'shuihuzhuan'
export function normalizeChapterBookSlug(bookId) {
  return aliasToCanonical.get(bookId) ?? bookId;
}

// 返回某本书的抓取配置。
// 使用示例：
// const config = getBookFetchConfig('shuihuzh');
export function getBookFetchConfig(bookId) {
  const canonicalBookId = normalizeChapterBookSlug(bookId);
  const config = BOOK_FETCH_CONFIGS[canonicalBookId];

  if (!config) {
    throw new Error(`暂不支持书籍: ${bookId}`);
  }

  return config;
}

// 根据书籍规则生成章节文件名。
// 使用示例：
// getChapterFilename('shuihuzhuan', 7) => '007.md'
export function getChapterFilename(bookId, chapterNumber) {
  const config = getBookFetchConfig(bookId);
  return `${String(chapterNumber).padStart(config.filenameWidth, '0')}.md`;
}

function formatLowerChineseNumber(value) {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  if (value <= 10) {
    if (value === 10) return '十';
    return digits[value];
  }

  if (value < 20) {
    return `十${digits[value - 10]}`;
  }

  if (value < 100) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return ones === 0
      ? `${digits[tens]}十`
      : `${digits[tens]}十${digits[ones]}`;
  }

  throw new Error(`暂不支持超过两位数的中文回目标号: ${value}`);
}

// 根据来源站规则生成章节编号文本。
// 使用示例：
// formatChapterLabelForSource('guwenguanzhi', 1) => '1'
export function formatChapterLabelForSource(bookId, chapterNumber) {
  const config = getBookFetchConfig(bookId);
  if (config.sourceNumberFormat === 'chinese-lower') {
    return encodeURIComponent(formatLowerChineseNumber(chapterNumber));
  }

  if (!config.sourceNumberWidth || config.sourceNumberWidth <= 0) {
    return String(chapterNumber);
  }

  return String(chapterNumber).padStart(config.sourceNumberWidth, '0');
}

// 生成章节保存路径。
// 使用示例：
// getChapterOutputPath('jinpingmei', 3) => 'src/content/chapters/jinpingmei/03.md'
export function getChapterOutputPath(bookId, chapterNumber, rootDir = 'src/content/chapters') {
  const config = getBookFetchConfig(bookId);
  return `${rootDir}/${config.storageDir}/${getChapterFilename(bookId, chapterNumber)}`;
}

// 生成原始抓取链接。
// 使用示例：
// getChapterSourceUrl('shuihuzh', 1)
export function getChapterSourceUrl(bookId, chapterNumber) {
  const config = getBookFetchConfig(bookId);
  const chapterLabel = formatChapterLabelForSource(bookId, chapterNumber);
  return `${config.sourceBaseUrl}${config.sourceLabelPrefix}${chapterLabel}${config.sourceLabelSuffix}`;
}
