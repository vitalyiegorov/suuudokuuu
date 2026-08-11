import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface StepScriptNarrationInterface {
    technique: SolutionTechniqueEnum;
    cells: CellInterface[];
    values: number[];
}
