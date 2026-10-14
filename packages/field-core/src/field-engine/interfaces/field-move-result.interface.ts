import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface FieldMoveResultInterface {
    cell: CellInterface;
    isCorrect: boolean;
    scoredCells: ScoredCellsInterface;
    hintTechnique?: SolutionTechniqueEnum;
}
