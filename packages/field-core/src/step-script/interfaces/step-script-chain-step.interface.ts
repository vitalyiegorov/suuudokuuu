import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

export interface StepScriptChainStepInterface {
    readonly kind: StepScriptStepKindEnum.SHOW_CHAIN;
    readonly chain: readonly ChainCandidateInterface[];
    readonly visibleLength: number;
    readonly narration: StepScriptNarrationInterface;
}
