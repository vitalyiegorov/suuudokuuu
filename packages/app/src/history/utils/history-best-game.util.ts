import type { HistoryState } from '../store/history.state';

export const historyBestGame = (history: HistoryState): [number, number] =>
    Object.values(history.byDifficulty).reduce(
        (max, gameHistory) => (gameHistory.bestScore > max[0] ? [gameHistory.bestScore, gameHistory.bestTime] : max),
        [0, 0]
    );
