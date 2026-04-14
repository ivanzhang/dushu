import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { createEpubArchive } from '../../lib/epub';
import {
  getChapterBookIdsForBook,
  normalizeChapterBookSlug,
} from '../../lib/library';

interface EpubRouteProps {
  book: CollectionEntry<'books'>;
  chapters: CollectionEntry<'chapters'>[];
}

export const prerender = true;

export async function getStaticPaths() {
  const books = await getCollection('books');
  const allChapters = await getCollection('chapters');

  return books
    .map((book) => {
      const canonicalBookSlug = normalizeChapterBookSlug(book.id);
      const aliases = getChapterBookIdsForBook(canonicalBookSlug);
      const chapters = allChapters
        .filter((chapter) => aliases.includes(chapter.data.bookId))
        .sort((left, right) => left.data.chapterNumber - right.data.chapterNumber);

      return {
        params: { slug: canonicalBookSlug },
        props: {
          book,
          chapters,
        } satisfies EpubRouteProps,
      };
    })
    .filter((entry) => entry.props.chapters.length > 0);
}

// 构建期直接输出静态 EPUB，方便 Pages 站点直接分发下载。
// 使用示例：
// /epub/hongloumeng.epub
export const GET: APIRoute = async ({ props }) => {
  const { book, chapters } = props as EpubRouteProps;

  const archive = await createEpubArchive(
    {
      slug: book.id,
      title: book.data.title,
      author: book.data.author,
      summary: `${book.data.summary}（当前 EPUB 收录本站已整理的 ${chapters.length} 章内容。）`,
      source: book.data.source,
      sourceUrl: book.data.sourceUrl,
    },
    chapters.map((chapter) => ({
      slug: chapter.id.split('/').pop() ?? String(chapter.data.chapterNumber),
      title: chapter.data.title,
      chapterNumber: chapter.data.chapterNumber,
      content: chapter.body,
    })),
  );

  return new Response(archive, {
    headers: {
      'Content-Type': 'application/epub+zip',
      'Content-Disposition': `attachment; filename="${book.id}.epub"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
