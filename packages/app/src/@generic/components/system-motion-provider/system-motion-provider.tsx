import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { appRuntime } from '../../runtime/app.runtime';
import { logErrorCause } from '../../utils/log-error-cause.util';

import { SystemMotionContext } from './context/system-motion.context';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const SystemMotionProvider = ({ children }: Props) => {
    const [isSystemMotionReduced, setIsSystemMotionReduced] = useState(false);

    useEffect(() => {
        const fiber = appRuntime.runFork(
            Effect.tryPromise(() => AccessibilityInfo.isReduceMotionEnabled()).pipe(
                Effect.tap(isEnabled => Effect.sync(() => void setIsSystemMotionReduced(isEnabled))),
                Effect.tapCause(logErrorCause)
            )
        );
        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', isEnabled => {
            appRuntime.runFork(Fiber.interrupt(fiber));
            setIsSystemMotionReduced(isEnabled);
        });

        return () => {
            appRuntime.runFork(Fiber.interrupt(fiber));
            subscription.remove();
        };
    }, []);

    return <SystemMotionContext value={isSystemMotionReduced}>{children}</SystemMotionContext>;
};
