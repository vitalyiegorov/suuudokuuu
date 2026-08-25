import type { GameFieldStatePayloadInterface } from '../interface/game-field-state-payload.interface';
import type { FieldEngine } from '@suuudokuuu/field-core';

export const gameGetFieldStatePayload = (engine: FieldEngine): GameFieldStatePayloadInterface => {
    const { sudokuString, candidates } = engine.serialize();

    return { sudokuString, candidates };
};
