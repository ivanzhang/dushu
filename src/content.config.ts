import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    authorSlug: z.string(),
    dynasty: z.string().optional(),
    category: z.array(z.string()),
    tags: z.array(z.string()),
    wordCount: z.number(),
    chapterCount: z.number(),
    status: z.enum(['完结', '连载']),
    copyrightStatus: z.enum(['public-domain', 'cc-by-sa', 'cc-by', 'author-authorized']),
    copyrightNote: z.string(),
    source: z.string(),
    sourceUrl: z.string().url(),
    summary: z.string(),
    // 馆藏策展层字段先做成可选，兼容现有旧书目数据。
    collectionTier: z.enum(['core', 'featured', 'shelf']).optional(),
    completionLevel: z.enum(['L1', 'L2', 'L3', 'L4']).optional(),
    featuredTopics: z.array(z.string()).optional(),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    bookId: z.string(),
    chapterNumber: z.number(),
    wordCount: z.number(),
  }),
});

export const collections = { books, chapters };
