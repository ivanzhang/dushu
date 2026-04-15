import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // 线上正式站点域名，用于 canonical、Open Graph 和 Astro.url。
  site: 'https://dushu.my',
  build: { format: 'file' },
});
