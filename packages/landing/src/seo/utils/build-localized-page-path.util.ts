import { getActiveLocale } from '../../i18n/utils/get-active-locale.util';

import { buildLocalePath } from './build-locale-path.util';
import { getPageLocales } from './get-page-locales.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const buildLocalizedPagePath = (pageMetadata: Pick<PageMetadataInterface, 'path' | 'translations'>): string => {
    const locale = getActiveLocale();

    return getPageLocales(pageMetadata).includes(locale) ? buildLocalePath(locale, pageMetadata.path) : pageMetadata.path;
};
