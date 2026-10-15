import { DEFAULT_LOCALE } from '../constants/site.constant';

import { getPageLocales } from './get-page-locales.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const buildLocaleStaticParams = (pageMetadata: Pick<PageMetadataInterface, 'translations'>): Array<{ locale: string }> =>
    getPageLocales(pageMetadata)
        .filter(locale => locale !== DEFAULT_LOCALE)
        .map(locale => ({ locale: locale.toLowerCase() }));
