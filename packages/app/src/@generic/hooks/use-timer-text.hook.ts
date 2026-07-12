import { useLingui } from '@lingui/react/macro';

import { getTimerText } from '../utils/get-timer-text.util';

export const useTimerText = (timeInSeconds: number): string => {
    const { t } = useLingui();
    const labels = {
        day: t`d`,
        hour: t`h`,
        minute: t`m`
    };

    return getTimerText(timeInSeconds, labels);
};
