import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://mochao.example.com',
  build: { format: 'file' },
});
