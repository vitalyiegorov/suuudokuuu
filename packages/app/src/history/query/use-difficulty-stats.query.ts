import { DifficultyStatsRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { useLiveAtomValue } from '../../@generic/hooks/use-live-atom-value.hook';
import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const difficultyStatsAtom = databaseQueryAtom(
    [ReactivityKeyEnum.DifficultyStats],
    Effect.flatMap(DifficultyStatsRepository, difficultyStatsRepository => difficultyStatsRepository.findAll)
);

export const useDifficultyStats = () => AsyncResult.getOrElse(useLiveAtomValue(difficultyStatsAtom), () => []);
