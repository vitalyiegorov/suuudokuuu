import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { ProgressTestLayer } from '../progress-test.layer';

import type { PlayerStatsType } from '../../src/player-stats/type/player-stats.type';

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
const playerStats: PlayerStatsType = {
    techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 14, [SolutionTechniqueEnum.XWing]: 2 },
    dailyBestStreak: 6,
    playedDayNumbers: [firstDay, secondDay],
    dailyCompletedDayNumbers: [secondDay]
};

describe('stats repositories', () => {
    it.effect('restores empty stats when a difficulty row is missing', () =>
        Effect.gen(function* () {
            const difficultyStatsRepository = yield* DifficultyStatsRepository;
            const sql = yield* SqlClient.SqlClient;

            yield* sql`DELETE FROM difficulty_stats WHERE difficulty = ${DifficultyEnum.Easy}`;

            const stats = yield* difficultyStatsRepository.findByDifficulty(DifficultyEnum.Easy);

            assert.strictEqual(stats.difficulty, DifficultyEnum.Easy);
            assert.strictEqual(stats.gamesCompleted, 0);
            assert.strictEqual(stats.bestScore, 0);
            assert.strictEqual((yield* difficultyStatsRepository.findAll).length, Object.values(DifficultyEnum).length - 1);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('seed empty stats for every difficulty and overwrite them per difficulty', () =>
        Effect.gen(function* () {
            const difficultyStatsRepository = yield* DifficultyStatsRepository;

            yield* difficultyStatsRepository.save(hardStats);

            assert.strictEqual((yield* difficultyStatsRepository.findAll).length, Object.values(DifficultyEnum).length);
            assert.deepStrictEqual(yield* difficultyStatsRepository.findByDifficulty(DifficultyEnum.Hard), hardStats);
            assert.strictEqual((yield* difficultyStatsRepository.findByDifficulty(DifficultyEnum.Easy)).gamesCompleted, 0);
        }).pipe(Effect.provide(ProgressTestLayer))
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
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
