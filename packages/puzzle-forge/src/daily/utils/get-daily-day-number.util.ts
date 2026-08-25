import { DAILY_MILLISECONDS_PER_DAY } from '../../@generic/constants/daily-challenge.constant';

export const getDailyDayNumber = (dateString: string): number =>
    Math.floor(Date.parse(`${dateString}T00:00:00.000Z`) / DAILY_MILLISECONDS_PER_DAY);
