import { DifficultyEnum } from '@suuudokuuu/generator';

export interface HistoryGameInterface {
    difficulty: DifficultyEnum;
    gamesCompleted: number;
    gamesWon: number;
    gamesWonWithoutMistakes: number;
    gamesLost: number;
    bestScore: number;
    bestTime: number;
    averageTime: number;
    hardcoreWon: number;
    hardcoreLost: number;
    challengesWon: number;
    challengesLost: number;
}

export const emptyGameHistory: HistoryGameInterface = {
    bestScore: 0,
    bestTime: 0,
    difficulty: DifficultyEnum.Easy,
    gamesCompleted: 0,
    gamesLost: 0,
    gamesWon: 0,
    gamesWonWithoutMistakes: 0,
    averageTime: 0,
    hardcoreWon: 0,
    hardcoreLost: 0,
    challengesWon: 0,
    challengesLost: 0
};
