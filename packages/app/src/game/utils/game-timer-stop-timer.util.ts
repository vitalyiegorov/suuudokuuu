import { isDefined } from '@rnw-community/shared';

import type { RefObject } from 'react';

export const gameTimerStopTimer = (timerIntervalRef: RefObject<ReturnType<typeof setInterval> | null>): void => {
    if (isDefined(timerIntervalRef.current)) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
};
