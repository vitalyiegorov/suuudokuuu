/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';

import { defaultScoringConfig } from './scoring-config.interface';
import { SudokuScoring } from './sudoku-scoring';

import type { ScoredCellsInterface } from '@suuudokuuu/generator';

describe('SudokuScoring', () => {
    const scoring = new SudokuScoring(defaultScoringConfig);

    describe('Base scoring', () => {
        it('should calculate base score for correct value with no bonuses or penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);

            expect(score).toBe(1);
        });

        it('should apply difficulty multipliers correctly', () => {
            expect.assertions(5);

            const newbie = scoring.calculate(DifficultyEnum.Newbie, emptyScoredCells, 0, 0);
            const easy = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);
            const medium = scoring.calculate(DifficultyEnum.Medium, emptyScoredCells, 0, 0);
            const hard = scoring.calculate(DifficultyEnum.Hard, emptyScoredCells, 0, 0);
            const nightmare = scoring.calculate(DifficultyEnum.Nightmare, emptyScoredCells, 0, 0);

            expect(newbie).toBe(0.5);
            expect(easy).toBe(1);
            expect(medium).toBe(1.5);
            expect(hard).toBe(2);
            expect(nightmare).toBe(2.5);
        });
    });

    describe('Completion bonuses', () => {
        it('should apply row completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithRow: ScoredCellsInterface = {
                ...emptyScoredCells,
                x: 5
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithRow, 0, 0);

            expect(score).toBe(4);
        });

        it('should apply column completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithCol: ScoredCellsInterface = {
                ...emptyScoredCells,
                y: 3
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithCol, 0, 0);

            expect(score).toBe(3);
        });

        it('should apply group completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithGroup: ScoredCellsInterface = {
                ...emptyScoredCells,
                group: 2
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithGroup, 0, 0);

            expect(score).toBe(4);
        });

        it('should apply value completion bonus when exactly one value is completed', () => {
            expect.assertions(1);

            const scoredCellsWithValue: ScoredCellsInterface = {
                ...emptyScoredCells,
                values: [7]
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithValue, 0, 0);

            expect(score).toBe(3);
        });

        it('should NOT apply value bonus when multiple values are in the array', () => {
            expect.assertions(1);

            const scoredCellsWithValues: ScoredCellsInterface = {
                ...emptyScoredCells,
                values: [7, 8]
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithValues, 0, 0);

            expect(score).toBe(1);
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

            expect(score).toBe(22);
        });
    });

    describe('Time penalties', () => {
        it('should apply time penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 60);

            expect(score).toBeCloseTo(0.99, 2);
        });

        it('should apply larger time penalty for longer duration', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 600);

            expect(score).toBeCloseTo(0.99, 2);
        });
    });

    describe('Mistake penalties', () => {
        it('should apply mistake penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 5, 0);

            expect(score).toBeCloseTo(0.99, 2);
        });

        it('should apply larger penalty for more mistakes', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 10, 0);

            expect(score).toBeCloseTo(0.99, 2);
        });
    });

    describe('Combined penalties', () => {
        it('should apply both time and mistake penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 5, 60);

            expect(score).toBeCloseTo(0.99, 2);
        });

        it('should respect minimum score threshold with heavy penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 1000, 3600);

            expect(score).toBe(defaultScoringConfig.correctMinValue);
        });

        it('should not let penalties create negative scores that become positive', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 100, 2000);

            expect(score).toBe(defaultScoringConfig.correctMinValue);
        });
    });

    describe('Complex scenarios', () => {
        it('should calculate score with bonuses and penalties combined', () => {
            expect.assertions(1);

            const scoredCells: ScoredCellsInterface = {
                x: 1,
                y: 2,
                group: 3,
                values: [5],
                isWon: false
            };

            const score = scoring.calculate(DifficultyEnum.Medium, scoredCells, 3, 120);

            expect(score).toBeCloseTo(12.34, 1);
        });

        it('should handle nightmare difficulty with all bonuses', () => {
            expect.assertions(1);

            const scoredCells: ScoredCellsInterface = {
                x: 8,
                y: 8,
                group: 8,
                values: [9],
                isWon: false
            };

            const score = scoring.calculate(DifficultyEnum.Nightmare, scoredCells, 0, 0);

            expect(score).toBe(27.5);
        });
    });

    describe('Edge cases', () => {
        it('should handle zero elapsed time', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);

            expect(score).toBe(1);
        });

        it('should handle zero mistakes', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 60);

            expect(score).toBeCloseTo(0.99, 2);
        });

        it('should never return less than minimum score', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Newbie, emptyScoredCells, 10000, 10000);

            expect(score).toBeGreaterThanOrEqual(defaultScoringConfig.correctMinValue);
        });
    });
});
