import { DEFAULT_LOCALE, SITE_ORIGIN } from '../constants/site.constant';

export const buildLocaleUrl = (locale: string, path: string): string => {
    const localePrefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;

    return `${SITE_ORIGIN}${localePrefix}${path}`;
};
