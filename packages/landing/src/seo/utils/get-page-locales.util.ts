import { isDefined } from '@rnw-community/shared';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../constants/site.constant';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { LocaleType } from '../types/locale.type';

export const getPageLocales = ({ translations }: Pick<PageMetadataInterface, 'translations'>): LocaleType[] =>
    SUPPORTED_LOCALES.filter(locale => locale === DEFAULT_LOCALE || isDefined(translations?.[locale]));
