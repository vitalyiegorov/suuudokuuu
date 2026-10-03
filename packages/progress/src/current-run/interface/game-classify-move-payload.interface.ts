import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface GameClassifyMovePayloadInterface {
    readonly cell: CellInterface;
    readonly technique: SolutionTechniqueEnum;
}
