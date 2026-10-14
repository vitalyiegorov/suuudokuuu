import { DEFAULT_LOCALE } from '../constants/site.constant';

export const buildLocalePath = (locale: string, path: string): string => {
    if (locale === DEFAULT_LOCALE) {
        return path;
    }

    const localePrefix = `/${locale.toLowerCase()}`;

    return path === '/' ? localePrefix : `${localePrefix}${path}`;
};
