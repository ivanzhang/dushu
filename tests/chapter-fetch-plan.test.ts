import { describe, expect, it } from 'vitest';
import {
  buildChapterApiUrl,
  extractContentFromWikitext,
  extractTitleFromWikitext,
} from '../scripts/fetch-chapters.mjs';
import {
  getBookFetchConfig,
  getChapterFilename,
  getChapterSourceUrl,
  normalizeChapterBookSlug,
} from '../scripts/fetch-chapter-helpers.mjs';

describe('chapter fetch helpers', () => {
  it('把历史别名 shuihuzh 统一映射到 shuihuzhuan', () => {
    expect(normalizeChapterBookSlug('shuihuzh')).toBe('shuihuzhuan');
  });

  it('水浒传沿用三位章节文件名', () => {
    expect(getChapterFilename('shuihuzh', 1)).toBe('001.md');
  });

  it('金瓶梅沿用两位章节文件名', () => {
    expect(getChapterFilename('jinpingmei', 1)).toBe('01.md');
  });

  it('能返回水浒传的抓取配置', () => {
    const config = getBookFetchConfig('shuihuzh');
    expect(config.canonicalBookId).toBe('shuihuzhuan');
    expect(config.storageDir).toBe('shuihuzh');
  });

  it('儒林外史沿用两位回目规则', () => {
    expect(getChapterFilename('rulinwaishi', 1)).toBe('01.md');
    expect(getChapterSourceUrl('rulinwaishi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E5%84%92%E6%9E%97%E5%A4%96%E5%8F%B2/%E7%AC%AC01%E5%9B%9E',
    );
  });

  it('聊斋志异使用卷编号抓取', () => {
    expect(getChapterFilename('liaozhaizhiyi', 1)).toBe('01.md');
    expect(getChapterSourceUrl('liaozhaizhiyi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E8%81%8A%E9%BD%8B%E5%BF%97%E7%95%B0/%E7%AC%AC01%E5%8D%B7',
    );
  });

  it('东周列国志沿用三位回目规则', () => {
    expect(getChapterFilename('dongzhoulieguozhi', 1)).toBe('001.md');
    expect(getChapterSourceUrl('dongzhoulieguozhi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E6%9D%B1%E5%91%A8%E5%88%97%E5%9C%8B%E5%BF%97/%E7%AC%AC001%E5%9B%9E',
    );
  });

  it('封神演义使用卷前缀和三位编号', () => {
    expect(getChapterFilename('fengshenyanyi', 1)).toBe('001.md');
    expect(getChapterSourceUrl('fengshenyanyi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E5%B0%81%E7%A5%9E%E6%BC%94%E7%BE%A9/%E5%8D%B7001',
    );
  });

  it('古文观止本地文件补零，但源地址保持自然卷号', () => {
    expect(getChapterFilename('guwenguanzhi', 1)).toBe('01.md');
    expect(getChapterSourceUrl('guwenguanzhi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E5%8F%A4%E6%96%87%E8%A7%80%E6%AD%A2/%E5%8D%B71',
    );
  });

  it('阅微草堂笔记使用自然卷号抓取，但本地文件保持两位编号', () => {
    expect(getChapterFilename('yueweicaotangbiji', 1)).toBe('01.md');
    expect(getChapterSourceUrl('yueweicaotangbiji', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E9%96%B1%E5%BE%AE%E8%8D%89%E5%A0%82%E7%AD%86%E8%A8%98/%E5%8D%B71',
    );
  });

  it('子不语使用自然卷号抓取，但本地文件保持两位编号', () => {
    expect(getChapterFilename('zibuyu', 1)).toBe('01.md');
    expect(getChapterSourceUrl('zibuyu', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E5%AD%90%E4%B8%8D%E8%AA%9E/%E5%8D%B71',
    );
  });

  it('喻世明言使用两位卷编号抓取', () => {
    expect(getChapterFilename('yushimingyan', 1)).toBe('01.md');
    expect(getChapterSourceUrl('yushimingyan', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E5%96%BB%E4%B8%96%E6%98%8E%E8%A8%80/%E7%AC%AC01%E5%8D%B7',
    );
  });

  it('警世通言使用两位卷编号抓取', () => {
    expect(getChapterFilename('jingshitongyan', 1)).toBe('01.md');
    expect(getChapterSourceUrl('jingshitongyan', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E8%AD%A6%E4%B8%96%E9%80%9A%E8%A8%80/%E7%AC%AC01%E5%8D%B7',
    );
  });

  it('醒世恒言使用两位卷编号抓取', () => {
    expect(getChapterFilename('xingshihengyan', 1)).toBe('01.md');
    expect(getChapterSourceUrl('xingshihengyan', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E9%86%92%E4%B8%96%E6%81%86%E8%A8%80/%E7%AC%AC01%E5%8D%B7',
    );
  });

  it('红楼梦沿用三位回目规则', () => {
    expect(getChapterFilename('hongloumeng', 1)).toBe('001.md');
    expect(getChapterSourceUrl('hongloumeng', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E7%B4%85%E6%A8%93%E5%A4%A2/%E7%AC%AC001%E5%9B%9E',
    );
  });

  it('三国演义沿用三位回目规则', () => {
    expect(getChapterFilename('sanguoyanyi', 1)).toBe('001.md');
    expect(getChapterSourceUrl('sanguoyanyi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E4%B8%89%E5%9C%8B%E6%BC%94%E7%BE%A9/%E7%AC%AC001%E5%9B%9E',
    );
  });

  it('西游记沿用三位回目规则', () => {
    expect(getChapterFilename('xiyouji', 1)).toBe('001.md');
    expect(getChapterSourceUrl('xiyouji', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E8%A5%BF%E9%81%8A%E8%A8%98/%E7%AC%AC001%E5%9B%9E',
    );
  });

  it('三侠五义沿用三位回目规则', () => {
    expect(getChapterFilename('sanxiawuyi', 1)).toBe('001.md');
    expect(getChapterSourceUrl('sanxiawuyi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E4%B8%89%E4%BF%A0%E4%BA%94%E7%BE%A9/%E7%AC%AC001%E5%9B%9E',
    );
  });

  it('说岳全传使用中文数字回目抓取，但本地文件保持三位编号', () => {
    expect(getChapterFilename('shuoyuequanzhuan', 1)).toBe('001.md');
    expect(getChapterSourceUrl('shuoyuequanzhuan', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E8%AA%AA%E5%B2%B3%E5%85%A8%E5%82%B3/%E7%AC%AC%E4%B8%80%E5%9B%9E',
    );
    expect(getChapterSourceUrl('shuoyuequanzhuan', 12)).toBe(
      'https://zh.wikisource.org/wiki/%E8%AA%AA%E5%B2%B3%E5%85%A8%E5%82%B3/%E7%AC%AC%E5%8D%81%E4%BA%8C%E5%9B%9E',
    );
  });

  it('隋唐演义使用三位数字子页面抓取', () => {
    expect(getChapterFilename('suitangyanyi', 1)).toBe('001.md');
    expect(getChapterSourceUrl('suitangyanyi', 1)).toBe(
      'https://zh.wikisource.org/wiki/%E9%9A%8B%E5%94%90%E6%BC%94%E7%BE%A9/001',
    );
  });

  it('能返回三侠五义与英雄线两书的抓取配置', () => {
    expect(getBookFetchConfig('sanxiawuyi').storageDir).toBe('sanxiawuyi');
    expect(getBookFetchConfig('shuoyuequanzhuan').storageDir).toBe('shuoyuequanzhuan');
    expect(getBookFetchConfig('suitangyanyi').storageDir).toBe('suitangyanyi');
  });

  it('能把章节页面链接转换成 MediaWiki API 内容链接', () => {
    expect(
      buildChapterApiUrl(
        'https://zh.wikisource.org/wiki/%E5%84%92%E6%9E%97%E5%A4%96%E5%8F%B2/%E7%AC%AC01%E5%9B%9E',
      ),
    ).toBe(
      'https://zh.wikisource.org/w/api.php?action=query&titles=%E5%84%92%E6%9E%97%E5%A4%96%E5%8F%B2%2F%E7%AC%AC01%E5%9B%9E&prop=revisions&rvslots=main&rvprop=content&formatversion=2&format=json',
    );
  });

  it('能从维基文库原始 wikitext 中提取正文', () => {
    const raw = `{{Novel|儒林外史|第一回　'''說楔子敷陳大義'''||第02回|}}\n<onlyinclude>\n::人生南北多歧路。\n::功名富貴無憑據。\n[[../第02回|下一回]]\n</onlyinclude>`;

    expect(extractContentFromWikitext(raw)).toContain('人生南北多歧路。');
    expect(extractContentFromWikitext(raw)).not.toContain('Novel');
    expect(extractContentFromWikitext(raw)).not.toContain('下一回');
  });

  it('能从 header 模板里提取章节标题并清掉模板噪音', () => {
    const raw = `{{header
| title = 古文觀止
| section = -{卷}-一 周文
| notes = {{Textq|index=否}}
}}
=卷一 周文=
==鄭伯克段于鄢==
正文第一段。`;

    expect(extractTitleFromWikitext(raw)).toBe('卷一 周文');
    expect(extractContentFromWikitext(raw)).toContain('正文第一段。');
    expect(extractContentFromWikitext(raw)).not.toContain('header');
    expect(extractContentFromWikitext(raw)).not.toContain('Textq');
  });

  it('能从红楼梦的居中标题模板里提取回目并过滤导航噪音', () => {
    const raw = `{{样式:古典小說}}
[[../第003回|上一回]]　[[../|回目录]]　[[../第005回|下一回]]

----

{{center|'''第四回　薄命女偏逢薄命郎　葫蘆僧亂判葫蘆案'''}}

題曰：
<poem>捐軀報國恩，未報軀猶在。</poem>
卻說黛玉同姊妹們至王夫人處。`;

    expect(extractTitleFromWikitext(raw)).toBe('第四回　薄命女偏逢薄命郎　葫蘆僧亂判葫蘆案');
    expect(extractContentFromWikitext(raw)).not.toContain('上一回');
    expect(extractContentFromWikitext(raw)).not.toContain('回目录');
    expect(extractContentFromWikitext(raw)).not.toContain('----');
  });

  it('能从带脚注的红楼梦居中标题模板里提取回目', () => {
    const raw = `{{样式:古典小說}}
[[../第029回|上一回]]　[[../|回目录]]　[[../第031回|下一回]]

----

{{center|'''第三十回　寶釵借扇机帶雙敲　齡官划薔痴及局外'''<ref>本回回目有异文。</ref>}}

話說林黛玉與寶玉角口後，也自後悔。`;

    expect(extractTitleFromWikitext(raw)).toBe('第三十回　寶釵借扇机帶雙敲　齡官划薔痴及局外');
  });

  it('能从单行 Header 模板里提取 section 标题，避免说岳全传落成诗曰', () => {
    const raw = `{{Header|title=說岳全傳|section=第十三回 昭豐鎮王貴染病　牟駝岡宗澤踹營|previous=[[../第十二回|第十二回 奪狀元槍挑小梁王　反武場放走岳鵬舉]]|next=[[../第十四回|第十四回 岳飛破賊酬知己　施全剪徑遇良朋]]}}

　　詩曰：

　　旅邸相依賴故人。`;

    expect(extractTitleFromWikitext(raw)).toBe('第十三回 昭豐鎮王貴染病　牟駝岡宗澤踹營');
  });

  it('能清理西游记 header 里的 br 标记，生成纯文本标题', () => {
    const raw = `{{header
| title    = 西遊記
| section  = 第四回<br>官封弼馬心何足　名注齊天意未寧
| author   = 吳承恩
| previous = [[../第003回|第三回<br>四海千山皆拱伏<br>九幽十類盡除名]]
| next     = [[../第005回|第五回<br>亂蟠桃大聖偷丹<br>反天宮諸神捉怪]]
| notes    =
}}`;

    expect(extractTitleFromWikitext(raw)).toBe('第四回 官封弼馬心何足　名注齊天意未寧');
  });

  it('能清理西游记回目里的异文模板，避免标题残留维基标记', () => {
    const raw = `{{header
| title   = 西遊記
| section = 第六十一回 豬八戒助力{{另|破|敗}}魔王　孫行者三調芭蕉扇
| notes   =
}}`;

    expect(extractTitleFromWikitext(raw)).toBe('第六十一回 豬八戒助力破魔王　孫行者三調芭蕉扇');
  });

  it('能清理西游记回目里的參模板，避免 Unicode 缺字提示混入标题', () => {
    const raw = `{{header
| title   = 西遊記
| section = 第五十二回 悟空大鬧金{{參|兜|本作“⿰山兜”，Unicode缺字}}洞　如來暗示主人公
| notes   =
}}`;

    expect(extractTitleFromWikitext(raw)).toBe('第五十二回 悟空大鬧金兜洞　如來暗示主人公');
  });
});
