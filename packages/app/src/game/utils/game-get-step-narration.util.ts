import { msg, plural } from '@lingui/core/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';

import type { MessageDescriptor } from '@lingui/core';
import type { StepScriptStepType } from '@suuudokuuu/field-core';

export const gameGetStepNarration = (step: StepScriptStepType, techniqueName: string): MessageDescriptor => {
    const cellCount = step.narration.cells.length;
    const valueList = step.narration.values.join(', ');

    if (step.kind === StepScriptStepKindEnum.Highlight) {
        return msg`${techniqueName}: start with ${plural(cellCount, { one: 'the # highlighted cell', other: 'the # highlighted cells' })} and the digits ${valueList}.`;
    }

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        return msg`Inside that pattern the digits ${valueList} can only sit in the highlighted cells.`;
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return msg`That rules ${valueList} out of ${plural(cellCount, { one: '# other cell', other: '# other cells' })}, so the struck candidates are gone.`;
    }

    return msg`Only ${valueList} is left for the marked cell, so place it there.`;
};
