import { DifficultyEnum } from '../enums/difficulty.enum';

import { emptyGameHistory, type GameHistoryInterface } from './game-history.interface';

export interface HistoryInterface {
    byDifficulty: Record<DifficultyEnum, GameHistoryInterface>;
    totalGamesCompleted: number;
    totalGamesWon: number;
    totalGamesLost: number;
    totalBestScore: number;
    totalBestTime: number;
}

export const emptyHistoryState: HistoryInterface = {
    byDifficulty: {
        [DifficultyEnum.Newbie]: emptyGameHistory,
        [DifficultyEnum.Easy]: emptyGameHistory,
        [DifficultyEnum.Medium]: emptyGameHistory,
        [DifficultyEnum.Hard]: emptyGameHistory,
        [DifficultyEnum.Nightmare]: emptyGameHistory
    },
    totalGamesCompleted: 0,
    totalGamesWon: 0,
    totalGamesLost: 0,
    totalBestScore: 0,
    totalBestTime: 0
};
