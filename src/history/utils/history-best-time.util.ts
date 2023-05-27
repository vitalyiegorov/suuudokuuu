import { type HistoryInterface } from '../interfaces/history.interface';

export const historyBestGame = (history: HistoryInterface): [number, Duration] => {
    return Object.values(history.byDifficulty).reduce<[number, Duration]>(
        (max, gameHistory) => {
            return gameHistory.bestScore > max[0] ? [gameHistory.bestScore, gameHistory.bestTime] : max;
        },
        [0, {}]
    );
};
