import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { buildEpubDownloadPath, createEpubArchive } from '../src/lib/epub';

describe('epub helpers', () => {
  it('下载路径固定落在 /epub 下', () => {
    expect(buildEpubDownloadPath('hongloumeng')).toBe('/epub/hongloumeng.epub');
  });

  it('可以生成包含核心文件的 epub 压缩包', async () => {
    const archive = await createEpubArchive(
      {
        slug: 'ceshishu',
        title: '测试书',
        author: '墨潮馆',
        summary: '用于验证 EPUB 结构的最小样本。',
        source: '本站整理',
        sourceUrl: 'https://dushu.my/book/ceshishu',
      },
      [
        {
          slug: '001',
          title: '第一章 起笔',
          chapterNumber: 1,
          content: '第一段内容。\n\n第二段内容。',
        },
        {
          slug: '002',
          title: '第二章 收束',
          chapterNumber: 2,
          content: '尾声内容。',
        },
      ],
    );

    const zip = await JSZip.loadAsync(archive);
    const mimetype = await zip.file('mimetype')?.async('string');
    const containerXml = await zip.file('META-INF/container.xml')?.async('string');
    const packageOpf = await zip.file('OEBPS/content.opf')?.async('string');
    const navXhtml = await zip.file('OEBPS/nav.xhtml')?.async('string');
    const chapterXhtml = await zip.file('OEBPS/text/chapter-001.xhtml')?.async('string');

    expect(mimetype).toBe('application/epub+zip');
    expect(containerXml).toContain('full-path="OEBPS/content.opf"');
    expect(packageOpf).toContain('测试书');
    expect(packageOpf).toContain('chapter-001.xhtml');
    expect(navXhtml).toContain('第一章 起笔');
    expect(chapterXhtml).toContain('<p>第一段内容。</p>');
    expect(chapterXhtml).toContain('<p>第二段内容。</p>');
  });
});
