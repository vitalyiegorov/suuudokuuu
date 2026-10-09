import type { StepScriptBranchStepInterface } from '../interfaces/step-script-branch-step.interface';
import type { StepScriptChainStepInterface } from '../interfaces/step-script-chain-step.interface';
import type { StepScriptPlaceValueStepInterface } from '../interfaces/step-script-place-value-step.interface';
import type { StepScriptRevealCandidatesStepInterface } from '../interfaces/step-script-reveal-candidates-step.interface';
import type { StepScriptStrikeCandidatesStepInterface } from '../interfaces/step-script-strike-candidates-step.interface';

export type StepScriptStepType =
    | StepScriptPlaceValueStepInterface
    | StepScriptRevealCandidatesStepInterface
    | StepScriptStrikeCandidatesStepInterface
    | StepScriptChainStepInterface
    | StepScriptBranchStepInterface;
