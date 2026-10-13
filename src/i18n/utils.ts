import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';

export { languages, defaultLang };
export type { Lang, UIKey };

export const locales: Lang[] = ['fr', 'en'];

export function isLang(value: string | undefined): value is Lang {
  return value === 'fr' || value === 'en';
}

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  return isLang(maybeLang) ? maybeLang : defaultLang;
}

export function useTranslations(lang: Lang) {
  const dictionary = ui[lang] as Record<string, string>;
  const fallback = ui[defaultLang] as Record<string, string>;
  return function t(key: UIKey | string): string {
    return dictionary[key] ?? fallback[key] ?? String(key);
  };
}

/** Builds an absolute path for a locale, e.g. localize('en', '/providers/') -> '/en/providers/' */
export function localize(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${lang}/`;
  return `/${lang}${clean}`;
}

/** Same path, other locale — used by the language switcher. */
export function switchLocalePath(currentPath: string, target: Lang): string {
  const parts = currentPath.split('/').filter(Boolean);
  if (isLang(parts[0])) {
    parts[0] = target;
  } else {
    parts.unshift(target);
  }
  return `/${parts.join('/')}${currentPath.endsWith('/') ? '/' : ''}`;
}

/** Reads a bilingual field such as description_fr / description_en. */
export function bilingual<T extends Record<string, any>>(
  data: T,
  field: string,
  lang: Lang
): string {
  const localized = data[`${field}_${lang}`];
  if (typeof localized === 'string' && localized.length > 0) return localized;
  const fallback = data[`${field}_${defaultLang}`];
  return typeof fallback === 'string' ? fallback : '';
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function accessTypeLabel(lang: Lang, type: string): string {
  const t = useTranslations(lang);
  return t(`access.${type}`);
}

export function modelLabel(lang: Lang, model: string): string {
  const t = useTranslations(lang);
  return t(`model.${model}`);
}

export function categoryLabel(lang: Lang, category: string): string {
  const t = useTranslations(lang);
  return t(`category.${category}`);
}

export function newsTypeLabel(lang: Lang, type: string): string {
  const t = useTranslations(lang);
  return t(`newstype.${type}`);
}
