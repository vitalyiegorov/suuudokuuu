import { getDayNumber, getDayStreak } from '@suuudokuuu/progress';

import { isNotEmptyArray, isPositiveNumber } from '@rnw-community/shared';

import { historyGetWinRate } from './history-get-win-rate.util';

import type { DifficultyStatsType } from '@suuudokuuu/progress';

export const historyGetTotals = (histories: readonly DifficultyStatsType[], playedDayNumbers: readonly number[]) => {
    const gamesCompleted = histories.reduce((total, history) => total + history.gamesCompleted, 0);
    const gamesWon = histories.reduce((total, history) => total + history.gamesWon, 0);
    const gamesLost = histories.reduce((total, history) => total + history.gamesLost, 0);
    const cleanWins = histories.reduce((total, history) => total + history.gamesWonWithoutMistakes, 0);
    const hardcoreWins = histories.reduce((total, history) => total + history.hardcoreWon, 0);
    const bestScore = histories.reduce((best, history) => Math.max(best, history.bestScore), 0);
    const bestTimes = histories.map(history => history.bestTime).filter(isPositiveNumber);
    const bestTime = isNotEmptyArray(bestTimes) ? Math.min(...bestTimes) : 0;
    const averageTimeTotal = histories.reduce((total, history) => total + history.averageTime * history.gamesWon, 0);
    const averageTime = isPositiveNumber(gamesWon) ? averageTimeTotal / gamesWon : 0;
    const dayStreak = getDayStreak(playedDayNumbers, getDayNumber(Date.now()));
    const winRate = historyGetWinRate(gamesWon, gamesCompleted);

    return {
        averageTime,
        bestScore,
        bestTime,
        cleanWins,
        dayStreak,
        gamesCompleted,
        gamesLost,
        hardcoreWins,
        winRate
    };
};
