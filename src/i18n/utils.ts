import esDict from './es.json';
import enDict from './en.json';

export const LANGUAGES = {
  es: 'Español',
  en: 'English',
} as const;

export type Locale = keyof typeof LANGUAGES;
export const DEFAULT_LOCALE: Locale = 'es';

type Dictionary = Record<string, unknown>;

const dictionaries: Record<Locale, Dictionary> = {
  es: esDict as Dictionary,
  en: enDict as Dictionary,
};

function collectLeafPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value) || typeof value !== 'object' || value === null) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    collectLeafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

const esLeaves = collectLeafPaths(dictionaries.es);
const enLeaves = collectLeafPaths(dictionaries.en);
const missingInEnglish = esLeaves.filter((key) => !enLeaves.includes(key));
const missingInSpanish = enLeaves.filter((key) => !esLeaves.includes(key));

if (missingInEnglish.length || missingInSpanish.length) {
  throw new Error(
    `[i18n] Dictionary trees must match. Missing in EN: ${missingInEnglish.join(', ')}. Missing in ES: ${missingInSpanish.join(', ')}.`,
  );
}

function getValue(locale: Locale, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = dictionaries[locale];

  for (const segment of keys) {
    value = (value as Dictionary)?.[segment];
  }

  return value;
}

export function useTranslations(locale: Locale) {
  return (key: string): string => {
    const value = getValue(locale, key);

    if (typeof value !== 'string') {
      throw new Error(`[i18n] Expected string translation for "${key}" in ${locale}.`);
    }

    return value;
  };
}

export function getLocalizedArray(locale: Locale, key: string): string[] {
  const value = getValue(locale, key);

  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`[i18n] Expected string array translation for "${key}" in ${locale}.`);
  }

  return value;
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  const lang = segments[0];
  if (lang === 'es' || lang === 'en') return lang as Locale;
  return DEFAULT_LOCALE;
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
