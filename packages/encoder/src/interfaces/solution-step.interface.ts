import type { SolutionTechniqueEnum } from '@suuudokuuu/generator';

export interface SolutionStepInterface {
    cellIndex: number;
    value: number;
    ts: number;
    technique: SolutionTechniqueEnum;
}
