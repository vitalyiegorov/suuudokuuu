import { isNotEmptyArray, isPositiveNumber } from '@rnw-community/shared';

import { HistorySeProfileRecentWinsSampleSize } from '../constants/history-se-profile.constant';
import { emptyHistoryRatingSnapshot } from '../interfaces/history-rating-snapshot.interface';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { HistorySeProfileInterface } from '../interfaces/history-se-profile.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const historyGetSeProfile = (
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>,
    completedGames: readonly CompletedGameInterface[]
): HistorySeProfileInterface => {
    const histories = Object.values(historyByDifficulty);
    const bestRating = histories.reduce(
        (best, history) => (history.bestRating.rating > best.rating ? history.bestRating : best),
        emptyHistoryRatingSnapshot
    );

    const recentRatedGames = completedGames
        .filter(game => isPositiveNumber(game.rating))
        .sort((first, second) => second.completedAt - first.completedAt)
        .slice(0, HistorySeProfileRecentWinsSampleSize);
    const averageRecentSeRating = isNotEmptyArray(recentRatedGames)
        ? recentRatedGames.reduce((total, game) => total + game.rating, 0) / recentRatedGames.length
        : 0;

    const mostPlayedHistory = histories.reduce((mostPlayed, history) =>
        history.gamesCompleted > mostPlayed.gamesCompleted ? history : mostPlayed
    );
    const hasMostPlayed = isPositiveNumber(mostPlayedHistory.gamesCompleted);

    return {
        averageRecentSeRating,
        hardestSolveIsCeiling: bestRating.isRatingCeiling,
        hardestSolveRating: bestRating.rating,
        mostPlayedDifficulty: hasMostPlayed ? mostPlayedHistory.difficulty : null,
        mostPlayedGamesCompleted: hasMostPlayed ? mostPlayedHistory.gamesCompleted : 0
    };
};
