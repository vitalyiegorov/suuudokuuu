const dtfHMS = new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});

const dtfMS = new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    hour12: false,
    minute: '2-digit',
    second: '2-digit'
});

export const getTimerText = (timeInSeconds: number): string => {
    const date = new Date(timeInSeconds * 1000);

    return timeInSeconds >= 3600 ? dtfHMS.format(date) : dtfMS.format(date);
};
