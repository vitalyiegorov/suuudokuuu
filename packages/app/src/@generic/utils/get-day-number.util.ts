const HoursPerDay = 24;
const DayInMilliseconds = HoursPerDay * 60 * 60 * 1000;

export const getDayNumber = (timestamp: number): number => {
    const date = new Date(timestamp);

    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DayInMilliseconds;
};
