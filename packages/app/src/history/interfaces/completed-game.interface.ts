import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface CompletedGameInterface {
    encodedState: string;
    difficulty: DifficultyEnum;
    elapsedTime: number;
    score: number;
    mistakes: number;
    maxMistakes: number;
    isWon: boolean;
    completedAt: number;
}

export const maxCompletedGamesPerDifficulty = 10;
