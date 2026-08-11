import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface LogicalSolveResultInterface {
    requiredTechniques: SolutionTechniqueEnum[];
    hardestTechnique: SolutionTechniqueEnum;
    isBeyondTechniqueLadder: boolean;
}
