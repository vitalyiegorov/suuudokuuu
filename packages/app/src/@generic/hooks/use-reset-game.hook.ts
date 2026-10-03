import { CurrentRunService, initialCurrentRun } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { useEffect, useState } from 'react';

import { appRuntime } from '../runtime/app.runtime';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useResetGame = (): CurrentRunType | null => {
    const [finishedRun, setFinishedRun] = useState<CurrentRunType | null>(null);

    useEffect(
        () =>
            void appRuntime
                .runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.reset))
                .then(run => void setFinishedRun(Option.getOrElse(run, () => initialCurrentRun))),
        []
    );

    return finishedRun;
};
