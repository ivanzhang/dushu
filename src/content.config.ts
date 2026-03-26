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
