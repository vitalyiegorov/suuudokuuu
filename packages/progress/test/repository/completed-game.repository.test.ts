import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';

import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { ProgressTestLayer } from '../progress-test.layer';

const insertedGamesCount = 25;
const maxGamesPerDifficulty = 20;
const completedAtValues = Array.from({ length: insertedGamesCount }, (_, index) => index * 1000);
const firstDailyDayNumber = 20_000;
const baseElapsedTime = 300;
const baseScore = 900;

const makeGame = (difficulty: DifficultyEnum, completedAt: number, dailyDayNumber: number | null = null) => ({
    difficulty,
    encodedState: `${difficulty}-${completedAt}`,
    rating: 1.5,
    isRatingCeiling: false,
    elapsedTime: baseElapsedTime + completedAt,
    score: baseScore + completedAt,
    mistakes: 0,
    maxMistakes: 3,
    completedAt,
    dailyDayNumber
});

describe('CompletedGameRepository', () => {
    it.effect('keeps the newest games per difficulty, newest first', () =>
        Effect.gen(function* () {
            const completedGameRepository = yield* CompletedGameRepository;

            yield* Effect.forEach(completedAtValues, completedAt =>
                completedGameRepository.insert(makeGame(DifficultyEnum.Medium, completedAt))
            );
            yield* completedGameRepository.insert(makeGame(DifficultyEnum.Hell, 0));

            const allGames = yield* completedGameRepository.findAll;

            assert.deepStrictEqual(
                allGames.filter(game => game.difficulty === DifficultyEnum.Medium),
                completedAtValues
                    .slice(-maxGamesPerDifficulty)
                    .reverse()
                    .map(completedAt => makeGame(DifficultyEnum.Medium, completedAt))
            );
            assert.strictEqual(allGames.length, maxGamesPerDifficulty + 1);
            assert.deepStrictEqual(allGames.at(-1), makeGame(DifficultyEnum.Hell, 0));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('retains daily results alongside twenty ordinary games per difficulty', () =>
        Effect.gen(function* () {
            const completedGameRepository = yield* CompletedGameRepository;
            const dailyGame = makeGame(DifficultyEnum.Medium, 0, firstDailyDayNumber);

            yield* completedGameRepository.insert(dailyGame);
            yield* Effect.forEach(completedAtValues, completedAt =>
                completedGameRepository.insert(makeGame(DifficultyEnum.Medium, completedAt))
            );

            const allGames = yield* completedGameRepository.findAll;

            assert.strictEqual(allGames.length, maxGamesPerDifficulty + 1);
            assert.deepStrictEqual(allGames.at(-1), dailyGame);
            assert.strictEqual((yield* completedGameRepository.findDailyResults).length, 1);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('bulk imports history with the same retention and daily preservation rules', () =>
        Effect.gen(function* () {
            const completedGameRepository = yield* CompletedGameRepository;
            const dailyGame = makeGame(DifficultyEnum.Medium, 0, firstDailyDayNumber);

            yield* completedGameRepository.insertMany([
                dailyGame,
                ...completedAtValues.map(completedAt => makeGame(DifficultyEnum.Medium, completedAt)),
                makeGame(DifficultyEnum.Hell, 0)
            ]);
            yield* completedGameRepository.insertMany([]);

            const allGames = yield* completedGameRepository.findAll;

            assert.strictEqual(allGames.length, maxGamesPerDifficulty + 2);
            assert.deepStrictEqual(
                allGames.filter(game => game.dailyDayNumber !== null),
                [dailyGame]
            );
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('finds the first result of every daily, newest day first, and skips ordinary games', () =>
        Effect.gen(function* () {
            const completedGameRepository = yield* CompletedGameRepository;

            yield* Effect.forEach(
                [
                    makeGame(DifficultyEnum.Easy, 1, firstDailyDayNumber),
                    makeGame(DifficultyEnum.Medium, 2),
                    makeGame(DifficultyEnum.Hard, 3, firstDailyDayNumber + 1),
                    makeGame(DifficultyEnum.Hard, 4, firstDailyDayNumber + 1)
                ],
                game => completedGameRepository.insert(game)
            );

            assert.deepStrictEqual(yield* completedGameRepository.findDailyResults, [
                { dailyDayNumber: firstDailyDayNumber + 1, encodedState: 'Hard-3', elapsedTime: 303, score: 903, mistakes: 0 },
                { dailyDayNumber: firstDailyDayNumber, encodedState: 'Easy-1', elapsedTime: 301, score: 901, mistakes: 0 }
            ]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
