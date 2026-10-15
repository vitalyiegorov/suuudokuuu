const DAILY_MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const formatDailyMonth = (month: string): string => DAILY_MONTH_FORMAT.format(new Date(`${month}-01T00:00:00.000Z`));
