/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';

import { defaultScoringConfig } from './scoring-config.interface';
import { SudokuScoring } from './sudoku-scoring';

import type { ScoredCellsInterface } from '@suuudokuuu/generator';

describe('SudokuScoring', () => {
    const scoring = new SudokuScoring(defaultScoringConfig);

    describe('Base scoring with maxMistakes bonus', () => {
        it('should calculate base score for correct value with no bonuses or penalties (3 mistakes)', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBe(1.5);
        });

        it('should apply hardcore mode bonus (0 mistakes allowed)', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 0
            });

            expect(score).toBe(5);
        });

        it('should apply 1 mistake bonus', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 1
            });

            expect(score).toBe(3);
        });

        it('should apply immortal mode (no bonus for 99 mistakes)', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 99
            });

            expect(score).toBe(1);
        });

        it('should apply difficulty multipliers correctly with maxMistakes', () => {
            expect.assertions(5);

            const maxMistakes = 3;
            const newbie = scoring.calculate({ difficulty: DifficultyEnum.Newbie, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: 0, maxMistakes });
            const easy = scoring.calculate({ difficulty: DifficultyEnum.Easy, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: 0, maxMistakes });
            const medium = scoring.calculate({ difficulty: DifficultyEnum.Medium, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: 0, maxMistakes });
            const hard = scoring.calculate({ difficulty: DifficultyEnum.Hard, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: 0, maxMistakes });
            const nightmare = scoring.calculate({ difficulty: DifficultyEnum.Nightmare, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: 0, maxMistakes });

            expect(newbie).toBe(0.75);
            expect(easy).toBe(1.5);
            expect(medium).toBe(2.25);
            expect(hard).toBe(3);
            expect(nightmare).toBe(3.75);
        });
    });

    describe('Completion bonuses', () => {
        it('should apply row completion bonus', () => {
            expect.assertions(1);

            const scoredCellsWithRow: ScoredCellsInterface = {
                ...emptyScoredCells,
                x: 5
            };

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: scoredCellsWithRow,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBe(6);
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

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Hard,
                scoredCells: scoredCellsWithAll,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBe(33);
        });
    });

    describe('Time penalties', () => {
        it('should apply time penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 60,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(1.4, 1);
        });

        it('should apply larger time penalty for longer duration', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 600,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(1.4, 1);
        });
    });

    describe('Mistake penalties', () => {
        it('should apply mistake penalty correctly', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 2,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(1.3, 1);
        });

        it('should apply larger penalty for more mistakes', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 5,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(1.1, 1);
        });
    });

    describe('Combined penalties', () => {
        it('should apply both time and mistake penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 2,
                elapsedTime: 60,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(1.2, 1);
        });

        it('should respect minimum score threshold with heavy penalties', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 1000,
                elapsedTime: 3600,
                maxMistakes: 3
            });

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

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Medium,
                scoredCells,
                mistakes: 3,
                elapsedTime: 120,
                maxMistakes: 3
            });

            expect(score).toBeCloseTo(16, 0);
        });

        it('should handle nightmare difficulty with hardcore mode', () => {
            expect.assertions(1);

            const scoredCells: ScoredCellsInterface = {
                x: 8,
                y: 8,
                group: 8,
                values: [9],
                isWon: false
            };

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Nightmare,
                scoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 0
            });

            expect(score).toBe(137.5);
        });
    });

    describe('Edge cases', () => {
        it('should handle zero elapsed time', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Easy,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });

            expect(score).toBe(1.5);
        });

        it('should never return less than minimum score', () => {
            expect.assertions(1);

            const score = scoring.calculate({
                difficulty: DifficultyEnum.Newbie,
                scoredCells: emptyScoredCells,
                mistakes: 10000,
                elapsedTime: 10000,
                maxMistakes: 99
            });

            expect(score).toBeGreaterThanOrEqual(defaultScoringConfig.correctMinValue);
        });
    });
});
