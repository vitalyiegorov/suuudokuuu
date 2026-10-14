import { notFound } from 'next/navigation';

import { isDefined } from '@rnw-community/shared';

import { SUPPORTED_LOCALES } from '../constants/site.constant';

import type { LocaleType } from '../types/locale.type';

export const resolveLocaleSegment = (segment: string): LocaleType => {
    const locale = SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.toLowerCase() === segment);

    return isDefined(locale) ? locale : notFound();
};
