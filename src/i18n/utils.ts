import { ui, defaultLang, type Lang, type UIKey } from './ui';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 给站内路径加上 base（GitHub Pages 项目站点需要），并保证以 / 结尾 */
export function url(path = '/'): string {
  let p = path.startsWith('/') ? path : `/${path}`;
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p) && !p.includes('#') && !p.includes('?')) p += '/';
  return `${BASE}${p}`;
}

/** 去掉 base，得到形如 /en/notes/xxx/ 的站内路径 */
export function stripBase(pathname: string): string {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  if (!p.startsWith('/')) p = `/${p}`;
  return p;
}

export function getLangFromUrl(u: URL): Lang {
  const p = stripBase(u.pathname);
  return p === '/en' || p.startsWith('/en/') ? 'en' : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** 把"不带语言前缀的路径"转换为某语言下的完整 URL */
export function localizedUrl(path: string, lang: Lang): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return url(lang === defaultLang ? p : `/en${p === '/' ? '/' : p}`);
}

/** 当前页面在另一种语言下的路径（去掉语言前缀后再加上目标语言） */
export function switchLangPath(u: URL, target: Lang): string {
  let p = stripBase(u.pathname);
  if (p === '/en' || p.startsWith('/en/')) p = p.slice(3) || '/';
  return localizedUrl(p, target);
}

export function formatDate(date: Date, lang: Lang, withDay = true): string {
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'numeric' : 'short',
    ...(withDay ? { day: 'numeric' } : {}),
    timeZone: 'UTC',
  });
}

/** content collection 的 id 形如 "zh/aes-gf28"，拆成语言与 slug */
export function splitId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: (lang === 'en' ? 'en' : 'zh') as Lang, slug: rest.join('/') };
}
