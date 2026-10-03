import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';

import { CompletedGameRepository } from '../src/completed-game/repository/completed-game.repository';

import { ContractsTestLayer } from './contracts-test.layer';

const insertedGamesCount = 25;
const maxGamesPerDifficulty = 20;
const completedAtValues = Array.from({ length: insertedGamesCount }, (_, index) => index * 1000);

const makeGame = (difficulty: DifficultyEnum, completedAt: number) => ({
    difficulty,
    encodedState: `${difficulty}-${completedAt}`,
    rating: 1.5,
    isRatingCeiling: false,
    elapsedTime: 300,
    score: 900,
    mistakes: 0,
    maxMistakes: 3,
    completedAt
});

describe('CompletedGameRepository', () => {
    it.effect('keeps the newest games per difficulty, newest first', () =>
        Effect.gen(function* () {
            const completedGameRepository = yield* CompletedGameRepository;

            yield* Effect.forEach(completedAtValues, completedAt =>
                completedGameRepository.insert(makeGame(DifficultyEnum.Medium, completedAt))
            );
            yield* completedGameRepository.insert(makeGame(DifficultyEnum.Hell, 0));

            const mediumGames = yield* completedGameRepository.findByDifficulty(DifficultyEnum.Medium);
            const allGames = yield* completedGameRepository.findAll;

            assert.deepStrictEqual(
                mediumGames,
                completedAtValues
                    .slice(-maxGamesPerDifficulty)
                    .reverse()
                    .map(completedAt => makeGame(DifficultyEnum.Medium, completedAt))
            );
            assert.strictEqual(allGames.length, maxGamesPerDifficulty + 1);
            assert.deepStrictEqual(allGames.at(-1), makeGame(DifficultyEnum.Hell, 0));
        }).pipe(Effect.provide(ContractsTestLayer))
    );
});
