import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { pathToFileURL } from 'url';
import {
  getBookFetchConfig,
  getChapterFilename,
  getChapterOutputPath,
  getChapterSourceUrl,
  normalizeChapterBookSlug,
} from './fetch-chapter-helpers.mjs';

// 统一抓取章节的主脚本。
// 使用示例：
// bun scripts/fetch-chapters.mjs shuihuzhuan 1 3
// bun scripts/fetch-chapters.mjs jinpingmei 1 5

// 把章节页面链接转换为 MediaWiki API 的原始内容接口。
// 使用示例：
// buildChapterApiUrl('https://zh.wikisource.org/wiki/...') => 'https://zh.wikisource.org/w/api.php?...'
export function buildChapterApiUrl(sourceUrl) {
  const url = new URL(sourceUrl);
  const wikiPathPrefix = '/wiki/';

  if (!url.pathname.startsWith(wikiPathPrefix)) {
    throw new Error(`无法识别的维基文库页面链接: ${sourceUrl}`);
  }

  const pageTitle = decodeURIComponent(url.pathname.slice(wikiPathPrefix.length));
  return `https://zh.wikisource.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvslots=main&rvprop=content&formatversion=2&format=json`;
}

function fetchRemoteTextWithPython(url) {
  const pythonCode = `
import sys
import time
import urllib.request
import urllib.error

last_error = None
for attempt in range(3):
    try:
        request = urllib.request.Request(sys.argv[1], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            sys.stdout.buffer.write(response.read())
        raise SystemExit(0)
    except Exception as exc:
        last_error = exc
        if attempt == 2:
            raise
        time.sleep(1)
`;

  return execFileSync('python3', ['-c', pythonCode, url], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

// 抓取维基文库章节的原始 wikitext。
// 使用示例：
// const text = fetchChapterWikitext('https://zh.wikisource.org/wiki/...第01回');
function fetchChapterWikitext(sourceUrl) {
  const apiUrl = buildChapterApiUrl(sourceUrl);
  const rawResponse = fetchRemoteTextWithPython(apiUrl);
  const payload = JSON.parse(rawResponse);
  const page = payload?.query?.pages?.[0];
  const content = page?.revisions?.[0]?.slots?.main?.content;

  if (!content) {
    throw new Error(`未能从维基文库 API 取回正文: ${sourceUrl}`);
  }

  return content;
}

function stripNestedTemplates(input) {
  let output = input;

  // MediaWiki 模板常嵌套，循环去掉最内层，直到稳定。
  while (/\{\{[^{}]*\}\}/.test(output)) {
    output = output.replace(/\{\{[^{}]*\}\}/g, '');
  }

  return output;
}

// 清理标题行里的少量维基模板，只保留最终给读者看的正文字符。
// 使用示例：
// normalizeTitleTemplates('第六十一回 豬八戒助力{{另|破|敗}}魔王')
// => '第六十一回 豬八戒助力破魔王'
function normalizeTitleTemplates(input) {
  return input
    .replace(/\{\{\s*另\s*\|([^|{}]+)\|[^{}]*\}\}/g, '$1')
    .replace(/\{\{\s*參\s*\|([^|{}]+)\|[^{}]*\}\}/g, '$1');
}

function normalizeExtractedLine(line) {
  return normalizeTitleTemplates(line)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/-\{([^}]+)\}-/g, '$1')
    .replace(/'''/g, '')
    .replace(/''/g, '')
    // 只折叠换行和半角空格，尽量保留回目里原有的全角间距。
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

// 从 wikitext 提取可阅读正文，避免 Node/Bun 直接请求页面时的 TLS/超时问题。
// 使用示例：
// const content = extractContentFromWikitext(rawText);
export function extractContentFromWikitext(rawText) {
  const onlyIncludeMatch = rawText.match(/<onlyinclude>([\s\S]*?)<\/onlyinclude>/i);
  let content = onlyIncludeMatch ? onlyIncludeMatch[1] : rawText;

  content = content.replace(/<!--[\s\S]*?-->/g, '');
  content = stripNestedTemplates(content);
  content = content.replace(/^\{\{\s*header[\s\S]*?\}\}\s*/i, '');
  content = content.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<\/?(?:div|center|small|big|poem|onlyinclude)[^>]*>/gi, '\n');
  content = content.replace(/<\/?u>/gi, '');
  content = content.replace(/<\/?span[^>]*>/gi, '');
  content = content.replace(/<\/?includeonly>/gi, '');
  content = content.replace(/<\/?noinclude>/gi, '');
  content = content.replace(/<\/?nowiki>/gi, '');
  content = content.replace(/<[^>]+>/g, '');
  content = content.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
  content = content.replace(/\[\[([^\]]+)\]\]/g, '$1');
  content = content.replace(/\[[^\s\]]+\s+([^\]]+)\]/g, '$1');
  content = content.replace(/'''/g, '');
  content = content.replace(/''/g, '');
  content = content.replace(/-\{([^}]+)\}-/g, '$1');

  const lines = content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line
      .replace(/^=+\s*(.*?)\s*=+$/g, '$1')
      .replace(/^[:;*#\s]+/, '')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean)
    .filter((line) => !/^[-—]{3,}$/.test(line))
    .filter((line) => !/(?:上一[回卷]|下一[回卷]|回目录|回目錄|目录|目錄)/.test(line))
    .filter((line) => ![
      '回目录',
      '回目錄',
      '目录',
      '目錄',
      '上一回',
      '下一回',
      '上一卷',
      '下一卷',
    ].includes(line));

  return lines.join('\n').trim();
}

export function extractTitleFromWikitext(rawText) {
  // 章节标题里偶尔会带脚注，先去掉以免打断回目提取。
  const titleSource = rawText
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '');

  const novelTitleMatch = titleSource.match(/\{\{\s*(?:Novel|novel)\|[^|]+\|([^|]+)\|/);
  if (novelTitleMatch?.[1]) {
    return normalizeExtractedLine(novelTitleMatch[1]);
  }

  const inlineHeaderSectionMatch = titleSource.match(/\{\{\s*Header\b[^\n]*\|\s*section\s*=\s*([^|\n]+?)(?=\|[a-z]+?\s*=|\}\})/i);
  if (inlineHeaderSectionMatch?.[1]) {
    return normalizeExtractedLine(inlineHeaderSectionMatch[1]);
  }

  const headerSectionMatch = titleSource.match(/^\|\s*section\s*=\s*(.+)$/im);
  if (headerSectionMatch?.[1]) {
    return normalizeExtractedLine(headerSectionMatch[1]);
  }

  const centeredTitleMatch = titleSource.match(/\{\{\s*center\s*\|\s*'''([^']+)'''\s*\}\}/i);
  if (centeredTitleMatch?.[1]) {
    return normalizeExtractedLine(centeredTitleMatch[1]);
  }

  return null;
}

function extractTitle(content) {
  const lines = content.split('\n').filter(Boolean);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (
      /^[第○零一二三四五六七八九十百千\d]+[回章节]/.test(line) ||
      /^[一二三四五六七八九十]+[、．，]/.test(line)
    ) {
      return line;
    }
  }

  return lines[0] ?? '未命名章节';
}

function estimateWordCount(content) {
  return content.replace(/\s/g, '').length;
}

function buildChapterFrontmatter(bookId, chapterNumber, title, content) {
  const canonicalBookId = normalizeChapterBookSlug(bookId);
  const escapedTitle = title.replaceAll('"', '\\"');
  const wordCount = estimateWordCount(content);

  return `---\ntitle: "${escapedTitle}"\nbookId: "${canonicalBookId}"\nchapterNumber: ${chapterNumber}\nwordCount: ${wordCount}\n---\n\n${content}\n`;
}

async function fetchAndWriteChapter(bookId, chapterNumber) {
  const config = getBookFetchConfig(bookId);
  const outputPath = getChapterOutputPath(bookId, chapterNumber);
  const outputDir = dirname(outputPath);
  const sourceUrl = getChapterSourceUrl(bookId, chapterNumber);

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  if (existsSync(outputPath)) {
    console.log(`跳过已存在章节: ${outputPath}`);
    return;
  }

  console.log(`开始抓取 ${config.canonicalBookId} 第 ${chapterNumber} 回...`);
  const rawText = fetchChapterWikitext(sourceUrl);
  const rawContent = extractContentFromWikitext(rawText);

  if (!rawContent || rawContent.length < 100) {
    throw new Error(`正文提取失败: ${sourceUrl}`);
  }

  const title = extractTitleFromWikitext(rawText) ?? extractTitle(rawContent);
  const cleanedContent = rawContent.startsWith(title)
    ? rawContent.slice(title.length).trim()
    : rawContent;

  const chapterFile = buildChapterFrontmatter(
    bookId,
    chapterNumber,
    title,
    cleanedContent,
  );

  await writeFile(outputPath, chapterFile, 'utf8');
  console.log(`已写入 ${outputPath} (${getChapterFilename(bookId, chapterNumber)})`);
}

function parseCliArgs(argv) {
  const [bookId, startText, endText] = argv;

  if (!bookId || !startText || !endText) {
    console.log('用法: bun scripts/fetch-chapters.mjs <bookId> <start> <end>');
    console.log('示例: bun scripts/fetch-chapters.mjs shuihuzhuan 1 3');
    console.log('示例: bun scripts/fetch-chapters.mjs jinpingmei 1 5');
    process.exit(1);
  }

  const start = Number.parseInt(startText, 10);
  const end = Number.parseInt(endText, 10);

  if (!Number.isInteger(start) || !Number.isInteger(end) || start <= 0 || end < start) {
    throw new Error('章节范围非法，请传入正整数且 end >= start');
  }

  return { bookId, start, end };
}

export {
  getBookFetchConfig,
  getChapterFilename,
  getChapterOutputPath,
  getChapterSourceUrl,
  normalizeChapterBookSlug,
};

export async function main(argv = process.argv.slice(2)) {
  const { bookId, start, end } = parseCliArgs(argv);

  for (let chapterNumber = start; chapterNumber <= end; chapterNumber += 1) {
    try {
      await fetchAndWriteChapter(bookId, chapterNumber);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`第 ${chapterNumber} 回处理失败: ${message}`);
    }
  }

  console.log('全部处理完成');
}

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
