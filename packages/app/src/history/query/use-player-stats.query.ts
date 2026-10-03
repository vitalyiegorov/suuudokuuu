import { PlayerStatsRepository, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { useLiveAtomValue } from '../../@generic/hooks/use-live-atom-value.hook';
import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

import type { PlayerStatsType } from '@suuudokuuu/progress';

const emptyPlayerStats: PlayerStatsType = {
    techniqueUsageCounts: {},
    dailyBestStreak: 0,
    playedDayNumbers: [],
    dailyCompletedDayNumbers: []
};

const playerStatsAtom = databaseQueryAtom(
    [ReactivityKeyEnum.PlayerStats],
    Effect.flatMap(PlayerStatsRepository, playerStatsRepository => playerStatsRepository.get)
);

export const usePlayerStats = () => AsyncResult.getOrElse(useLiveAtomValue(playerStatsAtom), () => emptyPlayerStats);
