import { dailyGetDateString } from './daily-get-date-string.util';

export const dailyGetDateText = (dayNumber: number, locale: string): string => {
    const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', weekday: 'short' });

    return formatter.format(new Date(dailyGetDateString(dayNumber)));
};
