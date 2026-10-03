import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';

import type { FieldEngine, FieldMoveResultInterface } from '@suuudokuuu/field-core';
import type { GameSavePayloadInterface } from '@suuudokuuu/progress';

export const gameGetSavePayload = (engine: FieldEngine, move: FieldMoveResultInterface): GameSavePayloadInterface => ({
    ...gameGetFieldStatePayload(engine),
    correctCell: move.cell,
    scoredCells: move.scoredCells
});
