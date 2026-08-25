import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';
import { gameGetPreMoveSudoku } from './game-get-pre-move-sudoku.util';

import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { FieldEngine, FieldMoveResultInterface } from '@suuudokuuu/field-core';

export const gameGetSavePayload = (engine: FieldEngine, move: FieldMoveResultInterface): GameSavePayloadInterface => ({
    ...gameGetFieldStatePayload(engine),
    correctCell: move.cell,
    scoredCells: move.scoredCells,
    technique: classifyTimelineMove(gameGetPreMoveSudoku(engine.Sudoku.toString(), move.cell), move.cell)
});
