import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';

import type { FieldEngine, FieldMoveResultInterface } from '@suuudokuuu/field-core';

export const gameGetSavePayload = (engine: FieldEngine, move: FieldMoveResultInterface) => ({
    ...gameGetFieldStatePayload(engine),
    correctCell: move.cell,
    scoredCells: move.scoredCells
});
