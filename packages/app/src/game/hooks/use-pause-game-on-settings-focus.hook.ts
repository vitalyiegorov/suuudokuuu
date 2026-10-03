import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { useCurrentRun } from '../query/use-current-run.query';

export const usePauseGameOnSettingsFocus = () => {
    const { isPaused, sudokuString } = useCurrentRun();
    const shouldPause = isNotEmptyString(sudokuString) && !isPaused;

    useFocusEffect(
        useCallback(() => {
            if (shouldPause) {
                void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.pause(false)));
            }
        }, [shouldPause])
    );
};
