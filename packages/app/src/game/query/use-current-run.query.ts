import { useAtomValue } from '@effect/atom-react/Hooks';
import { CurrentRunRepository, ReactivityKeyEnum, initialCurrentRun } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

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

export const useCurrentRun = () => AsyncResult.getOrElse(useAtomValue(currentRunAtom), () => initialCurrentRun);
