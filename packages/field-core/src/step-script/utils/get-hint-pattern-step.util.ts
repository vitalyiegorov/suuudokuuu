import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptInterface } from '../interfaces/step-script.interface';

export const getHintPatternStep = (script: StepScriptInterface) =>
    script.steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
