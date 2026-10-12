import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { emptyFn, isNotEmptyString } from '@rnw-community/shared';

import { PageHead } from '../../../@generic/components/page-head/page-head';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { SettingsPageContent } from '../../../settings/component/settings-page-content/settings-page-content';

export const GameSettingsScreen = () => {
    const { isPaused, sudokuString } = useCurrentRun();
    const shouldPause = isNotEmptyString(sudokuString) && !isPaused;

    useFocusEffect(
        useCallback(() => {
            if (!shouldPause) {
                return emptyFn;
            }

            const pauseFiber = appRuntime.runFork(
                Effect.flatMap(CurrentRunService, currentRunService => currentRunService.pause(false)).pipe(
                    Effect.uninterruptible,
                    Effect.tapCause(logErrorCause)
                )
            );

            return () => void pauseFiber.interruptUnsafe();
        }, [shouldPause])
    );

    return (
        <>
            <PageHead isNoIndex />

            <SettingsPageContent />
        </>
    );
};
