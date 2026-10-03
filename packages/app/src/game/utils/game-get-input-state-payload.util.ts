import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const gameGetInputStatePayload = (engine: FieldEngine): Pick<CurrentRunType, 'inputMode' | 'showAutoCandidates'> => {
    const { inputMode, showAutoCandidates } = engine.serialize();

    return { inputMode, showAutoCandidates };
};
