import type { Sudoku } from '@suuudokuuu/generator';

export interface ForgedPuzzleInterface {
    sudoku: Sudoku;
    isInBand: boolean;
    rating: number;
    isRatingCeiling: boolean;
}
