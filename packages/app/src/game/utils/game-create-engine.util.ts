import { FieldEngine } from '@suuudokuuu/field-core';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const gameCreateEngine = (
    state: Pick<CurrentRunType, 'candidates' | 'difficulty' | 'inputMode' | 'mistakes' | 'showAutoCandidates' | 'sudokuString'>
): FieldEngine =>
    new FieldEngine({
        ...state,
        candidates: Object.fromEntries(Object.entries(state.candidates).map(([cellKey, values]) => [cellKey, [...values]]))
    });
