import type { StepScriptCandidateInterface } from './step-script-candidate.interface';
import type { StepScriptNarrationInterface } from './step-script-narration.interface';
import type { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

export interface StepScriptPlaceValueStepInterface {
    kind: StepScriptStepKindEnum.PlaceValue;
    placement: StepScriptCandidateInterface;
    narration: StepScriptNarrationInterface;
}
