import type { GameHistoryInterface } from '../interfaces/game-history.interface';
import type { HistoryInterface } from '../interfaces/history.interface';

// ts-prune-ignore-next
export const historyTotal = (history: HistoryInterface, field: keyof Omit<GameHistoryInterface, 'bestTime' | 'difficulty'>): number =>
    Object.values(history.byDifficulty).reduce((total, gameHistory) => total + gameHistory[field], 0);
