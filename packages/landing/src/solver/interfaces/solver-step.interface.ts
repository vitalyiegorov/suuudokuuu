import type { StepScriptInterface } from '@suuudokuuu/field-core';

export interface SolverStepInterface {
    index: number;
    techniqueName: string;
    techniquePath: string;
    narration: string;
    boardBefore: string;
    script: StepScriptInterface;
}
