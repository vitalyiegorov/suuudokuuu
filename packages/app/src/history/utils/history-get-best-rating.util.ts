import { emptyHistoryRatingSnapshot } from '../interfaces/history-rating-snapshot.interface';

import type { HistoryRatingSnapshotInterface } from '../interfaces/history-rating-snapshot.interface';
import type { DifficultyStatsType } from '@suuudokuuu/progress';

export const historyGetBestRating = (difficultyStats: readonly DifficultyStatsType[]): HistoryRatingSnapshotInterface =>
    difficultyStats.reduce(
        (best, stats) => (stats.bestRating > best.rating ? { rating: stats.bestRating, isRatingCeiling: stats.isBestRatingCeiling } : best),
        emptyHistoryRatingSnapshot
    );
