import { initialCurrentRun } from '@suuudokuuu/progress';
import * as Option from 'effect/Option';
import { useEffect, useState } from 'react';

import { runCurrentRunCommand } from '../../game/utils/run-current-run-command.util';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useResetGame = (): CurrentRunType | null => {
    const [finishedRun, setFinishedRun] = useState<CurrentRunType | null>(null);

    useEffect(
        () =>
            void runCurrentRunCommand(currentRunService => currentRunService.reset).then(
                run => void setFinishedRun(Option.getOrElse(run, () => initialCurrentRun))
            ),
        []
    );

    return finishedRun;
};
