import type { Sudoku } from '@suuudokuuu/generator';

export interface RatedGameInterface {
    readonly sudoku: Sudoku;
    readonly rating: number;
}
