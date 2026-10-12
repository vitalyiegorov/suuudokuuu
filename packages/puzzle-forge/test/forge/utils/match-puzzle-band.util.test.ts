import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { DIFFICULTY_BANDS } from '../../../src/@generic/constants/difficulty-band.constant';
import { isSolvableWithLadder } from '../../../src/forge/utils/is-solvable-with-ladder.util';
import { createPuzzleBandMatcher } from '../../../src/forge/utils/match-puzzle-band.util';

const nakedSinglesPuzzle = '349.6...1.1..37..9.57.8..435......96..61.8.5...2....749.36...1.12.8...6..6.2.943.';
const hiddenSinglePuzzle = '2.846.9.5.75.....2.9.32.4.896.1438.75......6.7....82..32..1.54......41....9532...';
const openBand = {
    blankCells: 0,
    corpus: null,
    simplerLadderMaxTechnique: null,
    bandLadderMaxTechnique: null
};

describe('createPuzzleBandMatcher', () => {
    it('should accept anything for a band that is open on both sides', () => {
        expect.assertions(2);

        const match = createPuzzleBandMatcher(openBand)(Sudoku.fromString(nakedSinglesPuzzle, defaultSudokuConfig));

        expect(match.isAboveSimplerLadder).toBe(true);
        expect(match.isWithinBand).toBe(true);
    });

    it('should reject a puzzle that is above the band ceiling', () => {
        expect(
            createPuzzleBandMatcher(DIFFICULTY_BANDS[DifficultyEnum.Newbie])(Sudoku.fromString(hiddenSinglePuzzle, defaultSudokuConfig))
        ).toStrictEqual({
            isAboveSimplerLadder: true,
            isWithinBand: false
        });
    });

    it('should enforce the simpler ceiling when the upper ceiling is open', () => {
        const match = createPuzzleBandMatcher({ ...openBand, simplerLadderMaxTechnique: SolutionTechniqueEnum.NakedSingle });

        expect(match(Sudoku.fromString(nakedSinglesPuzzle, defaultSudokuConfig)).isWithinBand).toBe(false);
        expect(match(Sudoku.fromString(hiddenSinglePuzzle, defaultSudokuConfig)).isWithinBand).toBe(true);
    });

    it.each(Object.values(DIFFICULTY_BANDS))('should preserve the two-ladder classification for ceiling $bandLadderMaxTechnique', band => {
        const match = createPuzzleBandMatcher(band);

        for (const puzzle of [nakedSinglesPuzzle, hiddenSinglePuzzle]) {
            const isAboveSimplerLadder =
                band.simplerLadderMaxTechnique === null || !isSolvableWithLadder(puzzle, band.simplerLadderMaxTechnique);
            const isWithinBand =
                isAboveSimplerLadder && (band.bandLadderMaxTechnique === null || isSolvableWithLadder(puzzle, band.bandLadderMaxTechnique));

            expect(match(Sudoku.fromString(puzzle, defaultSudokuConfig))).toStrictEqual({ isAboveSimplerLadder, isWithinBand });
        }
    });
});
