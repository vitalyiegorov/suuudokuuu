import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';

import { DifficultyStatsRepository } from '../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../src/player-stats/repository/player-stats.repository';

import { ContractsTestLayer } from './contracts-test.layer';

import type { PlayerStatsSchema } from '../src/player-stats/schema/player-stats.schema';

const firstDay = 20_400;
const secondDay = 20_401;
const hardStats = {
    difficulty: DifficultyEnum.Hard,
    gamesCompleted: 12,
    gamesWon: 9,
    gamesWonWithoutMistakes: 4,
    gamesLost: 3,
    bestScore: 4200,
    bestRating: 4.4,
    isBestRatingCeiling: true,
    bestTime: 310,
    averageTime: 455.5,
    hardcoreWon: 2,
    challengesWon: 1,
    challengesLost: 1
};
const playerStats: typeof PlayerStatsSchema.Type = {
    techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 14, [SolutionTechniqueEnum.XWing]: 2 },
    dailyBestStreak: 6,
    playedDayNumbers: [firstDay, secondDay],
    dailyCompletedDayNumbers: [secondDay]
};

describe('stats repositories', () => {
    it.effect('overwrite difficulty stats per difficulty', () =>
        Effect.gen(function* () {
            const difficultyStatsRepository = yield* DifficultyStatsRepository;

            yield* difficultyStatsRepository.save(hardStats);
            yield* difficultyStatsRepository.save({ ...hardStats, gamesCompleted: 13 });

            assert.deepStrictEqual(yield* difficultyStatsRepository.findAll, [{ ...hardStats, gamesCompleted: 13 }]);
        }).pipe(Effect.provide(ContractsTestLayer))
    );

    it.effect('start player stats empty and round-trip them', () =>
        Effect.gen(function* () {
            const playerStatsRepository = yield* PlayerStatsRepository;

            assert.deepStrictEqual(yield* playerStatsRepository.get, {
                techniqueUsageCounts: {},
                dailyBestStreak: 0,
                playedDayNumbers: [],
                dailyCompletedDayNumbers: []
            });

            yield* playerStatsRepository.save(playerStats);

            assert.deepStrictEqual(yield* playerStatsRepository.get, playerStats);
        }).pipe(Effect.provide(ContractsTestLayer))
    );
});
