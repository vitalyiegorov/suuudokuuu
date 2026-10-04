import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';
import type { StepScriptCandidateInterface } from './step-script-candidate.interface';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';

export interface StepScriptStrikeCandidatesStepInterface {
    kind: StepScriptStepKindEnum.StrikeCandidates;
    eliminations: StepScriptCandidateInterface[];
    narration: StepScriptNarrationInterface;
}
