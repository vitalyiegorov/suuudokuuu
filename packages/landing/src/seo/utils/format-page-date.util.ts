import { PAGE_DATE_FORMAT_OPTIONS, PAGE_DATE_LOCALE } from '../constants/page-date.constant';

export const formatPageDate = (isoDate: string): string =>
    new Intl.DateTimeFormat(PAGE_DATE_LOCALE, PAGE_DATE_FORMAT_OPTIONS).format(new Date(isoDate));
