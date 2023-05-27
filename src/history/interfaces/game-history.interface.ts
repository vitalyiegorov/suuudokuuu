import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

export interface GameHistoryInterface {
    difficulty: DifficultyEnum;
    gamesCompleted: number;
    gamesWon: number;
    gamesLost: number;
    bestScore: number;
    bestTime: Duration;
}

export const emptyGameHistory: GameHistoryInterface = {
    bestScore: 0,
    bestTime: {},
    difficulty: DifficultyEnum.Easy,
    gamesCompleted: 0,
    gamesLost: 0,
    gamesWon: 0
};
