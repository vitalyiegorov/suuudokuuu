import type { StepScriptPlaceValueStepInterface } from '../interfaces/step-script-place-value-step.interface';
import type { StepScriptRevealCandidatesStepInterface } from '../interfaces/step-script-reveal-candidates-step.interface';
import type { StepScriptStrikeCandidatesStepInterface } from '../interfaces/step-script-strike-candidates-step.interface';

export type StepScriptStepType =
    StepScriptPlaceValueStepInterface | StepScriptRevealCandidatesStepInterface | StepScriptStrikeCandidatesStepInterface;
