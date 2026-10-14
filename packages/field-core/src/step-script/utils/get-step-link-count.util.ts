import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptStepType } from '../types/step-script-step.type';

export const getStepLinkCount = (step: StepScriptStepType): number => {
    if (step.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        return step.branch.implications.length;
    }

    return step.kind === StepScriptStepKindEnum.SHOW_CHAIN ? step.chain.length - 1 : 0;
};
