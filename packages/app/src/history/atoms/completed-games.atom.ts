import { CompletedGameRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

export const completedGamesAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CompletedGames],
    Effect.flatMap(CompletedGameRepository, completedGameRepository => completedGameRepository.findAll)
);
