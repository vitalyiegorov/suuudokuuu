import * as Fiber from 'effect/Fiber';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { gameTimerFocusEffect } from '../../utils/game-timer-focus-effect.util';

export const GameTimerController = () => {
    const { replace } = useRouter();

    useFocusEffect(
        useCallback(() => {
            const timerFiber = appRuntime.runFork(gameTimerFocusEffect(() => void replace('/pause')));

            return () => void appRuntime.runFork(Fiber.interrupt(timerFiber));
        }, [replace])
    );

    return null;
};
