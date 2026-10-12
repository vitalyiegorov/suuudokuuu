import { CurrentRunService, initialCurrentRun } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Option from 'effect/Option';
import { useEffect, useState } from 'react';

import { appRuntime } from '../runtime/app.runtime';
import { logErrorCause } from '../utils/log-error-cause.util';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useResetGame = (): CurrentRunType | null => {
    const [finishedRun, setFinishedRun] = useState<CurrentRunType | null>(null);

    useEffect(() => {
        const fiber = appRuntime.runFork(
            Effect.flatMap(CurrentRunService, currentRunService => currentRunService.reset).pipe(
                Effect.uninterruptible,
                Effect.tap(run => Effect.sync(() => void setFinishedRun(Option.getOrElse(run, () => initialCurrentRun)))),
                Effect.tapCause(logErrorCause)
            )
        );

        return () => void appRuntime.runFork(Fiber.interrupt(fiber));
    }, []);

    return finishedRun;
};
