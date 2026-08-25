import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';

import { defaultScoringConfig } from '../interfaces/scoring-config.interface';

import { SudokuScoring } from './sudoku-scoring';

import type { ScoringConfigInterface } from '../interfaces/scoring-config.interface';
import type { ScoredCellsInterface } from '@suuudokuuu/generator';

describe('SudokuScoring', () => {
    describe('calculate', () => {
        describe('base scoring calculation', () => {
            it('should calculate base score with difficulty bonus for Newbie', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Newbie,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore =
                    defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Newbie];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });

            it('should calculate base score with difficulty bonus for Easy', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore =
                    defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });

            it('should calculate base score with difficulty bonus for Medium', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Medium,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore =
                    defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Medium];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });

            it('should calculate base score with difficulty bonus for Hard', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Hard,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore =
                    defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hard];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });

            it('should calculate base score with difficulty bonus for Nightmare', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Nightmare,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore =
                    defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Nightmare];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });
        });

        describe('maxMistakes bonus', () => {
            it('should apply 5x multiplier for maxMistakes=0', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 0
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const expectedScore = Math.floor(baseScore * 5);
                expect(score).toBe(expectedScore);
            });

            it('should apply 3x multiplier for maxMistakes=1', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 1
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const expectedScore = Math.floor(baseScore * 3);
                expect(score).toBe(expectedScore);
            });

            it('should apply 2x multiplier for maxMistakes=2', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 2
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const expectedScore = Math.floor(baseScore * 2);
                expect(score).toBe(expectedScore);
            });

            it('should apply 1x multiplier for unknown maxMistakes value', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 10
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const expectedScore = Math.floor(baseScore);
                expect(score).toBe(expectedScore);
            });
        });

        describe('completion bonuses', () => {
            it('should add bonus when completing a row', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, x: 5 };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const rowBonus = Math.floor(baseScore * defaultScoringConfig.lastInRowCoefficientConstant);
                const expectedScore = Math.floor(baseScore + rowBonus);
                expect(score).toBe(expectedScore);
            });

            it('should add bonus when completing a column', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, y: 3 };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const colBonus = Math.floor(baseScore * defaultScoringConfig.lastInColCoefficientConstant);
                const expectedScore = Math.floor(baseScore + colBonus);
                expect(score).toBe(expectedScore);
            });

            it('should add bonus when completing a group', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, group: 2 };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const groupBonus = Math.floor(baseScore * defaultScoringConfig.lastInGroupCoefficientConstant);
                const expectedScore = Math.floor(baseScore + groupBonus);
                expect(score).toBe(expectedScore);
            });

            it('should add bonus when completing last value', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, values: [7] };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const valueBonus = Math.floor(baseScore * defaultScoringConfig.lastValueCoefficient);
                const expectedScore = Math.floor(baseScore + valueBonus);
                expect(score).toBe(expectedScore);
            });

            it('should not add value bonus when multiple values remain', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, values: [7, 8] };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(baseScore));
            });

            it('should add all bonuses when completing row, column, group, and value', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = {
                    x: 5,
                    y: 3,
                    group: 2,
                    values: [7],
                    isWon: false
                };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const rowBonus = Math.floor(baseScore * defaultScoringConfig.lastInRowCoefficientConstant);
                const colBonus = Math.floor((baseScore + rowBonus) * defaultScoringConfig.lastInColCoefficientConstant);
                const groupBonus = Math.floor((baseScore + rowBonus + colBonus) * defaultScoringConfig.lastInGroupCoefficientConstant);
                const valueBonus = Math.floor((baseScore + rowBonus + colBonus + groupBonus) * defaultScoringConfig.lastValueCoefficient);
                const expectedScore = Math.floor(baseScore + rowBonus + colBonus + groupBonus + valueBonus);
                expect(score).toBe(expectedScore);
            });
        });

        describe('elapsed time penalty', () => {
            it('should apply penalty for elapsed time', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const elapsedTime = 100;
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const penalty = Math.floor(baseScore * elapsedTime * defaultScoringConfig.elapsedCoefficient);
                const expectedScore = Math.floor(Math.max(baseScore - penalty, defaultScoringConfig.correctMinValue));
                expect(score).toBe(expectedScore);
            });

            it('should not let elapsed penalty reduce score below minimum', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const elapsedTime = 10000;
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime,
                    maxMistakes: 99
                });

                expect(score).toBe(defaultScoringConfig.correctMinValue);
            });

            it('should apply no penalty when elapsed time is 0', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(baseScore));
            });
        });

        describe('mistakes penalty', () => {
            it('should apply penalty for mistakes', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const mistakes = 3;
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                const penalty = Math.floor(baseScore * mistakes * defaultScoringConfig.mistakesCoefficient);
                const expectedScore = Math.floor(Math.max(baseScore - penalty, defaultScoringConfig.correctMinValue));
                expect(score).toBe(expectedScore);
            });

            it('should not let mistakes penalty reduce score below minimum', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const mistakes = 1000;
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                expect(score).toBe(defaultScoringConfig.correctMinValue);
            });

            it('should apply no penalty when mistakes is 0', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(baseScore));
            });
        });

        describe('combined scenarios', () => {
            it('should handle combination of bonuses and penalties', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = {
                    x: 2,
                    y: 4,
                    group: 1,
                    values: [5],
                    isWon: false
                };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Hard,
                    scoredCells,
                    mistakes: 2,
                    elapsedTime: 50,
                    maxMistakes: 3
                });

                expect(score).toBeGreaterThanOrEqual(defaultScoringConfig.correctMinValue);
                expect(score).toBeGreaterThan(0);
            });

            it('should ensure score never goes below minimum value', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Newbie,
                    scoredCells: emptyScoredCells,
                    mistakes: 1000,
                    elapsedTime: 10000,
                    maxMistakes: 99
                });

                expect(score).toBe(defaultScoringConfig.correctMinValue);
            });

            it('should handle perfect game scenario', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = {
                    x: 8,
                    y: 8,
                    group: 8,
                    values: [9],
                    isWon: true
                };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Nightmare,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 0
                });

                expect(score).toBeGreaterThan(100);
            });

            it('should calculate consistent scores with same inputs', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const params = {
                    difficulty: DifficultyEnum.Medium,
                    scoredCells: { ...emptyScoredCells, x: 3, y: 5 },
                    mistakes: 1,
                    elapsedTime: 30,
                    maxMistakes: 5
                };

                const score1 = scoring.calculate(params);
                const score2 = scoring.calculate(params);

                expect(score1).toBe(score2);
            });
        });

        describe('custom config', () => {
            it('should work with custom scoring configuration', () => {
                const customConfig: ScoringConfigInterface = {
                    correctValue: 50,
                    correctMinValue: 10,
                    elapsedCoefficient: 0.02,
                    hintCoefficient: 0.25,
                    undoCoefficient: 0.1,
                    mistakesCoefficient: 0.1,
                    lastInRowCoefficientConstant: 1,
                    lastInColCoefficientConstant: 1,
                    lastInGroupCoefficientConstant: 1,
                    lastValueCoefficient: 1,
                    difficultyCoefficients: {
                        [DifficultyEnum.Newbie]: 1,
                        [DifficultyEnum.Easy]: 1.5,
                        [DifficultyEnum.Medium]: 2,
                        [DifficultyEnum.Hard]: 2.5,
                        [DifficultyEnum.Nightmare]: 3,
                        [DifficultyEnum.Hell]: 3.7,
                        [DifficultyEnum.Infinity]: 4.4
                    },
                    maxMistakesCoefficients: {
                        0: 2,
                        3: 1,
                        99: 1
                    }
                };

                const scoring = new SudokuScoring(customConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const expectedBaseScore = customConfig.correctValue * customConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(expectedBaseScore));
            });

            it('should enforce custom minimum value', () => {
                const customConfig: ScoringConfigInterface = {
                    ...defaultScoringConfig,
                    correctMinValue: 100
                };

                const scoring = new SudokuScoring(customConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Newbie,
                    scoredCells: emptyScoredCells,
                    mistakes: 1000,
                    elapsedTime: 10000,
                    maxMistakes: 99
                });

                expect(score).toBe(100);
            });
        });

        describe('edge cases', () => {
            it('should handle zero coefficients gracefully', () => {
                const customConfig: ScoringConfigInterface = {
                    ...defaultScoringConfig,
                    elapsedCoefficient: 0,
                    mistakesCoefficient: 0
                };

                const scoring = new SudokuScoring(customConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 100,
                    elapsedTime: 1000,
                    maxMistakes: 99
                });

                const baseScore = customConfig.correctValue * customConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(baseScore));
            });

            it('should handle empty values array correctly', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const scoredCells: ScoredCellsInterface = { ...emptyScoredCells, values: [] };
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells,
                    mistakes: 0,
                    elapsedTime: 0,
                    maxMistakes: 99
                });

                const baseScore = defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy];
                expect(score).toBe(Math.floor(baseScore));
            });

            it('should always return an integer score', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Medium,
                    scoredCells: { ...emptyScoredCells, x: 5, values: [3] },
                    mistakes: 1,
                    elapsedTime: 37,
                    maxMistakes: 2
                });

                expect(Number.isInteger(score)).toBe(true);
            });

            it('should handle negative elapsed time as positive', () => {
                const scoring = new SudokuScoring(defaultScoringConfig);
                const score = scoring.calculate({
                    difficulty: DifficultyEnum.Easy,
                    scoredCells: emptyScoredCells,
                    mistakes: 0,
                    elapsedTime: -10,
                    maxMistakes: 99
                });

                expect(score).toBeGreaterThanOrEqual(defaultScoringConfig.correctMinValue);
            });
        });
    });

    describe('calculateHintPenalty', () => {
        it('should charge half of a plain placement at the same difficulty', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);
            const placementScore = scoring.calculate({
                difficulty: DifficultyEnum.Medium,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });
            const penalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Medium, maxMistakes: 3 });

            expect(penalty).toBe(Math.floor(placementScore * defaultScoringConfig.hintCoefficient));
        });

        it('should scale the penalty with the difficulty coefficient', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);

            const newbiePenalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Newbie, maxMistakes: 99 });
            const hellPenalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Hell, maxMistakes: 99 });

            expect(hellPenalty).toBeGreaterThan(newbiePenalty);
        });

        it('should scale the penalty with the hardcore max mistakes bonus', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);

            const forgivingPenalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Hard, maxMistakes: 99 });
            const hardcorePenalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Hard, maxMistakes: 0 });

            expect(hardcorePenalty).toBeGreaterThan(forgivingPenalty);
        });

        it('should never charge less than the minimum correct value', () => {
            const scoring = new SudokuScoring({ ...defaultScoringConfig, hintCoefficient: 0 });

            expect(scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Newbie, maxMistakes: 99 })).toBe(
                defaultScoringConfig.correctMinValue
            );
        });

        it('should stay below what a mistake costs over the rest of a run', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);
            const calculateWithMistakes = (mistakes: number): number =>
                scoring.calculate({
                    difficulty: DifficultyEnum.Medium,
                    scoredCells: emptyScoredCells,
                    mistakes,
                    elapsedTime: 0,
                    maxMistakes: 3
                });
            const remainingPlacements = 20;
            const mistakeCost = (calculateWithMistakes(0) - calculateWithMistakes(1)) * remainingPlacements;
            const penalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Medium, maxMistakes: 3 });

            expect(penalty).toBeLessThan(mistakeCost);
        });

        it('should always return an integer penalty', () => {
            const scoring = new SudokuScoring({ ...defaultScoringConfig, hintCoefficient: 0.33 });

            expect(Number.isInteger(scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Nightmare, maxMistakes: 5 }))).toBe(true);
        });
    });

    describe('calculateUndoPenalty', () => {
        it('should charge the undo fraction of a plain placement at the same difficulty', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);
            const placementScore = scoring.calculate({
                difficulty: DifficultyEnum.Hell,
                scoredCells: emptyScoredCells,
                mistakes: 0,
                elapsedTime: 0,
                maxMistakes: 3
            });
            const penalty = scoring.calculateUndoPenalty({ difficulty: DifficultyEnum.Hell, maxMistakes: 3 });

            expect(penalty).toBe(Math.floor(placementScore * defaultScoringConfig.undoCoefficient));
        });

        it('should cost less than applying a hint', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);

            const undoPenalty = scoring.calculateUndoPenalty({ difficulty: DifficultyEnum.Infinity, maxMistakes: 0 });
            const hintPenalty = scoring.calculateHintPenalty({ difficulty: DifficultyEnum.Infinity, maxMistakes: 0 });

            expect(undoPenalty).toBeLessThan(hintPenalty);
        });

        it('should scale the penalty with the difficulty coefficient', () => {
            const scoring = new SudokuScoring(defaultScoringConfig);

            const newbiePenalty = scoring.calculateUndoPenalty({ difficulty: DifficultyEnum.Newbie, maxMistakes: 99 });
            const hellPenalty = scoring.calculateUndoPenalty({ difficulty: DifficultyEnum.Hell, maxMistakes: 99 });

            expect(hellPenalty).toBeGreaterThan(newbiePenalty);
        });

        it('should never charge less than the minimum correct value', () => {
            const scoring = new SudokuScoring({ ...defaultScoringConfig, undoCoefficient: 0 });

            expect(scoring.calculateUndoPenalty({ difficulty: DifficultyEnum.Newbie, maxMistakes: 99 })).toBe(
                defaultScoringConfig.correctMinValue
            );
        });
    });
});
