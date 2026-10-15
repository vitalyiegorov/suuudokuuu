import { PAGE_DATE_FORMAT_OPTIONS, PAGE_DATE_LOCALE } from '../constants/page-date.constant';
import { DEFAULT_LOCALE } from '../constants/site.constant';

import type { LocaleType } from '../types/locale.type';

export const formatPageDate = (isoDate: string, locale: LocaleType): string =>
    new Intl.DateTimeFormat(locale === DEFAULT_LOCALE ? PAGE_DATE_LOCALE : locale, PAGE_DATE_FORMAT_OPTIONS).format(new Date(isoDate));
