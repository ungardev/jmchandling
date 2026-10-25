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

export function getLocalizedObject<T extends Record<string, unknown>>(locale: Locale, key: string): T {
  const value = getValue(locale, key);

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`[i18n] Expected object translation for "${key}" in ${locale}.`);
  }

  return value as T;
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  const lang = segments[0];
  if (lang === 'es' || lang === 'en') return lang as Locale;
  return DEFAULT_LOCALE;
}

/**
 * Slug translation between locales. The two locales do not share slug names,
 * so `/es/contacto` must become `/en/contact` — not `/en/contacto`.
 * Add a row here whenever a page is created in both locales.
 */
export const ROUTE_SLUGS: Record<string, Record<Locale, string>> = {
  servicios: { es: 'servicios', en: 'services' },
  contacto: { es: 'contacto', en: 'contact' },
  cotizacion: { es: 'cotizacion', en: 'quote' },
  'sobre-jmc': { es: 'sobre-jmc', en: 'about-jmc' },
};

function translateSlug(slug: string, from: Locale, to: Locale): string {
  const entry = Object.values(ROUTE_SLUGS).find((row) => row[from] === slug);
  if (!entry) return slug;
  return entry[to] ?? slug;
}

export function switchLocalePath(currentPath: string, target: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  let current: Locale = DEFAULT_LOCALE;

  if (segments[0] === 'es' || segments[0] === 'en') {
    current = segments[0] as Locale;
    segments[0] = target;
  } else {
    segments.unshift(target);
  }

  if (segments[1]) {
    segments[1] = translateSlug(segments[1], current, target);
  }

  const newPath = '/' + segments.join('/');
  return newPath || `/${target}`;
}

/**
 * Alternates for hreflang. The trailing slash is preserved so that
 * `/es/` and `/en/` do not resolve to `/es` and `/en`, which would be a
 * different URL than the canonical one emitted for the home page.
 */
export function getAlternateUrls(currentPath: string, locale: Locale) {
  // Solo la home lleva barra final; el resto de rutas se dejan intactas.
  const isHome = currentPath === `/${locale}` || currentPath === `/${locale}/`;

  const alternate = (target: Locale) => {
    const path = switchLocalePath(currentPath, target);
    if (!isHome) return path;
    return path.endsWith('/') ? path : `${path}/`;
  };

  return {
    en: alternate('en'),
    es: alternate('es'),
    xDefault: alternate(locale === 'en' ? 'en' : 'es'),
  };
}
