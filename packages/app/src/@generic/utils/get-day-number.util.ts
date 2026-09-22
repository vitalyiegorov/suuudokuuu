import { MillisecondsPerSecond, SecondsPerDay } from '../constants/time.constant';

const DayInMilliseconds = SecondsPerDay * MillisecondsPerSecond;

export const getDayNumber = (timestamp: number): number => {
    const date = new Date(timestamp);

    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DayInMilliseconds;
};
