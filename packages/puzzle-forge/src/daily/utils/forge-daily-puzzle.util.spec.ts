import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { DIFFICULTY_BANDS } from '../../@generic/constants/difficulty-band.constant';
import { isSolvableWithLadder } from '../../forge/utils/is-solvable-with-ladder.util';

import { forgeDailyPuzzle } from './forge-daily-puzzle.util';
import { getDailyDifficulty } from './get-daily-difficulty.util';

const sampleDateString = '2026-08-23';
const nextDateString = '2026-08-24';
const forgeTimeoutMs = 120_000;
const generousAttemptBudget = 200;

describe('forgeDailyPuzzle', () => {
    it(
        'should forge the identical board every time the same UTC date is asked for',
        () => {
            expect.assertions(3);

            const first = forgeDailyPuzzle(sampleDateString, generousAttemptBudget);
            const second = forgeDailyPuzzle(sampleDateString, generousAttemptBudget);

            expect(first.sudoku.toString()).toBe(second.sudoku.toString());
            expect(first.rating).toBe(second.rating);
            expect(first.sudoku.Difficulty).toBe(getDailyDifficulty(sampleDateString));
        },
        forgeTimeoutMs
    );

    it(
        'should forge a different board for a different UTC date',
        () => {
            expect.assertions(1);

            const today = forgeDailyPuzzle(sampleDateString, generousAttemptBudget);
            const tomorrow = forgeDailyPuzzle(nextDateString, generousAttemptBudget);

            expect(today.sudoku.toString()).not.toBe(tomorrow.sudoku.toString());
        },
        forgeTimeoutMs
    );

    it(
        'should keep the daily board inside the band of its rotated tier',
        () => {
            expect.assertions(2);

            const difficulty = getDailyDifficulty(sampleDateString);
            const band = DIFFICULTY_BANDS[difficulty];
            const { isInBand, sudoku } = forgeDailyPuzzle(sampleDateString, generousAttemptBudget);
            const puzzleString = sudoku.toString();

            expect(isInBand).toBe(true);
            expect(puzzleString.split('').filter(character => character === '.')).toHaveLength(band.blankCells);
        },
        forgeTimeoutMs
    );

    it(
        'should never serve a corpus tier as the daily board',
        () => {
            expect.assertions(1);

            const difficulty = getDailyDifficulty(sampleDateString);

            expect(DIFFICULTY_BANDS[difficulty].corpus).toBeNull();
        },
        forgeTimeoutMs
    );

    it(
        'should stay solvable with the tier ladder',
        () => {
            expect.assertions(1);

            const difficulty = getDailyDifficulty(sampleDateString);
            const band = DIFFICULTY_BANDS[difficulty];
            const { sudoku } = forgeDailyPuzzle(sampleDateString, generousAttemptBudget);

            expect(isSolvableWithLadder(sudoku.toString(), band.bandLadderMaxTechnique ?? SolutionTechniqueEnum.AIC)).toBe(true);
        },
        forgeTimeoutMs
    );
});
