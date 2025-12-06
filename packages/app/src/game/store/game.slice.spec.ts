/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings */
import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

describe('game slice', () => {
    describe('finish reducer', () => {
        it('should calculate average time correctly when losing first game', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 300,
                mistakes: 1,
                maxMistakes: 0
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Nightmare,
                isWon: false,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesCompleted).toBe(1);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].averageTime).toBe(300);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesLost).toBe(1);
        });

        it('should calculate average time correctly when losing second game', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 300,
                mistakes: 1,
                maxMistakes: 0,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Nightmare]: {
                        ...initialGameState.historyByDifficulty[DifficultyEnum.Nightmare],
                        gamesCompleted: 2,
                        averageTime: 100,
                        gamesLost: 2
                    }
                }
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Nightmare,
                isWon: false,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesCompleted).toBe(3);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].averageTime).toBeCloseTo(166.67, 2);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesLost).toBe(3);
        });

        it('should calculate average time correctly when winning game', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 150,
                mistakes: 0,
                maxMistakes: 0,
                score: 1000,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Nightmare]: {
                        ...initialGameState.historyByDifficulty[DifficultyEnum.Nightmare],
                        gamesCompleted: 2,
                        averageTime: 200,
                        gamesWon: 1
                    }
                }
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Nightmare,
                isWon: true,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesCompleted).toBe(3);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].averageTime).toBeCloseTo(183.33, 2);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesWon).toBe(2);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].hardcoreWon).toBe(1);
        });

        it('should increment hardcoreWon when winning with maxMistakes = 0', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 100,
                mistakes: 0,
                maxMistakes: 0,
                score: 1000
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Nightmare,
                isWon: true,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].hardcoreWon).toBe(1);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesWon).toBe(1);
        });

        it('should not increment hardcoreWon when winning with maxMistakes > 0', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 100,
                mistakes: 0,
                maxMistakes: 3,
                score: 1000
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Easy,
                isWon: true,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Easy].hardcoreWon).toBe(0);
            expect(newState.historyByDifficulty[DifficultyEnum.Easy].gamesWon).toBe(1);
        });

        it('should track statistics when losing hardcore nightmare game', () => {
            const state = {
                ...initialGameState,
                elapsedTime: 450,
                mistakes: 1,
                maxMistakes: 0,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Nightmare]: {
                        ...initialGameState.historyByDifficulty[DifficultyEnum.Nightmare],
                        gamesCompleted: 5,
                        averageTime: 300,
                        gamesLost: 3,
                        gamesWon: 2
                    }
                }
            };

            const action = gameSlice.actions.finish({
                difficulty: DifficultyEnum.Nightmare,
                isWon: false,
                isChallenge: false
            });

            const newState = gameSlice.reducer(state, action);

            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesCompleted).toBe(6);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].gamesLost).toBe(4);
            expect(newState.historyByDifficulty[DifficultyEnum.Nightmare].averageTime).toBeCloseTo(325, 2);
        });
    });
});
