import { type GameHistoryInterface } from '../../interfaces/game-history.interface';
import { type HistoryInterface } from '../../interfaces/history.interface';

export const historyTotal = (history: HistoryInterface, field: keyof Omit<GameHistoryInterface, 'difficulty' | 'bestTime'>): number => {
    return Object.values(history.byDifficulty).reduce((total, gameHistory) => {
        return total + gameHistory[field];
    }, 0);
};
