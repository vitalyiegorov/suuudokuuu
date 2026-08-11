import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MINIMUM_RATING, INFINITY_CORPUS_MINIMUM_RATING } from '@suuudokuuu/hell-corpus';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { DIFFICULTY_BANDS } from '../../@generic/constants/difficulty-band.constant';

import { forgePuzzle } from './forge-puzzle.util';
import { isSolvableWithLadder } from './is-solvable-with-ladder.util';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';

const generatedDifficulties = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare
];
const forgeTimeoutMs = 120_000;
const generousAttemptBudget = 200;
const hellClueCount = 17;

const getClueCount = (puzzleString: string): number => puzzleString.split('').filter(character => character !== '.').length;

const getBlankCellCount = (puzzleString: string): number => puzzleString.split('').filter(character => character === '.').length;

const isTooEasyForBand = (puzzleString: string, band: DifficultyBandInterface): boolean =>
    band.simplerLadderMaxTechnique !== null && isSolvableWithLadder(puzzleString, band.simplerLadderMaxTechnique);

describe('forgePuzzle', () => {
    it.each(generatedDifficulties)(
        'should forge a %s board that needs a technique inside the tier band',
        difficulty => {
            expect.assertions(4);

            const band = DIFFICULTY_BANDS[difficulty];
            const { isInBand, sudoku } = forgePuzzle(difficulty, generousAttemptBudget);
            const puzzleString = sudoku.toString();

            expect(isInBand).toBe(true);
            expect(getBlankCellCount(puzzleString)).toBe(band.blankCells);
            expect(isTooEasyForBand(puzzleString, band)).toBe(false);
            expect(isSolvableWithLadder(puzzleString, band.bandLadderMaxTechnique ?? SolutionTechniqueEnum.AIC)).toBe(true);
        },
        forgeTimeoutMs
    );

    it('should keep every generated tier logically distinct from the tier below it', () => {
        expect.assertions(4);

        for (const difficulty of generatedDifficulties.slice(1)) {
            const band = DIFFICULTY_BANDS[difficulty];
            const previousLadderMaxTechnique = band.simplerLadderMaxTechnique ?? SolutionTechniqueEnum.Guess;

            expect(band.bandLadderMaxTechnique ?? SolutionTechniqueEnum.AIC).toBeGreaterThan(previousLadderMaxTechnique);
        }
    });

    it('should serve Hell from the bundled seventeen-clue corpus', () => {
        expect.assertions(3);

        const { isInBand, sudoku } = forgePuzzle(DifficultyEnum.Hell);
        const puzzleString = sudoku.toString();

        expect(isInBand).toBe(true);
        expect(getClueCount(puzzleString)).toBe(hellClueCount);
        expect(isSolvableWithLadder(puzzleString, SolutionTechniqueEnum.HiddenSingle)).toBe(false);
    });

    it('should serve Infinity from the curated corpus with its published rating', () => {
        expect.assertions(3);

        const { isInBand, rating, sudoku } = forgePuzzle(DifficultyEnum.Infinity);

        expect(isInBand).toBe(true);
        expect(rating).toBeGreaterThanOrEqual(INFINITY_CORPUS_MINIMUM_RATING);
        expect(isSolvableWithLadder(sudoku.toString(), SolutionTechniqueEnum.HiddenSingle)).toBe(false);
    });

    it('should take a corpus-sourced rating from the record instead of re-rating the board', () => {
        expect.assertions(2);

        expect(forgePuzzle(DifficultyEnum.Hell).rating).toBeGreaterThanOrEqual(HELL_CORPUS_MINIMUM_RATING);
        expect(forgePuzzle(DifficultyEnum.Infinity).rating).toBeGreaterThan(SE_RATING_CEILING);
    });

    it(
        'should rate a generated board through the rater',
        () => {
            expect.assertions(3);

            const { isRatingCeiling, rating } = forgePuzzle(DifficultyEnum.Newbie, generousAttemptBudget);

            expect(rating).toBeGreaterThan(0);
            expect(rating).toBeLessThanOrEqual(SE_RATING_CEILING);
            expect(isRatingCeiling).toBe(false);
        },
        forgeTimeoutMs
    );

    it('should return the closest board it found when the attempt budget runs out', () => {
        expect.assertions(2);

        const { isInBand, sudoku } = forgePuzzle(DifficultyEnum.Nightmare, 1);

        expect(typeof isInBand).toBe('boolean');
        expect(getBlankCellCount(sudoku.toString())).toBe(DIFFICULTY_BANDS[DifficultyEnum.Nightmare].blankCells);
    });
});
