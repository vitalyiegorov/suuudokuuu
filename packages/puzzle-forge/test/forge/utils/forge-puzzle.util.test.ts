import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MINIMUM_RATING, INFINITY_CORPUS_MINIMUM_RATING } from '@suuudokuuu/hell-corpus';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { DIFFICULTY_BANDS, PUZZLE_FORGE_MAX_ATTEMPTS } from '../../../src/@generic/constants/difficulty-band.constant';
import { forgePuzzle } from '../../../src/forge/utils/forge-puzzle.util';

import { isSolvableWithLadder } from './is-solvable-with-ladder.util';

import type { DifficultyBandInterface } from '../../../src/@generic/interfaces/difficulty-band.interface';

const generatedDifficulties = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare
];
const forgeTimeoutMs = 120_000;
const generousAttemptBudget = 200;
const sampleSeed = 20_260_823;
const otherSeed = 20_260_824;
const unseededSampleCount = 3;

const getBlankCellCount = (puzzleString: string): number => puzzleString.split('').filter(character => character === '.').length;

const isTooEasyForBand = (puzzleString: string, band: DifficultyBandInterface): boolean =>
    band.simplerLadderMaxTechnique !== null && isSolvableWithLadder(puzzleString, band.simplerLadderMaxTechnique);

const seededForgeFixtures = [
    {
        difficulty: DifficultyEnum.Newbie,
        puzzle: '...4......47..5..958.9..1....625.481..8.6..53.52.18.9..745...68...89752.895......',
        rating: 1.5
    },
    {
        difficulty: DifficultyEnum.Easy,
        puzzle: '.9....8.61..4.8..2...2795.1..97346....1.9....7.6..1...96..2......3.......87..396.',
        rating: 1.5
    },
    {
        difficulty: DifficultyEnum.Medium,
        puzzle: '5.....7.92..9.5.....7..3.24.73....4.....179.3....38.5..1.3.......47...1.7..2.....',
        rating: 3.4
    },
    {
        difficulty: DifficultyEnum.Hard,
        puzzle: '.147....3587..............2......6..9..6..8.5.5..3..19..637..5........64.91..5...',
        rating: 4.4
    },
    {
        difficulty: DifficultyEnum.Nightmare,
        puzzle: '..5..942.....481...1.6......2..8...36..9....4..3.74....5.........2...91.9...3..6.',
        rating: 7.2
    },
    {
        difficulty: DifficultyEnum.Hell,
        puzzle: '5.......1..9..872..6.4...8...2..75.....1....23...2...7..5.413..9..........36....8',
        rating: 8
    },
    {
        difficulty: DifficultyEnum.Infinity,
        puzzle: '....3...7..9..5.1....6..8....1..2.5.3..8.........7.6....4...5..29...4....1.....49',
        rating: 11.7
    }
];

describe('forgePuzzle', () => {
    it.each(seededForgeFixtures)('should preserve the seeded $difficulty board and rating', ({ difficulty, puzzle, rating }) => {
        const result = forgePuzzle(difficulty, PUZZLE_FORGE_MAX_ATTEMPTS, sampleSeed);

        expect(result.sudoku.toString()).toBe(puzzle);
        expect(result.rating).toBe(rating);
        expect(result.isInBand).toBe(true);
        expect(result.isRatingCeiling).toBe(false);
    });

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

    it('should serve Hell from the corpus with a board that Nightmare techniques cannot solve', () => {
        expect.assertions(3);

        const { isInBand, isRatingCeiling, sudoku } = forgePuzzle(DifficultyEnum.Hell);

        expect(isInBand).toBe(true);
        expect(isRatingCeiling).toBe(false);
        expect(isTooEasyForBand(sudoku.toString(), DIFFICULTY_BANDS[DifficultyEnum.Hell])).toBe(false);
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

    it(
        'should forge a different generated board for a different seed',
        () => {
            expect.assertions(1);

            const first = forgePuzzle(DifficultyEnum.Easy, generousAttemptBudget, sampleSeed);
            const second = forgePuzzle(DifficultyEnum.Easy, generousAttemptBudget, otherSeed);

            expect(first.sudoku.toString()).not.toBe(second.sudoku.toString());
        },
        forgeTimeoutMs
    );

    it(
        'should stay unpredictable when no seed is supplied',
        () => {
            expect.assertions(1);

            const boards = new Set(
                Array.from({ length: unseededSampleCount }, () =>
                    forgePuzzle(DifficultyEnum.Newbie, generousAttemptBudget).sudoku.toString()
                )
            );

            expect(boards.size).toBe(unseededSampleCount);
        },
        forgeTimeoutMs
    );

    it('should return the closest board it found when the attempt budget runs out', () => {
        expect.assertions(3);

        const { isInBand, sudoku } = forgePuzzle(DifficultyEnum.Nightmare, 1, sampleSeed);

        expect(isInBand).toBe(false);
        expect(isTooEasyForBand(sudoku.toString(), DIFFICULTY_BANDS[DifficultyEnum.Nightmare])).toBe(true);
        expect(getBlankCellCount(sudoku.toString())).toBe(DIFFICULTY_BANDS[DifficultyEnum.Nightmare].blankCells);
    });
});
