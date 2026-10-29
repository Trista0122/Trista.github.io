import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 所有内容都放在 src/content/<集合>/<语言>/ 下：
 *   src/content/notes/zh/aes-gf28.md   → /notes/aes-gf28/
 *   src/content/notes/en/aes-gf28.md   → /en/notes/aes-gf28/
 * 中英两版文件名保持一致，语言切换时就能跳到对应页面。
 */
const md = (dir: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${dir}` });

/** 首页"关于我"那段自我介绍 */
const about = defineCollection({
  loader: md('about'),
  schema: z.object({}),
});

const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    period: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    /** 数字越小越靠前；不填则按日期倒序 */
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: md('notes'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: md('now'),
  schema: z.object({
    updated: z.coerce.date(),
    location: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: md('reading'),
  schema: z.object({
    title: z.string(),
    creator: z.string(),
    type: z.enum(['book', 'podcast']),
    status: z.enum(['done', 'reading', 'want', 'listening']),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const life = defineCollection({
  loader: md('life'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    emoji: z.string().default('✨'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { about, projects, notes, now, reading, life };
