import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as TestClock from 'effect/testing/TestClock';

import { getDayNumber } from '../../src/@generic/utils/get-day-number.util';
import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { CurrentRunFinishService } from '../../src/current-run/service/current-run-finish.service';
import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { ProgressTestLayer } from '../progress-test.layer';

import { getRun, saveRun } from './current-run-fixture';

const dayInMilliseconds = 86_400_000;
const firstDayMs = 1_728_000_000_000;
const firstDay = getDayNumber(firstDayMs);

const finishRun = (run: Parameters<typeof saveRun>[0], isWon: boolean, isChallenge = false) =>
    Effect.gen(function* () {
        const currentRunFinishService = yield* CurrentRunFinishService;

        yield* saveRun(run);
        yield* currentRunFinishService.finish(isWon, isChallenge);
    });

describe('CurrentRunFinishService', () => {
    it.effect('records wins, personal bests, best rating, the replay and the daily streak', () =>
        Effect.gen(function* () {
            yield* TestClock.setTime(firstDayMs);
            yield* finishRun({ score: 500, elapsedTime: 100, rating: 3.4, dailyDayNumber: firstDay }, true);

            assert.deepInclude(yield* getRun, { hasNewPersonalBestScore: true, isPaused: true, shouldResumeOnFocus: false });

            yield* TestClock.setTime(firstDayMs + dayInMilliseconds);
            yield* finishRun(
                { score: 300, elapsedTime: 50, rating: 2, mistakes: 1, maxMistakes: 0, dailyDayNumber: firstDay + 1 },
                true,
                true
            );

            assert.isFalse((yield* getRun).hasNewPersonalBestScore);
            assert.deepInclude(
                yield* Effect.flatMap(DifficultyStatsRepository, repository => repository.findByDifficulty(DifficultyEnum.Medium)),
                {
                    gamesCompleted: 2,
                    gamesWon: 2,
                    gamesWonWithoutMistakes: 1,
                    hardcoreWon: 1,
                    challengesWon: 1,
                    bestScore: 500,
                    bestTime: 50,
                    averageTime: 75,
                    bestRating: 3.4
                }
            );
            assert.deepStrictEqual(
                (yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll)).map(game => game.score),
                [300, 500]
            );
            assert.deepInclude(yield* Effect.flatMap(PlayerStatsRepository, repository => repository.get), {
                playedDayNumbers: [firstDay, firstDay + 1],
                dailyCompletedDayNumbers: [firstDay, firstDay + 1],
                dailyBestStreak: 2
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('records losses without a replay, a daily record or a personal best', () =>
        Effect.gen(function* () {
            yield* TestClock.setTime(firstDayMs);
            yield* finishRun({ score: 900, dailyDayNumber: firstDay }, false, true);

            assert.isFalse((yield* getRun).hasNewPersonalBestScore);
            assert.deepInclude(
                yield* Effect.flatMap(DifficultyStatsRepository, repository => repository.findByDifficulty(DifficultyEnum.Medium)),
                {
                    gamesCompleted: 1,
                    gamesLost: 1,
                    challengesLost: 1,
                    averageTime: 0,
                    bestScore: 0
                }
            );
            assert.deepStrictEqual(yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll), []);
            assert.deepInclude(yield* Effect.flatMap(PlayerStatsRepository, repository => repository.get), {
                playedDayNumbers: [firstDay],
                dailyCompletedDayNumbers: []
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
