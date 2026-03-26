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
}

// 书籍详情页有 Book JSON-LD
const bookPages = ['sanguoyanyi', 'hongloumeng', 'xiyouji'];
for (const slug of bookPages) {
  const file = join(DIST, 'book', `${slug}.html`);
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf-8');
    check(content.includes('"@type":"Book"') || content.includes('"@type": "Book"'),
      `/book/${slug}.html 缺少 Book JSON-LD`);
  } else {
    errors.push(`/book/${slug}.html 不存在`);
  }
}

// 检查关键页面存在
const requiredPages = [
  'index.html',
  '404.html',
  'search.html',
  'about/copyright.html',
];
for (const page of requiredPages) {
  check(existsSync(join(DIST, page)), `缺少页面: ${page}`);
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
