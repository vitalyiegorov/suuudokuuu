import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

export interface FieldMoveResultInterface {
    cell: CellInterface;
    isCorrect: boolean;
    scoredCells: ScoredCellsInterface;
}
