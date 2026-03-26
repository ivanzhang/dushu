type BookEntry = {
  id: string;
  data: {
    category: string[];
    tags: string[];
    author: string;
  };
};

/**
 * 根据分类、标签、作者计算相关推荐书籍。
 * 评分规则：同分类 +3，同标签每个 +1，同作者 +2。
 * 排除自身，按分数降序取前 max 本（默认 6）。
 */
export function getRecommendations(
  current: BookEntry,
  allBooks: BookEntry[],
  max = 6,
): BookEntry[] {
  const scored = allBooks
    .filter((book) => book.id !== current.id)
    .map((book) => {
      let score = 0;

      // 同分类 +3
      for (const cat of current.data.category) {
        if (book.data.category.includes(cat)) {
          score += 3;
        }
      }

      // 同标签每个 +1
      for (const tag of current.data.tags) {
        if (book.data.tags.includes(tag)) {
          score += 1;
        }
      }

      // 同作者 +2
      if (book.data.author === current.data.author) {
        score += 2;
      }

      return { book, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ book }) => book);

  return scored;
}
