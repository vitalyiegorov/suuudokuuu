import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { emptyGameHistory } from '../interfaces/history-game.interface';
import { emptyHistoryRatingSnapshot } from '../interfaces/history-rating-snapshot.interface';

import { historyGetTotals } from './history-get-totals.util';

import type { HistoryGameInterface } from '../interfaces/history-game.interface';

const HighestBestScore = 1500;
const LowestBestTime = 120;
const WeightedAverageTimeByWins = 175;
const CorrectlyWeightedAverageTime = 200;
const BuggyWeightedAverageTime = 150;
const QuarterWinRate = 25;
const NoPlayedDayNumbers: readonly number[] = [];

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
    [DifficultyEnum.Hell]: buildHistory(DifficultyEnum.Hell, overridesByDifficulty[DifficultyEnum.Hell] ?? {}),
    [DifficultyEnum.Infinity]: buildHistory(DifficultyEnum.Infinity, overridesByDifficulty[DifficultyEnum.Infinity] ?? {})
});

describe('historyGetTotals', () => {
    it('should return zeroed totals for an untouched history', () => {
        expect.assertions(1);

        expect(historyGetTotals(buildHistoryByDifficulty({}), NoPlayedDayNumbers)).toStrictEqual({
            averageTime: 0,
            bestRating: emptyHistoryRatingSnapshot,
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
            }),
            NoPlayedDayNumbers
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
            }),
            NoPlayedDayNumbers
        );

        expect(totals.bestScore).toBe(HighestBestScore);
        expect(totals.bestTime).toBe(LowestBestTime);
    });

    it('should take the highest best rating across every difficulty and preserve its ceiling flag', () => {
        expect.assertions(1);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { bestRating: { rating: 3.4, isRatingCeiling: false } },
                [DifficultyEnum.Hard]: { bestRating: { rating: 8.5, isRatingCeiling: true } },
                [DifficultyEnum.Medium]: { bestRating: { rating: 5.6, isRatingCeiling: false } }
            }),
            NoPlayedDayNumbers
        );

        expect(totals.bestRating).toStrictEqual({ rating: 8.5, isRatingCeiling: true });
    });

    it('should ignore zero best times entirely when no difficulty has a positive one', () => {
        expect.assertions(1);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({ [DifficultyEnum.Easy]: { bestScore: 10, bestTime: 0 } }),
            NoPlayedDayNumbers
        );

        expect(totals.bestTime).toBe(0);
    });

    it('should weight the average time by games won per difficulty', () => {
        expect.assertions(1);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { gamesWon: 1, averageTime: 100 },
                [DifficultyEnum.Hard]: { gamesWon: 3, averageTime: 200 }
            }),
            NoPlayedDayNumbers
        );

        expect(totals.averageTime).toBe(WeightedAverageTimeByWins);
    });

    it('should weight the average time by wins, not by completed games including losses', () => {
        expect.assertions(2);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { gamesCompleted: 5, gamesWon: 2, averageTime: 100 },
                [DifficultyEnum.Hard]: { gamesCompleted: 1, gamesWon: 1, averageTime: 400 }
            }),
            NoPlayedDayNumbers
        );

        expect(totals.averageTime).toBe(CorrectlyWeightedAverageTime);
        expect(totals.averageTime).not.toBe(BuggyWeightedAverageTime);
    });

    it('should derive the win rate from the aggregated games', () => {
        expect.assertions(1);

        const totals = historyGetTotals(
            buildHistoryByDifficulty({
                [DifficultyEnum.Easy]: { gamesCompleted: 4, gamesWon: 1 }
            }),
            NoPlayedDayNumbers
        );

        expect(totals.winRate).toBe(QuarterWinRate);
    });

    it('should derive the day streak from the played day numbers', () => {
        expect.assertions(1);

        const totals = historyGetTotals(buildHistoryByDifficulty({}), [getDayNumber(Date.now())]);

        expect(totals.dayStreak).toBe(1);
    });
});
