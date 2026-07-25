import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameTimerRunFocusEffect } from '../../utils/game-timer-focus-effect.util';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

export const GameTimerController = () => {
    const { replace } = useRouter();
    const dispatch = useAppDispatch();
    const hasHandledBackgroundRef = useRef(false);
    const timerIntervalRef = useRef<SetIntervalRef>(null);

    useFocusEffect(
        useCallback(() => gameTimerRunFocusEffect({ dispatch, hasHandledBackgroundRef, replace, timerIntervalRef }), [dispatch, replace])
    );

    return null;
};
