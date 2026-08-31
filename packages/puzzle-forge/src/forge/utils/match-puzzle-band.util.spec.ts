import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { DIFFICULTY_BANDS } from '../../@generic/constants/difficulty-band.constant';

import { matchPuzzleBand } from './match-puzzle-band.util';

const nakedSinglesPuzzle = '349.6...1.1..37..9.57.8..435......96..61.8.5...2....749.36...1.12.8...6..6.2.943.';
const hiddenSinglePuzzle = '2.846.9.5.75.....2.9.32.4.896.1438.75......6.7....82..32..1.54......41....9532...';
const openBand = {
    blankCells: 0,
    corpus: null,
    simplerLadderMaxTechnique: null,
    bandLadderMaxTechnique: null
};

describe('matchPuzzleBand', () => {
    it('should accept a naked-singles board for the Newbie band', () => {
        expect.assertions(2);

        const match = matchPuzzleBand(nakedSinglesPuzzle, DIFFICULTY_BANDS[DifficultyEnum.Newbie]);

        expect(match.isAboveSimplerLadder).toBe(true);
        expect(match.isWithinBand).toBe(true);
    });

    it('should reject a naked-singles board as too easy for the Easy band', () => {
        expect.assertions(2);

        const match = matchPuzzleBand(nakedSinglesPuzzle, DIFFICULTY_BANDS[DifficultyEnum.Easy]);

        expect(match.isAboveSimplerLadder).toBe(false);
        expect(match.isWithinBand).toBe(false);
    });

    it('should accept a hidden-single board for the Easy band', () => {
        expect.assertions(2);

        const match = matchPuzzleBand(hiddenSinglePuzzle, DIFFICULTY_BANDS[DifficultyEnum.Easy]);

        expect(match.isAboveSimplerLadder).toBe(true);
        expect(match.isWithinBand).toBe(true);
    });

    it('should reject a hidden-single board as too easy for the Medium band', () => {
        expect.assertions(1);

        expect(matchPuzzleBand(hiddenSinglePuzzle, DIFFICULTY_BANDS[DifficultyEnum.Medium]).isWithinBand).toBe(false);
    });

    it('should accept anything for a band that is open on both sides', () => {
        expect.assertions(2);

        const match = matchPuzzleBand(nakedSinglesPuzzle, openBand);

        expect(match.isAboveSimplerLadder).toBe(true);
        expect(match.isWithinBand).toBe(true);
    });

    it('should treat the Newbie ladder ceiling as the naked single', () => {
        expect.assertions(1);

        expect(DIFFICULTY_BANDS[DifficultyEnum.Newbie].bandLadderMaxTechnique).toBe(SolutionTechniqueEnum.NakedSingle);
    });
});
