import type { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../constants/site.constant';

export type LocaleType = (typeof SUPPORTED_LOCALES)[number];

export type TranslatedLocaleType = Exclude<LocaleType, typeof DEFAULT_LOCALE>;
