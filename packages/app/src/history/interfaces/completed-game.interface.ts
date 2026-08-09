import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface CompletedGameInterface {
    encodedState: string;
    difficulty: DifficultyEnum;
    rating: number;
    isRatingCeiling: boolean;
    elapsedTime: number;
    score: number;
    mistakes: number;
    maxMistakes: number;
    completedAt: number;
}
