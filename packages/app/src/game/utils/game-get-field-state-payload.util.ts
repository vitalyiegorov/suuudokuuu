import type { FieldEngine } from '@suuudokuuu/field-core';
import type { GameFieldStatePayloadInterface } from '@suuudokuuu/progress';

export const gameGetFieldStatePayload = (engine: FieldEngine): GameFieldStatePayloadInterface => {
    const { sudokuString, candidates } = engine.serialize();

    return { sudokuString, candidates };
};
