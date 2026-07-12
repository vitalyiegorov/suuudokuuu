import { isNotEmptyArray, isPositiveNumber } from '@rnw-community/shared';

import { historyGetDayStreak } from './history-get-day-streak.util';
import { historyGetWinRate } from './history-get-win-rate.util';

import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const historyGetTotals = (historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>) => {
    const histories = Object.values(historyByDifficulty);
    const gamesCompleted = histories.reduce((total, history) => total + history.gamesCompleted, 0);
    const gamesWon = histories.reduce((total, history) => total + history.gamesWon, 0);
    const gamesLost = histories.reduce((total, history) => total + history.gamesLost, 0);
    const cleanWins = histories.reduce((total, history) => total + history.gamesWonWithoutMistakes, 0);
    const hardcoreWins = histories.reduce((total, history) => total + history.hardcoreWon, 0);
    const challengesWon = histories.reduce((total, history) => total + history.challengesWon, 0);
    const challengesLost = histories.reduce((total, history) => total + history.challengesLost, 0);
    const completedGames = histories.flatMap(history => history.completedGames);
    const bestScore = histories.reduce((best, history) => Math.max(best, history.bestScore), 0);
    const bestTimes = histories.map(history => history.bestTime).filter(isPositiveNumber);
    const bestTime = isNotEmptyArray(bestTimes) ? Math.min(...bestTimes) : 0;
    const averageTimeTotal = histories.reduce((total, history) => total + history.averageTime * history.gamesCompleted, 0);
    const averageTime = isPositiveNumber(gamesCompleted) ? averageTimeTotal / gamesCompleted : 0;
    const dayStreak = historyGetDayStreak(completedGames);
    const winRate = historyGetWinRate(gamesWon, gamesCompleted);

    return {
        averageTime,
        bestScore,
        bestTime,
        challengesLost,
        challengesWon,
        cleanWins,
        dayStreak,
        gamesCompleted,
        gamesLost,
        gamesWon,
        hardcoreWins,
        winRate
    };
};
