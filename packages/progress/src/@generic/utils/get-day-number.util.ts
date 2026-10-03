const DayInMilliseconds = 86_400_000;

export const getDayNumber = (timestamp: number): number => {
    const date = new Date(timestamp);

    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DayInMilliseconds;
};
