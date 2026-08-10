import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface ReplayHardestStepInterface {
    readonly stepNumber: number;
    readonly technique: SolutionTechniqueEnum;
}
