import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { ForcingBranchInterface } from '@suuudokuuu/techniques';

export interface StepScriptBranchStepInterface {
    readonly kind: StepScriptStepKindEnum.SHOW_BRANCH;
    readonly branch: ForcingBranchInterface;
    readonly branchIndex: number;
    readonly branchCount: number;
    readonly visibleImplicationCount: number;
    readonly showOutcome: boolean;
    readonly narration: StepScriptNarrationInterface;
}
