import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const gameGetFieldStatePayload = (
    engine: FieldEngine
): Pick<CurrentRunType, 'candidates' | 'eliminatedCandidates' | 'sudokuString'> => {
    const { sudokuString, candidates, eliminatedCandidates } = engine.serialize();

    return { sudokuString, candidates, eliminatedCandidates };
};
