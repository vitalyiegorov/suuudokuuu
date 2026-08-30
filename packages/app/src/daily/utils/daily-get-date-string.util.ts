const HoursPerDay = 24;
const MinutesPerHour = 60;
const SecondsPerMinute = 60;
const MillisecondsPerSecond = 1000;
const DayInMilliseconds = HoursPerDay * MinutesPerHour * SecondsPerMinute * MillisecondsPerSecond;
const DateStringLength = 10;

export const dailyGetDateString = (dayNumber: number): string =>
    new Date(dayNumber * DayInMilliseconds).toISOString().slice(0, DateStringLength);
