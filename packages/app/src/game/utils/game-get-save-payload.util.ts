import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetPreMoveSudoku } from './game-get-pre-move-sudoku.util';

import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { FieldMoveResultInterface } from '@suuudokuuu/field-core';
import type { Sudoku } from '@suuudokuuu/generator';

export const gameGetSavePayload = (sudoku: Sudoku, move: FieldMoveResultInterface): GameSavePayloadInterface => ({
    sudoku,
    correctCell: move.cell,
    scoredCells: move.scoredCells,
    technique: classifyTimelineMove(gameGetPreMoveSudoku(sudoku.toString(), move.cell), move.cell)
});
