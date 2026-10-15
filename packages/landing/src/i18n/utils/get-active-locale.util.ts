import { getI18n } from '@lingui/react/server';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../../seo/constants/site.constant';

import type { LocaleType } from '../../seo/types/locale.type';

export const getActiveLocale = (): LocaleType => {
    const activeLocale = getI18n()?.i18n.locale;

    return SUPPORTED_LOCALES.find(locale => locale === activeLocale) ?? DEFAULT_LOCALE;
};
