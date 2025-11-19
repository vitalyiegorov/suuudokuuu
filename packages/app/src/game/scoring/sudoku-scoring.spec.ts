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

            // Easy difficulty: 500 * 2 = 1000
            expect(score).toBe(1000);
        });

        it('should apply difficulty multipliers correctly', () => {
            expect.assertions(5);

            const newbie = scoring.calculate(DifficultyEnum.Newbie, emptyScoredCells, 0, 0);
            const easy = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);
            const medium = scoring.calculate(DifficultyEnum.Medium, emptyScoredCells, 0, 0);
            const hard = scoring.calculate(DifficultyEnum.Hard, emptyScoredCells, 0, 0);
            const nightmare = scoring.calculate(DifficultyEnum.Nightmare, emptyScoredCells, 0, 0);

            // Base value is 500
            // 500 * 1
            expect(newbie).toBe(500);
            // 500 * 2
            expect(easy).toBe(1000);
            // 500 * 3
            expect(medium).toBe(1500);
            // 500 * 4
            expect(hard).toBe(2000);
            // 500 * 5
            expect(nightmare).toBe(2500);
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

            // Base: 1000, Row bonus: 1000 * 3 = 3000
            expect(score).toBe(4000);
        });

        it('should apply column completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithCol: ScoredCellsInterface = {
                ...emptyScoredCells,
                y: 3
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithCol, 0, 0);

            // Base: 1000, Col bonus: 1000 * 2 = 2000
            expect(score).toBe(3000);
        });

        it('should apply group completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithGroup: ScoredCellsInterface = {
                ...emptyScoredCells,
                group: 2
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithGroup, 0, 0);

            // Base: 1000, Group bonus: 1000 * 3 = 3000
            expect(score).toBe(4000);
        });

        it('should apply value completion bonus when exactly one value is completed', () => {
            expect.assertions(1);

            const scoredCellsWithValue: ScoredCellsInterface = {
                ...emptyScoredCells,
                values: [7]
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithValue, 0, 0);

            // Base: 1000, Value bonus: 1000 * 2 = 2000
            expect(score).toBe(3000);
        });

        it('should NOT apply value bonus when multiple values are in the array', () => {
            expect.assertions(1);

            const scoredCellsWithValues: ScoredCellsInterface = {
                ...emptyScoredCells,
                values: [7, 8]
            };

            const score = scoring.calculate(DifficultyEnum.Easy, scoredCellsWithValues, 0, 0);

            // Base: 1000, no value bonus
            expect(score).toBe(1000);
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

            // Base: 2000 (Hard = 500 * 4)
            // Row: 2000 * 3 = 6000
            // Col: 2000 * 2 = 4000
            // Group: 2000 * 3 = 6000
            // Value: 2000 * 2 = 4000
            // Total: 2000 + 6000 + 4000 + 6000 + 4000 = 22000
            expect(score).toBe(22000);
        });
    });

    describe('Time penalties', () => {
        it('should apply time penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 60);

            // Base: 1000
            // Time penalty: 1000 * 60 * 0.001 = 60
            // Result: 1000 - 60 = 940
            expect(score).toBe(940);
        });

        it('should apply larger time penalty for longer duration', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 600);

            // Base: 1000
            // Time penalty: 1000 * 600 * 0.001 = 600
            // Result: 1000 - 600 = 400
            expect(score).toBe(400);
        });
    });

    describe('Mistake penalties', () => {
        it('should apply mistake penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 5, 0);

            // Base: 1000
            // Mistake penalty: 1000 * 5 * 0.05 = 250
            // Result: 1000 - 250 = 750
            expect(score).toBe(750);
        });

        it('should apply larger penalty for more mistakes', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 10, 0);

            // Base: 1000
            // Mistake penalty: 1000 * 10 * 0.05 = 500
            // Result: 1000 - 500 = 500
            expect(score).toBe(500);
        });
    });

    describe('Combined penalties', () => {
        it('should apply both time and mistake penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 5, 60);

            // Base: 1000
            // Time penalty: 1000 * 60 * 0.001 = 60 -> 940
            // Mistake penalty: 940 * 5 * 0.05 = 235 -> 705
            // Result: 705
            expect(score).toBe(705);
        });

        it('should respect minimum score threshold with heavy penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 1000, 3600);

            // Base: 1000
            // Time penalty: 1000 * 3600 * 0.001 = 3600 -> would be -2600
            // But minimum is enforced: 50
            expect(score).toBe(defaultScoringConfig.correctMinValue);
        });

        it('should not let penalties create negative scores that become positive', () => {
            expect.assertions(1);

            // This tests the bug fix where negative scores after time penalty
            // would become positive after mistake penalty
            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 100, 2000);

            // Base: 1000
            // Time penalty: 1000 * 2000 * 0.001 = 2000 -> would be -1000
            // Should be capped at minimum: 50
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

            // Base: 1500 (Medium = 500 * 3)
            // Row: 1500 * 3 = 4500
            // Col: 1500 * 2 = 3000
            // Group: 1500 * 3 = 4500
            // Value: 1500 * 2 = 3000
            // Subtotal: 1500 + 4500 + 3000 + 4500 + 3000 = 16500
            // Time penalty: 16500 * 120 * 0.001 = 1980 -> 14520
            // Mistake penalty: 14520 * 3 * 0.05 = 2178 -> 12342
            expect(score).toBe(12342);
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

            // Base: 2500 (Nightmare = 500 * 5)
            // Row: 2500 * 3 = 7500
            // Col: 2500 * 2 = 5000
            // Group: 2500 * 3 = 7500
            // Value: 2500 * 2 = 5000
            // Total: 2500 + 7500 + 5000 + 7500 + 5000 = 27500
            expect(score).toBe(27500);
        });
    });

    describe('Edge cases', () => {
        it('should handle zero elapsed time', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 0);

            expect(score).toBe(1000);
        });

        it('should handle zero mistakes', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Easy, emptyScoredCells, 0, 60);

            expect(score).toBe(940);
        });

        it('should never return less than minimum score', () => {
            expect.assertions(1);

            const score = scoring.calculate(DifficultyEnum.Newbie, emptyScoredCells, 10000, 10000);

            expect(score).toBeGreaterThanOrEqual(defaultScoringConfig.correctMinValue);
        });
    });
});
