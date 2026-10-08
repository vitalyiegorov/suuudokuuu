import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { StepScriptCandidateInterface } from './step-script-candidate.interface';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { CellInterface } from '@suuudokuuu/generator';
import type { ForcingBranchInterface } from '@suuudokuuu/techniques';

export interface StepScriptBranchStepInterface {
    readonly kind: StepScriptStepKindEnum.SHOW_BRANCH;
    readonly branch: ForcingBranchInterface;
    readonly branchIndex: number;
    readonly branchCount: number;
    readonly outcomeCells: readonly CellInterface[];
    readonly outcomeCandidates: readonly StepScriptCandidateInterface[];
    readonly narration: StepScriptNarrationInterface;
}
