import type { StepScriptInterface } from '@suuudokuuu/field-core';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface SolverStepInterface {
    readonly index: number;
    readonly technique: SolutionTechniqueEnum;
    readonly techniqueName: string;
    readonly techniquePath: string;
    readonly narration: string;
    readonly boardBefore: string;
    readonly eliminatedCandidates: Readonly<Record<string, number[]>>;
    readonly script: StepScriptInterface;
}
