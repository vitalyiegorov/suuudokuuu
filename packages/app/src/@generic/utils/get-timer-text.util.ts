import { MillisecondsPerSecond, SecondsPerDay, SecondsPerHour, SecondsPerMinute } from '../constants/time.constant';

interface TimerTextLabelsInterface {
    readonly day: string;
    readonly hour: string;
    readonly minute: string;
}

const DefaultTimerTextLabels: TimerTextLabelsInterface = {
    day: 'd',
    hour: 'h',
    minute: 'm'
};

// eslint-disable-next-line no-undefined
const dtfMS = new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    hour12: false,
    minute: '2-digit',
    second: '2-digit'
});

export const getTimerText = (timeInSeconds: number, labels = DefaultTimerTextLabels): string => {
    const normalizedSeconds = Math.max(0, Math.floor(timeInSeconds));

    if (normalizedSeconds >= SecondsPerDay) {
        const days = Math.floor(normalizedSeconds / SecondsPerDay);
        const remainingSeconds = normalizedSeconds % SecondsPerDay;
        const hours = Math.floor(remainingSeconds / SecondsPerHour);

        return `${days}${labels.day} ${hours}${labels.hour}`;
    }

    if (normalizedSeconds >= SecondsPerHour) {
        const hours = Math.floor(normalizedSeconds / SecondsPerHour);
        const remainingSeconds = normalizedSeconds % SecondsPerHour;
        const minutes = Math.floor(remainingSeconds / SecondsPerMinute);

        return `${hours}${labels.hour} ${minutes}${labels.minute}`;
    }

    const date = new Date(normalizedSeconds * MillisecondsPerSecond);

    return dtfMS.format(date);
};
