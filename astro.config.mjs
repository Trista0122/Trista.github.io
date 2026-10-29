// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages 地址。
// 在 GitHub Actions 中由 actions/configure-pages 自动注入 SITE / BASE，
// 本地开发时使用下面的默认值。
// 当前仓库名为 Trista.github.io（属于账号 Trista0122），因此是"项目站点"：
//   https://trista0122.github.io/Trista.github.io/
// 如果以后把仓库改名为 trista0122.github.io（用户站点），BASE 会自动变成 "/"。
const site = process.env.SITE || 'https://trista0122.github.io';
const base = process.env.BASE ?? '/Trista.github.io';

export default defineConfig({
  site,
  base: base || '/',
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
