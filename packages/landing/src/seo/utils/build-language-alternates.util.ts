import { DEFAULT_LOCALE, HREFLANG_DEFAULT_KEY } from '../constants/site.constant';

import { buildLocaleUrl } from './build-locale-url.util';
import { getPageLocales } from './get-page-locales.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const buildLanguageAlternates = (pageMetadata: Pick<PageMetadataInterface, 'path' | 'translations'>): Record<string, string> => ({
    ...Object.fromEntries(getPageLocales(pageMetadata).map(locale => [locale, buildLocaleUrl(locale, pageMetadata.path)])),
    [HREFLANG_DEFAULT_KEY]: buildLocaleUrl(DEFAULT_LOCALE, pageMetadata.path)
});
