import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';

import { TECHNIQUE_NAMES } from '../constants/technique-name.constant';

import { formatCellLabel } from './format-cell-label.util';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

export const renderTechniqueNarration = (step: StepScriptStepType): string => {
    const techniqueName = TECHNIQUE_NAMES[step.narration.technique];
    const cellLabels = step.narration.cells.map(formatCellLabel).join(', ');
    const valueLabels = step.narration.values.join(', ');

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        return `${techniqueName} pattern: candidates ${valueLabels} stay live in ${cellLabels}.`;
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return `The ${techniqueName} removes ${valueLabels} from ${cellLabels}.`;
    }

    return `The ${techniqueName} places ${valueLabels} in ${cellLabels}.`;
};
