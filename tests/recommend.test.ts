import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/lib/recommend';

function makeBook(id: string, category: string[], tags: string[], author: string) {
  return { id, data: { category, tags, author } };
}

describe('getRecommendations', () => {
  const sanguoyanyi = makeBook('sanguoyanyi', ['古典小说', '历史演义'], ['三国', '历史', '战争'], '罗贯中');
  const hongloumeng = makeBook('hongloumeng', ['古典小说', '世情小说'], ['红楼', '诗词'], '曹雪芹');
  const xiyouji = makeBook('xiyouji', ['古典小说', '神魔小说'], ['西游', '神话', '冒险'], '吴承恩');
  const shuihuzhuan = makeBook('shuihuzhuan', ['古典小说', '历史演义'], ['水浒', '历史', '战争'], '施耐庵');
  const allBooks = [sanguoyanyi, hongloumeng, xiyouji, shuihuzhuan];

  it('排除自身', () => {
    const result = getRecommendations(sanguoyanyi, allBooks);
    expect(result.every(b => b.id !== 'sanguoyanyi')).toBe(true);
  });

  it('同分类+同标签得分更高排在前面', () => {
    const result = getRecommendations(sanguoyanyi, allBooks);
    // 水浒传与三国演义共享 古典小说+历史演义 两个分类和 历史+战争 两个标签
    expect(result[0].id).toBe('shuihuzhuan');
  });

  it('限制返回数量', () => {
    const result = getRecommendations(sanguoyanyi, allBooks, 2);
    expect(result.length).toBe(2);
  });

  it('不超过可用书籍数', () => {
    const result = getRecommendations(sanguoyanyi, allBooks, 100);
    expect(result.length).toBe(3); // allBooks 有 4 本，减去自身
  });

  it('空列表返回空数组', () => {
    const result = getRecommendations(sanguoyanyi, [sanguoyanyi]);
    expect(result).toEqual([]);
  });

  it('同作者加分', () => {
    const luoguanzhong2 = makeBook('other', ['其他'], [], '罗贯中');
    const unrelated = makeBook('unrelated', ['其他'], [], '无名氏');
    const result = getRecommendations(sanguoyanyi, [sanguoyanyi, luoguanzhong2, unrelated]);
    expect(result[0].id).toBe('other');
  });
});
