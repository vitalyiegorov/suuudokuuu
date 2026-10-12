import { DifficultyEnum, Sudoku } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { forgeDailyPuzzle } from '../../../src/daily/utils/forge-daily-puzzle.util';
import { getDailyDifficulty } from '../../../src/daily/utils/get-daily-difficulty.util';
import { getDailyPuzzleSeed } from '../../../src/daily/utils/get-daily-puzzle-seed.util';
import { forgeSerializablePuzzle } from '../../../src/forge/utils/forge-serializable-puzzle.util';

const corpusSeed = 172_000;

describe('forgeSerializablePuzzle', () => {
    it('serializes the daily board, its rating and a matching solution', () => {
        const dateString = '2026-10-11';
        const expected = forgeDailyPuzzle(dateString);
        const result = forgeSerializablePuzzle(getDailyDifficulty(dateString), getDailyPuzzleSeed(dateString));

        expect(result.sudokuString).toBe(expected.sudoku.toString());
        expect(result.rating).toBe(expected.rating);
        expect(Sudoku.fromPuzzleAndSolution(result.sudokuString, result.solutionString).FullField).toEqual(expected.sudoku.FullField);
        expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    });

    it('serializes corpus tiers', () => {
        for (const difficulty of [DifficultyEnum.Hell, DifficultyEnum.Infinity]) {
            const result = forgeSerializablePuzzle(difficulty, corpusSeed);

            expect(Sudoku.fromPuzzleAndSolution(result.sudokuString, result.solutionString).toString()).toBe(result.sudokuString);
        }
    });
});
