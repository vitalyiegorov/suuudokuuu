import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface SerializedPuzzleInterface {
    readonly difficulty: DifficultyEnum;
    readonly sudokuString: string;
    readonly solutionString: string;
    readonly rating: number;
    readonly isRatingCeiling: boolean;
    readonly isInBand: boolean;
}
