import { CurrentRunRepository, ReactivityKeyEnum, initialCurrentRun } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

export const currentRunAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CurrentRun],
    Effect.flatMap(CurrentRunRepository, currentRunRepository =>
        Effect.map(
            currentRunRepository.get,
            Option.getOrElse(() => initialCurrentRun)
        )
    )
);
