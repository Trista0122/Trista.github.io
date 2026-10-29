import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { splitId } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

/** 取某集合中指定语言的条目（生产环境自动隐藏 draft: true） */
export async function getByLang<C extends CollectionKey>(collection: C, lang: Lang) {
  const all = await getCollection(collection, (entry) => {
    const data = entry.data as { draft?: boolean };
    if (import.meta.env.PROD && data.draft) return false;
    return splitId(entry.id).lang === lang;
  });
  return all as CollectionEntry<C>[];
}

export const slugOf = (entry: { id: string }) => splitId(entry.id).slug;

export async function getProjects(lang: Lang) {
  const list = await getByLang('projects', lang);
  return list.sort((a, b) => {
    const oa = a.data.order ?? Infinity;
    const ob = b.data.order ?? Infinity;
    if (oa !== ob) return oa - ob;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

export async function getNotes(lang: Lang) {
  const list = await getByLang('notes', lang);
  return list.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 某个 slug 在另一种语言下是否存在（不存在就回到列表页） */
export async function hasCounterpart(collection: CollectionKey, slug: string, lang: Lang) {
  const list = await getByLang(collection, lang);
  return list.some((e) => slugOf(e) === slug);
}

/** 粗略估算阅读时长：中文按 400 字/分钟，英文按 220 词/分钟 */
export function readingMinutes(body: string | undefined, lang: Lang) {
  const text = (body ?? '').replace(/```[\s\S]*?```/g, '').replace(/\$\$[\s\S]*?\$\$/g, '');
  const n = lang === 'zh' ? (text.match(/[一-鿿]/g)?.length ?? 0) / 400 : text.split(/\s+/).length / 220;
  return Math.max(1, Math.round(n));
}
