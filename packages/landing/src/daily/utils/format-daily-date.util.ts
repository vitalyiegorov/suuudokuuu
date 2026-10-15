const DAILY_DATE_FORMAT = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const formatDailyDate = (date: string): string => DAILY_DATE_FORMAT.format(new Date(`${date}T00:00:00.000Z`));
