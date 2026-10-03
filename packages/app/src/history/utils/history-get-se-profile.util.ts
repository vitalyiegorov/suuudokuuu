import { isNotEmptyArray, isPositiveNumber } from '@rnw-community/shared';

import { HistorySeProfileRecentWinsSampleSize } from '../constants/history-se-profile.constant';

import { historyGetBestRating } from './history-get-best-rating.util';

import type { HistorySeProfileInterface } from '../interfaces/history-se-profile.interface';
import type { CompletedGameType, DifficultyStatsType } from '@suuudokuuu/progress';

export const historyGetSeProfile = (
    histories: readonly DifficultyStatsType[],
    completedGames: readonly CompletedGameType[]
): HistorySeProfileInterface => {
    const bestRating = historyGetBestRating(histories);

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
