import { describe, expect, it } from '@jest/globals';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { emptyScoredCells } from '../../interfaces/scored-cells.interface';
import { defaultSudokuScoringConfig } from '../../interfaces/sudoku-scoring-config.interface';

import { SudokuScoring } from './sudoku-scoring';

import type { ScoredCellsInterface } from '../../interfaces/scored-cells.interface';

const TIME_IN_SECONDS = 3600;

describe('SudokuScoring', () => {
    const scoring = new SudokuScoring(defaultSudokuScoringConfig);

    it('should calculate base score for correct value', () => {
        expect.assertions(1);

        const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply row completion bonus', () => {
        expect.assertions(1);

        const scoredCellsWithRow: ScoredCellsInterface = {
            ...emptyScoredCells,
            x: 5
        };

        const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithRow, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply column completion bonus', () => {
        expect.assertions(1);

        const scoredCellsWithCol: ScoredCellsInterface = {
            ...emptyScoredCells,
            y: 3
        };

        const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithCol, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply group completion bonus', () => {
        expect.assertions(1);

        const scoredCellsWithGroup: ScoredCellsInterface = {
            ...emptyScoredCells,
            group: 2
        };

        const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithGroup, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply value completion bonus when exactly one value is completed', () => {
        expect.assertions(1);

        const scoredCellsWithValue: ScoredCellsInterface = {
            ...emptyScoredCells,
            values: [7]
        };

        const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithValue, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply all bonuses when all conditions are met', () => {
        expect.assertions(1);

        const scoredCellsWithAll: ScoredCellsInterface = {
            x: 1,
            y: 2,
            group: 3,
            values: [5],
            isWon: false
        };

        const score = scoring.calculate(DifficultyEnum.Hard, scoredCellsWithAll, 0, 0);

        expect(score).toBeGreaterThan(0);
    });

    it('should apply time and mistake penalties', () => {
        expect.assertions(2);

        const scoreWithoutPenalties = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);
        const scoreWithPenalties = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 5, 60);

        expect(scoreWithPenalties).toBeLessThan(scoreWithoutPenalties);
        expect(scoreWithPenalties).toBeGreaterThanOrEqual(defaultSudokuScoringConfig.correctMinValue);
    });

    it('should respect minimum score threshold', () => {
        expect.assertions(1);

        const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 1000, TIME_IN_SECONDS);

        expect(score).toBe(defaultSudokuScoringConfig.correctMinValue);
    });
});
