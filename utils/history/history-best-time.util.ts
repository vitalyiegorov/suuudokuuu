import { type HistoryInterface } from '../../interfaces/history.interface';
import { isDurationLower } from '../is-duration.lower';

export const historyBestTime = (history: HistoryInterface): Duration => {
    return Object.values(history.byDifficulty).reduce<Duration>((min, gameHistory) => {
        return isDurationLower(gameHistory.bestTime, min) ? gameHistory.bestTime : min;
    }, {});
};
