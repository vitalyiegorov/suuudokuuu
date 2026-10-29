import '../../utils/i18n-catalogs';
import { useAtomValue } from '@effect/atom-react/Hooks';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { useEffect } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { currentRunAtom } from '../../../game/query/use-current-run.query';
import { settingsAtom } from '../../../settings/query/use-settings.query';
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

        const fiber = Effect.runFork(Effect.tryPromise(hideAppSplashScreen).pipe(Effect.tapCause(logErrorCause), Effect.ignoreCause));

        return () => void Effect.runFork(Fiber.interrupt(fiber));
    }, [isReady, hasFailed]);

    if (hasFailed) {
        return (
            <I18nProvider i18n={i18n}>
                <BootFailure />
            </I18nProvider>
        );
    }

    return isReady ? children : null;
};
