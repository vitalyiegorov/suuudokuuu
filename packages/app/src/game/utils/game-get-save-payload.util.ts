import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';

import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { FieldEngine, FieldMoveResultInterface } from '@suuudokuuu/field-core';

export const gameGetSavePayload = (engine: FieldEngine, move: FieldMoveResultInterface): GameSavePayloadInterface => ({
    ...gameGetFieldStatePayload(engine),
    correctCell: move.cell,
    scoredCells: move.scoredCells
});
