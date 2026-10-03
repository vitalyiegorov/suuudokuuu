import { useAtomValue } from '@effect/atom-react/Hooks';
import { CurrentRunRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const elapsedTimeAtom = databaseQueryAtom(
    [ReactivityKeyEnum.RunClock],
    Effect.flatMap(CurrentRunRepository, currentRunRepository =>
        Effect.map(currentRunRepository.get, run => Option.match(run, { onNone: () => 0, onSome: currentRun => currentRun.elapsedTime }))
    )
);

export const useElapsedTime = () => AsyncResult.getOrElse(useAtomValue(elapsedTimeAtom), () => 0);
