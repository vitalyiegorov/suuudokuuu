import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const gameGetFieldStatePayload = (engine: FieldEngine): Pick<CurrentRunType, 'candidates' | 'sudokuString'> => {
    const { sudokuString, candidates } = engine.serialize();

    return { sudokuString, candidates };
};
