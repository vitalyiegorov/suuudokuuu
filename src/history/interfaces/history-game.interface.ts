import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

export interface HistoryGameInterface {
    difficulty: DifficultyEnum;
    gamesCompleted: number;
    gamesWon: number;
    gamesLost: number;
    bestScore: number;
    bestTime: number;
}

export const emptyGameHistory: HistoryGameInterface = {
    bestScore: 0,
    bestTime: 0,
    difficulty: DifficultyEnum.Easy,
    gamesCompleted: 0,
    gamesLost: 0,
    gamesWon: 0
};
