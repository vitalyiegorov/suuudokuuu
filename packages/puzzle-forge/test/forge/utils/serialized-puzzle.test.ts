import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { GRID_CELL_COUNT } from '@suuudokuuu/solver-core';
import * as Effect from 'effect/Effect';

import { PUZZLE_FORGE_MAX_ATTEMPTS } from '../../../src/@generic/constants/difficulty-band.constant';
import { forgePuzzle } from '../../../src/forge/utils/forge-puzzle.util';
import { forgeSerializablePuzzle } from '../../../src/forge/utils/forge-serializable-puzzle.util';
import { isValidPuzzleResult } from '../../../src/forge/utils/is-valid-puzzle-result.util';

const sampleSeed = 172000;
const solvedGrid = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

describe('serialized puzzle boundary', () => {
    it.effect('preserves a seeded board and its rating across serialization', () =>
        Effect.sync(() => {
            const expected = forgePuzzle(DifficultyEnum.Easy, PUZZLE_FORGE_MAX_ATTEMPTS, sampleSeed);
            const result = forgeSerializablePuzzle(DifficultyEnum.Easy, sampleSeed);

            assert.strictEqual(result.sudokuString, expected.sudoku.toString());
            assert.strictEqual(result.rating, expected.rating);
            assert.isTrue(isValidPuzzleResult(result, DifficultyEnum.Easy));
            assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
        })
    );

    it.effect('rejects a result for another requested tier', () =>
        Effect.sync(() => {
            assert.isFalse(isValidPuzzleResult(forgeSerializablePuzzle(DifficultyEnum.Easy, sampleSeed), DifficultyEnum.Hard));
        })
    );

    it.effect('rejects malformed, contradictory and ambiguous boards', () =>
        Effect.sync(() => {
            const result = forgeSerializablePuzzle(DifficultyEnum.Newbie, sampleSeed);

            for (const sudokuString of [
                '.',
                'x'.repeat(GRID_CELL_COUNT),
                '1'.repeat(GRID_CELL_COUNT),
                '.'.repeat(GRID_CELL_COUNT),
                `55.${solvedGrid.slice(3)}`
            ]) {
                assert.isFalse(isValidPuzzleResult({ ...result, sudokuString }, DifficultyEnum.Newbie));
            }
        })
    );

    it.effect('rejects an ambiguous board even when its solution matches every clue', () =>
        Effect.sync(() => {
            const result = forgeSerializablePuzzle(DifficultyEnum.Newbie, sampleSeed);

            assert.isFalse(
                isValidPuzzleResult(
                    {
                        ...result,
                        sudokuString: solvedGrid.replaceAll(/[12]/gu, '.'),
                        solutionString: solvedGrid
                    },
                    DifficultyEnum.Newbie
                )
            );
        })
    );

    it.effect('rejects malformed solutions and solutions for a different grid', () =>
        Effect.sync(() => {
            const result = forgeSerializablePuzzle(DifficultyEnum.Newbie, sampleSeed);

            for (const solutionString of ['1'.repeat(GRID_CELL_COUNT), solvedGrid]) {
                assert.isFalse(isValidPuzzleResult({ ...result, solutionString }, DifficultyEnum.Newbie));
            }
        })
    );

    it.effect('accepts both corpus tiers without inferring difficulty from clue count', () =>
        Effect.sync(() => {
            for (const difficulty of [DifficultyEnum.Hell, DifficultyEnum.Infinity]) {
                assert.isTrue(isValidPuzzleResult(forgeSerializablePuzzle(difficulty, sampleSeed), difficulty));
            }
        })
    );

    it.effect('preserves the bounded-attempt fallback contract', () =>
        Effect.sync(() => {
            const result = forgeSerializablePuzzle(DifficultyEnum.Newbie, sampleSeed);

            assert.isTrue(isValidPuzzleResult({ ...result, isInBand: false }, DifficultyEnum.Newbie));
            assert.isFalse(isValidPuzzleResult({ ...result, rating: NaN }, DifficultyEnum.Newbie));
        })
    );
});
