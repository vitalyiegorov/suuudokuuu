import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../interfaces/history-game.interface';

import { historyGetTotals } from './history-get-totals.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';

const buildCompletedGame = (difficulty: DifficultyEnum, completedAt: number): CompletedGameInterface => ({
    completedAt,
    difficulty,
    elapsedTime: 100,
    encodedState: '',
    maxMistakes: 3,
    mistakes: 0,
    score: 500
});

const HighestBestScore = 1500;
const LowestBestTime = 120;
const WeightedAverageTime = 175;
const QuarterWinRate = 25;

const buildHistory = (difficulty: DifficultyEnum, overrides: Partial<HistoryGameInterface>): HistoryGameInterface => ({
    ...emptyGameHistory,
    difficulty,
    ...overrides
});

const buildHistoryByDifficulty = (
    overridesByDifficulty: Partial<Record<DifficultyEnum, Partial<HistoryGameInterface>>>
): Record<DifficultyEnum, HistoryGameInterface> => ({
    [DifficultyEnum.Newbie]: buildHistory(DifficultyEnum.Newbie, overridesByDifficulty[DifficultyEnum.Newbie] ?? {}),
    [DifficultyEnum.Easy]: buildHistory(DifficultyEnum.Easy, overridesByDifficulty[DifficultyEnum.Easy] ?? {}),
    [DifficultyEnum.Medium]: buildHistory(DifficultyEnum.Medium, overridesByDifficulty[DifficultyEnum.Medium] ?? {}),
    [DifficultyEnum.Hard]: buildHistory(DifficultyEnum.Hard, overridesByDifficulty[DifficultyEnum.Hard] ?? {}),
    [DifficultyEnum.Nightmare]: buildHistory(DifficultyEnum.Nightmare, overridesByDifficulty[DifficultyEnum.Nightmare] ?? {}),
    [DifficultyEnum.Hell]: buildHistory(DifficultyEnum.Hell, overridesByDifficulty[DifficultyEnum.Hell] ?? {})
});

describe('historyGetTotals', () => {
    it('should return zeroed totals for an untouched history', () => {
        expect.assertions(1);

        expect(historyGetTotals(buildHistoryByDifficulty({}))).toStrictEqual({
            averageTime: 0,
            bestScore: 0,
            bestTime: 0,
            challengesLost: 0,
            challengesWon: 0,
            cleanWins: 0,
            dayStreak: 0,
            gamesCompleted: 0,
            gamesLost: 0,
            gamesWon: 0,
            hardcoreWins: 0,
            winRate: 0
        });
    });

    it('should sum counters across every difficulty', () => {
        expect.assertions(7);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: {
                    gamesCompleted: 4,
                    gamesWon: 3,
                    gamesLost: 1,
                    gamesWonWithoutMistakes: 2,
                    hardcoreWon: 1,
                    challengesWon: 1,
                    challengesLost: 2
                },
                [DifficultyEnum.Hard]: {
                    gamesCompleted: 6,
                    gamesWon: 3,
                    gamesLost: 3,
                    gamesWonWithoutMistakes: 1,
                    hardcoreWon: 2,
                    challengesWon: 4,
                    challengesLost: 1
                }
            })
        );

        expect(totals.gamesCompleted).toBe(10);
        expect(totals.gamesWon).toBe(6);
        expect(totals.gamesLost).toBe(4);
        expect(totals.cleanWins).toBe(3);
        expect(totals.hardcoreWins).toBe(3);
        expect(totals.challengesWon).toBe(5);
        expect(totals.challengesLost).toBe(3);
    });

    it('should take the highest best score and the lowest positive best time', () => {
        expect.assertions(2);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { bestScore: 900, bestTime: 300 },
                [DifficultyEnum.Hard]: { bestScore: HighestBestScore, bestTime: LowestBestTime },
                [DifficultyEnum.Medium]: { bestScore: 100, bestTime: 0 }
            })
        );

        expect(totals.bestScore).toBe(HighestBestScore);
        expect(totals.bestTime).toBe(LowestBestTime);
    });

    it('should ignore zero best times entirely when no difficulty has a positive one', () => {
        expect.assertions(1);

        const totals = historyGetTotals(buildHistoryByDifficulty({ [DifficultyEnum.Easy]: { bestScore: 10, bestTime: 0 } }));

        expect(totals.bestTime).toBe(0);
    });

    it('should weight the average time by games completed per difficulty', () => {
        expect.assertions(1);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { gamesCompleted: 1, averageTime: 100 },
                [DifficultyEnum.Hard]: { gamesCompleted: 3, averageTime: 200 }
            })
        );

        expect(totals.averageTime).toBe(WeightedAverageTime);
    });

    it('should derive the win rate and day streak from the aggregated games', () => {
        expect.assertions(2);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: {
                    gamesCompleted: 4,
                    gamesWon: 1,
                    completedGames: [buildCompletedGame(DifficultyEnum.Easy, Date.now())]
                }
            })
        );

        expect(totals.winRate).toBe(QuarterWinRate);
        expect(totals.dayStreak).toBe(1);
    });
});
