// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages 地址：仓库 Trista0122/Trista0122.github.io 是"用户站点"，
// 直接部署在域名根目录 https://trista0122.github.io/，因此 base 为 '/'。
// 站内链接统一通过 src/i18n/utils.ts 的 url() 生成，以后若改回项目站点只需改这里。
const site = 'https://trista0122.github.io';
const base = '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en' } },
    }),
  ],
  markdown: {
    // 使用 remark/rehype 流水线，以便接入 KaTeX 数学公式（.md 与 .mdx 共用）
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      // 关闭 SmartyPants：它会把中文里的直引号转成方向错误的弯引号
      smartypants: false,
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
  prefetch: true,
});
