import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
let errors: string[] = [];
let checks = 0;

function check(condition: boolean, msg: string) {
  checks++;
  if (!condition) errors.push(msg);
}

function findHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

// dist 目录存在
check(existsSync(DIST), 'dist/ 目录不存在，请先运行 build');

if (!existsSync(DIST)) {
  console.error('❌ dist/ 目录不存在');
  process.exit(1);
}

const htmlFiles = findHtmlFiles(DIST);
check(htmlFiles.length > 0, '没有找到任何 HTML 文件');

// 所有 HTML 都有 <title> 和 <meta name="description">
for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8');
  const rel = file.replace(DIST, '');
  check(/<title>.+<\/title>/.test(content), `${rel} 缺少 <title>`);
  check(/<meta\s+name="description"/.test(content), `${rel} 缺少 <meta name="description">`);
  check(!content.includes('mochao.example.com'), `${rel} 仍包含错误线上域名 mochao.example.com`);
}

// 书籍详情页有 Book JSON-LD
const bookPages = ['sanguoyanyi', 'hongloumeng', 'xiyouji'];
for (const slug of bookPages) {
  const file = join(DIST, 'book', `${slug}.html`);
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf-8');
    check(content.includes('"@type":"Book"') || content.includes('"@type": "Book"'),
      `/book/${slug}.html 缺少 Book JSON-LD`);
    check(content.includes('收录进度'), `/book/${slug}.html 缺少 收录进度`);
    check(content.includes('完成度'), `/book/${slug}.html 缺少 完成度`);
    check(content.includes('当前已整理到第'), `/book/${slug}.html 缺少 当前已整理到第 文案`);
    check(content.includes('可连续读到第'), `/book/${slug}.html 缺少 可连续读到第 文案`);
  } else {
    errors.push(`/book/${slug}.html 不存在`);
  }
}

// 书籍页需要具备继续阅读、书签摘要和 EPUB 下载入口
const readerBookHtml = readFileSync(join(DIST, 'book', 'hongloumeng.html'), 'utf-8');
check(readerBookHtml.includes('继续阅读'), '/book/hongloumeng.html 缺少 继续阅读 入口');
check(readerBookHtml.includes('最近阅读'), '/book/hongloumeng.html 缺少 最近阅读 模块');
check(readerBookHtml.includes('我的书签'), '/book/hongloumeng.html 缺少 我的书签 模块');
check(readerBookHtml.includes('下载 EPUB'), '/book/hongloumeng.html 缺少 下载 EPUB 入口');
check(readerBookHtml.includes('https://dushu.my/book/hongloumeng'), '/book/hongloumeng.html canonical 未指向 https://dushu.my');

// 章节页需要具备阅读设置、书签和历史入口
const readerChapterHtml = readFileSync(join(DIST, 'book', 'hongloumeng', '001.html'), 'utf-8');
check(readerChapterHtml.includes('阅读设置'), '/book/hongloumeng/001.html 缺少 阅读设置');
check(readerChapterHtml.includes('阅读进度'), '/book/hongloumeng/001.html 缺少 阅读进度 模块');
check(readerChapterHtml.includes('保存书签'), '/book/hongloumeng/001.html 缺少 保存书签 按钮');
check(readerChapterHtml.includes('最近阅读'), '/book/hongloumeng/001.html 缺少 最近阅读 模块');
check(readerChapterHtml.includes('恢复上次进度'), '/book/hongloumeng/001.html 缺少 恢复上次进度 按钮');
check(readerChapterHtml.includes('本书目录速览'), '/book/hongloumeng/001.html 缺少 本书目录速览 模块');
check(readerChapterHtml.includes('快速跳章'), '/book/hongloumeng/001.html 缺少 快速跳章 入口');
check(readerChapterHtml.includes('本章快捷入口'), '/book/hongloumeng/001.html 缺少 本章快捷入口 模块');
check(readerChapterHtml.includes('回到书页'), '/book/hongloumeng/001.html 缺少 回到书页 入口');
check(readerChapterHtml.includes('下载 EPUB'), '/book/hongloumeng/001.html 缺少 下载 EPUB 入口');
check(readerChapterHtml.includes('我的阅读'), '/book/hongloumeng/001.html 缺少 我的阅读 入口');

for (const chapterPath of [
  ['hongloumeng', '070'],
  ['sanguoyanyi', '070'],
  ['xiyouji', '070'],
] as const) {
  const [slug, chapter] = chapterPath;
  check(existsSync(join(DIST, 'book', slug, `${chapter}.html`)), `/book/${slug}/${chapter}.html 不存在`);
}

// 红楼梦部分章节曾因带脚注回目导致标题抽取错误，这里锁定真实回目避免回归。
const lockedHongloumengTitles: Array<[string, string]> = [
  ['005', '第五回　開生面夢演紅樓夢　立新場情傳幻境情'],
  ['007', '第七回　送宮花周瑞嘆英蓮　談肄業秦鐘結寶玉'],
  ['008', '第八回　薛寶釵小恙梨香院　賈寶玉大醉絳芸軒'],
  ['009', '第九回　戀風流情友入家塾　起嫌疑頑童鬧學堂'],
  ['017', '第十七回　會芳園試才題對額　賈寶玉機敏動諸賓'],
  ['018', '第十八回　林黛玉誤剪香囊袋　賈元春歸省慶元宵'],
  ['030', '第三十回　寶釵借扇机帶雙敲　齡官划薔痴及局外'],
];

for (const [chapter, title] of lockedHongloumengTitles) {
  const chapterHtml = readFileSync(join(DIST, 'book', 'hongloumeng', `${chapter}.html`), 'utf-8');
  check(chapterHtml.includes(title), `/book/hongloumeng/${chapter}.html 标题未锁定为正确回目`);
}

const xiyouji61Html = readFileSync(join(DIST, 'book', 'xiyouji', '061.html'), 'utf-8');
check(xiyouji61Html.includes('第六十一回 豬八戒助力破魔王　孫行者三調芭蕉扇'), '/book/xiyouji/061.html 标题未清理为可读回目');
check(!xiyouji61Html.includes('{{另|'), '/book/xiyouji/061.html 仍残留维基模板标记');

// 构建产物里应包含可下载的 EPUB 文件
const epubFiles = ['hongloumeng', 'sanguoyanyi', 'xiyouji', 'sanxiawuyi', 'shuoyuequanzhuan'];
for (const slug of epubFiles) {
  const epubFile = join(DIST, 'epub', `${slug}.epub`);
  check(existsSync(epubFile), `缺少 EPUB 文件: /epub/${slug}.epub`);
  if (existsSync(epubFile)) {
    check(statSync(epubFile).size > 1024, `/epub/${slug}.epub 体积异常，可能生成失败`);
  }
}

// 检查关键页面存在
const requiredPages = [
  'index.html',
  '404.html',
  'about.html',
  'category.html',
  'reading.html',
  'search.html',
  'about/copyright.html',
];
for (const page of requiredPages) {
  check(existsSync(join(DIST, page)), `缺少页面: ${page}`);
}

check(existsSync(join(DIST, 'favicon.svg')), '缺少站点图标: favicon.svg');

// 首页需要具备读书馆入口模块
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
check(indexHtml.includes('馆长推荐'), '首页缺少 馆长推荐 模块');
check(indexHtml.includes('名著必读'), '首页缺少 名著必读 模块');
check(indexHtml.includes('最近入藏'), '首页缺少 最近入藏 模块');
check(indexHtml.includes('怎么逛这座小馆'), '首页缺少 怎么逛这座小馆');
check(indexHtml.includes('按兴趣进入'), '首页缺少 按兴趣进入');
check(indexHtml.includes('馆藏地图'), '首页缺少 馆藏地图');
check(indexHtml.includes('已整理章节'), '首页缺少 已整理章节 统计');
check(indexHtml.includes('已整理正文'), '首页缺少 已整理正文 统计');
check(indexHtml.includes('核心馆藏进展'), '首页缺少 核心馆藏进展 模块');
check(indexHtml.includes('已整理到第'), '首页书架卡片缺少 已整理到第 文案');
check(indexHtml.includes('可连读到第'), '首页书架卡片缺少 可连读到第 文案');

const readingHtml = readFileSync(join(DIST, 'reading.html'), 'utf-8');
check(readingHtml.includes('我的阅读'), '我的阅读页缺少 我的阅读 标题');
check(readingHtml.includes('继续阅读中的书'), '我的阅读页缺少 继续阅读中的书 模块');
check(readingHtml.includes('最近书签'), '我的阅读页缺少 最近书签 模块');
check(readingHtml.includes('最近足迹'), '我的阅读页缺少 最近足迹 模块');

// 分类页需要升级成分馆页
const categoryIndexHtml = readFileSync(join(DIST, 'category.html'), 'utf-8');
check(categoryIndexHtml.includes('分馆浏览'), '分类总览页缺少 分馆浏览 标题');
check(categoryIndexHtml.includes('怎么选馆'), '分类总览页缺少 怎么选馆');
check(categoryIndexHtml.includes('推荐逛法'), '分类总览页缺少 推荐逛法');
check(categoryIndexHtml.includes('适合谁'), '分类总览页缺少 适合谁');

const worldlyHallHtml = readFileSync(join(DIST, 'category', '世情小说.html'), 'utf-8');
check(worldlyHallHtml.includes('分类简介'), '分类页缺少 分类简介');
check(worldlyHallHtml.includes('代表作品'), '分类页缺少 代表作品');
check(worldlyHallHtml.includes('阅读建议'), '分类页缺少 阅读建议');
check(worldlyHallHtml.includes('适合谁读'), '分类页缺少 适合谁读');
check(worldlyHallHtml.includes('入馆路线'), '分类页缺少 入馆路线');
check(worldlyHallHtml.includes('邻馆串逛'), '分类页缺少 邻馆串逛');
check(worldlyHallHtml.includes('已整理到第'), '分类页书卡缺少 已整理到第 文案');
check(worldlyHallHtml.includes('可连读到第'), '分类页书卡缺少 可连读到第 文案');

// 作者页需要升级成作者展架页
const authorHtml = readFileSync(join(DIST, 'author', 'caoxueqin.html'), 'utf-8');
check(authorHtml.includes('作者简介'), '作者页缺少 作者简介');
check(authorHtml.includes('推荐阅读顺序'), '作者页缺少 推荐阅读顺序');
check(authorHtml.includes('馆内定位'), '作者页缺少 馆内定位');
check(authorHtml.includes('气质标签'), '作者页缺少 气质标签');
check(authorHtml.includes('从哪本开始'), '作者页缺少 从哪本开始');
check(authorHtml.includes('顺手再逛'), '作者页缺少 顺手再逛');
check(authorHtml.includes('已整理到第'), '作者页书卡缺少 已整理到第 文案');
check(authorHtml.includes('可连读到第'), '作者页书卡缺少 可连读到第 文案');

const fengmenglongHtml = readFileSync(join(DIST, 'author', 'fengmenglong.html'), 'utf-8');
check(!fengmenglongHtml.includes('正在整理中'), '冯梦龙作者页仍在使用兜底文案');

// 专题页与关于页需要存在
check(existsSync(join(DIST, 'topic', 'four-masterpieces.html')), '缺少专题页: 四大名著');
check(existsSync(join(DIST, 'topic', 'strange-tales.html')), '缺少专题页: 志怪传奇');

const topicHtml = readFileSync(join(DIST, 'topic', 'four-masterpieces.html'), 'utf-8');
check(topicHtml.includes('策展缘起'), '专题页缺少 策展缘起');
check(topicHtml.includes('阅读路线'), '专题页缺少 阅读路线');
check(topicHtml.includes('相关分馆'), '专题页缺少 相关分馆');
check(topicHtml.includes('已整理到第'), '专题页书卡缺少 已整理到第 文案');
check(topicHtml.includes('可连读到第'), '专题页书卡缺少 可连读到第 文案');
check(existsSync(join(DIST, 'topic', 'three-yans.html')), '缺少专题页: 三言话本');

if (existsSync(join(DIST, 'topic', 'three-yans.html'))) {
  const threeYansHtml = readFileSync(join(DIST, 'topic', 'three-yans.html'), 'utf-8');
  check(threeYansHtml.includes('相关专题'), '三言专题页缺少 相关专题');
  check(threeYansHtml.includes('作者入口'), '三言专题页缺少 作者入口');
}

const searchHtml = readFileSync(join(DIST, 'search.html'), 'utf-8');
check(searchHtml.includes('分馆浏览') || searchHtml.includes('专题'), '搜索页缺少馆藏导览提示');
check(searchHtml.includes('如果你不知道搜什么'), '搜索页缺少 如果你不知道搜什么');
check(searchHtml.includes('按读法找书'), '搜索页缺少 按读法找书');
check(searchHtml.includes('热门搜词'), '搜索页缺少 热门搜词');
check(searchHtml.includes('从作者进入'), '搜索页缺少 从作者进入');
check(searchHtml.includes('从专题进入'), '搜索页缺少 从专题进入');
check(searchHtml.includes('历史风云'), '搜索页缺少 历史风云');
check(searchHtml.includes('神魔奇想'), '搜索页缺少 神魔奇想');
check(searchHtml.includes('罗贯中'), '搜索页缺少 罗贯中');
check(searchHtml.includes('吴承恩'), '搜索页缺少 吴承恩');
check(searchHtml.includes('许仲琳'), '搜索页缺少 许仲琳');
check(searchHtml.includes('公案侠义'), '搜索页缺少 公案侠义');
check(searchHtml.includes('英雄传奇'), '搜索页缺少 英雄传奇');
check(searchHtml.includes('石玉昆'), '搜索页缺少 石玉昆');
check(searchHtml.includes('施耐庵'), '搜索页缺少 施耐庵');
check(searchHtml.includes('钱彩'), '搜索页缺少 钱彩');

check(existsSync(join(DIST, 'topic', 'historical-epics.html')), '缺少专题页: 历史风云');
check(existsSync(join(DIST, 'topic', 'mythic-realms.html')), '缺少专题页: 神魔奇想');
check(existsSync(join(DIST, 'topic', 'gong-an-heroics.html')), '缺少专题页: 公案侠义');
check(existsSync(join(DIST, 'topic', 'heroic-tales.html')), '缺少专题页: 英雄传奇');

if (existsSync(join(DIST, 'topic', 'historical-epics.html'))) {
  const historicalHtml = readFileSync(join(DIST, 'topic', 'historical-epics.html'), 'utf-8');
  check(historicalHtml.includes('相关专题'), '历史风云专题页缺少 相关专题');
  check(historicalHtml.includes('作者入口'), '历史风云专题页缺少 作者入口');
}

if (existsSync(join(DIST, 'topic', 'mythic-realms.html'))) {
  const mythicHtml = readFileSync(join(DIST, 'topic', 'mythic-realms.html'), 'utf-8');
  check(mythicHtml.includes('相关专题'), '神魔奇想专题页缺少 相关专题');
  check(mythicHtml.includes('作者入口'), '神魔奇想专题页缺少 作者入口');
}

if (existsSync(join(DIST, 'topic', 'gong-an-heroics.html'))) {
  const gongAnHtml = readFileSync(join(DIST, 'topic', 'gong-an-heroics.html'), 'utf-8');
  check(gongAnHtml.includes('相关专题'), '公案侠义专题页缺少 相关专题');
  check(gongAnHtml.includes('作者入口'), '公案侠义专题页缺少 作者入口');
}

if (existsSync(join(DIST, 'topic', 'heroic-tales.html'))) {
  const heroicHtml = readFileSync(join(DIST, 'topic', 'heroic-tales.html'), 'utf-8');
  check(heroicHtml.includes('相关专题'), '英雄传奇专题页缺少 相关专题');
  check(heroicHtml.includes('作者入口'), '英雄传奇专题页缺少 作者入口');
}

// Pagefind 索引存在
check(existsSync(join(DIST, 'pagefind')), 'pagefind/ 索引目录不存在');

// 输出结果
console.log(`\n构建验证: ${checks} 项检查`);
if (errors.length === 0) {
  console.log('✅ 全部通过');
} else {
  console.log(`❌ ${errors.length} 项失败:`);
  for (const e of errors) {
    console.log(`  - ${e}`);
  }
  process.exit(1);
}
