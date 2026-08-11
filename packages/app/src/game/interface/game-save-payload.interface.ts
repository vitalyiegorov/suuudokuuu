import type { CellInterface, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface GameSavePayloadInterface {
    readonly sudoku: Sudoku;
    readonly correctCell: CellInterface;
    readonly scoredCells: ScoredCellsInterface;
    readonly technique?: SolutionTechniqueEnum;
}
