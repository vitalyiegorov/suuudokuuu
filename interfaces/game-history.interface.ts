import { DifficultyEnum } from '../enums/difficulty.enum';

export interface GameHistoryInterface {
    difficulty: DifficultyEnum;
    gamesCompleted: number;
    gamesWon: number;
    gamesLost: number;
    bestScore: number;
    bestTime: number;
}

export const emptyGameHistory: GameHistoryInterface = {
    bestScore: 0,
    bestTime: 0,
    difficulty: DifficultyEnum.Easy,
    gamesCompleted: 0,
    gamesLost: 0,
    gamesWon: 0
};
