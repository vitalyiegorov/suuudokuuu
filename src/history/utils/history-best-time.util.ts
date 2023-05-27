import { isDurationLower } from '../../@generic/utils/is-duration.lower';
import { type HistoryInterface } from '../interfaces/history.interface';

export const historyBestTime = (history: HistoryInterface): Duration => {
    return Object.values(history.byDifficulty).reduce<Duration>((min, gameHistory) => {
        return isDurationLower(gameHistory.bestTime, min) ? gameHistory.bestTime : min;
    }, {});
};
