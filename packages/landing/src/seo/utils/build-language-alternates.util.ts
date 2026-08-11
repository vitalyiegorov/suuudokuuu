import { DEFAULT_LOCALE, HREFLANG_DEFAULT_KEY, SUPPORTED_LOCALES } from '../constants/site.constant';

import { buildLocaleUrl } from './build-locale-url.util';

export const buildLanguageAlternates = (path: string): Record<string, string> => ({
    ...Object.fromEntries(SUPPORTED_LOCALES.map(locale => [locale, buildLocaleUrl(locale, path)])),
    [HREFLANG_DEFAULT_KEY]: buildLocaleUrl(DEFAULT_LOCALE, path)
});
