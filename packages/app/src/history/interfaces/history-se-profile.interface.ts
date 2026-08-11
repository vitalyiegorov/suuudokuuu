import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface HistorySeProfileInterface {
    readonly hardestSolveRating: number;
    readonly hardestSolveIsCeiling: boolean;
    readonly averageRecentSeRating: number;
    readonly mostPlayedDifficulty: DifficultyEnum | null;
    readonly mostPlayedGamesCompleted: number;
}
