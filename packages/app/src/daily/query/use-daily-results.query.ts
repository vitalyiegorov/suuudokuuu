import { useAtomValue } from '@effect/atom-react/Hooks';
import { CompletedGameRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const dailyResultsAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CompletedGames],
    Effect.flatMap(CompletedGameRepository, completedGameRepository => completedGameRepository.findDailyResults)
);

export const useDailyResults = () => AsyncResult.getOrElse(useAtomValue(dailyResultsAtom), () => []);
