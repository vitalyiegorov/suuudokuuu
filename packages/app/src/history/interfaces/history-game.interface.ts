import { DifficultyEnum } from '@suuudokuuu/generator';

import type { CompletedGameInterface } from './completed-game.interface';

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
    challengesWon: number;
    challengesLost: number;
    completedGames: CompletedGameInterface[];
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
    challengesWon: 0,
    challengesLost: 0,
    completedGames: []
};
