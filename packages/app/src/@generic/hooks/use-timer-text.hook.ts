import { useLingui } from '@lingui/react/macro';

import { SecondsPerDay, SecondsPerHour, SecondsPerMinute } from '../constants/time.constant';

export const useTimerText = (timeInSeconds: number): string => {
    const { t, i18n } = useLingui();
    const normalizedSeconds = Math.max(0, Math.floor(timeInSeconds));

    if (normalizedSeconds >= SecondsPerDay) {
        const days = Math.floor(normalizedSeconds / SecondsPerDay);
        const hours = Math.floor((normalizedSeconds % SecondsPerDay) / SecondsPerHour);

        return `${days}${t`d`} ${hours}${t`h`}`;
    }

    if (normalizedSeconds >= SecondsPerHour) {
        const hours = Math.floor(normalizedSeconds / SecondsPerHour);
        const minutes = Math.floor((normalizedSeconds % SecondsPerHour) / SecondsPerMinute);

        return `${hours}${t`h`} ${minutes}${t`m`}`;
    }

    return new Intl.DateTimeFormat(i18n.locale, {
        timeZone: 'UTC',
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(normalizedSeconds * 1000));
};
