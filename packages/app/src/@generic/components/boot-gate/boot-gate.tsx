import { useAtomValue } from '@effect/atom-react/Hooks';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { useEffect } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { currentRunAtom } from '../../../game/query/use-current-run.query';
import { settingsAtom } from '../../../settings/query/use-settings.query';
import { appRuntime } from '../../runtime/app.runtime';
import { hideAppSplashScreen } from '../../utils/hide-app-splash-screen';
import { logErrorCause } from '../../utils/log-error-cause.util';
import { BootFailure } from '../boot-failure/boot-failure';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const BootGate = ({ children }: Props) => {
    const settingsResult = useAtomValue(settingsAtom);
    const currentRunResult = useAtomValue(currentRunAtom);
    const isReady = AsyncResult.isSuccess(settingsResult) && AsyncResult.isSuccess(currentRunResult);
    const hasFailed = AsyncResult.isFailure(settingsResult) || AsyncResult.isFailure(currentRunResult);

    useEffect(() => {
        if (!isReady && !hasFailed) {
            return emptyFn;
        }

        const fiber = appRuntime.runFork(Effect.tryPromise(hideAppSplashScreen).pipe(Effect.tapCause(logErrorCause), Effect.ignoreCause));

        return () => void appRuntime.runFork(Fiber.interrupt(fiber));
    }, [isReady, hasFailed]);

    if (hasFailed) {
        return <BootFailure />;
    }

    return isReady ? children : null;
};
