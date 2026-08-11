import { emptyHistoryRatingSnapshot } from '../interfaces/history-rating-snapshot.interface';

import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { HistoryRatingSnapshotInterface } from '../interfaces/history-rating-snapshot.interface';

export const historyGetBestRating = (histories: readonly HistoryGameInterface[]): HistoryRatingSnapshotInterface =>
    histories.reduce((best, history) => (history.bestRating.rating > best.rating ? history.bestRating : best), emptyHistoryRatingSnapshot);
