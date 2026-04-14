import JSZip from 'jszip';

export interface EpubBookMeta {
  slug: string;
  title: string;
  author: string;
  summary: string;
  source: string;
  sourceUrl: string;
}

export interface EpubChapter {
  slug: string;
  title: string;
  chapterNumber: number;
  content: string;
}

// 统一生成 EPUB 下载路径，页面和构建校验都走这里。
// 使用示例：
// const href = buildEpubDownloadPath('hongloumeng');
export function buildEpubDownloadPath(bookSlug: string): string {
  return `/epub/${bookSlug}.epub`;
}

// 把一本书和若干章节打成标准 EPUB 文件。
// 使用示例：
// const archive = await createEpubArchive(bookMeta, chapterList);
export async function createEpubArchive(
  book: EpubBookMeta,
  chapters: EpubChapter[],
): Promise<Uint8Array> {
  const zip = new JSZip();
  const identifier = `urn:mochao:${book.slug}`;
  const modifiedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const stylesheetPath = 'OEBPS/styles/book.css';

  zip.file('mimetype', 'application/epub+zip', {
    compression: 'STORE',
  });

  zip.file('META-INF/container.xml', buildContainerXml());
  zip.file(stylesheetPath, buildStylesheet());

  const manifestItems: string[] = [
    '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
    '<item id="style" href="styles/book.css" media-type="text/css"/>',
  ];
  const spineItems = ['<itemref idref="nav"/>'];
  const navItems: string[] = [];
  const ncxItems: string[] = [];

  chapters.forEach((chapter, index) => {
    const fileName = buildChapterFileName(index + 1);
    const chapterId = `chapter-${String(index + 1).padStart(3, '0')}`;
    const chapterPath = `OEBPS/text/${fileName}`;

    zip.file(chapterPath, buildChapterXhtml(book, chapter));

    manifestItems.push(
      `<item id="${chapterId}" href="text/${fileName}" media-type="application/xhtml+xml"/>`,
    );
    spineItems.push(`<itemref idref="${chapterId}"/>`);
    navItems.push(
      `<li><a href="text/${fileName}">${escapeXml(chapter.title)}</a></li>`,
    );
    ncxItems.push(
      `<navPoint id="${chapterId}" playOrder="${index + 1}"><navLabel><text>${escapeXml(chapter.title)}</text></navLabel><content src="text/${fileName}"/></navPoint>`,
    );
  });

  zip.file(
    'OEBPS/nav.xhtml',
    buildNavDocument(book.title, navItems.join('')),
  );
  zip.file(
    'OEBPS/toc.ncx',
    buildNcxDocument(book, identifier, ncxItems.join('')),
  );
  zip.file(
    'OEBPS/content.opf',
    buildPackageDocument({
      identifier,
      modifiedAt,
      title: book.title,
      author: book.author,
      summary: book.summary,
      source: book.source,
      sourceUrl: book.sourceUrl,
      manifestItems: manifestItems.join(''),
      spineItems: spineItems.join(''),
    }),
  );

  return zip.generateAsync({
    type: 'uint8array',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

function buildChapterFileName(index: number): string {
  return `chapter-${String(index).padStart(3, '0')}.xhtml`;
}

function buildContainerXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

function buildPackageDocument(input: {
  identifier: string;
  modifiedAt: string;
  title: string;
  author: string;
  summary: string;
  source: string;
  sourceUrl: string;
  manifestItems: string;
  spineItems: string;
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" unique-identifier="book-id" xmlns="http://www.idpf.org/2007/opf" xml:lang="zh-CN">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${escapeXml(input.identifier)}</dc:identifier>
    <dc:title>${escapeXml(input.title)}</dc:title>
    <dc:creator>${escapeXml(input.author)}</dc:creator>
    <dc:language>zh-CN</dc:language>
    <dc:description>${escapeXml(input.summary)}</dc:description>
    <dc:source>${escapeXml(`${input.source} · ${input.sourceUrl}`)}</dc:source>
    <meta property="dcterms:modified">${input.modifiedAt}</meta>
  </metadata>
  <manifest>${input.manifestItems}</manifest>
  <spine toc="ncx">${input.spineItems}</spine>
</package>`;
}

function buildNavDocument(title: string, navItems: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
  <head>
    <title>${escapeXml(title)} 目录</title>
    <link rel="stylesheet" type="text/css" href="styles/book.css"/>
  </head>
  <body>
    <nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops">
      <h1>${escapeXml(title)}</h1>
      <ol>${navItems}</ol>
    </nav>
  </body>
</html>`;
}

function buildNcxDocument(
  book: Pick<EpubBookMeta, 'title'>,
  identifier: string,
  navPoints: string,
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${escapeXml(identifier)}"/>
  </head>
  <docTitle><text>${escapeXml(book.title)}</text></docTitle>
  <navMap>${navPoints}</navMap>
</ncx>`;
}

function buildChapterXhtml(book: Pick<EpubBookMeta, 'title' | 'author'>, chapter: EpubChapter): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
  <head>
    <title>${escapeXml(chapter.title)}</title>
    <link rel="stylesheet" type="text/css" href="../styles/book.css"/>
  </head>
  <body>
    <article class="chapter">
      <header class="chapter-header">
        <p class="book-title">${escapeXml(book.title)} · ${escapeXml(book.author)}</p>
        <h1>${escapeXml(chapter.title)}</h1>
      </header>
      ${renderChapterBody(chapter.content)}
    </article>
  </body>
</html>`;
}

function buildStylesheet(): string {
  return `body {
  margin: 0;
  padding: 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  color: #241b14;
  background: #fbf7ef;
}

.chapter {
  padding: 5vw 7vw;
  line-height: 1.9;
  font-size: 1rem;
}

.chapter-header {
  margin-bottom: 2em;
  text-align: center;
}

.book-title {
  color: #7a5d46;
  font-size: 0.9rem;
}

h1 {
  margin: 0.4em 0 0;
  font-size: 1.4rem;
}

p {
  margin: 0 0 1.2em;
  text-indent: 2em;
}`;
}

function renderChapterBody(content: string): string {
  const paragraphs = content
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => `<p>${escapeXml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
