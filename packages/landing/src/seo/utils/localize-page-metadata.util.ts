import { DEFAULT_LOCALE } from '../constants/site.constant';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { LocaleType } from '../types/locale.type';

export const localizePageMetadata = <PageMetadata extends Pick<PageMetadataInterface, 'translations'>>(
    pageMetadata: PageMetadata,
    locale: LocaleType
): PageMetadata => (locale === DEFAULT_LOCALE ? pageMetadata : { ...pageMetadata, ...pageMetadata.translations?.[locale] });
