import esDict from './es.json';
import enDict from './en.json';

export const LANGUAGES = {
  es: 'Español',
  en: 'English',
} as const;

export type Locale = keyof typeof LANGUAGES;
export const DEFAULT_LOCALE: Locale = 'es';

const dictionaries = {
  es: esDict as Record<string, unknown>,
  en: enDict as Record<string, unknown>,
};

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  const lang = segments[0];
  if (lang === 'es' || lang === 'en') return lang as Locale;
  return DEFAULT_LOCALE;
}

export function useTranslations(locale: Locale) {
  return (key: string): string => {
    const dict = dictionaries[locale];
    const keys = key.split('.');
    let value: unknown = dict;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : key;
  };
}

export function switchLocalePath(currentPath: string, target: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments[0] === 'es' || segments[0] === 'en') {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  const newPath = '/' + segments.join('/');
  return newPath || `/${target}`;
}

export function getAlternateUrls(currentPath: string, locale: Locale) {
  return {
    en: switchLocalePath(currentPath, 'en'),
    es: switchLocalePath(currentPath, 'es'),
    xDefault: switchLocalePath(currentPath, locale === 'en' ? 'en' : 'es'),
  };
}
